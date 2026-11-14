import os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dechive-film')
DUR = 22

SCENES = [
  # id, start, dur, step label, title, line
  ('s0', 0, 4.2, '', '같은 실수를,<br>왜 또 반복할까?', ''),
  ('s1', 4.2, 4.0, '1', '관찰한다', '해석을 보태기 전에, 사실부터 적습니다.'),
  ('s2', 8.2, 3.3, '2', '의심한다', '당연하던 전제를 다시 묻습니다.'),
  ('s3', 11.5, 4.1, '3', '재설계한다', '의지 대신 순서와 기준을 다시 짭니다.'),
  ('s4', 15.6, 3.0, '4', '검증한다', '달라졌는지, 실제 결과로 확인합니다.'),
]

def comp(W, H, cid, orient):
    land = orient == 'landscape'
    cx, cy = (W*0.68, H*0.5) if land else (W*0.5, H*0.33)
    scale = min(W*0.25, H*0.37) if land else min(W*0.36, H*0.19)
    # 글자 크기
    big = 112 if land else 104
    small = 38 if land else 40
    textbox = (f'left:140px; top:50%; transform:translateY(-50%); width:760px;' if land
               else f'left:90px; right:90px; top:{int(H*0.60)}px;')
    scenes_html = []
    for sid, st, du, num, title, line in SCENES:
        numhtml = f'<span class="num">{num}<i>/4</i></span>' if num else ''
        linehtml = f'<p class="line">{line}</p>' if line else ''
        cls = 'title hook' if not num else 'title'
        scenes_html.append(f'''      <div id="{sid}" class="clip scene" data-start="{st}" data-duration="{du}" data-track-index="1">
        <div class="tb">{numhtml}<h2 class="{cls}">{title}</h2>{linehtml}</div>
      </div>''')
    endbox = ('left:140px; top:50%; transform:translateY(-50%);' if land
              else f'left:90px; right:90px; top:{int(H*0.60)}px;')
    tweens = []
    for sid, st, du, num, title, line in SCENES:
        a, b = st, st + du
        if sid != 's0': tweens.append(f'tl.fromTo("#{sid} .tb > *", {{opacity:0, y:28}}, {{opacity:1, y:0, duration:0.7, ease:"power3.out", stagger:0.12}}, {a+0.05});')
        tweens.append(f'tl.to("#{sid} .tb > *", {{opacity:0, y:-16, duration:0.45, ease:"power2.in", stagger:0.05}}, {b-0.55});')
    tweens.append('tl.fromTo("#end .tb > *", {opacity:0, y:28}, {opacity:1, y:0, duration:0.8, ease:"power3.out", stagger:0.14}, 18.95);')
    return f'''<!doctype html>
<html lang="ko" data-resolution="{orient}" data-composition-variables='[{{"id":"url","type":"string","label":"URL","default":"studio.dechive.dev"}}]'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="assets/gsap.min.js"></script>
    <script src="assets/film-brain.js"></script>
    <style>
      @font-face {{ font-family: "Plex KR"; font-weight: 400; src: url(assets/fonts/ibm-plex-sans-kr-korean-400-normal.woff2) format("woff2"); }}
      @font-face {{ font-family: "Plex KR"; font-weight: 400; src: url(assets/fonts/ibm-plex-sans-kr-latin-400-normal.woff2) format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }}
      @font-face {{ font-family: "Plex KR"; font-weight: 600; src: url(assets/fonts/ibm-plex-sans-kr-korean-600-normal.woff2) format("woff2"); }}
      @font-face {{ font-family: "Plex KR"; font-weight: 600; src: url(assets/fonts/ibm-plex-sans-kr-latin-600-normal.woff2) format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }}
      @font-face {{ font-family: "Plex KR"; font-weight: 700; src: url(assets/fonts/ibm-plex-sans-kr-korean-700-normal.woff2) format("woff2"); }}
      @font-face {{ font-family: "Plex KR"; font-weight: 700; src: url(assets/fonts/ibm-plex-sans-kr-latin-700-normal.woff2) format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }}
      @font-face {{ font-family: "Plex Mono"; font-weight: 400; src: url(assets/fonts/ibm-plex-mono-latin-400-normal.woff2) format("woff2"); }}
      :root {{
        --ground: #F2F3F0;
        --ink: #15181C;
        --muted: #5B626C;
        --accent: #2448D8;
        --font-display: "Plex KR", sans-serif;
      }}
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: var(--ground); }}
      #root {{
        position: relative; width: 100%; height: 100%;
        font-family: var(--font-display); color: var(--ink); word-break: keep-all;
      }}
      .clip {{ position: absolute; inset: 0; }}
      #brain {{ position: absolute; inset: 0; width: {W}px; height: {H}px; }}
      .tb {{ position: absolute; {textbox} }}
      .num {{ display: block; font-family: "Plex Mono", monospace; font-size: {small}px; color: var(--accent); margin-bottom: 18px; }}
      .num i {{ font-style: normal; color: var(--muted); }}
      .title {{ font-size: {big}px; line-height: 1.12; font-weight: 600; letter-spacing: -0.035em; }}
      .hook {{ font-size: {int(big*0.92)}px; }}
      .line {{ margin-top: 26px; font-size: {small}px; line-height: 1.5; color: var(--muted); font-weight: 400; }}
      #end .tb {{ {endbox} }}
      .wm {{ font-size: {int(small*1.05)}px; font-weight: 700; letter-spacing: .16em; }}
      .end-title {{ margin-top: 22px; font-size: {int(big*0.86)}px; line-height: 1.14; font-weight: 600; letter-spacing: -0.035em; }}
      .url {{ margin-top: 34px; font-family: "Plex Mono", monospace; font-size: {small}px; color: var(--accent); }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="{cid}" data-start="0" data-duration="{DUR}" data-width="{W}" data-height="{H}">
      <canvas id="brain" class="clip" width="{W}" height="{H}" data-start="0" data-duration="{DUR}" data-track-index="0"></canvas>
{chr(10).join(scenes_html)}
      <div id="end" class="clip scene" data-start="18.8" data-duration="{DUR-18.8:.1f}" data-track-index="1">
        <div class="tb"><p class="wm">DECHIVE</p><h2 class="end-title">생각을<br>다시 설계하는 수업</h2><p class="url" id="url">studio.dechive.dev</p></div>
      </div>
    </div>
    <script>
      (function () {{
        var DUR = {DUR};
        var vars = (window.__hyperframes && window.__hyperframes.getVariables) ? window.__hyperframes.getVariables() : {{}};
        if (vars.url) document.getElementById('url').textContent = vars.url;

        var brain = new FilmBrain(document.getElementById('brain'), {{ cx: {cx:.1f}, cy: {cy:.1f}, scale: {scale:.1f} }});
        function c01(x) {{ return x < 0 ? 0 : x > 1 ? 1 : x; }}
        function ez(x) {{ return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }}
        function seg(t, a, b) {{ return ez(c01((t - a) / (b - a))); }}
        // 화면 상태는 모두 시간 t만으로 계산합니다.
        function render(t) {{
          brain.draw({{
            t: t,
            phase: seg(t, 11.6, 13.3) + seg(t, 13.5, 15.3),
            mark: seg(t, 4.5, 6.8),
            doubt: seg(t, 8.5, 9.9),
            scan: c01((t - 15.9) / 2.1),
            fade: 1 - 0.78 * seg(t, 18.5, 19.6)
          }});
        }}
        var clock = {{}}, now = 0;
        Object.defineProperty(clock, 't', {{
          get: function () {{ return now; }},
          set: function (v) {{ now = v; render(v); }}
        }});

        var tl = gsap.timeline({{ paused: true }});
        tl.fromTo(clock, {{ t: 0 }}, {{ t: DUR, duration: DUR, ease: "none" }}, 0);
        {chr(10).join("        "+x for x in tweens).strip()}
        window.__timelines = window.__timelines || {{}};
        window.__timelines["{cid}"] = tl;
        render(0);
        tl.seek(0);
      }})();
    </script>
  </body>
</html>
'''

open(os.path.join(ROOT, 'index.html'), 'w').write(comp(1920, 1080, 'main', 'landscape'))
import shutil
PR = ROOT + '-portrait'
os.makedirs(PR, exist_ok=True)
for f in ['hyperframes.json','package.json','meta.json']: shutil.copy(os.path.join(ROOT,f), PR)
shutil.rmtree(PR+'/assets', ignore_errors=True); shutil.copytree(ROOT+'/assets', PR+'/assets')
open(os.path.join(PR, 'index.html'), 'w').write(comp(1080, 1920, 'portrait', 'portrait'))
print('ok')
