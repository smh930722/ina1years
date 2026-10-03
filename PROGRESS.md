# 이나 돌잔치 모바일 초대장: 진행 상황

마지막 작업: 2026-10-03
다음 세션은 이 파일부터 읽고 시작한다.

## 1. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 행사 | 신이나 첫 번째 생일, **2026년 12월 12일 토요일 오전 11:30** |
| 장소 | 파티하우스더엘 씨엘로홀 (구 파티엘하우스 가산점), 서울 금천구 디지털로 173 엘리시아빌딩 3층, 02-865-1141 |
| 부모 | 아빠 신민호, 엄마 박주영 (연락처 노출 OK, 계좌는 넣지 않음) |
| 기준 디자인 | 투아워게스트 '아이스크림' 샘플 (https://baby.toourguest.com/preview/icecream). 구성과 분위기만 참고하고, 코드·이미지는 직접 만듦 |
| 초대장 주소 | https://smh930722.github.io/ina1years/invite/ |
| 레퍼런스 모음 | https://smh930722.github.io/ina1years/ (국내 업체 샘플 82개, 스타일 아이디어 118개) |
| 저장소 | https://github.com/smh930722/ina1years (공개, GitHub Pages: main 브랜치 루트) |
| 로컬 폴더 | `D:\PROJECTS\ina1years` |

## 2. 폴더 구조

```
ina1years/
├─ index.html              레퍼런스 허브 (예시 모음 / 스타일 아이디어로 가는 첫 화면)
├─ styles/                 레퍼런스 페이지 2개 (examples.html, index.html)
├─ PLAN.md                 처음 세운 계획서
├─ PROGRESS.md             이 파일
└─ invite/                 ★ 실제 초대장
   ├─ index.html           화면 구조
   ├─ style.css            디자인 (테마색 5종, 애니메이션, 스크롤 스냅)
   ├─ app.js               동작 (달력·카운트다운·갤러리·음악·첫 화면 연출·방울 등)
   ├─ config.js            ★ 내용은 전부 여기서 고친다 (문구·날짜·사진·음악·테마·옵션)
   ├─ photos/              웹용 사진 (_original/ 은 원본, git 제외)
   ├─ music/               배경음악 mp3 4곡 (Pixabay 무료 음원)
   ├─ apps-script/         방명록 저장용 Google Apps Script 코드 + 연결 방법
   └─ tools/
      ├─ optimize_photos.py   새 사진을 웹용으로 줄이고 위치정보 제거, og.jpg 생성
      └─ bump_version.js      CSS·JS 주소의 ?v= 갱신 (휴대폰 캐시 방지)
```

## 3. 현재 화면 구성 (위에서 아래, 각 섹션은 화면 한 장 + 스크롤 스냅)

1. **첫 화면 연출 (인트로)**: 기본은 세로쓰기
   - 오른쪽 줄 '이나의', 왼쪽 줄 '첫번째생일'
   - 글자마다 파스텔 동그라미 위에 올라가 통통 튀어나옴
   - 맨 왼쪽에 날짜 세로글씨 + 하트 '이나' 스탬프, 배경에 작은 방울과 반짝이
   - 화면을 누르면 바로 넘어감
   - 다른 안: A안 아치 사진(`?intro=arch`), B안 신짱아 크레용 '이나는 못말려!'(`?intro=crayon`)
2. **커버**: 사진 3장이 천천히 확대되며 바뀜, 제목 한 글자씩 등장, 작은 파스텔 방울이 떠오름
3. **인사말** (초안 1번 사용 중) + 아빠·엄마 이름
4. **중간 사진** (팔 번쩍 사진)
5. **PARTY DAY**: 12월 달력에 12일 표시, D-day 카운트다운. 행사가 지나면 감사 문구로 자동 전환
6. **가족 소개**: 아빠 · 이나(가운데, 크게) · 엄마 동그란 프로필 사진, 축하 연락하기(전화·문자)
7. **갤러리**: 8장 슬라이드, 누르면 전체 화면
8. **이나의 1년**: 태어난 날(신생아 사진) / 3·6·9개월·첫 생일 사진 자리 비어 있음
9. **오시는 길**: 장소 약도 이미지(누르면 확대), 카카오맵·네이버지도·전화, 지하철·버스·자가용·주차 안내
10. **방명록**: 목록 + 남기기 (저장소 아직 미연결)
11. **마무리**: 사진 + 문구 + 카카오톡 공유 / 주소 복사

- 오른쪽 위: 배경음악 버튼 (자동재생 시도, 막히면 첫 터치 때 재생)
- 오른쪽 아래: **꾸미기** 패널 (첫 화면 3안, 테마색 5종, 음악 4곡을 바로 바꿔 보기, 선택은 기기별 저장)

## 4. 확정된 결정

- 날짜 12/12 **토요일** (일요일 아님)
- 참석 여부(RSVP) 섹션 **제외**, 계좌 **제외**, 연락처는 노출
- 커버 숫자 '1' 장식 제거, 커버 방울은 작은 파스텔 방울로 **확정**
- 첫 화면 기본: 세로쓰기(귀여운 파스텔 버전)
- **기본 테마색: 노란색(butter)** (2026-10-03 확정)
- 짱구 캐릭터 그림·로고는 저작권 때문에 쓰지 않음 (B안은 분위기만)

## 5. 남은 일 (다음에 할 것)

**부모님이 정할 것**
- [ ] 첫 화면 최종안: 세로쓰기 / A안 / B안 → 정하면 `config.js`의 `introStyle` 설정, `showIntroPicker: false`, 안 쓰는 안 코드 정리
- [ ] 배경음악 최종 곡 → `music` 설정, `showMusicPicker: false`
- [ ] 테마색 최종 확인 (지금 노란색) → `showThemePicker: false`로 꾸미기 버튼 숨김
- [ ] 인사말 최종 (초안 1·2·3 중 `greetingPick`, 또는 직접 문구)

**받아야 할 자료**
- [ ] 이나의 1년 월별 사진 (3·6·9·12개월)
- [ ] 엄마 아빠 프로필 사진 교체용 (지금은 웨딩 사진에서 잘라 좌우반전)
- [ ] 사진 추가·교체 시 `invite/photos/`에 넣고 `python invite/tools/optimize_photos.py`
- [ ] 무료 주차 시간 (장소에 확인 필요)

**기능**
- [ ] 방명록 저장 연결: Google 스프레드시트 + Apps Script 배포 → `apiUrl` 입력 (`invite/apps-script/README.md`). 부모님 Google 계정에서 직접 해야 함
- [ ] 카카오톡 공유 버튼: 카카오 개발자 JavaScript 키 받으면 `kakaoJsKey` 입력 (사이트 도메인 등록 필요). 지금은 휴대폰 공유창 또는 주소 복사로 동작
- [ ] 실제 아이폰·갤럭시·카톡 인앱 브라우저에서 스크롤 스냅·음악·인트로 확인
- [ ] 행사 후: 감사 문구는 자동 전환됨. 당일 사진 추가는 선택

## 6. 수정·배포 방법

```bash
# 1) 내용 수정: invite/config.js (문구·사진·음악·테마)
# 2) 새 사진이 있으면
python invite/tools/optimize_photos.py
# 3) 캐시 방지 버전 갱신
node invite/tools/bump_version.js
# 4) 올리기 (1~2분 뒤 사이트 반영)
git add -A && git commit -m "update" && git push
```

- 로컬 미리보기: `.claude/launch.json`의 `site` (python http.server 8765) → http://localhost:8765/invite/
- 특정 첫 화면 바로 보기: `?intro=vertical|arch|crayon`, 테마: `?theme=butter|lilac|peach|mint|sky`
- GitHub CLI: `C:\Program Files\GitHub CLI\gh.exe` (PowerShell에서는 앞에 `&` 필요), 계정 smh930722 로그인됨

## 7. 참고·주의

- 저장소가 공개라 코드에 있는 연락처는 누구나 볼 수 있음. 행사 후 연락처 삭제 권장
- 음원 4곡은 Pixabay Content License (출처 표시 의무 없음): zec53, HitsLab, Keyframe_Audio, REDproductions
- 사진 원본은 `invite/photos/_original/`에만 있고 GitHub에는 올라가지 않음
- 파스텔무비 썸네일은 https 미지원이라 레퍼런스 페이지에서 이름 카드로 표시됨
