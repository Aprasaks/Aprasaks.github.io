# DECHIVE — 생각의 재설계

2026-11-16 원스크린 랜딩 업데이트.

- 사이트: https://studio.dechive.dev
- 데스크톱: 화면 하나에 모든 주요 요소 표시 (표준 헤더 66px, 본문 카피, 하단 우측 CTA 2개)
- 모바일: 화면 비율에 따라 독립적인 구도, 작은 화면에서는 세로 스크롤 허용
- 배경: `assets/hero-thought.avif` (1672 × 941 생성 이미지, 따뜻한 집안·정육면체·체스 킹을 연상시키는 그림자), `assets/hero-thought.jpg` (호환용 대체)
- HTML 텍스트: `생각의` + 타이핑 `재설계`, 아래 `AI시대에 익숙한 판단을 멈추고, / 다르게 보는 힘을 만듭니다.`
- 구독·상담: 실제 입력 링크가 없어 **연결 전 안내창만 표시**. `assets/landing.js`의 DESTINATIONS에 실제 HTTPS URL을 입력해야 전환이 작동함
- HTML/CSS/JS: `index.html`, `assets/landing.css`, `assets/landing.js`
- 이미지 비율: `object-fit: cover`로 종횡비 유지, 늘려 왜곡하지 않음. 모바일은 별도 크롭
- 기존 `/notes/`, `/about/`, `/work/` 등 내부 페이지와 `CNAME`은 보존
- 동작 줄이기 설정에서는 타이핑 없이 문장이 바로 표시됨.
