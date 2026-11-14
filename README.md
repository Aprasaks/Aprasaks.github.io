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
| `assets/site.css` | 전체 스타일 (청사진 도면 컨셉) |
| `notes/` | 생각 노트 목록과 글 |
| `essays/`, `about/` | 옛 주소. 새 주소로 넘겨주는 페이지만 남아 있음 |

## 상담 채널 바꾸기

`assets/site.js` 맨 위 `DECHIVE_CONTACT`에 링크를 넣으면 상담 섹션에 버튼이 생깁니다. 비워둔 항목은 표시되지 않습니다.

## 노트 추가하기

`notes/<slug>/index.html`을 기존 글 형식대로 만들고, `notes/index.html` 목록, 홈의 생각 노트 영역, `sitemap.xml`, `feed.xml`을 함께 갱신합니다.
