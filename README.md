# DECHIVE · 생각의 재설계

DECHIVE의 수업(AI 실전 수업, 생각의 재설계 클래스, 콘텐츠 설계, 1:1 세션, 출강)을 소개하고 상담 신청을 받는 랜딩 사이트입니다.

- **배포:** GitHub Pages, `main` 브랜치 루트. 빌드 단계 없음.
- **구현:** 정적 HTML/CSS/JS. 외부 라이브러리 없음(글꼴만 Google Fonts).
- **주소:** 현재 `CNAME`은 `studio.dechive.dev`. 새 도메인을 연결할 때 `CNAME`, 각 페이지의 `canonical`/`og:url`, `sitemap.xml`, `feed.xml`, `robots.txt`의 주소를 함께 바꿉니다.

## 파일

| 경로 | 역할 |
| --- | --- |
| `index.html` | 랜딩 페이지 |
| `assets/brain.js` | 히어로 모션. 스크롤에 따라 엉킨 생각(REV.A) → 뇌(REV.B) → 등고선 설계도(REV.C) |
| `assets/site.js` | 메뉴, 상담 채널 버튼, 노트 검색 |
| `assets/site.css` | 전체 스타일 (밝은 종이 + 잉크, 강조색은 파랑 하나) |
| `assets/og.jpg` | 링크 공유 미리보기 이미지 (1200×630) |
| `assets/video/` | 방법 섹션 영상(가로/세로 MP4, 포스터). 데스크톱은 가로, 모바일은 세로 파일을 보일 때만 불러옴 |
| `video-src/` | 영상 원본(HyperFrames 프로젝트). 수정 방법은 아래 참고 |
| `notes/` | 생각 노트 목록과 글 |
| `essays/`, `about/` | 옛 주소. 새 주소로 넘겨주는 페이지만 남아 있음 |

## 상담 채널 바꾸기

`assets/site.js` 맨 위 `DECHIVE_CONTACT`에 링크를 넣으면 상담 섹션에 버튼이 생깁니다. 비워둔 항목은 표시되지 않습니다.

## 노트 추가하기

`notes/<slug>/index.html`을 기존 글 형식대로 만들고, `notes/index.html` 목록, 홈의 생각 노트 영역, `sitemap.xml`, `feed.xml`을 함께 갱신합니다.

## 방법 영상 다시 만들기 (HyperFrames)

1. `python3 video-src/make_comps.py` — 가로(`video-src/dechive-film/`)와 세로(`video-src/dechive-film-portrait/`) 컴포지션을 만듭니다. 장면 문구와 타이밍은 이 파일의 `SCENES`에서 고칩니다.
2. 각 폴더에서 `npx hyperframes@0.9.45 render -o out.mp4 --fps 30` (Node 22+, FFmpeg 필요)
3. 웹용으로 압축: `ffmpeg -i out.mp4 -an -c:v libx264 -preset veryfast -crf 30 -pix_fmt yuv420p -movflags +faststart -tune animation method-landscape.mp4`
4. `assets/video/`의 파일을 교체합니다. 마지막 화면의 주소는 `--variables '{"url":"새도메인"}'`으로 바꿔 렌더링할 수 있습니다.
