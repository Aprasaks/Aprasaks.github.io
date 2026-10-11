# Studio v2 — Editorial Homepage (draft 01)

2026-10-11 제작 기준. User-approved editorial hero / 3 × 2 channel layout.

## 구현 범위
- `index.html`: 1안 스타일의 메인 전면 재구성. DECHIVE.dev(Knowledge + AI Update) / NAVER Blog / Morning AI Radio / Instagram / Threads / X, 하단 Work·Education 및 About.
- `studio-v2.css`: 기존 4,291줄 `style.css`에 의존하지 않는 홈페이지 단독 라이트 스타일. 3열 → 2열 → 1열 반응형.
- `studio-v2.js`: 모바일 메뉴 동작, 연도 표시. 불필요한 자동 애니메이션/라이브 피드/복잡한 앱 기능 없음.

## 게시 링크
- DECHIVE.dev /knowledge, /ai-update: 개별 링크 연결.
- YouTube: https://www.youtube.com/@dechive
- NAVER Blog: https://blog.naver.com/dehcive-ai (기존 Studio 코드의 주소를 승계; 실제 계정 표기 재확인 필요).
- Instagram/Threads/X: 공식 계정 URL이 아직 확인되지 않아 **가짜 계정으로 연결하지 않음**. 실제 URL 확인 후 CTA를 연결해야 완료.

## 이미지와 라이선스
- 이미지 블록 및 hero는 Unsplash `images.unsplash.com` 사진을 원격 참조하는 임시 편집형 비주얼. Unsplash 라이선스가 적용되는 사진을 사용하는 전제이나 각 작품/작가의 최종 출처 및 상업 이용 가능 여부는 출시 전 재확인 필요.
- 캐릭터 외형이 결정되면 Instagram/Threads의 이미지 블록을 **DECHIVE 자체 만화 장면**으로 바꾼다.
- 원격 이미지 URL 의존성은 추후 라이선스 확인 후 적절한 로컬 이미지 파일 배치로 해소.
- 모바일 또는 이미지 로딩 실패 시 흰색/중립 배경과 텍스트·링크가 남도록 설계.

## 후속 작업
1. 디자인 및 텍스트 피드백 수렴.
2. Instagram/Threads/X 계정 실주소 확인 및 CTA 연결.
3. Work·Education·About·Book·Resume 페이지를 새 브랜드 스타일에 맞춰 **차례로 전면 재설계**. 기존 하위 페이지는 현재 버전이 남아 있어 스타일이 다를 수 있음.
4. 책 소개, 명함 QR, 기존 SEO URL, OG 이미지, 모바일 실브라우저 검수.
5. 최신 게시물 노출은 실제 데이터 연동·운영 계획 검증 후 추가. 현재 더미 실적·가짜 지표·가짜 자동 업데이트는 없음.

## 안전
- 기존 `main` 히스토리를 보존한 브랜치 기반 작업.
- `CNAME`, 원래 하위 페이지 HTML, robots.txt, sitemap.xml 삭제하지 않음.
- 파일 및 링크 기계적 검사는 통과. 원격 사진 렌더링과 실제 브라우저 QA는 추가 확인 필요.
