// 초대장 내용은 전부 여기서 고친다. 디자인 코드는 건드릴 필요 없다.
window.INVITE = {
  // photo: 가족 소개 칸의 동그란 프로필 사진 (photos/ 폴더)
  baby: { name: '이나', fullName: '신이나', photo: 'profile_ina.jpg' },
  parents: {
    dad: { name: '신민호', phone: '010-8992-1067', photo: 'profile_dad.jpg' },
    mom: { name: '박주영', phone: '010-7195-1865', photo: 'profile_mom.jpg' },
  },

  // 날짜를 바꾸면 요일·달력·카운트다운이 자동으로 따라 바뀐다.
  event: { date: '2026-12-12', time: '11:30' },

  venue: {
    name: '파티하우스더엘',
    hall: '씨엘로홀',
    floor: '3층',
    address: '서울 금천구 디지털로 173 엘리시아빌딩 3층',
    tel: '02-865-1141',
    kakaoPlaceId: '26893532',
    naverQuery: '파티하우스더엘',
    oldName: '구 파티엘하우스 가산점',
    mapImage: 'venue_map.png', // 장소에서 받은 약도 (photos/ 폴더)
    transport: [
      { title: '지하철', lines: [
        '1호선 가산디지털단지역 3번 출구',
        '150m 걸어 마리오아울렛 버스정류장 앞 → 횡단보도 건너 마리오 3관 앞 → 육교 밑에서 왼쪽으로 50m',
        '7호선 가산디지털단지역 6번 출구',
        '200m 직진 후 육교 아래에서 왼쪽으로 50m',
      ] },
      { title: '버스', lines: [
        '간선 503 · 504 · 571 · 652 · 653',
        '금천패션아울렛 사거리, 마리오 하차',
        '지선 5536 · 5714 · 5616 · 5712 · 5619 · 5626 · 5630 · 5618 · 5528',
        '금천패션아울렛 사거리, 마리오 / 마리오아울렛 하차',
        '마을 금천07 · 금천03 · 금천05',
        '벽산디지털밸리, 한신IT타워, 마리오아울렛 하차',
        '공항 6004',
        '패션단지 하차',
      ] },
      { title: '자가용', lines: [
        '내비게이션: 서울 금천구 가산동 60-69 엘리시아빌딩',
        '도로명 주소: 디지털로 173',
      ] },
      { title: '주차', lines: [
        '엘리시아빌딩 건물 내 주차장 이용',
        '문의 02-865-1141',
      ] },
    ],
  },

  // 인사말 초안 3개 중 하나를 고른다 (0, 1, 2).
  greetingPick: 0,
  greetings: [
    '작고 여린 손으로 우리 가족에게 와 준 이나가\n어느덧 첫 번째 생일을 맞이했습니다.\n\n그동안 따뜻한 관심과 사랑으로\n함께 지켜봐 주신 고마운 분들을 모시고\n작은 자리를 마련했습니다.\n\n오셔서 이나의 첫걸음을 축복해 주세요.',
    '처음 웃던 날, 처음 뒤집던 날,\n처음 엄마 아빠를 부르던 날.\n\n하루하루가 선물 같았던 1년을 지나\n이나가 첫 생일을 맞았습니다.\n\n그 기쁨을 소중한 분들과 나누고 싶습니다.',
    '한 살 먹는 건 아주 큰일이래요.\n\n이나가 무사히, 씩씩하게 1년을 자라\n그 큰일을 해냈습니다.\n\n바쁘시더라도 오셔서\n이나에게 박수 한 번 보내 주세요.',
  ],

  // 첫 화면 연출: 'vertical'(세로쓰기, 기본) / 'arch'(A안 아치 사진) / 'crayon'(B안 신짱아 크레용)
  introStyle: 'vertical',
  showIntroPicker: true, // 꾸미기 패널에서 첫 화면을 바꿔 볼 수 있게 (정하면 false)
  introPhoto: 'KakaoTalk_20261002_144355051_05.jpg', // A안 아치 사진에 쓸 사진
  crayonPhoto: 'KakaoTalk_20261002_080459172_04.jpg', // B안 크레용 액자에 쓸 사진

  // 첫 화면 세로쓰기 문구. 오른쪽 줄부터 읽히고, 다음 줄은 앞 줄이 끝난 높이부터 이어진다.
  introColumns: ['이나의', '첫번째생일'],

  closing: '이나의 첫 번째 생일,\n함께해 주시면 큰 기쁨이 되겠습니다.',

  // 사진은 invite/photos/ 폴더에 넣고 파일 이름만 적는다. 비어 있으면 자리만 보인다.
  photos: {
    cover: 'KakaoTalk_20261002_144355051_05.jpg',
    // 커버에서 차례로 바뀌며 보일 사진들 (비우면 cover 한 장만)
    coverSlides: ['KakaoTalk_20261002_144355051_05.jpg', 'KakaoTalk_20260930_071419953_02.jpg', 'KakaoTalk_20260928_125130467.jpg'],
    middle: 'KakaoTalk_20261002_080459172_04.jpg',
    closing: 'KakaoTalk_20260928_125130467.jpg',
    gallery: [
      'KakaoTalk_20261002_144355051_05.jpg',
      'KakaoTalk_20260930_071419953_02.jpg',
      'KakaoTalk_20260928_125130467.jpg',
      'KakaoTalk_20261002_080459172_04.jpg',
      'KakaoTalk_20260923_151129611_02.jpg',
      'KakaoTalk_20261001_112840250.jpg',
      'KakaoTalk_20260923_081759364_01.jpg',
      'KakaoTalk_20260923_170852394_05.jpg',
    ],
    timeline: { 0: 'KakaoTalk_20260923_170852394_05.jpg', 3: '', 6: '', 9: '', 12: '' },
  },

  // 배경음악: invite/music/ 폴더의 파일 이름. 비우면 음악 버튼이 사라진다.
  music: 'glockenspiel-ukulele.mp3',
  showMusicPicker: true, // 곡을 다 고르면 false로 바꿔 숨긴다
  // 후보 곡 (모두 Pixabay 무료 음원, 출처 표시 의무 없음)
  musicOptions: [
    { file: 'glockenspiel-ukulele.mp3', title: 'Glockenspiel Ukulele', by: 'zec53' },
    { file: 'cute-joyful-ukulele.mp3', title: 'Cute Joyful Ukulele', by: 'HitsLab' },
    { file: 'sweets.mp3', title: 'Happy Kids Ukulele - Sweets', by: 'Keyframe_Audio' },
    { file: 'friendly-clapping.mp3', title: 'Friendly Glockenspiel Clapping', by: 'REDproductions' },
  ],

  // 테마: lilac / peach / mint / sky / butter
  theme: 'butter',
  showThemePicker: true, // 색을 다 고르면 false로 바꿔 버튼을 숨긴다

  // 방명록 저장용 Google Apps Script 웹앱 주소 (apps-script/README.md 참고)
  apiUrl: '',

  // 카카오 JavaScript 키 (있으면 카카오톡 공유 버튼이 카톡 공유창으로 열린다)
  kakaoJsKey: '',
  siteUrl: 'https://smh930722.github.io/ina1years/invite/', // 배포 후 실제 주소 (예: https://smh930722.github.io/ina-dol/)
};
