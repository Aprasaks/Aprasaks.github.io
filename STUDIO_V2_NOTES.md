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

## 공통 헤더·푸터 (2026-10-11)
- `studio-v2-shell.css`: 홈과 내부 페이지가 공유하는 헤더·푸터 **단일 스타일 소스**. 내부 페이지의 기존 `style.css`는 본문 디자인에만 계속 사용.
- 적용: `/`, `/work/`, `/work/association-system/`, `/education/`, `/about/`, `/book/`, `/resume/`.
- 헤더: DECHIVE STUDIO / Explore / Work / Education / About / dechive.dev. 모바일에서도 동일 메뉴, 현재 페이지 활성 표시.
- 푸터: DECHIVE STUDIO / Ideas for a More Open Tomorrow / Explore·Work·Education·About·Book / 자동 갱신 연도.
- `studio-v2.js`: 공통 `studio-mobile-nav` 메뉴의 열기·닫기, ESC·외부 클릭 닫기 및 © 연도 업데이트.
- 이 사이트는 정적 HTML이므로 위 7개 파일에 헤더·푸터 **같은 구조의 HTML**을 두고 스타일은 `studio-v2-shell.css`로 통합 관리한다. 메뉴 항목을 변경하면 공통 HTML을 함께 수정해야 한다.
- 기존 `/card/`는 별도의 명함 QR 전용 화면으로 현재 공통 헤더/푸터 적용 대상에서 제외. `/heymi/` 역시 별도 독립 경로라 이번 변경 범위에 포함하지 않음.
- **검증:** 7개 페이지에서 헤더/푸터, 링크, 공통 CSS/JS 및 본문 `main` 보존 정적 검사 통과. 실제 브라우저 PC·모바일 시각 확인은 별도 점검 필요.

## Work — 불편함·판단·변경 과정 중심 리뉴얼 (2026-10-11)
- Work는 모든 프로젝트나 구현 사이트의 목록이 아니라 **선별한 실제 문제 해결 기록**을 소개함.
- Work 메인에 2가지 사례만 노출: ① 생활체육 단체의 회원등록/문서 취합 반복 ② DECHIVE의 지식·출처·검증 기록 문제.
- 각 사례는 **PROBLEM(불편함) → DECISION(판단) → CHANGE(바꾼 방식)**으로 구성하고, 미확인 수치/성과 없이 진행 중임을 명확히 기술.
- 기존 `/work/association-system/` 페이지도 구체적인 고객명·소스 코드·기술 목록보다 실제 흐름과 선택 이유, 이후 확인할 문제(CHECK AGAIN)를 중심으로 재작성.
- GUNSAN.COM은 **이번 Work 대표 공개 목록에서 제외**. 삭제된 프로젝트가 아니며 사용자가 공개를 결정할 때만 다시 추가 가능.
- GitHub 외부 소스 코드/특정 프로젝트 URL 공개를 Work에서 제거. 실제 운영 고객 데이터, 명부, 미확인 성공률, 가상의 수치 포함하지 않음.
- 신규 전용 CSS `studio-work.css`; Work 본문에서 오래된 `style.css`, `script.js` 의존성 제거. 공통 `studio-v2-shell.css` 헤더·푸터/모바일 메뉴는 그대로 유지.
- 안전: 기존 2개 Work 경로/canonical 유지, 정적 내부 링크 검사 및 HTML·CSS 균형/모바일 브레이크포인트 확인. **실브라우저 레이아웃은 배포 후 추가 검수 필요.**

## 후속 작업
1. 디자인 및 텍스트 피드백 수렴.
2. Instagram/Threads/X 계정 실주소 확인 및 CTA 연결.
3. Work·Education·About 본문은 v2 디자인으로 개편 완료. Book·Resume 등 아직 남아 있는 본문 디자인을 차례로 검토.
4. 책 소개, 명함 QR, 기존 SEO URL, OG 이미지, 모바일 실브라우저 검수.
5. 최신 게시물 노출은 실제 데이터 연동·운영 계획 검증 후 추가. 현재 더미 실적·가짜 지표·가짜 자동 업데이트는 없음.

## 안전
- 기존 `main` 히스토리를 보존한 브랜치 기반 작업.
- `CNAME`, 원래 하위 페이지 HTML, robots.txt, sitemap.xml 삭제하지 않음.
- 파일 및 링크 기계적 검사는 통과. 원격 사진 렌더링과 실제 브라우저 QA는 추가 확인 필요.
