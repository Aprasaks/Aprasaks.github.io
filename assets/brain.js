/*
 * DECHIVE hero — "생각의 재설계" motion
 * 세 상태 사이를 스크롤로 오갑니다.
 *   REV.A 엉킨 생각  : 뒤엉킨 실타래
 *   REV.B 생각의 구조 : 회전하는 뇌(뉴런 연결 + 신호)
 *   REV.C 재설계      : 같은 뇌를 등고선 도면으로 다시 그린 형태
 * 외부 라이브러리 없이 Canvas 2D로 3D 투영을 직접 계산합니다.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('brain-canvas');
  var hero = document.getElementById('hero');
  if (!canvas || !hero || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.innerWidth < 760;

  // 재현 가능한 난수 (매 방문마다 같은 형태)
  var seed = 20261114;
  function rand() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  function gauss() {
    return (rand() + rand() + rand() - 1.5) / 1.5;
  }

  // ---------- 뇌 모델 ----------
  // 타원체 여러 개를 부드럽게 합쳐 좌우 반구·측두엽·소뇌·뇌간을 만듭니다.
  function ell(x, y, z, cx, cy, cz, ax, ay, az) {
    var dx = (x - cx) / ax, dy = (y - cy) / ay, dz = (z - cz) / az;
    return Math.sqrt(dx * dx + dy * dy + dz * dz) - 1;
  }
  function smin(a, b, k) {
    var h = Math.max(k - Math.abs(a - b), 0) / k;
    return Math.min(a, b) - h * h * k * 0.25;
  }
  // 반구 하나(side = -1 왼쪽, 1 오른쪽)
  function hemi(x, y, z, side) {
    var main = ell(x, y, z, side * 0.36, 0.06, 0.02, 0.46, 0.60, 1.02);
    var front = ell(x, y, z, side * 0.34, -0.05, 0.62, 0.38, 0.45, 0.45);   // 전두엽 아래쪽 볼륨
    var temporal = ell(x, y, z, side * 0.44, -0.30, 0.18, 0.32, 0.27, 0.55); // 측두엽
    return smin(smin(main, front, 0.25), temporal, 0.3);
  }
  function cereb(x, y, z) { return ell(x, y, z, 0, -0.46, -0.70, 0.50, 0.25, 0.30); }
  function stem(x, y, z) { return ell(x, y, z, 0, -0.74, -0.34, 0.13, 0.34, 0.14); }
  function brainSDF(x, y, z) {
    return Math.min(hemi(x, y, z, -1), hemi(x, y, z, 1), cereb(x, y, z), stem(x, y, z));
  }
  // 중심 c에서 방향 d로 나가며 경계를 이분 탐색
  function boundary(fn, cx, cy, cz, dx, dy, dz) {
    var lo = 0, hi = 2.2;
    if (fn(cx, cy, cz) > 0) return -1;
    for (var it = 0; it < 22; it++) {
      var m = (lo + hi) / 2;
      if (fn(cx + dx * m, cy + dy * m, cz + dz * m) < 0) lo = m; else hi = m;
    }
    return lo;
  }
  // 뇌 주름: 값이 0 근처인 곳이 고랑(sulci)
  function gyri(x, y, z) {
    return Math.sin(x * 9 + Math.sin(z * 6 + y * 2) * 1.8) * Math.cos(z * 8 + Math.sin(y * 7) * 1.3) +
           0.5 * Math.sin(y * 13 + z * 4 + x * 2);
  }

  // 도면 등고선 구성
  var HR = small ? 13 : 20;      // 반구당 등고선 수
  var HM = small ? 28 : 40;      // 등고선당 점
  var CR = small ? 5 : 6, CM = small ? 18 : 26;  // 소뇌
  var N = HR * HM * 2 + CR * CM;

  var A = new Float32Array(N * 3); // 엉킨 생각
  var B = new Float32Array(N * 3); // 뇌
  var C = new Float32Array(N * 3); // 등고선 도면
  var delay = new Float32Array(N);
  var size = new Float32Array(N);
  var ringLoops = [];              // [시작 인덱스, 점 개수]

  var ci = 0;
  function addRings(fn, cx, cz, y0, y1, rings, per, group) {
    for (var r = 0; r < rings; r++) {
      var y = y0 + (y1 - y0) * (r + 0.5) / rings;
      var startIdx = ci;
      for (var j = 0; j < per; j++) {
        var th = (j / per) * Math.PI * 2;
        var dx = Math.sin(th), dz = Math.cos(th);
        var d = boundary(fn, cx, y, cz, dx, 0, dz);
        if (d < 0) d = 0.02;
        C[ci * 3] = cx + dx * d; C[ci * 3 + 1] = y; C[ci * 3 + 2] = cz + dz * d;
        ci++;
      }
      ringLoops.push(startIdx, per, group);
    }
  }
  addRings(function (x, y, z) { return hemi(x, y, z, -1); }, -0.36, 0.02, -0.46, 0.64, HR, HM, 0);
  addRings(function (x, y, z) { return hemi(x, y, z, 1); }, 0.36, 0.02, -0.46, 0.64, HR, HM, 1);
  addRings(cereb, 0, -0.70, -0.66, -0.27, CR, CM, 2);

  // 상태 B: 표면 위의 점. 주름 능선(gyri)에 점이 모이도록 걸러냅니다.
  var centers = [
    [-0.36, 0.06, 0.02, 0.36], [0.36, 0.06, 0.02, 0.36],
    [-0.44, -0.30, 0.18, 0.07], [0.44, -0.30, 0.18, 0.07],
    [0, -0.46, -0.70, 0.11], [0, -0.74, -0.34, 0.03]
  ];
  var bi = 0, guard = 0;
  while (bi < N && guard < N * 40) {
    guard++;
    var pick = rand(), acc = 0, c = centers[0];
    for (var q = 0; q < centers.length; q++) { acc += centers[q][3]; if (pick <= acc) { c = centers[q]; break; } }
    var u = rand() * 2 - 1, t = rand() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    var dx = s * Math.cos(t), dy = u, dz = s * Math.sin(t);
    var d = boundary(brainSDF, c[0], c[1], c[2], dx, dy, dz);
    if (d <= 0) continue;
    var x = c[0] + dx * d, y = c[1] + dy * d, z = c[2] + dz * d;
    var isCereb = c === centers[4];
    var g = gyri(x, y, z);
    if (!isCereb && Math.abs(g) < 0.28 && rand() < 0.85) continue;     // 고랑은 비워둠
    var push = isCereb ? 0.025 * Math.sin(y * 70) : 0.05 * g;        // 소뇌는 가는 가로 줄무늬
    B[bi * 3] = x + dx * push; B[bi * 3 + 1] = y + dy * push; B[bi * 3 + 2] = z + dz * push;
    delay[bi] = rand();
    size[bi] = 0.7 + rand() * 0.9;
    bi++;
  }

  // 상태 A: 뒤엉킨 실타래. 무작위 보행 곡선 여러 가닥
  var STRANDS = small ? 9 : 14;
  var perStrand = Math.ceil(N / STRANDS);
  var strandOf = new Int16Array(N);
  var idx = 0;
  for (var st = 0; st < STRANDS && idx < N; st++) {
    var px = gauss() * 0.6, py = gauss() * 0.5, pz = gauss() * 0.6;
    var vx = gauss(), vy = gauss(), vz = gauss();
    for (var k2 = 0; k2 < perStrand && idx < N; k2++) {
      vx += gauss() * 0.55; vy += gauss() * 0.55; vz += gauss() * 0.55;
      var vl = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
      vx /= vl; vy /= vl; vz /= vl;
      px += vx * 0.06; py += vy * 0.06; pz += vz * 0.06;
      var dd0 = Math.sqrt(px * px + py * py + pz * pz);
      if (dd0 > 1.05) { px *= 1.05 / dd0; py *= 1.05 / dd0; pz *= 1.05 / dd0; vx = -px; vy = -py; vz = -pz; }
      A[idx * 3] = px; A[idx * 3 + 1] = py * 0.9; A[idx * 3 + 2] = pz;
      strandOf[idx] = st;
      idx++;
    }
  }

  var i, j;
  // ---------- 연결선 ----------
  // A: 같은 가닥의 이웃
  var edgesA = [];
  for (i = 1; i < N; i++) if (strandOf[i] === strandOf[i - 1]) edgesA.push(i - 1, i);
  // C: 같은 등고선의 이웃(닫힌 고리) + 아래위 등고선을 잇는 몇 줄
  var edgesC = [];
  for (var L = 0; L < ringLoops.length; L += 3) {
    var s0 = ringLoops[L], cnt = ringLoops[L + 1];
    var nextSame = L + 3 < ringLoops.length && ringLoops[L + 5] === ringLoops[L + 2];
    for (var j3 = 0; j3 < cnt; j3++) {
      edgesC.push(s0 + j3, s0 + ((j3 + 1) % cnt));
      if (nextSame && j3 % (cnt / 4 | 0) === 0) edgesC.push(s0 + j3, s0 + cnt + j3);
    }
  }
  // B: 가까운 이웃 2개 (뉴런 연결)
  var edgesB = [];
  for (i = 0; i < N; i++) {
    var best1 = -1, best2 = -1, d1 = 1e9, d2 = 1e9;
    var ix = B[i * 3], iy = B[i * 3 + 1], iz = B[i * 3 + 2];
    for (j = 0; j < N; j++) {
      if (j === i) continue;
      var ex = B[j * 3] - ix, ey = B[j * 3 + 1] - iy, ez = B[j * 3 + 2] - iz;
      var dd = ex * ex + ey * ey + ez * ez;
      if (dd < d1) { d2 = d1; best2 = best1; d1 = dd; best1 = j; }
      else if (dd < d2) { d2 = dd; best2 = j; }
    }
    if (best1 > i) edgesB.push(i, best1);
    if (best2 > i && d2 < 0.03) edgesB.push(i, best2);
  }

  // ---------- 신호(시냅스 펄스) ----------
  var pulses = [];
  function spawnPulse() {
    var e = (rand() * (edgesB.length / 2)) | 0;
    // 연쇄: 다음 펄스는 이웃 엣지에서 이어지게
    pulses.push({ e: e, t: 0, speed: 0.012 + rand() * 0.02, hops: 3 + (rand() * 5 | 0) });
  }

  // ---------- 상태 ----------
  var P = new Float32Array(N * 3);   // 현재 위치(월드)
  var S = new Float32Array(N * 3);   // 화면 좌표 x, y, 깊이
  var W = 0, H = 0, DPR = 1;
  var phase = 0, phaseTarget = 0;
  var mouseX = 0, mouseY = 0, mx = 0, my = 0;
  var rotY = 0, time = 0;
  var running = false, visible = true, rafId = 0;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    small = W < 760;
  }

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }

  function readScroll() {
    var rect = hero.getBoundingClientRect();
    var total = hero.offsetHeight - window.innerHeight;
    var prog = total > 0 ? clamp01(-rect.top / total) : 0;
    // 0 → 2 (A → B → C), 끝부분은 C에 머물게 약간 여유
    phaseTarget = Math.min(2, prog * 2.25);
    hero.style.setProperty('--phase', phaseTarget.toFixed(3));
    hero.style.setProperty('--progress', prog.toFixed(3));
    var done = prog > 0.97 ? 'true' : 'false';
    if (hero.dataset.done !== done) hero.dataset.done = done;
    var stage = phaseTarget < 0.55 ? 'a' : phaseTarget < 1.5 ? 'b' : 'c';
    if (hero.dataset.stage !== stage) hero.dataset.stage = stage;
  }

  function frame() {
    rafId = 0;
    if (!visible) { running = false; return; }
    time += reduceMotion ? 0 : 1 / 60;

    phase += (phaseTarget - phase) * 0.08;
    mx += (mouseX - mx) * 0.05;
    my += (mouseY - my) * 0.05;

    // 옆모습과 3/4 각도 사이를 천천히 오갑니다(뇌의 윤곽이 가장 잘 읽히는 범위)
    if (!reduceMotion) rotY += 0.0021;
    var ry = 1.05 + Math.sin(rotY) * 0.75 + mx * 0.45;
    var rx = -0.32 + my * 0.22;
    var cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);

    // 캔버스는 히어로의 그림 칸만 차지합니다. 가장 넓게 퍼지는 엉킨 상태도 칸 안에 들어오게 크기를 잡습니다.
    var centerX = W * 0.5;
    var centerY = H * 0.5;
    var scale = Math.min(W / 3.1, H / 2.9);

    var p1 = clamp01(phase), p2 = clamp01(phase - 1);
    var i, k;
    for (i = 0; i < N; i++) {
      k = i * 3;
      var dl = delay[i] * 0.35;
      var t1 = ease(clamp01((p1 - dl) / 0.65));
      var t2 = ease(clamp01((p2 - dl) / 0.65));
      // A에는 미세한 흔들림(정리되지 않은 상태)
      var jig = (1 - t1) * 0.025;
      var ax = A[k] + Math.sin(time * 0.9 + i * 0.37) * jig;
      var ay = A[k + 1] + Math.cos(time * 0.7 + i * 0.21) * jig;
      var az = A[k + 2] + Math.sin(time * 0.8 + i * 0.13) * jig;
      var bx = ax + (B[k] - ax) * t1, by = ay + (B[k + 1] - ay) * t1, bz = az + (B[k + 2] - az) * t1;
      var x = bx + (C[k] - bx) * t2, y = by + (C[k + 1] - by) * t2, z = bz + (C[k + 2] - bz) * t2;
      P[k] = x; P[k + 1] = y; P[k + 2] = z;
      // 회전
      var x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      var y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
      var f = 3.4 / (3.4 + z2);
      S[k] = centerX + x1 * scale * f;
      S[k + 1] = centerY - y1 * scale * f;
      S[k + 2] = z2;
    }

    ctx.clearRect(0, 0, W, H);

    // 연결선: 상태별 가중치
    var wA = 1 - clamp01(phase * 1.4);
    var wB = phase <= 1 ? clamp01((phase - 0.3) / 0.7) : 1 - clamp01((phase - 1) / 0.6);
    var wC = clamp01((phase - 1.25) / 0.6);
    drawEdges(edgesA, wA * 0.34);
    drawEdges(edgesB, wB * 0.30);
    drawEdges(edgesC, wC * 0.42);

    // 점
    ctx.fillStyle = '#15181C';
    var dotScale = 1 - wC * 0.45;
    for (i = 0; i < N; i++) {
      k = i * 3;
      var depth = S[k + 2];
      var alpha = 0.25 + 0.6 * clamp01((1.3 - depth) / 2.4);
      ctx.globalAlpha = alpha;
      var sz = size[i] * dotScale * (small ? 1.1 : 1.35);
      ctx.fillRect(S[k] - sz / 2, S[k + 1] - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;

    // 신호: 뇌 상태에서만
    if (!reduceMotion && wB > 0.05) {
      if (pulses.length < (small ? 14 : 26) && rand() < 0.35) spawnPulse();
      ctx.fillStyle = '#2448D8';
      for (var pi = pulses.length - 1; pi >= 0; pi--) {
        var pu = pulses[pi];
        pu.t += pu.speed;
        var ea = edgesB[pu.e * 2] * 3, eb = edgesB[pu.e * 2 + 1] * 3;
        var sx2 = S[ea] + (S[eb] - S[ea]) * pu.t;
        var sy2 = S[ea + 1] + (S[eb + 1] - S[ea + 1]) * pu.t;
        ctx.globalAlpha = wB * Math.sin(Math.PI * Math.min(pu.t, 1)) * 0.95;
        ctx.beginPath();
        ctx.arc(sx2, sy2, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = wB * 0.12;
        ctx.beginPath();
        ctx.arc(sx2, sy2, 7, 0, Math.PI * 2);
        ctx.fill();
        if (pu.t >= 1) {
          pu.hops--;
          if (pu.hops <= 0) { pulses.splice(pi, 1); continue; }
          // 끝점에서 이어지는 다른 엣지 찾기
          var endNode = edgesB[pu.e * 2 + 1];
          var next = findEdgeFrom(endNode, pu.e);
          if (next < 0) { pulses.splice(pi, 1); continue; }
          pu.e = next; pu.t = 0;
        }
      }
      ctx.globalAlpha = 1;
    }

    // 도면 상태: 아래에서 위로 지나가는 스캔선
    if (wC > 0.05) {
      var scanT = reduceMotion ? 0.5 : (time * 0.18) % 1;
      var scanY = centerY + scale * 0.85 - scanT * scale * 1.7;
      var half = Math.min(scale * 1.45, W / 2 - 4);
      ctx.globalAlpha = wC * 0.5;
      ctx.strokeStyle = '#2448D8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - half, scanY);
      ctx.lineTo(centerX + half, scanY);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    schedule();
  }

  // 노드 → 엣지 인덱스
  var nodeEdges = new Array(N);
  for (var e = 0; e < edgesB.length / 2; e++) {
    var na = edgesB[e * 2], nb = edgesB[e * 2 + 1];
    (nodeEdges[na] = nodeEdges[na] || []).push(e);
    (nodeEdges[nb] = nodeEdges[nb] || []).push(e);
  }
  function findEdgeFrom(node, prev) {
    var list = nodeEdges[node];
    if (!list || list.length < 2) return -1;
    var pick = list[(rand() * list.length) | 0];
    if (pick === prev) pick = list[(list.indexOf(pick) + 1) % list.length];
    // 방향 맞추기: node가 시작점이 되도록 엣지를 뒤집어 저장
    if (edgesB[pick * 2] !== node) {
      var tmp = edgesB[pick * 2];
      edgesB[pick * 2] = edgesB[pick * 2 + 1];
      edgesB[pick * 2 + 1] = tmp;
    }
    return pick;
  }

  function drawEdges(list, alpha) {
    if (alpha < 0.01) return;
    ctx.strokeStyle = '#15181C';
    ctx.lineWidth = 0.7;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    for (var e = 0; e < list.length; e += 2) {
      var a = list[e] * 3, b = list[e + 1] * 3;
      ctx.moveTo(S[a], S[a + 1]);
      ctx.lineTo(S[b], S[b + 1]);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function schedule() {
    if (!rafId) rafId = requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true;
    schedule();
  }

  window.addEventListener('resize', function () { resize(); readScroll(); schedule(); });
  window.addEventListener('scroll', function () { readScroll(); if (!running && visible) start(); }, { passive: true });
  window.addEventListener('pointermove', function (ev) {
    mouseX = (ev.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (ev.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(hero);
  }

  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden;
    if (visible) start();
  });

  resize();
  readScroll();
  phase = phaseTarget;
  canvas.classList.add('is-ready');
  start();
})();
