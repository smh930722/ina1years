(() => {
  const C = window.INVITE;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  document.documentElement.classList.add('js');

  // ---------- 날짜 ----------
  const [y, m, d] = C.event.date.split('-').map(Number);
  const [hh, mm] = C.event.time.split(':').map(Number);
  const eventAt = new Date(Date.UTC(y, m - 1, d, hh - 9, mm)); // KST 기준
  const dowKo = ['일', '월', '화', '수', '목', '금', '토'];
  const dowEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const ampm = hh < 12 ? '오전' : '오후';
  const h12 = ((hh + 11) % 12) + 1;
  const timeKo = `${ampm} ${h12}시${mm ? ` ${mm}분` : ''}`;
  const timeEn = `${hh < 12 ? 'AM' : 'PM'} ${h12}:${String(mm).padStart(2, '0')}`;
  const dateKo = `${y}년 ${m}월 ${d}일 ${dowKo[dow]}요일`;

  // ---------- 기본 텍스트 ----------
  const babyName = C.baby.name;
  // 제목은 한 글자씩 나타나도록 글자마다 span으로 나눈다
  const titleLines = [`${babyName} 돌잔치에`, '초대합니다'];
  let k = 0;
  $('coverTitle').innerHTML = titleLines.map(line => [...line].map(ch => ch === ' ' ? ' ' : `<span class="ch" style="animation-delay:${(0.5 + 0.09 * k++).toFixed(2)}s">${esc(ch)}</span>`).join('')).join('<br>');
  $('coverTitle').setAttribute('aria-label', titleLines.join(' '));
  $('coverWhen').textContent = `${dateKo} ${timeKo}`;
  $('coverWhere').textContent = `${C.venue.name} ${C.venue.hall}`;
  $('greeting').textContent = C.greetings[C.greetingPick] || C.greetings[0];
  $('greetFrom').innerHTML = `아빠 <b>${esc(C.parents.dad.name)}</b> · 엄마 <b>${esc(C.parents.mom.name)}</b>`;
  $('dateKo').textContent = `${dateKo} | ${timeKo}`;
  $('dateEn').textContent = `${dowEn[dow]}, ${monEn[m - 1]} ${d}, ${y} | ${timeEn}`;
  $('vdate').innerHTML = [...`${monEn[m - 1].slice(0, 3)}${d}`].map(c => `<span>${c}</span>`).join('');
  $('famBaby').textContent = C.baby.fullName;
  $('famDad').textContent = C.parents.dad.name;
  $('famMom').textContent = C.parents.mom.name;
  $('venueName').textContent = `${C.venue.name} ${C.venue.hall}`;
  $('venueAddr').textContent = C.venue.address;
  $('closing').textContent = C.closing;
  $('yearHint').textContent = `${babyName}가 자라 온 1년`;

  // ---------- 달력 ----------
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  let cal = dowKo.map(w => `<span class="dow">${w}</span>`).join('');
  cal += '<span></span>'.repeat(first);
  for (let i = 1; i <= days; i++) {
    const w = (first + i - 1) % 7;
    cal += `<span class="${i === d ? 'day-on' : ''}${w === 0 ? ' sun' : ''}">${i}</span>`;
  }
  $('calendar').innerHTML = cal;

  // ---------- 카운트다운 ----------
  const cd = $('countdown');
  const tick = () => {
    const diff = eventAt - Date.now();
    if (diff <= 0) {
      cd.innerHTML = '';
      $('dleft').innerHTML = `${esc(babyName)}의 첫 생일을 함께해 주셔서 <b>감사합니다</b>`;
      return false;
    }
    const s = Math.floor(diff / 1000);
    const parts = [[Math.floor(s / 86400), 'DAYS'], [Math.floor(s / 3600) % 24, 'HOURS'], [Math.floor(s / 60) % 60, 'MIN'], [s % 60, 'SEC']];
    cd.innerHTML = parts.map(([v, l]) => `<div><b>${v}</b><small>${l}</small></div>`).join('');
    $('dleft').innerHTML = `${esc(babyName)}의 첫 생일이 <b>${Math.ceil(diff / 86400000)}일</b> 남았어요`;
    return true;
  };
  if (tick()) setInterval(tick, 1000);

  // ---------- 사진 ----------
  const src = f => (f ? (/^(https?:|\/)/.test(f) ? f : `photos/${f}`) : '');
  const setPhoto = (el, f) => { if (f) { el.style.backgroundImage = `url("${src(f)}")`; el.classList.add('has-img'); } };
  // 커버: 사진이 천천히 확대되며 부드럽게 바뀌는 슬라이드 (영상 같은 연출)
  const coverList = (C.photos.coverSlides && C.photos.coverSlides.length ? C.photos.coverSlides : [C.photos.cover]).filter(Boolean);
  const cs = $('coverSlides');
  if (coverList.length) {
    cs.classList.add('has-img');
    cs.innerHTML = coverList.map(f => `<div class="cover-slide" style="background-image:url('${src(f)}')"></div>`).join('');
    const sl = [...cs.children];
    let ci = 0, zTop = 1;
    sl[0].classList.add('on');
    if (sl.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInterval(() => {
        const prev = sl[ci]; ci = (ci + 1) % sl.length;
        sl[ci].classList.remove("on"); void sl[ci].offsetWidth; sl[ci].style.zIndex = ++zTop; sl[ci].classList.add("on");
        setTimeout(() => prev.classList.remove('on'), 1600);
      }, 5200);
    }
  }
  setPhoto($('midPhoto'), C.photos.middle);
  setPhoto($('closingPhoto'), C.photos.closing || C.photos.cover);

  const gal = C.photos.gallery.length ? C.photos.gallery : Array(6).fill('');
  const slider = $('slider');
  slider.innerHTML = gal.map((f, i) => `<button type="button" class="slide ph${f ? ' has-img' : ''}" data-i="${i}" data-label="갤러리 ${i + 1}" ${f ? `style="background-image:url('${src(f)}')"` : ''} aria-label="사진 ${i + 1} 크게 보기"></button>`).join('');
  const slides = [...slider.children];
  let cur = 0;
  const count = () => { $('slideCount').textContent = `${cur + 1} / ${slides.length}`; };
  slider.addEventListener('scroll', () => {
    const w = slides[0].offsetWidth + 10;
    cur = Math.max(0, Math.min(slides.length - 1, Math.round(slider.scrollLeft / w)));
    count();
  }, { passive: true });
  const go = i => slides[(i + slides.length) % slides.length].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  $('prevBtn').onclick = () => go(cur - 1);
  $('nextBtn').onclick = () => go(cur + 1);
  count();

  const lb = $('lightbox');
  slider.addEventListener('click', e => {
    const b = e.target.closest('.slide');
    if (!b || !C.photos.gallery.length) return;
    const i = +b.dataset.i;
    $('lbTrack').innerHTML = C.photos.gallery.map(f => `<img src="${src(f)}" alt="">`).join('');
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    const tr = $('lbTrack');
    tr.scrollLeft = tr.clientWidth * i;
    const upd = () => { $('lbCount').textContent = `${Math.round(tr.scrollLeft / tr.clientWidth) + 1} / ${C.photos.gallery.length}`; };
    tr.onscroll = upd; upd();
  });

  const tl = C.photos.timeline || {};
  $('timeline').innerHTML = [0, 3, 6, 9, 12].map(k => `<li><div class="tl-photo ph${tl[k] ? ' has-img' : ''}" data-label="${k}개월" ${tl[k] ? `style="background-image:url('${src(tl[k])}')"` : ''}></div><span class="tl-label">${k === 0 ? '태어난 날' : k === 12 ? '첫 생일' : `${k}개월`}</span></li>`).join('');

  // ---------- 오시는 길 ----------
  $('kakaoMap').href = `https://place.map.kakao.com/${C.venue.kakaoPlaceId}`;
  $('naverMap').href = `https://map.naver.com/p/search/${encodeURIComponent(C.venue.naverQuery)}`;
  $('venueTel').href = `tel:${C.venue.tel.replace(/-/g, '')}`;
  $('transport').innerHTML = C.venue.transport.map(t => `<div><dt>${esc(t.title)}</dt><dd>${t.lines.map(l => `<span>${esc(l)}</span>`).join('')}</dd></div>`).join('');

  // ---------- 알림·복사 ----------
  const snack = msg => { const s = $('snack'); s.textContent = msg; s.classList.add('show'); clearTimeout(snack.t); snack.t = setTimeout(() => s.classList.remove('show'), 1800); };
  const copy = async (text, done) => {
    try { await navigator.clipboard.writeText(text); snack(done); }
    catch (e) { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); snack(done); } catch (_) { snack('복사하지 못했어요. 길게 눌러 복사해 주세요'); } t.remove(); }
  };
  $('copyAddr').onclick = () => copy(C.venue.address, '주소를 복사했어요');
  const pageUrl = () => C.siteUrl || location.href.split('#')[0];
  $('copyLink').onclick = () => copy(pageUrl(), '초대장 주소를 복사했어요');

  // ---------- 연락하기 ----------
  const contactRow = (role, p) => `<div class="contact"><span><small>${role}</small>${esc(p.name)}</span><a class="btn ghost" href="tel:${p.phone.replace(/-/g, '')}">전화</a><a class="btn" href="sms:${p.phone.replace(/-/g, '')}">문자</a></div>`;
  $('contactList').innerHTML = contactRow('아빠', C.parents.dad) + contactRow('엄마', C.parents.mom);

  // ---------- 모달 ----------
  let lastFocus = null;
  const openModal = id => { lastFocus = document.activeElement; const el = $(id); el.hidden = false; document.body.style.overflow = 'hidden'; const f = el.querySelector('input:not(.hp),button'); f && f.focus(); };
  const closeAll = () => {
    document.querySelectorAll('.modal, .lightbox').forEach(m => { m.hidden = true; });
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus && lastFocus.focus();
  };
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-open]');
    if (o) { openModal(o.dataset.open); return; }
    if (e.target.closest('[data-close]') || e.target.classList.contains('modal')) closeAll();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  // ---------- 방명록 (Apps Script) ----------
  const api = async (action, data) => {
    if (!C.apiUrl) throw new Error('noapi');
    if (data) {
      const r = await fetch(C.apiUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, ...data }) });
      return r.json();
    }
    const r = await fetch(`${C.apiUrl}?action=${action}`);
    return r.json();
  };
  const fmt = t => { const x = new Date(t); return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, '0')}.${String(x.getDate()).padStart(2, '0')}`; };
  let allMsgs = [], shown = 3;
  const renderMsgs = () => {
    const gb = $('guestbook');
    if (!allMsgs.length) { gb.innerHTML = `<li class="gb-empty">첫 번째 축하 메시지를 남겨 주세요</li>`; return; }
    gb.innerHTML = allMsgs.slice(0, shown).map(x => `<li><p>${esc(x.message)}</p><div class="gb-meta"><span>From ${esc(x.name)}</span><span>${fmt(x.time)}</span></div></li>`).join('')
      + (allMsgs.length > shown ? `<li class="gb-empty"><button type="button" class="link" id="gbMore">메시지 더 보기 (${allMsgs.length - shown})</button></li>` : '');
    const more = $('gbMore'); if (more) more.onclick = () => { shown += 5; renderMsgs(); };
  };
  const loadMsgs = async () => { try { const r = await api('list'); allMsgs = r.items || []; } catch (e) { allMsgs = []; } renderMsgs(); };
  loadMsgs();

  const submit = (formId, noteId, action, okMsg, after) => {
    const form = $(formId);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(form));
      if (fd.website) return; // 스팸 봇
      delete fd.website;
      const note = $(noteId), btn = form.querySelector('[type=submit]');
      btn.disabled = true; note.textContent = '보내는 중이에요…';
      try {
        const r = await api(action, fd);
        if (!r.ok) throw new Error(r.error || 'fail');
        form.reset(); note.textContent = ''; closeAll(); snack(okMsg); after && after();
      } catch (err) {
        note.textContent = err.message === 'noapi' ? '아직 저장 기능을 연결하는 중이에요. 조금만 기다려 주세요.' : '전송하지 못했어요. 잠시 후 다시 시도해 주세요.';
      } finally { btn.disabled = false; }
    });
  };
  submit('msgForm', 'msgNote', 'message', '축하 메시지를 남겼어요', loadMsgs);

  // ---------- 공유 ----------
  $('shareBtn').onclick = async () => {
    const title = `${C.baby.fullName} 첫 번째 생일에 초대합니다`;
    const desc = `${m}월 ${d}일 ${dowKo[dow]}요일 ${timeKo} · ${C.venue.name} ${C.venue.hall}`;
    if (C.kakaoJsKey && window.Kakao) {
      if (!Kakao.isInitialized()) Kakao.init(C.kakaoJsKey);
      Kakao.Share.sendDefault({ objectType: 'feed', content: { title, description: desc, imageUrl: new URL(src(C.photos.cover || 'og.jpg'), pageUrl()).href, link: { mobileWebUrl: pageUrl(), webUrl: pageUrl() } }, buttons: [{ title: '초대장 보기', link: { mobileWebUrl: pageUrl(), webUrl: pageUrl() } }] });
      return;
    }
    if (navigator.share) { try { await navigator.share({ title, text: desc, url: pageUrl() }); return; } catch (e) { if (e.name === 'AbortError') return; } }
    copy(pageUrl(), '주소를 복사했어요. 카카오톡에 붙여 넣어 보내 주세요');
  };
  if (C.kakaoJsKey) { const s = document.createElement('script'); s.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js'; s.crossOrigin = 'anonymous'; document.head.appendChild(s); }

  // ---------- 꾸미기 패널 (테마·음악 고르기) ----------
  const store = { get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  if ((C.showThemePicker || C.showMusicPicker) && $('tuner')) {
    $('tuner').hidden = false;
    $('tunerToggle').onclick = () => {
      const p = $('tunerPanel'), open = p.hidden;
      p.hidden = !open; $('tunerToggle').setAttribute('aria-expanded', open);
      $('tunerToggle').textContent = open ? '닫기' : '꾸미기';
    };
  }

  // ---------- 테마 ----------
  const THEMES = { lilac: ['#c2a3c2', '라일락'], peach: ['#f0ad94', '피치'], mint: ['#9fcfbd', '민트'], sky: ['#a9c6e8', '하늘'], butter: ['#ecd27f', '버터'] };
  const qsTheme = new URLSearchParams(location.search).get('theme');
  let theme = THEMES[qsTheme] ? qsTheme : C.theme;
  if (C.showThemePicker && THEMES[store.get('ina-theme')]) theme = store.get('ina-theme');
  const setTheme = t => {
    document.documentElement.dataset.theme = t;
    document.querySelectorAll('#swatches button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
  };
  if (C.showThemePicker && $('swatches')) {
    $('swatches').innerHTML = Object.entries(THEMES).map(([k, [c, n]]) => `<button type="button" data-t="${k}" style="background:${c}" aria-label="${n}" title="${n}"></button>`).join('');
    $('themeRow').hidden = false;
    $('swatches').onclick = e => { const b = e.target.closest('button'); if (!b) return; setTheme(b.dataset.t); store.set('ina-theme', b.dataset.t); };
  }
  setTheme(theme);

  // ---------- 등장 효과 ----------
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.15 }) : null;
  document.querySelectorAll('.reveal').forEach(el => (io ? io.observe(el) : el.classList.add('in')));

  // ---------- 배경음악 ----------
  // 휴대폰 브라우저는 소리 있는 자동재생을 막는다. 그래서 바로 재생을 시도하고,
  // 막히면 화면을 처음 만지는 순간 재생한다. 끄기 버튼을 누른 뒤에는 다시 켜지지 않는다.
  const btn = $('musicBtn'), toast = $('musicToast');
  const tracks = C.musicOptions || [];
  let track = C.music;
  if (C.showMusicPicker && tracks.some(t => t.file === store.get('ina-music'))) track = store.get('ina-music');
  if (!track) { btn.hidden = true; toast.hidden = true; }
  else {
    const url = f => (/^(https?:|\/)/.test(f) ? f : `music/${f}`);
    const audio = new Audio(url(track));
    audio.loop = true; audio.preload = 'auto'; audio.volume = 0.6;
    let userOff = false;
    const setBtn = on => { btn.setAttribute('aria-pressed', on); btn.setAttribute('aria-label', on ? '배경음악 끄기' : '배경음악 켜기'); };
    const play = () => audio.play().then(() => setBtn(true)).catch(() => setBtn(false));
    const gestures = ['pointerdown', 'touchstart', 'keydown'];
    const onFirst = e => {
      if (e.target.closest && e.target.closest('#musicBtn, #tuner')) return;
      gestures.forEach(g => document.removeEventListener(g, onFirst, true));
      if (!userOff && audio.paused) play();
    };
    gestures.forEach(g => document.addEventListener(g, onFirst, true));
    btn.onclick = () => {
      if (audio.paused) { userOff = false; play(); }
      else { userOff = true; audio.pause(); setBtn(false); }
    };
    document.addEventListener('visibilitychange', () => { if (document.hidden) audio.pause(); else if (!userOff && btn.getAttribute('aria-pressed') === 'true') audio.play().catch(() => {}); });

    if (C.showMusicPicker && tracks.length && $('tracks')) {
      const mark = () => document.querySelectorAll('#tracks button').forEach(b => b.setAttribute('aria-pressed', b.dataset.f === track));
      $('tracks').innerHTML = tracks.map((t, i) => `<button type="button" data-f="${esc(t.file)}"><b>${i + 1}</b><span>${esc(t.title)}<small>${esc(t.by || '')}</small></span></button>`).join('');
      $('musicRow').hidden = false;
      $('tracks').onclick = e => {
        const b = e.target.closest('button'); if (!b) return;
        track = b.dataset.f; store.set('ina-music', track); mark();
        audio.src = url(track); userOff = false; play();
      };
      mark();
    }
    play();
    setTimeout(() => toast.classList.add('show'), 600);
    setTimeout(() => toast.classList.remove('show'), 3600);
  }

  // ---------- 첫 화면 연출: 인트로 문구 → 커버 재생 ----------
  const cover = $('cover'), introEl = $('intro');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const startCover = () => cover.classList.add('play');
  if (introEl && !reduce) {
    const word = C.introText || `${babyName}'s First Birthday`;
    $('introText').innerHTML = [...word].map((ch, i) => ch === ' ' ? ' ' : `<span style="animation-delay:${(0.15 + i * 0.11).toFixed(2)}s">${esc(ch)}</span>`).join('');
    document.body.style.overflow = 'hidden';
    const done = () => { if (introEl.classList.contains('out')) return; introEl.classList.add('out'); document.body.style.overflow = ''; startCover(); };
    setTimeout(done, 400 + word.length * 110 + 1000);
    introEl.addEventListener('click', done);
  } else {
    if (introEl) introEl.hidden = true;
    startCover();
  }

  // ---------- 커버 비눗방울 ----------
  const cv = $('bubbles');
  if (cv && !reduce) {
    const g = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    const size = () => { dpr = Math.min(2, window.devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener('resize', size);
    const make = (fromBottom) => ({ x: Math.random() * W, y: fromBottom ? H + 20 : Math.random() * H, r: 5 + Math.random() * 16, v: 0.25 + Math.random() * 0.6, sway: Math.random() * Math.PI * 2, a: 0.35 + Math.random() * 0.4 });
    const bubbles = Array.from({ length: 16 }, () => make(false));
    let visible = true;
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cover);
    const draw = () => {
      if (visible) {
        g.clearRect(0, 0, W, H);
        for (const b of bubbles) {
          b.y -= b.v; b.sway += 0.015; const x = b.x + Math.sin(b.sway) * 10;
          if (b.y < -30) Object.assign(b, make(true));
          const grd = g.createRadialGradient(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, x, b.y, b.r);
          grd.addColorStop(0, `rgba(255,255,255,${b.a})`); grd.addColorStop(0.7, `rgba(255,255,255,${b.a * 0.15})`); grd.addColorStop(1, `rgba(255,255,255,${b.a * 0.6})`);
          g.beginPath(); g.arc(x, b.y, b.r, 0, Math.PI * 2); g.fillStyle = grd; g.fill();
          g.lineWidth = 1; g.strokeStyle = `rgba(255,255,255,${b.a * 0.8})`; g.stroke();
        }
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
})();
