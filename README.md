# DECHIVE — 생각의 재설계

2026-11-15 전면 리뉴얼. 첫 화면 한 장면만 남긴 미니멀 랜딩페이지.

- 도메인: https://studio.dechive.dev (CNAME 유지)
- 메인: `index.html`, `assets/landing.css`, `assets/landing.js`
- 사진: `assets/architecture.webp` (사용자와 함께 생성한 시안의 건축 공간 부분)
- 정육면체: CSS 3D + `assets/stone.svg`, 첫 진입 시 3.5초 굴러와 정지, 동작 줄이기 설정 시 정지 상태
- 본문: 생각의 / 재설계. / AI시대에 익숙한 판단을 멈추고, 다르게 보는 힘을 만듭니다.
- CTA: 상담 신청, 뉴스레터 구독. **외부 URL 미제공 상태로 연결 준비 중 안내만 표시.**
- 실제 URL을 받으면 `assets/landing.js`의 `DESTINATIONS.consult`, `DESTINATIONS.newsletter`에 HTTPS 링크 입력.
- 기존 `/notes/`, `/about/`, `/work/` 등은 URL 보존. 랜딩 메인에는 노출하지 않음.
- Google Forms, 뉴스레터 서비스의 접수/저장 기능은 아직 연동되지 않았음. 정상 접수로 오인시키지 말 것.
