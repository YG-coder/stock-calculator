# 문서 색인

이 폴더는 두 종류의 문서를 담고 있습니다.

- **현재 기준 문서** — 파일 이름에 날짜가 없습니다. 코드가 바뀌면 갱신합니다.
- **과거 기록** — 파일 이름이 `YYYY-MM-DD-` 로 시작합니다. 그 시점의 설계안·감사·작업 보고이며,
  **현재 상태를 나타내지 않습니다.** 내용은 고쳐 쓰지 않고, 이후 확인된 차이만 본문에 "정정"으로 덧붙입니다.

프로젝트 진입점은 저장소 루트의 [`../README.md`](../README.md) 입니다.

---

## 현재 기준 문서

| 문서 | 내용 |
|---|---|
| [`montecarlo-engine.md`](montecarlo-engine.md) | 몬테카를로 시뮬레이션 엔진 — 모형 가정, 연→월 변환, 목표 역산, Worker 구조, 테스트 범위, 구현 현황(§13) |

타입·상수·계산식의 단일 소스는 문서가 아니라 코드입니다.

| 알고 싶은 것 | 볼 곳 |
|---|---|
| 시뮬레이션 타입 계약 | `src/lib/montecarlo/types.ts` |
| 입력 허용 범위 | `src/lib/montecarlo/validate.ts` (`LIMITS`) |
| 연 → 월 변환 | `src/lib/montecarlo/returns.ts` (`toMonthlyParams`) |
| 공개 계산기 목록·라우트 | `src/lib/constants.ts` (`CALCULATORS`) |
| 세율·공제액·기준일 (단일 소스) | `src/lib/taxRates.ts` |
| 가이드 검수 상태·출처 확인 기록 | `src/data/guidePages.ts` 의 `review`, 타입은 `src/lib/contentReview.ts` |
| 발행·색인 검사 규칙 | `src/lib/contentGate.ts` |

가이드 검수 3단계와 색인 금지 운영 방법은 저장소 [`../README.md`](../README.md) 의
"콘텐츠 검수와 색인" 절에 있습니다. 공통 기준 원본(`Incomelab-Architecture.md`)은
이 저장소에 복사하지 않습니다.

---

## 과거 기록

### 설계 (몬테카를로 엔진)

| 문서 | 성격 |
|---|---|
| [`2026-08-21-montecarlo-engine-contract.md`](2026-08-21-montecarlo-engine-contract.md) | 엔진 입출력 계약 설계안 |
| [`2026-08-22-montecarlo-implementation-plan.md`](2026-08-22-montecarlo-implementation-plan.md) | 파일 구조·모듈 책임 구현 계획. §0·§1·§5 에 정정 노트 있음 |
| [`2026-08-22-portfolio-assumptions-design.md`](2026-08-22-portfolio-assumptions-design.md) | 입력 계층·프리셋 설계안. 프리셋은 미구현 |
| [`2026-08-22-types-contract-final.md`](2026-08-22-types-contract-final.md) | 착수 시점 타입 확정본. 끝에 "현재 코드와의 차이" 절 있음 |

### 감사·검증·작업 보고

| 문서 | 성격 |
|---|---|
| [`2026-08-20-버전업.md`](2026-08-20-버전업.md) | 의존성 업그레이드 기록 |
| [`2026-08-21-site-audit.md`](2026-08-21-site-audit.md) | 사이트 종합 감사 보고서 (P0~P3) |
| [`2026-08-21-crypto-entry-excel-audit.md`](2026-08-21-crypto-entry-excel-audit.md) | `/crypto/entry` 엑셀 대조 검증 |
| [`2026-08-21-track-plan.md`](2026-08-21-track-plan.md) | 트랙 분리와 다음 단계 계획 |
| [`2026-08-23-adsense-track-report.md`](2026-08-23-adsense-track-report.md) | 애드센스 대비 1차 개선 작업 보고 |
| [`2026-08-25-backlog-completion.md`](2026-08-25-backlog-completion.md) | SEO·정책·증권거래세 백로그 처리 보고 |
| [`2026-08-25-help-rollout-verification.md`](2026-08-25-help-rollout-verification.md) | 첫 사용 도움말 적용·검증 보고 |

> 감사 보고서의 지적 사항 중 상당수는 이후 수정됐습니다. 처리 결과는 애드센스 작업 보고와
> 백로그 처리 보고에 있습니다. 어떤 항목이 현재 남아 있는지는 문서가 아니라 코드로 확인하세요.

---

## `pdf-exports/`

같은 이름 Markdown 을 조판한 PDF 사본 6개입니다.
**`.gitignore` 에서 제외돼 Git 에 올라가지 않습니다 — 이 폴더는 로컬에만 있습니다.**
새로 클론한 작업본에는 없으니, 아래 표의 PDF 가 보이지 않아도 정상입니다.

| 파일 | 대응 Markdown |
|---|---|
| `2026-08-21-site-audit.pdf` | `2026-08-21-site-audit.md` |
| `2026-08-21-track-plan.pdf` | `2026-08-21-track-plan.md` |
| `2026-08-22-montecarlo-implementation-plan.pdf` | `2026-08-22-montecarlo-implementation-plan.md` |
| `2026-08-22-portfolio-assumptions-design.pdf` | `2026-08-22-portfolio-assumptions-design.md` |
| `2026-08-22-types-contract-final.pdf` | `2026-08-22-types-contract-final.md` |
| `2026-08-23-adsense-track-report.pdf` | `2026-08-23-adsense-track-report.md` |

2026-09-16 에 6개 모두 텍스트를 추출해 같은 이름 Markdown 과 대조했습니다. **PDF 에만 있는
고유 내용은 찾지 못했습니다** — 차이는 표 조판 순서, 줄바꿈, 쪽 머리말/쪽 번호 같은 조판
결과였습니다. 그래서 **로컬 보관 + 커밋 제외**로 두었습니다. 내용은 Markdown 에서 다시
조판할 수 있고, 저장소에 6MB 짜리 이진 파일을 넣지 않아도 됩니다.

다만 Git 에 커밋된 적이 없는 파일이라, **이 폴더를 지우면 되돌릴 수 없습니다.**
PDF 형태가 계속 필요하면 저장소 밖에 따로 보관하세요.

PDF 에는 위 정정 노트가 반영돼 있지 않습니다. **읽을 때는 Markdown 쪽을 기준으로 보세요.**
