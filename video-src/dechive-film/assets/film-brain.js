/*
 * DECHIVE 영상용 뇌 렌더러.
 * 사이트 히어로(assets/brain.js)와 같은 형태를 쓰되, 시간과 상태를 밖에서 받아
 * 같은 입력이면 항상 같은 그림을 그립니다(HyperFrames 결정적 렌더링 규칙).
 */
(function () {
  'use strict';

  var INK = '#15181C', ACCENT = '#2448D8';

  function makeRand(seed) {
    return function () {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }
  function hash(n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // ---------- 형태 ----------
  function ell(x, y, z, cx, cy, cz, ax, ay, az) {
    var dx = (x - cx) / ax, dy = (y - cy) / ay, dz = (z - cz) / az;
    return Math.sqrt(dx * dx + dy * dy + dz * dz) - 1;
  }
  function smin(a, b, k) {
    var h = Math.max(k - Math.abs(a - b), 0) / k;
    return Math.min(a, b) - h * h * k * 0.25;
  }
  function hemi(x, y, z, s) {
    var main = ell(x, y, z, s * 0.36, 0.06, 0.02, 0.46, 0.60, 1.02);
    var front = ell(x, y, z, s * 0.34, -0.05, 0.62, 0.38, 0.45, 0.45);
    var temporal = ell(x, y, z, s * 0.44, -0.30, 0.18, 0.32, 0.27, 0.55);
    return smin(smin(main, front, 0.25), temporal, 0.3);
  }
  function cereb(x, y, z) { return ell(x, y, z, 0, -0.46, -0.70, 0.50, 0.25, 0.30); }
  function stem(x, y, z) { return ell(x, y, z, 0, -0.74, -0.34, 0.13, 0.34, 0.14); }
  function brainSDF(x, y, z) {
    return Math.min(hemi(x, y, z, -1), hemi(x, y, z, 1), cereb(x, y, z), stem(x, y, z));
  }
  function boundary(fn, cx, cy, cz, dx, dy, dz) {
    if (fn(cx, cy, cz) > 0) return -1;
    var lo = 0, hi = 2.2;
    for (var it = 0; it < 22; it++) {
      var m = (lo + hi) / 2;
      if (fn(cx + dx * m, cy + dy * m, cz + dz * m) < 0) lo = m; else hi = m;
    }
    return lo;
  }
  function gyri(x, y, z) {
    return Math.sin(x * 9 + Math.sin(z * 6 + y * 2) * 1.8) * Math.cos(z * 8 + Math.sin(y * 7) * 1.3) +
           0.5 * Math.sin(y * 13 + z * 4 + x * 2);
  }

  function build() {
    var rand = makeRand(20261114);
    function gauss() { return (rand() + rand() + rand() - 1.5) / 1.5; }
    var HR = 20, HM = 40, CR = 6, CM = 26;
    var N = HR * HM * 2 + CR * CM;
    var A = new Float32Array(N * 3), B = new Float32Array(N * 3), C = new Float32Array(N * 3);
    var delay = new Float32Array(N), size = new Float32Array(N);
    var loops = [], ci = 0;

    function addRings(fn, cx, cz, y0, y1, rings, per, g) {
      for (var r = 0; r < rings; r++) {
        var y = y0 + (y1 - y0) * (r + 0.5) / rings, s0 = ci;
        for (var j = 0; j < per; j++) {
          var th = (j / per) * Math.PI * 2, dx = Math.sin(th), dz = Math.cos(th);
          var d = boundary(fn, cx, y, cz, dx, 0, dz);
          if (d < 0) d = 0.02;
          C[ci * 3] = cx + dx * d; C[ci * 3 + 1] = y; C[ci * 3 + 2] = cz + dz * d;
          ci++;
        }
        loops.push(s0, per, g);
      }
    }
    addRings(function (x, y, z) { return hemi(x, y, z, -1); }, -0.36, 0.02, -0.46, 0.64, HR, HM, 0);
    addRings(function (x, y, z) { return hemi(x, y, z, 1); }, 0.36, 0.02, -0.46, 0.64, HR, HM, 1);
    addRings(cereb, 0, -0.70, -0.66, -0.27, CR, CM, 2);

    var centers = [[-0.36, 0.06, 0.02, 0.36], [0.36, 0.06, 0.02, 0.36], [-0.44, -0.30, 0.18, 0.07],
                   [0.44, -0.30, 0.18, 0.07], [0, -0.46, -0.70, 0.11], [0, -0.74, -0.34, 0.03]];
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
      var isC = c === centers[4], g = gyri(x, y, z);
      if (!isC && Math.abs(g) < 0.28 && rand() < 0.85) continue;
      var push = isC ? 0.025 * Math.sin(y * 70) : 0.05 * g;
      B[bi * 3] = x + dx * push; B[bi * 3 + 1] = y + dy * push; B[bi * 3 + 2] = z + dz * push;
      delay[bi] = rand(); size[bi] = 0.8 + rand() * 1.0;
      bi++;
    }

    var STR = 14, per = Math.ceil(N / STR), strandOf = new Int16Array(N), idx = 0;
    for (var st = 0; st < STR && idx < N; st++) {
      var px = gauss() * 0.6, py = gauss() * 0.5, pz = gauss() * 0.6, vx = gauss(), vy = gauss(), vz = gauss();
      for (var k = 0; k < per && idx < N; k++) {
        vx += gauss() * 0.55; vy += gauss() * 0.55; vz += gauss() * 0.55;
        var vl = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1;
        vx /= vl; vy /= vl; vz /= vl;
        px += vx * 0.06; py += vy * 0.06; pz += vz * 0.06;
        var dd = Math.sqrt(px * px + py * py + pz * pz);
        if (dd > 1.05) { px *= 1.05 / dd; py *= 1.05 / dd; pz *= 1.05 / dd; vx = -px; vy = -py; vz = -pz; }
        A[idx * 3] = px; A[idx * 3 + 1] = py * 0.9; A[idx * 3 + 2] = pz;
        strandOf[idx] = st; idx++;
      }
    }

    var eA = [], eB = [], eC = [], i, j;
    for (i = 1; i < N; i++) if (strandOf[i] === strandOf[i - 1]) eA.push(i - 1, i);
    for (var L = 0; L < loops.length; L += 3) {
      var s0 = loops[L], cnt = loops[L + 1];
      var next = L + 3 < loops.length && loops[L + 5] === loops[L + 2];
      for (j = 0; j < cnt; j++) {
        eC.push(s0 + j, s0 + ((j + 1) % cnt));
        if (next && j % (cnt / 4 | 0) === 0) eC.push(s0 + j, s0 + cnt + j);
      }
    }
    for (i = 0; i < N; i++) {
      var b1 = -1, b2 = -1, d1 = 1e9, d2 = 1e9, ix = B[i * 3], iy = B[i * 3 + 1], iz = B[i * 3 + 2];
      for (j = 0; j < N; j++) {
        if (j === i) continue;
        var ex = B[j * 3] - ix, ey = B[j * 3 + 1] - iy, ez = B[j * 3 + 2] - iz, d3 = ex * ex + ey * ey + ez * ez;
        if (d3 < d1) { d2 = d1; b2 = b1; d1 = d3; b1 = j; } else if (d3 < d2) { d2 = d3; b2 = j; }
      }
      if (b1 > i) eB.push(i, b1);
      if (b2 > i && d2 < 0.03) eB.push(i, b2);
    }
    return { N: N, A: A, B: B, C: C, delay: delay, size: size, eA: eA, eB: eB, eC: eC, strandOf: strandOf };
  }

  // 관찰 단계에서 동그라미 칠 점, 의심 단계에서 지울 가닥
  var MARKS = [37, 211, 498, 803, 1066, 1390];
  var DOUBT_STRANDS = [2, 5, 9, 12];

  function FilmBrain(canvas, opts) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.W = canvas.width; this.H = canvas.height;
    this.cx = opts.cx; this.cy = opts.cy; this.scale = opts.scale;
    this.g = build();
    this.S = new Float32Array(this.g.N * 3);
  }

  /*
   * state: t(초), phase(0 엉킴 → 1 뇌 → 2 설계도),
   *        mark(0..1 관찰 표시), doubt(0..1 의심: 가닥 지움), scan(0..1 검증 스캔), fade(0..1 전체 투명도)
   */
  FilmBrain.prototype.draw = function (st) {
    var g = this.g, N = g.N, S = this.S, ctx = this.ctx, W = this.W, H = this.H;
    var t = st.t, phase = st.phase;
    var ry = 0.75 + t * 0.04;   // 천천히 한 방향으로 돌며, 설계도 단계에서 옆모습에 가까워짐
    var rx = -0.32;
    var cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
    var p1 = clamp01(phase), p2 = clamp01(phase - 1);
    var doubtFade = clamp01(st.doubt) * (1 - clamp01(phase * 1.5));

    for (var i = 0; i < N; i++) {
      var k = i * 3, dl = g.delay[i] * 0.35;
      var t1 = ease(clamp01((p1 - dl) / 0.65)), t2 = ease(clamp01((p2 - dl) / 0.65));
      var jig = (1 - t1) * 0.02;
      var ax = g.A[k] + Math.sin(t * 0.9 + i * 0.37) * jig;
      var ay = g.A[k + 1] + Math.cos(t * 0.7 + i * 0.21) * jig;
      var az = g.A[k + 2] + Math.sin(t * 0.8 + i * 0.13) * jig;
      var bx = ax + (g.B[k] - ax) * t1, by = ay + (g.B[k + 1] - ay) * t1, bz = az + (g.B[k + 2] - az) * t1;
      var x = bx + (g.C[k] - bx) * t2, y = by + (g.C[k + 1] - by) * t2, z = bz + (g.C[k + 2] - bz) * t2;
      var x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      var y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
      var f = 3.4 / (3.4 + z2);
      S[k] = this.cx + x1 * this.scale * f;
      S[k + 1] = this.cy - y1 * this.scale * f;
      S[k + 2] = z2;
    }

    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    var fade = st.fade === undefined ? 1 : st.fade;
    if (fade <= 0) return;

    var wA = 1 - clamp01(phase * 1.4);
    var wB = phase <= 1 ? clamp01((phase - 0.3) / 0.7) : 1 - clamp01((phase - 1) / 0.6);
    var wC = clamp01((phase - 1.25) / 0.6);
    var lw = Math.max(1, W / 1300);

    // 엉킨 가닥: 의심 단계에서 일부 가닥은 흐려짐
    if (wA > 0.01) {
      ctx.lineWidth = lw * 0.9;
      for (var pass = 0; pass < 2; pass++) {
        ctx.beginPath();
        for (var e = 0; e < g.eA.length; e += 2) {
          var isDoubt = DOUBT_STRANDS.indexOf(g.strandOf[g.eA[e]]) > -1;
          if ((pass === 1) !== isDoubt) continue;
          var a = g.eA[e] * 3, b = g.eA[e + 1] * 3;
          ctx.moveTo(S[a], S[a + 1]); ctx.lineTo(S[b], S[b + 1]);
        }
        ctx.strokeStyle = pass === 1 && doubtFade > 0 ? ACCENT : INK;
        ctx.globalAlpha = fade * wA * (pass === 1 ? 0.34 * (1 - doubtFade * 0.75) + doubtFade * 0.12 : 0.34);
        ctx.stroke();
      }
    }
    this.edges(g.eB, fade * wB * 0.3, INK, lw * 0.8);
    this.edges(g.eC, fade * wC * 0.42, INK, lw * 0.8);

    // 점
    ctx.fillStyle = INK;
    var dot = (1 - wC * 0.45) * lw * 1.6;
    for (i = 0; i < N; i++) {
      k = i * 3;
      ctx.globalAlpha = fade * (0.22 + 0.55 * clamp01((1.3 - S[k + 2]) / 2.4));
      var sz = g.size[i] * dot;
      ctx.fillRect(S[k] - sz / 2, S[k + 1] - sz / 2, sz, sz);
    }

    // 신호(뇌 상태): 시간의 함수로만 계산
    if (wB > 0.02) {
      var E = g.eB.length / 2;
      ctx.fillStyle = ACCENT;
      for (var pk = 0; pk < 26; pk++) {
        var period = 1.1 + hash(pk) * 1.3;
        var local = (t + hash(pk + 50) * period) / period;
        var cyc = Math.floor(local), pr = local - cyc;
        var ei = Math.floor(hash(pk * 31 + cyc * 7.3) * E);
        var a2 = g.eB[ei * 2] * 3, b2 = g.eB[ei * 2 + 1] * 3;
        var px = S[a2] + (S[b2] - S[a2]) * pr, py = S[a2 + 1] + (S[b2 + 1] - S[a2 + 1]) * pr;
        var on = Math.sin(Math.PI * pr);
        ctx.globalAlpha = fade * wB * on;
        ctx.beginPath(); ctx.arc(px, py, lw * 2.6, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = fade * wB * on * 0.14;
        ctx.beginPath(); ctx.arc(px, py, lw * 9, 0, Math.PI * 2); ctx.fill();
      }
    }

    // 관찰: 사실에 동그라미
    var mk = clamp01(st.mark) * (1 - clamp01(phase * 2));
    if (mk > 0) {
      ctx.lineWidth = lw * 1.6;
      for (var m = 0; m < MARKS.length; m++) {
        var local2 = clamp01(mk * 1.6 - m * 0.12);
        if (local2 <= 0) continue;
        var mi = MARKS[m] * 3, r = lw * 20;
        ctx.strokeStyle = INK;
        ctx.globalAlpha = fade * 0.9;
        ctx.beginPath();
        ctx.arc(S[mi], S[mi + 1], r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ease(local2));
        ctx.stroke();
        ctx.fillStyle = INK;
        ctx.beginPath(); ctx.arc(S[mi], S[mi + 1], lw * 3, 0, Math.PI * 2); ctx.fill();
      }
    }

    // 검증: 아래에서 위로 지나가는 스캔선과 통과 표시
    if (st.scan > 0 && wC > 0.05) {
      var sp = clamp01(st.scan);
      var top = this.cy - this.scale * 0.95, bottom = this.cy + this.scale * 0.95;
      var yy = bottom - (bottom - top) * ease(sp);
      ctx.strokeStyle = ACCENT; ctx.lineWidth = lw * 1.4;
      ctx.globalAlpha = fade * wC * Math.sin(Math.PI * sp) * 0.9;
      ctx.beginPath(); ctx.moveTo(this.cx - this.scale * 1.5, yy); ctx.lineTo(this.cx + this.scale * 1.5, yy); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  FilmBrain.prototype.edges = function (list, alpha, color, lw) {
    if (alpha < 0.01) return;
    var ctx = this.ctx, S = this.S;
    ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.globalAlpha = alpha;
    ctx.beginPath();
    for (var e = 0; e < list.length; e += 2) {
      var a = list[e] * 3, b = list[e + 1] * 3;
      ctx.moveTo(S[a], S[a + 1]); ctx.lineTo(S[b], S[b + 1]);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  window.FilmBrain = FilmBrain;
})();
