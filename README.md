# DECHIVE · 생각의 재설계

정답보다 그 답에 이르는 구조를 탐구하는 한국어 에세이 블로그입니다.

- **주소:** https://studio.dechive.dev
- **배포:** GitHub Pages, `main` 브랜치 루트
- **구현:** 정적 HTML/CSS/JavaScript. 프레임워크나 별도 서버 없음.
- **화면:** `index.html` 홈, `essays/index.html` 글 목록, `about/index.html` 소개
- **글:** `essays/<slug>/index.html`
- **공통 파일:** `assets/site.css`, `assets/site.js`
- **검색:** 글 목록 페이지 안에서만 동작하는 클라이언트 필터. 서버 검색 아님.

새 글을 추가할 때는 새 글 폴더 및 HTML을 만들고, 홈의 최신 글 영역·글 목록·`sitemap.xml`·`feed.xml`을 함께 갱신합니다. 현재 올라간 글 2편은 이번 사이트 구축 과정에서 새로 작성한 초안입니다. 향후 편집/확정할 수 있습니다.

기존 파일과 메뉴 구조를 재사용하지 않고 새로 작성했습니다. 커스텀 도메인 연결을 위해 `CNAME`은 유지했습니다.
