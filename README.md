# 주식계산기.kr (stock-calculator)

국내주식·미국주식·코인 투자 계산기와 몬테카를로 기반 장기 투자 시뮬레이션을 제공하는 Next.js 웹 서비스입니다.

- 운영 사이트: <https://주식계산기.kr>
- 이 문서 기준일: 2026-09-16 (main 브랜치 `3f3f4c5` 기준)

## 목차

- [공개 페이지](#공개-페이지)
- [몬테카를로 시뮬레이션 엔진](#몬테카를로-시뮬레이션-엔진)
- [기술 스택](#기술-스택)
- [실행 방법](#실행-방법)
- [검사와 테스트](#검사와-테스트)
- [배포](#배포)
- [디렉터리 구조](#디렉터리-구조)
- [문서](#문서)

---

## 공개 페이지

계산기 목록의 단일 소스는 `src/lib/constants.ts` 의 `CALCULATORS` 입니다. 여기에 등록하면
허브 페이지·전체 목록(`/calculators`)·사이트맵(`src/app/sitemap.ts`)에 자동으로 반영됩니다.
현재 등록된 항목은 **계산기 25종 + 허브 3종**입니다.

### 국내 주식 (16종)

| 경로 | 계산기 |
|---|---|
| `/profit-calculator` | 주식 수익률 계산기 |
| `/average-price-calculator` | 물타기 평단가 계산기 |
| `/target-price-calculator` | 주식 목표가 계산기 |
| `/stop-loss-calculator` | 주식 손절가 계산기 |
| `/break-even-calculator` | 본전 회복 계산기 |
| `/risk-reward-calculator` | 손익비 계산기 |
| `/position-size-calculator` | 포지션 사이즈 계산기 |
| `/dividend-calculator` | 배당 수익 계산기 |
| `/compound-interest-calculator` | 복리 계산기 |
| `/stock-transaction-tax-calculator` | 증권거래세 계산기 |
| `/dca-calculator` | 적립식 투자 시뮬레이션 (몬테카를로) |
| `/goal-probability-calculator` | 투자 목표달성확률 계산기 (몬테카를로) |
| `/fire-calculator` | FIRE 은퇴 시뮬레이션 (몬테카를로) |
| `/sequence-risk-calculator` | 수익률 순서 위험 계산기 (몬테카를로 + 정순·역순 비교) |
| `/no-sell-rebalancing-calculator` | 무매도 리밸런싱 계산기 |
| `/portfolio-calculator` | 포트폴리오 기대수익률·변동성 계산기 |

### 미국 주식 (3종)

| 경로 | 계산기 |
|---|---|
| `/overseas-stock-tax-calculator` | 해외주식 세금 계산기 |
| `/us-stocks/exchange-profit` | 환율 반영 수익 계산기 |
| `/us-stocks/dividend` | 미국주식 배당 계산기 |

### 코인 (6종)

| 경로 | 계산기 |
|---|---|
| `/crypto/entry` | 코인 레버리지 진입 계산기 |
| `/crypto/liquidation` | 코인 청산가 계산기 |
| `/crypto/leverage-profit` | 코인 레버리지 수익 계산기 |
| `/crypto/profit` | 코인 수익 계산기 |
| `/crypto/funding-fee` | 펀딩비 계산기 |
| `/crypto/average` | 코인 물타기 계산기 |

### 허브와 그 밖의 페이지

| 경로 | 설명 |
|---|---|
| `/` | 홈 |
| `/stocks`, `/crypto`, `/us-stocks` | 카테고리 허브 3종 |
| `/calculators` | 전체 계산기 목록 |
| `/guides`, `/guides/[slug]` | 투자 가이드 (현재 발행 7편, `src/data/guidePages.ts`) |
| `/lab` | 사용자 자료 백테스트 실험 도구. `robots: noindex` |
| `/dev/montecarlo` | 엔진 검증용 개발 화면. **프로덕션 빌드에서는 404** |
| `/about`, `/contact`, `/privacy`, `/terms` | 정책·소개 페이지 |

---

## 몬테카를로 시뮬레이션 엔진

- 엔진 버전 **1.0.1** — `ENGINE_VERSION` (`src/lib/montecarlo/types.ts`)
- 브라우저 Web Worker 에서 실행하며, 입력값은 서버로 전송하지 않습니다.
- 현재 이 엔진을 쓰는 공개 계산기: 적립식 시뮬레이션, 목표달성확률, FIRE, 수익률 순서 위험.

모형 가정·연→월 변환·목표 역산·검증 범위는 **[docs/montecarlo-engine.md](docs/montecarlo-engine.md)** 를 보세요.
타입 계약의 단일 소스는 문서가 아니라 `src/lib/montecarlo/types.ts` 입니다.

---

## 기술 스택

| 영역 | 사용 |
|---|---|
| 프레임워크 | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| 언어 | TypeScript 5 |
| 테스트 | Vitest 4 (`environment: node`) |
| 배포 | Cloudflare Workers (`@opennextjs/cloudflare` + `wrangler`) |

정확한 버전은 `package.json` 을 기준으로 합니다.

---

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 <http://localhost:3000> 에서 열립니다.

---

## 검사와 테스트

| 명령 | 하는 일 |
|---|---|
| `npm run lint` | ESLint (`eslint.config.mjs`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest 1회 실행 (`tests/**/*.test.ts`) |
| `npm run test:watch` | Vitest 감시 모드 |
| `npm run build` | Next.js 프로덕션 빌드 |
| `npm run check` | lint → typecheck → test → build 순차 실행 |

테스트는 `tests/` 아래에 있고 `@` 별칭이 `src/` 를 가리킵니다(`vitest.config.mts`).
계산 모듈만 대상으로 하므로 React·Worker 없이 Node 환경에서 돌아갑니다.

변동성 캘리브레이션 테이블(`src/lib/montecarlo/sigma-table.ts`)은 자동 생성 파일입니다.
직접 편집하지 말고 `node scripts/gen-sigma-table.mjs` 로 다시 만드세요.

---

## 배포

Cloudflare Workers 에 OpenNext 어댑터로 배포합니다. 설정은 `wrangler.jsonc`,
`open-next.config.ts` 에 있습니다.

| 명령 | 하는 일 |
|---|---|
| `npm run preview` | OpenNext 빌드 후 로컬에서 Workers 런타임으로 미리보기 |
| `npm run deploy` | OpenNext 빌드 후 배포 |
| `npm run upload` | OpenNext 빌드 후 업로드(즉시 전환 없이 버전 업로드) |
| `npm run cf-typegen` | `wrangler types` 로 `CloudflareEnv` 타입 생성 |

`next.config.ts` 에는 `www.주식계산기.kr` → `주식계산기.kr` 영구 리다이렉트가 정의돼 있습니다.

> 이 문서를 갱신하면서 배포 명령을 실행하거나 운영 배포 상태를 확인하지는 않았습니다.
> 위 표는 `package.json` 의 스크립트 정의를 옮긴 것입니다.

---

## 디렉터리 구조

```
src/
  app/                  App Router 페이지·라우트 (sitemap.ts, robots.ts 포함)
  components/
    calculator/         계산기 UI 컴포넌트
    dev/                개발 전용 화면(MonteCarloLab)
    layout/ seo/ ui/    공통 레이아웃·구조화 데이터·UI 조각
  data/guidePages.ts    가이드 콘텐츠 정의
  hooks/useMonteCarlo.ts  Worker 수명주기·디바운스·진행률
  lib/                  계산 로직 (순수 함수)
    montecarlo/         시뮬레이션 엔진
  workers/              Web Worker 진입점
tests/                  Vitest 테스트
scripts/                gen-sigma-table.mjs (캘리브레이션 테이블 생성)
docs/                   설계·감사·구현 문서 (docs/README.md 참고)
```

---

## 문서

문서 색인은 **[docs/README.md](docs/README.md)** 에 있습니다. 요약하면:

| 문서 | 성격 |
|---|---|
| [docs/montecarlo-engine.md](docs/montecarlo-engine.md) | **현재 기준** — 시뮬레이션 엔진 모형·구현 설명 |
| `docs/2026-*.md` | **과거 기록** — 당시의 설계안·감사·작업 보고서. 내용은 그대로 두고 상단에 기록 시점을 표시했습니다 |
| `docs/pdf-exports/` | 같은 이름 Markdown 을 조판한 PDF 사본. **로컬 전용 — `.gitignore` 로 커밋에서 제외** |

문서 규칙:

- 날짜가 붙은 문서는 **그 시점의 기록**입니다. 현재 상태와 다를 수 있으며, 사실관계를 고쳐 쓰지 않고 상단 안내와 정정 노트로만 차이를 표시합니다.
- 날짜가 없는 문서가 **현재 기준 문서**입니다.
- 타입·상수·계산식의 단일 소스는 코드입니다. 문서는 위치와 규칙을 설명하고, 전체 정의를 복사해 두지 않습니다.
