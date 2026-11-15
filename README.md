# DECHIVE — 생각의 재설계
2026-11-15 고해상도 포토 기반 랜딩 개편.

- URL: https://studio.dechive.dev
- 첫 화면만 표시: DECHIVE / 생각의 / 재설계. / 두 줄 문구 / 상담 신청 / 뉴스레터 구독
- 배경: `assets/dechive-real-cube.jpg` (2400×3600, Pexels, Anna Shvets; free license, https://www.pexels.com/photo/cube-stool-in-white-studio-in-sunlight-4971990/)
- 3D CSS 정육면체와 과도한 모션 제거. 정육면체 자체가 사진에 포함되어 있어 그림자와 조명이 일치합니다.
- 왜곡 방지: `object-fit: cover`로 종횡비 유지, 가로 확장이 아닌 크롭.
- HTML 텍스트를 사진 위에 배치하여 화면 크기에 관계없이 선명합니다.
- 응답형 레이아웃: PC / 태블릿 / 모바일
- CTA는 신청 URL 아직 미제공으로 안내창만 표시. `assets/landing.js`의 `DESTINATIONS`에 실제 HTTPS 주소를 입력하면 링크가 작동합니다.
- 과거 글 페이지와 기존 CNAME은 유지합니다.
