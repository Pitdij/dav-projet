// Logique de l'app convoyeur.
// Principe : un seul objet `state`, et chaque changement redessine l'écran (render).
// Les gestes de glisser (onboarding, cartes mission) manipulent le DOM directement
// pendant le mouvement, puis mettent à jour le state au relâchement.

import { STRINGS } from './strings.js';
import {
  ONBOARDING, MISSIONS, BALANCE, GOAL_PERCENT, WEEK_DAYS, WEEK_BARS,
  RECENT_EARNINGS, DRIVER, DOC_KEYS, freshDocs
} from './data.js';
import { icons } from './icons.js';

const APP_SCREENS = ['missions', 'planning', 'revenus', 'profil'];
const STEP_ORDER = ['accepted', 'loading', 'route', 'done'];
const STEP_INDEX = { loading: 1, route: 2, done: 3 };
const SWIPE_THRESHOLD = 100; // px avant d'accepter / refuser une mission
const ONB_THRESHOLD = 60;    // px avant de changer de slide
const LANG_KEY = 'logiflow.lang';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

function loadLang() {
  try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'fr'; } catch { return 'fr'; }
}
function saveLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* stockage indisponible : on ignore */ }
}

export class App {
  constructor(root) {
    this.root = root;
    this.screenEl = root.querySelector('[data-screen]');
    this.overlayEl = root.querySelector('[data-overlays]');
    this.toastEl = root.querySelector('[data-toast]');

    this.state = {
      screen: 'onboarding',
      onbStep: 0,
      drawerOpen: false,
      missions: MISSIONS.slice(),
      detailId: null,
      execution: null,
      execStep: 'loading',
      docs: freshDocs(),
      payoutOpen: false, payoutProcessing: false, payoutDone: false,
      lang: loadLang()
    };
    this.drag = null;

    this.bindEvents();
    this.render();
  }

  get t() { return STRINGS[this.state.lang]; }

  setState(patch) {
    Object.assign(this.state, patch);
    this.render();
  }

  /* ===================== Événements ===================== */

  bindEvents() {
    this.root.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      const fn = this.actions[el.dataset.action];
      if (!fn) return;
      e.preventDefault();
      fn.call(this, el.dataset.arg, e);
    });
    this.root.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', () => this.cancelDrag());
  }

  actions = {
    onbSkip() { this.finishOnboarding(); },
    onbNext() {
      const last = ONBOARDING.length - 1;
      if (this.state.onbStep < last) this.setOnbStep(this.state.onbStep + 1);
      else this.finishOnboarding();
    },
    onbGoto(i) { this.setOnbStep(Number(i)); },

    toggleDrawer() { this.setState({ drawerOpen: !this.state.drawerOpen }); },
    closeDrawer() { this.setState({ drawerOpen: false }); },
    goScreen(name) { this.setState({ screen: name, drawerOpen: false }); },
    logout() {
      this.setState({ screen: 'onboarding', onbStep: 0, drawerOpen: false, missions: MISSIONS.slice(), execution: null });
    },

    openDetail(id) { this.setState({ detailId: Number(id) }); },
    closeDetail() { this.setState({ detailId: null }); },
    acceptMission(id) { this.acceptMission(Number(id)); },
    declineMission(id) { this.declineMission(Number(id)); },

    captureDoc(key) {
      if (this.state.docs[key] === 'done') return;
      this.setState({ docs: { ...this.state.docs, [key]: 'done' } });
      this.showToast(this.t.toasts.photoCaptured);
    },
    execAdvance() {
      const { execStep, docs } = this.state;
      const t = this.t;
      if (execStep === 'loading') {
        if (docs.photo !== 'done') { this.showToast(t.toasts.addPhotoFirst); return; }
        this.setState({ execStep: 'route' });
        this.showToast(t.toasts.loadingConfirmed);
      } else if (execStep === 'route') {
        this.setState({ execStep: 'done' });
        this.showToast(t.toasts.deliveryConfirmed);
      }
    },
    closeExecution() { this.setState({ execution: null, screen: 'missions' }); },

    openPayout() { this.setState({ payoutOpen: true, payoutProcessing: false, payoutDone: false }); },
    confirmPayout() {
      if (this.state.payoutProcessing) return;
      this.setState({ payoutProcessing: true });
      setTimeout(() => this.setState({ payoutProcessing: false, payoutDone: true }), 900);
    },
    closePayout() { this.setState({ payoutOpen: false }); },

    toggleLanguage() {
      const lang = this.state.lang === 'fr' ? 'en' : 'fr';
      saveLang(lang);
      this.setState({ lang });
      this.showToast(this.t.toasts[lang === 'fr' ? 'langFr' : 'langEn']);
    }
  };

  /* ===================== Onboarding ===================== */

  // Met à jour le slide courant sans tout redessiner (pour garder l'animation).
  setOnbStep(i) {
    this.state.onbStep = i;
    const slides = this.screenEl.querySelector('[data-onb-slides]');
    if (slides) slides.style.transform = `translateX(-${i * 100}%)`;
    this.screenEl.querySelectorAll('[data-onb-dot]').forEach((d, k) => d.classList.toggle('is-active', k === i));
    const next = this.screenEl.querySelector('[data-onb-next]');
    if (next) next.textContent = i === ONBOARDING.length - 1 ? this.t.start : this.t.next;
  }

  finishOnboarding() { this.setState({ screen: 'missions' }); }

  /* ===================== Missions ===================== */

  acceptMission(id) {
    const mission = this.state.missions.find((m) => m.id === id);
    if (!mission) return;
    this.setState({
      missions: this.state.missions.filter((m) => m.id !== id),
      detailId: null,
      execution: mission, execStep: 'loading', docs: freshDocs(),
      screen: 'execution'
    });
    this.showToast(this.t.toasts.missionAccepted);
  }

  declineMission(id) {
    this.setState({ missions: this.state.missions.filter((m) => m.id !== id), detailId: null });
    this.showToast(this.t.toasts.missionDeclined);
  }

  /* ===================== Gestes de glisser ===================== */

  onPointerDown(e) {
    if (e.button !== 0 || this.drag) return;
    const card = e.target.closest('[data-swipe-card]');
    if (card) {
      card.style.transition = 'none';
      this.drag = { kind: 'card', id: Number(card.dataset.swipeCard), el: card, wrap: card.parentElement, startX: e.clientX, dx: 0 };
      return;
    }
    const track = e.target.closest('[data-onb-track]');
    if (track) {
      const slides = track.querySelector('[data-onb-slides]');
      slides.classList.add('is-dragging');
      this.drag = { kind: 'onb', el: slides, startX: e.clientX, dx: 0 };
    }
  }

  onPointerMove(e) {
    const d = this.drag;
    if (!d) return;
    d.dx = e.clientX - d.startX;
    if (d.kind === 'card') {
      d.el.style.transform = `translateX(${d.dx}px) rotate(${(d.dx / 28).toFixed(2)}deg)`;
      const [decline, accept] = d.wrap.querySelectorAll('[data-hint]');
      decline.style.opacity = d.dx < 0 ? Math.min(1, -d.dx / 80) : 0;
      accept.style.opacity = d.dx > 0 ? Math.min(1, d.dx / 80) : 0;
    } else {
      d.el.style.transform = `translateX(calc(-${this.state.onbStep * 100}% + ${d.dx}px))`;
    }
  }

  onPointerUp() {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    if (d.kind === 'card') {
      if (d.dx > SWIPE_THRESHOLD) this.acceptMission(d.id);
      else if (d.dx < -SWIPE_THRESHOLD) this.declineMission(d.id);
      else this.resetCard(d);
      return;
    }
    d.el.classList.remove('is-dragging');
    let step = this.state.onbStep;
    if (d.dx < -ONB_THRESHOLD && step < ONBOARDING.length - 1) step += 1;
    else if (d.dx > ONB_THRESHOLD && step > 0) step -= 1;
    this.setOnbStep(step);
  }

  cancelDrag() {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    if (d.kind === 'card') this.resetCard(d);
    else { d.el.classList.remove('is-dragging'); this.setOnbStep(this.state.onbStep); }
  }

  resetCard(d) {
    d.el.style.transition = 'transform .25s ease';
    d.el.style.transform = '';
    d.wrap.querySelectorAll('[data-hint]').forEach((h) => { h.style.opacity = 0; });
  }

  /* ===================== Toast ===================== */

  showToast(message) {
    const el = this.toastEl;
    el.textContent = message;
    el.hidden = false;
    el.style.animation = 'none';
    void el.offsetWidth; // force le navigateur à relancer l'animation
    el.style.animation = '';
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
  }

  /* ===================== Rendu ===================== */

  render() {
    const s = this.state;
    const sameScreen = this.screenEl.dataset.current === s.screen;
    const scrollTop = this.screenEl.scrollTop;

    let html;
    if (s.screen === 'onboarding') html = this.renderOnboarding();
    else if (s.screen === 'execution') html = this.renderExecution();
    else html = this.renderShell();

    this.screenEl.innerHTML = html;
    this.screenEl.dataset.current = s.screen;
    this.screenEl.scrollTop = sameScreen ? scrollTop : 0;

    const overlay = this.renderOverlays();
    this.overlayEl.innerHTML = overlay;
    this.overlayEl.hidden = !overlay;
  }

  renderOnboarding() {
    const { onbStep, lang } = this.state;
    const t = this.t;
    const last = ONBOARDING.length - 1;
    return `
      <section class="onb">
        <div class="onb__top"><button class="onb__skip" data-action="onbSkip">${esc(t.skip)}</button></div>
        <div class="onb__viewport" data-onb-track>
          <div class="onb__slides" data-onb-slides style="transform:translateX(-${onbStep * 100}%)">
            ${ONBOARDING.map((o) => `
              <div class="onb__slide">
                <div class="onb__art">${icons[o.icon](72, 1.4)}</div>
                <h2 class="onb__title">${esc(o[lang].title)}</h2>
                <p class="onb__desc">${esc(o[lang].desc)}</p>
              </div>`).join('')}
          </div>
        </div>
        <div class="onb__dots">
          ${ONBOARDING.map((_, i) => `<button class="onb__dot${i === onbStep ? ' is-active' : ''}" data-onb-dot data-action="onbGoto" data-arg="${i}" aria-label="${i + 1}/${ONBOARDING.length}"></button>`).join('')}
        </div>
        <button class="btn btn--primary" data-onb-next data-action="onbNext">${esc(onbStep === last ? t.start : t.next)}</button>
      </section>`;
  }

  renderShell() {
    const s = this.state;
    const t = this.t;
    const body = {
      missions: () => this.renderMissions(),
      planning: () => this.renderPlanning(),
      revenus: () => this.renderRevenus(),
      profil: () => this.renderProfil()
    }[s.screen]();
    return `
      <section class="app">
        <header class="app__header">
          <button class="icon-btn" data-action="toggleDrawer" aria-label="${esc(t.menu)}">${icons.menu()}</button>
          <h2 class="app__title">${esc(t.screenTitles[s.screen])}</h2>
          <div class="icon-btn" role="img" aria-label="${esc(t.notifications)}">${icons.bell()}<span class="badge-dot">2</span></div>
        </header>
        ${body}
      </section>`;
  }

  renderMissions() {
    const { missions, lang } = this.state;
    const t = this.t;
    return `
      <div>
        <p class="missions__count">${missions.length} ${esc(t.missionsAvailable)}</p>
        ${missions.map((m) => `
          <div class="swipe">
            <div class="swipe__hints" aria-hidden="true">
              <span class="swipe__hint swipe__hint--decline" data-hint>&#10005; ${esc(t.decline)}</span>
              <span class="swipe__hint swipe__hint--accept" data-hint>${esc(t.accept)} &#10003;</span>
            </div>
            <article class="mission" data-swipe-card="${m.id}">
              <div class="mission__icon">${icons.box(22, 1.5)}</div>
              <div class="mission__body">
                <div class="mission__row">
                  <h4 class="mission__title">${esc(m.from)} &rarr; ${esc(m.to)}</h4>
                  <span class="tag tag--${m.tagKind}">${esc(m[lang].tag)}</span>
                </div>
                <p class="mission__meta">${esc(m[lang].date)} ${esc(m.time)} &middot; ${esc(m.distance)} &middot; ${esc(m[lang].vehicle)}</p>
                <div class="mission__foot">
                  <span class="mission__price">${esc(m.price)}</span>
                  <button class="mission__info" data-action="openDetail" data-arg="${m.id}" aria-label="${esc(t.details)}">${icons.chevronRight(18, 1.8)}</button>
                </div>
              </div>
            </article>
          </div>`).join('')}
        ${missions.length === 0 ? `<p class="empty">${esc(t.noMissions)}</p>` : ''}
      </div>`;
  }

  renderPlanning() {
    const { missions, lang } = this.state;
    const t = this.t;
    const groups = ['today', 'tomorrow', 'week']
      .map((key) => ({ key, items: missions.filter((m) => m.when === key) }))
      .filter((g) => g.items.length > 0);
    return `
      <div class="planning">
        ${groups.map((g) => `
          <div class="planning__group">
            <div class="section-label">${esc(t.planningLabels[g.key])}</div>
            ${g.items.map((m) => `
              <div class="planning__item">
                <div class="planning__time">${esc(m.time)}</div>
                <div class="planning__body">
                  <div class="planning__route">${esc(m.from)} &rarr; ${esc(m.to)}</div>
                  <div class="planning__meta">${esc(m.distance)} &middot; ${esc(m[lang].vehicle)}</div>
                </div>
                <span class="planning__price">${esc(m.price)}</span>
              </div>`).join('')}
          </div>`).join('')}
        ${groups.length === 0 ? `<p class="empty">${esc(t.noMissions)}</p>` : ''}
      </div>`;
  }

  renderRevenus() {
    const { lang } = this.state;
    const t = this.t;
    return `
      <div>
        <div class="earn">
          <div class="earn__glow"></div>
          <div class="earn__inner">
            <div class="earn__label">${esc(t.thisWeek)}</div>
            <div class="earn__amount">${esc(BALANCE)}</div>
            <div class="earn__delta">${esc(t.vsLastWeek)}</div>
            <div class="earn__bar"><div class="earn__fill" style="width:${GOAL_PERCENT}%"></div></div>
            <div class="earn__goal"><span>${esc(t.monthlyGoal)}</span><span>${GOAL_PERCENT}%</span></div>
          </div>
        </div>
        <div class="section-title">${esc(t.weeklyTrend)}</div>
        <div class="card chart">
          <div class="chart__bars">${WEEK_BARS.map((h) => `<div class="chart__bar" style="height:${h}%"></div>`).join('')}</div>
          <div class="chart__days">${WEEK_DAYS[lang].map((d) => `<span class="chart__day">${esc(d)}</span>`).join('')}</div>
        </div>
        <div class="section-title">${esc(t.recentMissions)}</div>
        ${RECENT_EARNINGS.map((r) => `
          <div class="recent">
            <div class="recent__left">
              <div class="recent__icon">${icons.check(16, 2)}</div>
              <div>
                <div class="recent__route">${esc(r.route)}</div>
                <div class="recent__date">${esc(r[lang])}</div>
              </div>
            </div>
            <span class="recent__amount">${esc(r.amount)}</span>
          </div>`).join('')}
        <button class="btn btn--soft btn--inset payout-btn" data-action="openPayout">${esc(t.requestPayout)}</button>
      </div>`;
  }

  renderProfil() {
    const { lang } = this.state;
    const t = this.t;
    return `
      <div>
        <div class="profile">
          <div class="profile__avatar">${esc(DRIVER.initials)}</div>
          <div>
            <div class="profile__name">${esc(DRIVER.name)}</div>
            <div class="profile__role">${esc(t.driverRole)}</div>
          </div>
        </div>
        <div class="section-label">${esc(t.documents)}</div>
        ${this.renderDocs(false)}
        <div class="section-label section-label--spaced">${esc(t.account)}</div>
        <button class="row" data-action="toggleLanguage">
          ${icons.globe(18, 1.6)}
          <span class="row__label">${esc(t.interfaceLanguage)}</span>
          <span class="row__value">${lang === 'fr' ? 'Français' : 'English'}</span>
          <span class="row__chevron">${icons.chevronRight(16, 1.8)}</span>
        </button>
        <button class="row row--danger" data-action="logout">
          ${icons.logout(18, 1.7)}
          <span class="row__label">${esc(t.logout)}</span>
        </button>
      </div>`;
  }

  // Liste des documents. `compact` = version dense de l'écran d'exécution.
  renderDocs(compact) {
    const t = this.t;
    return DOC_KEYS.map((key) => {
      const done = this.state.docs[key] === 'done';
      const d = t.docs[key];
      const size = compact ? 14 : 16;
      return `
        <button class="${compact ? 'doc doc--compact' : 'row doc'}" data-action="captureDoc" data-arg="${key}">
          <span class="doc__icon ${done ? 'doc__icon--done' : 'doc__icon--pending'}">${done ? icons.check(size, 2) : icons.camera(size, 1.6)}</span>
          <span class="doc__body">
            <span class="doc__label" style="display:block">${esc(d.label)}</span>
            <span class="doc__sub" style="display:block">${esc(done ? d.doneSub : d.pendingSub)}</span>
          </span>
        </button>`;
    }).join('');
  }

  renderExecution() {
    const { execution: m, execStep, lang } = this.state;
    const t = this.t;
    if (!m) return '';
    const current = STEP_INDEX[execStep] ?? 1;
    const steps = STEP_ORDER.map((key, i) => {
      const cls = i < current ? 'step--done' : i === current ? 'step--active' : '';
      return `
        <div class="step ${cls}">
          <div class="step__circle">${i < current ? '&#10003;' : i + 1}</div>
          <div class="step__label">${esc(t.stepLabels[key])}</div>
        </div>`;
    }).join('');
    const done = execStep === 'done';
    return `
      <section class="exec">
        <header class="exec__header">
          <button class="exec__back" data-action="closeExecution" aria-label="${esc(t.backToMissions)}">${icons.chevronLeft(20, 1.8)}</button>
          <div class="exec__heading">
            <div class="exec__title">Mission #${1000 + m.id}</div>
            <div class="exec__sub">${esc(m.from)} &rarr; ${esc(m.to)}</div>
          </div>
          <div class="exec__spacer"></div>
        </header>

        <div class="steps"><div class="steps__line"></div>${steps}</div>

        <div class="card">
          <div class="card__label">${esc(t.shipperInstructions)}</div>
          <div class="card__text">${esc(m[lang].instructions)}</div>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">${esc(t.route)}</div>
            <div class="card__accent">${esc(m.distance)}</div>
          </div>
          <div class="map">
            <svg viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true">
              <path d="M20 95 C 90 30, 160 110, 280 25" stroke="var(--camel)" stroke-width="2.5" fill="none" stroke-dasharray="1 8" stroke-linecap="round"></path>
              <circle cx="20" cy="95" r="5" fill="var(--sage)"></circle>
              <circle cx="280" cy="25" r="5" fill="var(--terracotta)"></circle>
            </svg>
            <div class="map__truck">${icons.boxFlat(14, 1.8)}</div>
          </div>
          <div class="map__times">
            <span>${esc(t.departure)} ${esc(m.time)}</span><span>${esc(t.arrival)} ~${esc(m.endTime)}</span>
          </div>
        </div>

        <div class="card card--docs">
          <div class="card__title">${esc(t.requiredDocs)}</div>
          ${this.renderDocs(true)}
        </div>

        ${done
          ? `<button class="btn btn--sage btn--inset" data-action="closeExecution">${esc(t.backToMissions)}</button>`
          : `<button class="btn btn--primary btn--strong btn--inset" data-action="execAdvance">${esc(execStep === 'loading' ? t.confirmLoading : t.reportArrival)}</button>`}
      </section>`;
  }

  renderOverlays() {
    const s = this.state;
    const t = this.t;

    if (s.payoutOpen) {
      const inner = s.payoutDone
        ? `
          <div class="modal__check">${icons.check(26, 2)}</div>
          <h3 class="modal__title">${esc(t.payoutRequested)}</h3>
          <p class="modal__text modal__text--done">${esc(t.payoutEta)}</p>
          <button class="btn btn--primary" data-action="closePayout">${esc(t.close)}</button>`
        : `
          <h3 class="modal__title">${esc(t.requestPayout)}</h3>
          <p class="modal__text">${esc(t.availableBalance)}</p>
          <div class="modal__amount">${esc(BALANCE)}</div>
          <button class="btn btn--primary" data-action="confirmPayout">${esc(s.payoutProcessing ? t.processing : t.confirmPayoutBtn)}</button>
          <button class="btn btn--ghost" data-action="closePayout">${esc(t.cancel)}</button>`;
      return `
        <div class="modal-wrap">
          <button class="scrim" data-action="closePayout" aria-label="${esc(t.close)}"></button>
          <div class="modal" role="dialog" aria-modal="true">${inner}</div>
        </div>`;
    }

    if (s.drawerOpen) {
      const item = (name, icon, label) =>
        `<button class="drawer__item${s.screen === name ? ' is-active' : ''}" data-action="goScreen" data-arg="${name}">${icon}<span>${esc(label)}</span></button>`;
      return `
        <button class="scrim" data-action="closeDrawer" aria-label="${esc(t.close)}"></button>
        <nav class="drawer">
          <div class="drawer__brand">LogiFlow</div>
          <div class="drawer__sub">${esc(t.driverSpace)}</div>
          <div class="drawer__nav">
            ${item('missions', icons.target(18, 1.6), t.navMissions)}
            ${item('planning', icons.list(18, 1.6), t.navPlanning)}
            ${item('revenus', icons.euro(18, 1.6), t.navRevenus)}
            ${item('profil', icons.user(18, 1.6), t.navProfil)}
          </div>
          <div class="drawer__foot">
            <button class="drawer__item drawer__item--danger" data-action="logout">${icons.logout(18, 1.6)}<span>${esc(t.logout)}</span></button>
          </div>
        </nav>`;
    }

    if (s.detailId != null) {
      const m = s.missions.find((x) => x.id === s.detailId);
      if (!m) return '';
      const L = m[s.lang];
      return `
        <div class="sheet-wrap">
          <button class="scrim" data-action="closeDetail" aria-label="${esc(t.close)}"></button>
          <div class="sheet" role="dialog" aria-modal="true">
            <div class="sheet__handle"></div>
            <h3 class="sheet__title">${esc(m.from)} &rarr; ${esc(m.to)}</h3>
            <p class="sheet__meta">${esc(L.date)} ${esc(m.time)} &middot; ${esc(m.distance)} &middot; ${esc(L.vehicle)}</p>
            <div class="sheet__rate">
              <span class="sheet__rate-label">${esc(t.proposedRate)}</span>
              <span class="sheet__rate-price">${esc(m.price)}</span>
            </div>
            <div class="sheet__actions">
              <button class="sheet__decline" data-action="declineMission" data-arg="${m.id}">${esc(t.decline)}</button>
              <button class="sheet__accept" data-action="acceptMission" data-arg="${m.id}">${esc(t.acceptMission)}</button>
            </div>
          </div>
        </div>`;
    }

    return '';
  }
}
