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
  $('coverName').textContent = babyName;
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
  setPhoto($('coverPhoto'), C.photos.cover);
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

  // ---------- 테마 ----------
  const THEMES = { lilac: '#c2a3c2', peach: '#f0ad94', mint: '#9fcfbd', sky: '#a9c6e8', butter: '#ecd27f' };
  const qsTheme = new URLSearchParams(location.search).get('theme');
  let theme = THEMES[qsTheme] ? qsTheme : C.theme;
  try { if (C.showThemePicker && THEMES[localStorage.getItem('ina-theme')]) theme = localStorage.getItem('ina-theme'); } catch (e) {}
  const setTheme = t => {
    document.documentElement.dataset.theme = t;
    document.querySelectorAll('#swatches button').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
  };
  if (C.showThemePicker) {
    $('swatches').innerHTML = Object.entries(THEMES).map(([k, c]) => `<button type="button" data-t="${k}" style="background:${c}" aria-label="${k} 테마"></button>`).join('');
    $('themePicker').hidden = false;
    $('swatches').onclick = e => { const b = e.target.closest('button'); if (!b) return; setTheme(b.dataset.t); try { localStorage.setItem('ina-theme', b.dataset.t); } catch (_) {} };
  }
  setTheme(theme);

  // ---------- 등장 효과 ----------
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.15 }) : null;
  document.querySelectorAll('.reveal').forEach(el => (io ? io.observe(el) : el.classList.add('in')));

  // ---------- 배경음악 ----------
  // 휴대폰 브라우저는 소리 있는 자동재생을 막는다. 그래서 바로 재생을 시도하고,
  // 막히면 화면을 처음 만지는 순간(탭·스크롤 시작) 재생한다. 끄기 버튼을 누른 뒤에는 다시 켜지지 않는다.
  const btn = $('musicBtn'), toast = $('musicToast');
  if (!C.music) { btn.hidden = true; toast.hidden = true; }
  else {
    const audio = new Audio(/^(https?:|\/)/.test(C.music) ? C.music : `music/${C.music}`);
    audio.loop = true; audio.preload = 'auto'; audio.volume = 0.6;
    let userOff = false;
    const setBtn = on => { btn.setAttribute('aria-pressed', on); btn.setAttribute('aria-label', on ? '배경음악 끄기' : '배경음악 켜기'); };
    const play = () => audio.play().then(() => setBtn(true)).catch(() => setBtn(false));
    const gestures = ['pointerdown', 'touchstart', 'keydown'];
    const onFirst = e => {
      if (e.target.closest && e.target.closest('#musicBtn')) return;
      gestures.forEach(g => document.removeEventListener(g, onFirst, true));
      if (!userOff && audio.paused) play();
    };
    gestures.forEach(g => document.addEventListener(g, onFirst, true));
    btn.onclick = () => {
      if (audio.paused) { userOff = false; play(); }
      else { userOff = true; audio.pause(); setBtn(false); }
    };
    document.addEventListener('visibilitychange', () => { if (document.hidden) audio.pause(); else if (!userOff && btn.getAttribute('aria-pressed') === 'true') audio.play().catch(() => {}); });
    play();
    setTimeout(() => toast.classList.add('show'), 600);
    setTimeout(() => toast.classList.remove('show'), 3600);
  }
})();
