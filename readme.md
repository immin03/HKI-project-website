# THE KOMATSU 90 — 배포 안내

> **2026-07-27 수정본**
>
> **1. 메뉴 세부 항목 클릭 먹통 수정**
> 코스·료칸이 카드+상세 패널 구조로 바뀌면서 섹션 `id`가 사라졌는데
> 메뉴 링크는 옛 앵커(`#yamashiro` 등)를 그대로 가리키고 있었습니다.
> 앵커 스크롤 핸들러가 대상을 못 찾고 조용히 반환해 아무 반응이 없었습니다.
> → 대상 섹션이 없고 같은 이름의 카드가 있으면 상세 패널을 여는 라우팅을 추가.
> 미연결 앵커 18개 → 0개. (헤더 드롭다운 · 전체 메뉴 · 히어로 홀 수 링크)
>
> **2. 모바일 전체 메뉴 정렬**
> 하위 항목이 `flex-wrap + justify-content:center` 로 글자 길이대로
> 줄바꿈되며 줄마다 시작점이 달랐습니다.
> → 2열 격자 + 헤어라인, 터치 영역 46px. 360px 이하는 1열 자동 전환.
> 하단 유틸 5개, 문의 링크 6개도 같은 격자로 통일.
>
> **3. 중복 CSS 322개 규칙 제거 (122.6KB → 95.7KB)**
> 삽입용 주석 마커가 32개 중복돼 같은 블록이 두 벌씩 들어가 있었습니다.
> 뒤에 똑같은 규칙이 또 있어 캐스케이드에서 이길 수 없는 것만 골라 제거.
> 4개 해상도 × 3,076개 요소의 계산값을 전후 대조해 변화 없음을 확인했습니다.
>
> **4. 공유 썸네일 주소를 실제 배포 주소로 교체**
> `www.komatsu90.com` 은 아직 연결 전이라 카카오톡 썸네일이 뜨지 않았습니다.
> `https://brilliant-yeot-20afd1.netlify.app` 로 바꿔 지금 바로 뜨게 했습니다.
> **도메인을 붙이면 아래 6곳을 실제 도메인으로 다시 바꿔야 합니다.**
>
> | 파일 | 항목 |
> |---|---|
> | index.html | `<link rel="canonical">` |
> | index.html | `og:url` |
> | index.html | `og:image` |
> | index.html | `twitter:image` |
> | sitemap.xml | `<loc>` |
> | robots.txt | `Sitemap:` |
>
> **5. `_headers.txt` → `_headers` 로 파일명 변경**
> 확장자가 붙어 있으면 Netlify가 캐시 설정을 읽지 못합니다.
>
> 검증: 모바일 390 · 데스크톱 1440 양쪽에서 카드 6/6, 체험 팝업 10/10,
> 패널 탭 8/8, 갤러리 넘김, 상담신청 모달, 블록 겹침 없음, 가로 넘침 없음,
> JS 오류 없음.


정적 사이트입니다. 서버 프로그램(PHP·ASP·Node 등)이 전혀 필요 없고,
이 폴더를 그대로 올리면 동작합니다.

## 폴더 구성

```
index.html          단일 페이지 (HTML + CSS + JS 모두 포함)
images/             사진 96장 (webp)
og-image.jpg        카카오톡·페이스북 공유 썸네일 1200×630
favicon.ico / favicon-32.png / favicon-180.png / favicon-512.png
site.webmanifest    모바일 홈화면 추가용
robots.txt
sitemap.xml
_headers            Netlify / Cloudflare Pages 캐시 설정 (확장자 없음 — 그대로 두세요)
```

용량: 약 26MB (사진이 대부분)

---

## 배포 방법 A — Netlify Drop (가장 빠름, 5분)

1. https://app.netlify.com/drop 접속
2. 이 폴더를 브라우저 창에 **끌어다 놓기**
3. 끝. `무작위이름.netlify.app` 주소가 즉시 발급되고 HTTPS도 자동 적용됩니다
4. 도메인 연결: Site settings → Domain management → Add custom domain

계정 없이도 임시 배포되며, 무료 계정으로 로그인하면 주소가 유지됩니다.
`_headers` 파일이 자동 인식되어 이미지 캐시가 1년으로 잡힙니다.

## 배포 방법 B — 기존 웹서버 (FTP)

현재 데모가 올라간 `demo.implus.co.kr` 같은 서버가 있다면,
FTP/SFTP로 원하는 경로에 폴더째 업로드하면 됩니다.

```
/komatsu90/
   index.html
   images/
   ...
```

주의할 점
- 파일명·폴더명 **대소문자를 그대로** 유지해 주세요. Windows 서버에서 작업하다
  Linux 서버로 옮기면 대소문자 차이로 이미지가 깨집니다
- `.webp` MIME 타입이 없는 구형 IIS라면 `image/webp`를 추가해야 합니다

## 배포 방법 C — Cloudflare Pages / Vercel / GitHub Pages

세 곳 모두 정적 사이트를 무료로 호스팅합니다.
빌드 명령은 없고, **출력 디렉터리만 이 폴더로 지정**하면 됩니다.

- Cloudflare Pages: Build command 비움 / Output directory `/`
- Vercel: Framework Preset → Other
- GitHub Pages: 저장소에 push 후 Settings → Pages → Branch 지정

---

## 올리기 전에 바꿔야 할 것

`index.html` 안에서 아래 항목을 실제 값으로 교체해 주세요.

| 위치 | 현재 값 | 설명 |
|---|---|---|
| `<link rel="canonical">` | `https://brilliant-yeot-20afd1.netlify.app/` | 실제 도메인 |
| `og:image`, `og:url`, `twitter:image` | `https://brilliant-yeot-20afd1.netlify.app/...` | 실제 도메인 (절대경로여야 공유 썸네일이 뜹니다) |
| `sitemap.xml`, `robots.txt` | `https://brilliant-yeot-20afd1.netlify.app/` | 실제 도메인 |
| 헤더·푸터 전화번호 | `1660-3500` | 실제 대표번호 |
| FAQ·NEWS·회원권 링크 | `#` | 실제 페이지 주소 |
| 뉴스 5건 | 샘플 문구 | 실제 공지 |

## 아직 채워지지 않은 것

- **회원권 상담신청 폼** — 지금은 링크만 있고 폼이 없습니다.
  DB 연동이 필요하면 별도 작업이며, 간단히 가려면 Google Forms 또는
  Netlify Forms(정적 사이트에서 바로 동작)를 붙일 수 있습니다
- **서브페이지** — 현재는 한 페이지짜리입니다. 코스 상세·멤버십 안내 등을
  별도 페이지로 나눌지 정해야 합니다
- **다국어** — 일본어·영어 버전 필요 여부

## 외부에서 불러오는 것

폰트 2종만 CDN에서 가져옵니다. 인터넷이 되는 환경이면 신경 쓸 것 없습니다.

- SUIT (jsdelivr) — 국문
- Cormorant Garamond (Google Fonts) — 영문·숫자

폐쇄망에 올려야 하면 두 폰트 파일을 내려받아 `fonts/` 폴더에 넣고
`index.html` 상단의 `<link>` 두 줄을 로컬 경로로 바꾸면 됩니다.



---

# 회원권 상담신청 — Netlify Forms

**추가 설정이 없습니다.** 이 폴더를 Netlify에 올리는 순간 바로 동작합니다.
가입할 서비스도, 넣을 키도 없습니다.

## 어떻게 동작하나

`index.html` 안에 `name="membership"` 인 폼이 들어 있고 `data-netlify="true"` 가 붙어 있습니다.
Netlify가 배포할 때 이 폼을 자동으로 인식해 접수함을 만듭니다.

## 접수 내용 확인

Netlify 대시보드 → **Forms** → `membership`

- 접수 목록이 시간순으로 쌓입니다
- 개별 항목을 열면 성함 · 연락처 · 이메일 · 지역 · 관심사항 · 문의내용이 모두 보입니다
- 우측 상단 **Download as CSV** 로 엑셀에서 열 수 있습니다
- 스팸으로 분류된 건은 Spam 탭에 따로 모입니다

## 접수 알림 메일 받기

Netlify → **Forms → Settings and usage → Form notifications → Add notification**
→ **Email notification** → 받을 주소 입력.

새 상담신청이 들어올 때마다 즉시 메일이 옵니다. Slack 알림도 같은 자리에서 붙일 수 있습니다.

## 스팸 차단

빈 칸 함정(honeypot)을 넣어 두었습니다. 봇이 채우면 자동으로 걸러집니다.
그래도 스팸이 들어오면 Netlify → Forms → Settings 에서 reCAPTCHA를 켤 수 있습니다.

## 무료 한도

월 100건까지 무료입니다. 초과하면 Netlify에서 안내가 오고,
그때 유료 전환하거나 다른 방식으로 옮기면 됩니다.

## 파일

- `index.html` — 상담신청 폼(모달) 포함
- `thanks.html` — 자바스크립트가 꺼진 브라우저에서 폼을 보냈을 때 나오는 완료 페이지

평소에는 모달 안에서 접수가 끝나고 완료 화면이 그 자리에 뜹니다.
`thanks.html` 은 예비용입니다.

---

# 아직 붙이지 않은 것 — 뉴스 관리 · 회원가입

이 두 가지는 **Netlify Forms 로는 불가능합니다.** 데이터를 읽고 쓰는 저장소가 따로 필요합니다.

현재 상태
- **뉴스** — `index.html` 안에 5건이 직접 적혀 있습니다. 수정하려면 HTML을 고쳐 다시 올려야 합니다
- **회원가입 / 로그인** — 없습니다

어떤 방식으로 갈지 정해지면 그때 붙이면 됩니다.
