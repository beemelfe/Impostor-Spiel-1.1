// Universal Progressive Slider Values:
// Starts in 1-unit steps (0..100) and grows logically up to 1,000,000,000
const UNIVERSAL_SLIDER_VALUES = (() => {
  const vals = [];
  const addRange = (start, end, step) => {
    for (let v = start; v <= end; v += step) {
      if (vals.length === 0 || vals[vals.length - 1] !== v) {
        vals.push(v);
      }
    }
  };
  addRange(0, 100, 1);                      // 0..100 in 1er-Schritten
  addRange(105, 250, 5);                    // 105..250 in 5er-Schritten
  addRange(260, 500, 10);                   // 260..500 in 10er-Schritten
  addRange(525, 1000, 25);                  // 525..1.000 in 25er-Schritten
  addRange(1050, 2500, 50);                 // 1.050..2.500 in 50er-Schritten
  addRange(2750, 10000, 250);               // 2.750..10.000 in 250er-Schritten
  addRange(11000, 50000, 1000);             // 11.000..50.000 in 1.000er-Schritten
  addRange(55000, 200000, 5000);            // 55.000..200.000 in 5.000er-Schritten
  addRange(225000, 1000000, 25000);         // 225.000..1 Mio. in 25.000er-Schritten
  addRange(1250000, 10000000, 250000);      // 1,25 Mio...10 Mio. in 250.000er-Schritten
  addRange(12500000, 100000000, 2500000);   // 12,5 Mio...100 Mio. in 2,5-Mio.-Schritten
  addRange(125000000, 1000000000, 25000000);// 125 Mio...1 Mrd. in 25-Mio.-Schritten
  return vals;
})();

function findClosestUniversalIndex(targetVal) {
  let bestIdx = 0;
  let bestDiff = Infinity;
  for (let i = 0; i < UNIVERSAL_SLIDER_VALUES.length; i++) {
    const diff = Math.abs(UNIVERSAL_SLIDER_VALUES[i] - targetVal);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
  }
  return bestIdx;
}

function isScale10Slider(sl) {
  if (!sl) return false;
  return sl.max === 10 && sl.min === 1;
}

function formatCompactTimelineTick(val) {
  const n = Number(val);
  if (isNaN(n)) return String(val);
  if (n >= 1000000000) {
    const v = n / 1000000000;
    return `${v % 1 === 0 ? v : v.toLocaleString("de-DE", { maximumFractionDigits: 2 })} Mrd.`;
  }
  if (n >= 1000000) {
    const v = n / 1000000;
    return `${v % 1 === 0 ? v : v.toLocaleString("de-DE", { maximumFractionDigits: 2 })} Mio.`;
  }
  return n.toLocaleString("de-DE");
}

class SoundEngine {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTone(freq, type = "sine", duration = 0.1, gainVal = 0.05, slideFreq = null) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (slideFreq) {
        osc.frequency.exponentialRampToValueAtTime(slideFreq, this.ctx.currentTime + duration);
      }
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  click() {
    this.playTone(580, "sine", 0.05, 0.04, 720);
  }

  flip() {
    this.playTone(300, "triangle", 0.14, 0.06, 620);
  }

  imposterReveal() {
    this.playTone(210, "sawtooth", 0.3, 0.06, 110);
    setTimeout(() => this.playTone(155, "sawtooth", 0.4, 0.07, 85), 140);
  }

  success() {
    this.playTone(480, "triangle", 0.1, 0.06);
    setTimeout(() => this.playTone(600, "triangle", 0.1, 0.06), 90);
    setTimeout(() => this.playTone(720, "triangle", 0.2, 0.07), 180);
  }
}

const sfx = new SoundEngine();

function formatNumberDE(val) {
  const num = Number(val);
  if (isNaN(num)) return val;
  return num.toLocaleString("de-DE");
}

const CATEGORY_ICONS = [
  "fa-star", "fa-bolt", "fa-fire", "fa-heart", "fa-gamepad", "fa-pizza-slice",
  "fa-plane", "fa-music", "fa-futbol", "fa-car", "fa-ghost", "fa-gem"
];

// Simple symmetric XOR + Base64 encryption helper for localStorage vault protection
const VaultCrypto = {
  hashPassword(pw) {
    let h = 2166136261;
    for (let i = 0; i < pw.length; i++) {
      h ^= pw.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16);
  },
  encrypt(dataObj, key) {
    try {
      const json = encodeURIComponent(JSON.stringify(dataObj));
      let out = "";
      for (let i = 0; i < json.length; i++) {
        out += String.fromCharCode(json.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return btoa(out);
    } catch (e) {
      return "";
    }
  },
  decrypt(cipherB64, key) {
    try {
      const raw = atob(cipherB64);
      let out = "";
      for (let i = 0; i < raw.length; i++) {
        out += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return JSON.parse(decodeURIComponent(out));
    } catch (e) {
      return null;
    }
  }
};

// Version der mitgelieferten Daten. Erhöhen, wenn Standard-Fragen korrigiert wurden,
// damit gespeicherte Spielstände die Korrekturen übernehmen.
const DATA_VERSION = 2;

// Hauptfragen, die in einer früheren Version enthalten waren und ersetzt/entfernt wurden
const RETIRED_QUESTION_TITLES = [
  "Wie viele Regenschirme werden jährlich in der Londoner U-Bahn (TfL) vergessen?",
  "Wie viele Kilometer Stau gab es im letzten Jahr auf deutschen Autobahnen insgesamt (in Tausend km)?",
  "Wie viele Milliarden Lego-Steine werden jedes Jahr weltweit ungefähr produziert?",
  "Wie viele Millionen Mal wurde das meistgesehene YouTube-Video für Erwachsene („Despacito“) ca. aufgerufen (in Milliarden)?",
  "Wie viele Grad Celsius herrschen im äußeren Kern unserer Sonne (Oberflächentemperatur)?",
  "Wie viele Millionen Bienen leben in einem sehr großen Bienenvolk im Hochsommer (in Tausend)?",
  "Wie viele Kilometer tief liegt die Erdkruste bis zum Erdmittelpunkt?"
];

const app = {
  state: {
    mode: "word", // 'word' | 'question' | 'quiz'
    questionSubmode: "all", // 'all' | 'slider' | 'classic'
    theme: "obsidian", // 'obsidian' | 'emerald' | 'nordic' | 'amber' | 'mono'
    colorMode: "system", // 'system' | 'dark' | 'light' (defaults to device setting)
    playerCount: 5,
    imposterCount: 1,
    randomImposterCount: false,
    starterMode: "random", // 'random' or player index (0..N-1)
    players: [
      { name: "Spieler 1", score: 0, votes: 0, answer: "" },
      { name: "Spieler 2", score: 0, votes: 0, answer: "" },
      { name: "Spieler 3", score: 0, votes: 0, answer: "" },
      { name: "Spieler 4", score: 0, votes: 0, answer: "" },
      { name: "Spieler 5", score: 0, votes: 0, answer: "" }
    ],
    showImposterHint: true,
    showImposterCategory: true,
    collectWrittenAnswers: true,
    timerMinutes: 3, // 0 = Kein Timer
    activeWordCats: new Set(WORD_CATEGORIES.map(c => c.id)),
    activeQuestionCats: new Set(QUESTION_CATEGORIES.map(c => c.id)),
    activeQuizCats: new Set(QUIZ_CATEGORIES.map(c => c.id)),
    usedWords: new Set(),
    usedQuestions: new Set(),
    usedQuiz: new Set(),
    deletedQuestions: [],
    deletedQuiz: [],
    globalQuizTargetCatId: QUIZ_CATEGORIES[0] ? QUIZ_CATEGORIES[0].id : null,
    quizRounds: 3,
    quizSeconds: 15,
    quizInstantFeedback: true,
    quiz: null,
    currentRound: null,
    roundActiveLocked: false, // Prevents opening Vault during an active round
    passIndex: 0,
    cardFlipped: false,
    cardTransitionBusy: false,
    timerSecondsLeft: 180,
    timerInterval: null,
    timerPaused: false,
    dbTab: "words",
    vaultSelectedCatId: null, // null = show category overview cards in Vault
    globalWordTargetCatId: WORD_CATEGORIES[0].id,
    globalQuestionTargetCatId: QUESTION_CATEGORIES[0].id,
    deleteConfirmArmed: false, // 2-step delete confirmation state
    logoMenuOpen: false,
    // Vault Password & Encryption State
    vaultPasswordHash: null,
    vaultSessionKey: null,
    vaultUnlocked: false,
    pendingVaultTab: "words",
    vaultAuthMode: "setup", // 'setup' | 'unlock' | 'change'
    // Category Creator & Item Editor State
    newCategoryType: "word",
    newCategoryIcon: "fa-star",
    editingItem: null
  },

  init() {
    this.loadPersistentState();
    if (this.state.dataUpgraded) this.savePersistentState();
    this.loadVaultMeta();
    this.initSystemColorSchemeListener();
    this.applyAppearanceUI();
    this.updateVaultCounts();
    this.renderPlayersSetup();
    this.renderCategoriesGrid();
    this.renderScoreboard();
    this.renderTimerPresets();
    this.renderNewCategoryIcons();
    this.updateSetupOptionLabels();
    this.setupInstallSupport();
    initAmbientCanvas();

    let startView = "view-welcome";
    try {
      startView = localStorage.getItem("partyspiele_intro_seen_v1") ? "view-home" : "view-welcome";
    } catch (e) {}
    this.initHistory(startView);
    this.switchView(startView, { fromPop: true });

    // Close logo menu when clicking outside
    document.addEventListener("click", (e) => {
      const menu = document.getElementById("logoDropdownMenu");
      const trigger = document.getElementById("logoMenuTrigger");
      if (this.state.logoMenuOpen && menu && trigger && !menu.contains(e.target) && !trigger.contains(e.target)) {
        this.closeLogoMenu();
      }
    });

    // Re-fit dynamic elements when the viewport changes (rotation, browser bars, keyboard)
    let resizeRaf = null;
    const onViewportChange = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = null;
        if (document.getElementById("timelineSliderCanvas")) this.drawTimelineCanvas();
        this.fitAdaptiveWordElements(document);
      });
    };
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", onViewportChange);
  },

  // ===== Zurück-Wischen / Browser-Zurück-Taste (History API) =====
  nav: {
    levels: {
      "view-welcome": 0,
      "view-home": 0,
      "view-setup": 1,
      "view-pass": 2,
      "view-discussion": 2,
      "view-quiz-pass": 2,
      "view-quiz-play": 2,
      "view-quiz-result": 2
    },
    cur: "view-home",
    ready: false,
    pending: null
  },

  initHistory(startView) {
    this.nav.cur = startView;
    try {
      // Erster Eintrag = Wächter: Zurück darauf verlässt die Seite erst, wenn nichts mehr zu schließen ist
      history.replaceState({ guard: true }, "");
      history.pushState({ view: startView }, "");
      this.nav.ready = true;
      window.addEventListener("popstate", (e) => this.onPopState(e));
    } catch (e) {
      this.nav.ready = false;
    }
  },

  syncHistory(viewId) {
    if (!this.nav.ready) return;
    // Läuft gerade noch ein Zurück-Sprung, gleicht onPopState den Verlauf danach ab
    if (this.nav.pending) return;
    const lv = this.nav.levels;
    const nl = lv[viewId] ?? 0;
    const cl = lv[this.nav.cur] ?? 0;
    try {
      if (nl > cl) {
        history.pushState({ view: viewId }, "");
      } else if (nl === cl) {
        history.replaceState({ view: viewId }, "");
      } else {
        this.nav.pending = viewId;
        history.go(-(cl - nl));
      }
    } catch (e) {}
  },

  closeTopOverlay() {
    const order = [
      "customSelectModal", "customCategoryModal", "editVaultItemModal", "vaultAuthModal",
      "answerDetailModal", "quizReviewModal", "installHelpModal", "dbModal", "starterModal", "timerModal", "themeModal", "rulesModal",
      "scoreModal", "categoriesSetupModal", "optionsSetupModal", "playersSetupModal"
    ];
    for (const id of order) {
      const el = document.getElementById(id);
      if (el && !el.classList.contains("hidden") && !el.classList.contains("modal-backdrop-animate-out")) {
        if (id === "dbModal") this.closeVaultModal();
        else this.closeModal(id);
        return true;
      }
    }
    if (this.state.logoMenuOpen) {
      this.closeLogoMenu();
      return true;
    }
    return false;
  },

  onPopState(e) {
    const st = (e && e.state) || {};
    if (this.nav.pending) {
      // Ein von der App ausgelöster Zurück-Sprung ist angekommen: Verlauf an die
      // aktuelle Ansicht anpassen (der Nutzer kann inzwischen schon weiter navigiert haben)
      const lv = this.nav.levels;
      const landed = lv[this.nav.pending] ?? 0;
      const cur = this.nav.cur;
      const cl = lv[cur] ?? 0;
      this.nav.pending = null;
      try {
        if (cl === landed) {
          history.replaceState({ view: cur }, "");
        } else if (cl > landed) {
          history.replaceState({ view: cl >= 1 && landed === 0 ? "view-home" : "view-setup" }, "");
          for (let l = landed + 1; l <= cl; l++) {
            history.pushState({ view: l === cl ? cur : "view-setup" }, "");
          }
        } else {
          this.nav.pending = cur;
          history.go(-(landed - cl));
        }
      } catch (err) {}
      return;
    }
    if (this.closeTopOverlay()) {
      try { history.pushState({ view: this.nav.cur }, ""); } catch (err) {}
      return;
    }
    if (st.guard) {
      // Nichts mehr zu schließen: normales Verlassen der Seite erlauben
      this.nav.ready = false;
      history.back();
      return;
    }
    if (st.view) this.applyViewFromNav(st.view);
  },

  applyViewFromNav(target) {
    let t = target;
    if ((this.nav.levels[t] ?? 0) >= 2) {
      t = "view-setup";
      try { history.replaceState({ view: t }, ""); } catch (err) {}
    }
    this.stopTimer();
    this.stopQuizTimer();
    this.state.roundActiveLocked = false;
    this.updateVaultMenuLockUI();
    if (t === "view-setup") this.prepareSetupUI();
    this.switchView(t, { fromPop: true });
  },

  // ===== Hilfsfunktionen =====
  escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  },

  shuffleArray(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  },

  getActiveCatSet() {
    if (this.state.mode === "quiz") return this.state.activeQuizCats;
    return this.state.mode === "word" ? this.state.activeWordCats : this.state.activeQuestionCats;
  },

  // ===== QUIZ =====
  changeQuizRounds(delta) {
    sfx.click();
    this.state.quizRounds = Math.min(10, Math.max(1, this.state.quizRounds + delta));
    this.updateSetupOptionLabels();
    this.savePersistentState();
  },

  openQuizSecondsPopup() {
    const opts = [10, 15, 20, 30, 45, 60];
    this.openCustomSelectPopup({
      title: "Zeit pro Frage",
      subtitle: "Wie lange darf jeder Spieler pro Frage überlegen?",
      selectedValue: this.state.quizSeconds,
      options: opts.map(v => ({
        value: v,
        label: `${v} Sekunden`,
        sub: v <= 10 ? "Blitzquiz" : v === 15 ? "Standard" : v >= 45 ? "Entspannt" : "Ausgewogen",
        icon: "fa-clock"
      })),
      onSelect: (val) => {
        this.state.quizSeconds = val;
        this.updateSetupOptionLabels();
        this.savePersistentState();
      }
    });
  },

  toggleQuizFeedback() {
    sfx.click();
    this.state.quizInstantFeedback = !this.state.quizInstantFeedback;
    this.updateSetupOptionLabels();
    this.savePersistentState();
  },

  buildQuizPool() {
    const pool = [];
    QUIZ_CATEGORIES.forEach(cat => {
      if (!this.state.activeQuizCats.has(cat.id)) return;
      cat.qs.forEach(q => {
        if (this.state.usedQuiz.has(q[0])) return;
        pool.push({ cat: cat.name, icon: cat.icon, q: q[0], right: q[1], wrong: q.slice(2) });
      });
    });
    return pool;
  },

  startQuiz() {
    const n = this.state.quizRounds;
    let pool = this.buildQuizPool();
    if (pool.length < n) {
      this.state.usedQuiz.clear();
      pool = this.buildQuizPool();
    }
    if (pool.length === 0) {
      this.showToast("Keine Quizfragen in den gewählten Kategorien!", "fa-circle-exclamation");
      return;
    }
    const picked = this.shuffleArray(pool).slice(0, n);
    picked.forEach(p => this.state.usedQuiz.add(p.q));
    this.stopTimer();
    this.stopQuizTimer();
    this.state.roundActiveLocked = false;
    this.state.quiz = {
      qs: picked,
      round: 0,
      turn: 0,
      results: this.state.players.map(() => []),
      opts: [],
      t0: 0,
      locked: true,
      timer: null,
      stats: [],
      awarded: false,
      finished: false
    };
    this.showQuizHandoff();
  },

  showQuizHandoff() {
    const qz = this.state.quiz;
    const player = this.state.players[qz.turn];
    document.getElementById("quizPassRound").textContent = `Runde ${qz.round + 1} von ${qz.qs.length}`;
    document.getElementById("quizPassProgress").textContent = `${qz.turn + 1} / ${this.state.playerCount}`;
    document.getElementById("quizPassPlayerName").textContent = player.name;
    document.getElementById("quizPassTimeInfo").textContent = `${this.state.quizSeconds} Sek.`;
    this.switchView("view-quiz-pass");
  },

  startQuizQuestion() {
    const qz = this.state.quiz;
    if (!qz) return;
    sfx.click();
    const q = qz.qs[qz.round];
    const player = this.state.players[qz.turn];
    qz.opts = this.shuffleArray([{ t: q.right, ok: true }, ...q.wrong.map(t => ({ t, ok: false }))]);

    document.getElementById("quizPlayAvatar").textContent = qz.turn + 1;
    document.getElementById("quizPlayName").textContent = player.name;
    document.getElementById("quizPlayRound").textContent = `Runde ${qz.round + 1} / ${qz.qs.length}`;
    document.getElementById("quizPlayCat").textContent = q.cat;

    const qEl = document.getElementById("quizQuestionText");
    qEl.textContent = q.q;
    const len = q.q.length;
    qEl.style.fontSize = (len <= 45 ? 22 : len <= 75 ? 19 : len <= 105 ? 17 : 15) + "px";

    const letters = ["A", "B", "C", "D"];
    const box = document.getElementById("quizAnswers");
    box.innerHTML = "";
    qz.opts.forEach((o, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-ans pill-button w-full h-full min-h-0 px-2.5 sm:px-3 rounded-xl text-left flex items-center gap-2.5";
      btn.onclick = () => this.answerQuiz(i);
      btn.innerHTML = `
        <span class="w-6 h-6 rounded-lg bg-white/10 text-[11px] font-mono-num font-bold text-zinc-200 flex items-center justify-center shrink-0">${letters[i]}</span>
        <span class="text-xs sm:text-sm font-semibold text-white leading-snug min-w-0 break-words">${this.escapeHTML(o.t)}</span>
      `;
      box.appendChild(btn);
    });

    document.getElementById("quizFeedbackText").textContent = "Tippe auf deine Antwort";
    document.getElementById("quizFeedbackText").className = "flex-1 min-w-0 text-xs sm:text-sm font-semibold text-zinc-400 truncate";
    document.getElementById("quizNextBtn").classList.add("hidden");

    const bar = document.getElementById("quizTimeBar");
    bar.style.width = "100%";
    bar.style.background = "var(--accent)";
    document.getElementById("quizPlayTimeText").textContent = this.formatQuizSeconds(this.state.quizSeconds * 1000);

    this.switchView("view-quiz-play");
    qz.locked = false;
    qz.t0 = performance.now();
    this.stopQuizTimer();
    const limit = this.state.quizSeconds * 1000;
    qz.timer = setInterval(() => {
      const elapsed = performance.now() - qz.t0;
      const left = Math.max(0, limit - elapsed);
      bar.style.width = (left / limit * 100) + "%";
      if (left <= 3000) bar.style.background = "#f43f5e";
      document.getElementById("quizPlayTimeText").textContent = this.formatQuizSeconds(left);
      if (left <= 0) this.answerQuiz(-1);
    }, 80);
  },

  formatQuizSeconds(ms) {
    return (ms / 1000).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " s";
  },

  stopQuizTimer() {
    const qz = this.state.quiz;
    if (qz && qz.timer) {
      clearInterval(qz.timer);
      qz.timer = null;
    }
  },

  answerQuiz(i) {
    const qz = this.state.quiz;
    if (!qz || qz.locked) return;
    qz.locked = true;
    this.stopQuizTimer();

    const limit = this.state.quizSeconds * 1000;
    const elapsed = Math.min(limit, performance.now() - qz.t0);
    const opt = i >= 0 ? qz.opts[i] : null;
    const correct = Boolean(opt && opt.ok);
    qz.results[qz.turn].push({ correct, ms: elapsed, timeout: i < 0, pick: opt ? opt.t : null });

    const btns = document.querySelectorAll("#quizAnswers .quiz-ans");
    const fb = document.getElementById("quizFeedbackText");
    btns.forEach((b, idx) => {
      b.disabled = true;
      if (this.state.quizInstantFeedback) {
        if (qz.opts[idx].ok) b.dataset.state = "right";
        else if (idx === i) b.dataset.state = "wrong";
        else b.dataset.state = "dim";
      } else {
        b.dataset.state = idx === i ? "picked" : "dim";
      }
    });

    if (this.state.quizInstantFeedback) {
      if (correct) {
        sfx.success();
        fb.textContent = `Richtig! ${this.formatQuizSeconds(elapsed)}`;
        fb.className = "flex-1 min-w-0 text-xs sm:text-sm font-bold text-emerald-400 truncate";
      } else {
        sfx.imposterReveal();
        fb.textContent = i < 0 ? "Zeit abgelaufen!" : "Leider falsch";
        fb.className = "flex-1 min-w-0 text-xs sm:text-sm font-bold text-rose-400 truncate";
      }
    } else {
      sfx.click();
      fb.textContent = i < 0 ? "Zeit abgelaufen" : "Antwort gespeichert";
      fb.className = "flex-1 min-w-0 text-xs sm:text-sm font-semibold text-zinc-300 truncate";
    }

    const isLast = qz.turn >= this.state.playerCount - 1 && qz.round >= qz.qs.length - 1;
    document.getElementById("quizNextBtnText").textContent = isLast ? "Zum Ergebnis" : "Weiter";
    document.getElementById("quizNextBtn").classList.remove("hidden");
  },

  nextQuizStep() {
    const qz = this.state.quiz;
    if (!qz) return;
    sfx.click();
    qz.turn++;
    if (qz.turn >= this.state.playerCount) {
      qz.turn = 0;
      qz.round++;
    }
    if (qz.round >= qz.qs.length) this.showQuizResult();
    else this.showQuizHandoff();
  },

  showQuizResult() {
    const qz = this.state.quiz;
    const total = qz.qs.length;
    const stats = this.state.players.map((p, i) => {
      const rs = qz.results[i];
      const correct = rs.filter(r => r.correct).length;
      const timeCorrect = rs.filter(r => r.correct).reduce((a, r) => a + r.ms, 0);
      return { idx: i, name: p.name, correct, timeCorrect };
    });
    stats.sort((a, b) => b.correct - a.correct || a.timeCorrect - b.timeCorrect);
    qz.stats = stats;
    qz.awarded = false;
    qz.finished = true;

    const top = stats[0];
    const second = stats[1];
    const tie = second && second.correct === top.correct && second.timeCorrect === top.timeCorrect;
    const decidedBySpeed = second && second.correct === top.correct && !tie;

    document.getElementById("quizWinnerText").textContent = tie ? `${top.name} & ${second.name}` : top.name;
    document.getElementById("quizWinnerSub").textContent = tie
      ? "Gleichstand bei Treffern und Tempo!"
      : `${top.correct} von ${total} richtig${top.correct > 0 ? " • " + this.formatQuizSeconds(top.timeCorrect) : ""}${decidedBySpeed ? " • schneller als " + second.name : ""}`;

    const list = document.getElementById("quizRankList");
    list.innerHTML = "";
    stats.forEach((st, rank) => {
      const medalColor = rank === 0 ? "text-amber-400" : rank === 1 ? "text-zinc-300" : rank === 2 ? "text-orange-400" : "text-zinc-500";
      const row = document.createElement("div");
      row.className = `flex items-center gap-2.5 p-2 sm:p-3 rounded-2xl border ${rank === 0 ? "bg-white/10 border-white/30" : "bg-black/25 border-white/10"}`;
      row.innerHTML = `
        <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-mono-num text-xs font-bold ${medalColor} shrink-0">${rank < 3 ? '<i class="fa-solid fa-medal"></i>' : rank + 1}</div>
        <div class="min-w-0 flex-1">
          <div class="font-semibold text-sm text-white truncate">${this.escapeHTML(st.name)}</div>
          <div class="text-[11px] text-zinc-400">${st.correct} von ${total} richtig</div>
        </div>
        <div class="font-mono-num text-xs font-bold text-white shrink-0">${st.correct > 0 ? this.formatQuizSeconds(st.timeCorrect) : "–"}</div>
      `;
      list.appendChild(row);
    });

    document.getElementById("quizAwardBtnText").textContent = "+1 Punkt Sieger";
    sfx.success();
    this.switchView("view-quiz-result");
  },

  awardQuizPoint() {
    const qz = this.state.quiz;
    if (!qz || !qz.stats.length) return;
    if (qz.awarded) {
      this.showToast("Punkt wurde schon verbucht", "fa-circle-info");
      return;
    }
    const top = qz.stats[0];
    const second = qz.stats[1];
    const winners = [top];
    if (second && second.correct === top.correct && second.timeCorrect === top.timeCorrect) winners.push(second);
    winners.forEach(w => { this.state.players[w.idx].score += 1; });
    qz.awarded = true;
    sfx.success();
    this.renderScoreboard();
    this.savePersistentState();
    document.getElementById("quizAwardBtnText").textContent = "Punkt gebucht";
    this.showToast(`+1 Punkt für ${winners.map(w => w.name).join(" & ")}`, "fa-trophy");
  },

  openQuizReview() {
    const qz = this.state.quiz;
    if (!qz) return;
    sfx.click();
    const list = document.getElementById("quizReviewList");
    list.innerHTML = "";
    qz.qs.forEach((q, r) => {
      const chips = this.state.players.map((p, i) => {
        const res = qz.results[i][r];
        if (!res) return "";
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${res.correct ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/15 text-rose-300 border border-rose-500/30"}">
          <i class="fa-solid ${res.correct ? "fa-check" : "fa-xmark"}"></i>${this.escapeHTML(p.name)}${res.correct ? " · " + this.formatQuizSeconds(res.ms) : ""}
        </span>`;
      }).join("");
      const card = document.createElement("div");
      card.className = "p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5";
      card.innerHTML = `
        <div class="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400">Runde ${r + 1} • ${this.escapeHTML(q.cat)}</div>
        <div class="text-xs font-semibold text-white leading-snug">${this.escapeHTML(q.q)}</div>
        <div class="text-xs text-emerald-300 font-semibold"><i class="fa-solid fa-circle-check mr-1"></i>${this.escapeHTML(q.right)}</div>
        <div class="flex flex-wrap gap-1">${chips}</div>
      `;
      list.appendChild(card);
    });
    this.animateOpenModal("quizReviewModal");
  },

  // ===== Web-App: Installation & Offline (Service Worker) =====
  setupInstallSupport() {
    this.deferredInstall = null;
    let standalone = false;
    try {
      standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    } catch (e) {}
    const ua = navigator.userAgent || "";
    this.installEnv = {
      standalone,
      isIOS: /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
      isFile: location.protocol === "file:"
    };

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredInstall = e;
      this.updateInstallMenuUI();
    });
    window.addEventListener("appinstalled", () => {
      this.deferredInstall = null;
      this.installEnv.standalone = true;
      this.updateInstallMenuUI();
      this.showToast("Partyspiele wurde installiert!", "fa-mobile-screen");
    });

    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      const hadController = Boolean(navigator.serviceWorker.controller);
      navigator.serviceWorker.register("sw.js").catch(() => {});
      // Neue App-Version übernommen: einmal neu laden, damit alle Dateien zusammenpassen –
      // aber nur außerhalb einer laufenden Runde
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!hadController || this.swReloading) return;
        if ((this.nav.levels[this.nav.cur] ?? 0) >= 2) return;
        this.swReloading = true;
        location.reload();
      });
    }
    this.updateInstallMenuUI();
  },

  updateInstallMenuUI() {
    const btn = document.getElementById("menuInstallBtn");
    if (btn) btn.classList.toggle("hidden", Boolean(this.installEnv && this.installEnv.standalone));
  },

  installApp() {
    if (this.deferredInstall) {
      const promptEvent = this.deferredInstall;
      promptEvent.prompt();
      promptEvent.userChoice.finally(() => {
        this.deferredInstall = null;
        this.updateInstallMenuUI();
      });
      return;
    }
    const env = this.installEnv || {};
    document.getElementById("installHelpFileNote").classList.toggle("hidden", !env.isFile);
    document.getElementById("installHelpIOS").classList.toggle("order-first", Boolean(env.isIOS));
    this.openModal("installHelpModal");
  },

  openWelcomeScreen() {
    sfx.click();
    this.stopTimer();
    this.state.roundActiveLocked = false;
    this.updateVaultMenuLockUI();
    this.switchView("view-welcome");
  },

  completeWelcomeIntro() {
    sfx.click();
    try {
      localStorage.setItem("partyspiele_intro_seen_v1", "1");
    } catch (e) {}
    this.switchView("view-home");
  },

  startFromWelcome(mode) {
    try {
      localStorage.setItem("partyspiele_intro_seen_v1", "1");
    } catch (e) {}
    this.selectGameMode(mode);
  },

  initSystemColorSchemeListener() {
    try {
      if (window.matchMedia) {
        const mq = window.matchMedia("(prefers-color-scheme: light)");
        const handler = () => {
          if (this.state.colorMode === "system") {
            this.applyAppearanceUI();
          }
        };
        if (mq.addEventListener) mq.addEventListener("change", handler);
        else if (mq.addListener) mq.addListener(handler);
      }
    } catch (e) {}
  },

  getResolvedColorMode() {
    if (this.state.colorMode === "light" || this.state.colorMode === "dark") {
      return this.state.colorMode;
    }
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
    } catch (e) {}
    return "dark";
  },

  savePersistentState() {
    try {
      const settingsPayload = {
        mode: this.state.mode,
        questionSubmode: this.state.questionSubmode,
        theme: this.state.theme,
        colorMode: this.state.colorMode,
        playerCount: this.state.playerCount,
        imposterCount: this.state.imposterCount,
        randomImposterCount: this.state.randomImposterCount,
        starterMode: this.state.starterMode,
        players: this.state.players.map(p => ({ name: p.name, score: p.score || 0 })),
        showImposterHint: this.state.showImposterHint,
        showImposterCategory: this.state.showImposterCategory,
        collectWrittenAnswers: this.state.collectWrittenAnswers,
        timerMinutes: this.state.timerMinutes,
        activeWordCats: Array.from(this.state.activeWordCats),
        activeQuestionCats: Array.from(this.state.activeQuestionCats),
        soundEnabled: sfx.enabled,
        quizRounds: this.state.quizRounds,
        quizSeconds: this.state.quizSeconds,
        quizInstantFeedback: this.state.quizInstantFeedback,
        activeQuizCats: Array.from(this.state.activeQuizCats)
      };
      localStorage.setItem("imposter_app_settings_v3", JSON.stringify(settingsPayload));

      // Always persist current categories, words, questions & quiz so nothing is ever lost
      const dataPayload = {
        dataVersion: DATA_VERSION,
        wordCats: WORD_CATEGORIES,
        questionCats: QUESTION_CATEGORIES,
        quizCats: QUIZ_CATEGORIES,
        deletedQuestions: this.state.deletedQuestions,
        deletedQuiz: this.state.deletedQuiz
      };
      localStorage.setItem("imposter_vault_data_v3", JSON.stringify(dataPayload));
    } catch (e) {}
  },

  // Gespeicherte Kategorien mit den mitgelieferten Standarddaten zusammenführen:
  // neue Standard-Einträge kommen dazu, korrigierte Standard-Einträge werden bei einem
  // Daten-Update ersetzt, vom Spieler gelöschte Standard-Einträge bleiben gelöscht.
  mergeSavedWithDefaults(savedCats, defaultCats, itemsKey, deletedSet, upgrade, retiredSet) {
    const savedMap = new Map(savedCats.map(c => [c.id, c]));
    defaultCats.forEach(defCat => {
      const savedCat = savedMap.get(defCat.id);
      if (!savedCat) {
        const copy = JSON.parse(JSON.stringify(defCat));
        copy[itemsKey] = copy[itemsKey].filter(item => !deletedSet.has(item[0]));
        savedCats.push(copy);
        return;
      }
      if (!Array.isArray(savedCat[itemsKey])) savedCat[itemsKey] = [];
      if (upgrade) {
        savedCat[itemsKey] = savedCat[itemsKey].filter(item => !retiredSet.has(item[0]));
        const defByTitle = new Map(defCat[itemsKey].map(item => [item[0], item]));
        savedCat[itemsKey] = savedCat[itemsKey].map(item =>
          defByTitle.has(item[0]) ? JSON.parse(JSON.stringify(defByTitle.get(item[0]))) : item
        );
      }
      const existingTitles = new Set(savedCat[itemsKey].map(item => item[0]));
      defCat[itemsKey].forEach(defItem => {
        if (!existingTitles.has(defItem[0]) && !deletedSet.has(defItem[0])) {
          savedCat[itemsKey].push(JSON.parse(JSON.stringify(defItem)));
        }
      });
    });
    return savedCats;
  },

  loadPersistentState() {
    try {
      const savedDataRaw = localStorage.getItem("imposter_vault_data_v3");
      if (savedDataRaw) {
        const parsedData = JSON.parse(savedDataRaw);
        const savedVersion = Number(parsedData.dataVersion) || 1;
        const upgrade = savedVersion < DATA_VERSION;
        if (upgrade) this.state.dataUpgraded = true;
        if (Array.isArray(parsedData.deletedQuestions)) this.state.deletedQuestions = parsedData.deletedQuestions;
        if (Array.isArray(parsedData.deletedQuiz)) this.state.deletedQuiz = parsedData.deletedQuiz;

        if (Array.isArray(parsedData.wordCats) && parsedData.wordCats.length > 0) {
          WORD_CATEGORIES.length = 0;
          parsedData.wordCats.forEach(c => WORD_CATEGORIES.push(c));
        }
        if (Array.isArray(parsedData.questionCats) && parsedData.questionCats.length > 0) {
          const merged = this.mergeSavedWithDefaults(
            parsedData.questionCats, QUESTION_CATEGORIES, "pairs",
            new Set(this.state.deletedQuestions), upgrade, new Set(RETIRED_QUESTION_TITLES)
          );
          QUESTION_CATEGORIES.length = 0;
          merged.forEach(c => QUESTION_CATEGORIES.push(c));
        }
        if (Array.isArray(parsedData.quizCats) && parsedData.quizCats.length > 0) {
          const mergedQuiz = this.mergeSavedWithDefaults(
            parsedData.quizCats, QUIZ_CATEGORIES, "qs",
            new Set(this.state.deletedQuiz), upgrade, new Set()
          );
          QUIZ_CATEGORIES.length = 0;
          mergedQuiz.forEach(c => QUIZ_CATEGORIES.push(c));
        }
      }

      const rawSettings = localStorage.getItem("imposter_app_settings_v3");
      if (rawSettings) {
        const s = JSON.parse(rawSettings);
        if (s.mode) this.state.mode = s.mode;
        if (s.questionSubmode) this.state.questionSubmode = s.questionSubmode;
        if (s.theme) this.state.theme = s.theme;
        if (s.colorMode) this.state.colorMode = s.colorMode;
        if (typeof s.playerCount === "number") this.state.playerCount = Math.min(16, Math.max(3, s.playerCount));
        if (typeof s.imposterCount === "number") this.state.imposterCount = s.imposterCount;
        if (typeof s.randomImposterCount === "boolean") this.state.randomImposterCount = s.randomImposterCount;
        if (s.starterMode !== undefined) this.state.starterMode = s.starterMode;
        if (Array.isArray(s.players) && s.players.length >= 3) {
          this.state.players = s.players.map((p, i) => ({
            name: p.name || `Spieler ${i + 1}`,
            score: p.score || 0,
            votes: 0,
            answer: ""
          }));
          this.state.playerCount = this.state.players.length;
        }
        if (typeof s.showImposterHint === "boolean") this.state.showImposterHint = s.showImposterHint;
        if (typeof s.showImposterCategory === "boolean") this.state.showImposterCategory = s.showImposterCategory;
        if (typeof s.collectWrittenAnswers === "boolean") this.state.collectWrittenAnswers = s.collectWrittenAnswers;
        if (typeof s.timerMinutes === "number") this.state.timerMinutes = s.timerMinutes;
        if (typeof s.soundEnabled === "boolean") sfx.enabled = s.soundEnabled;
        if (typeof s.quizRounds === "number") this.state.quizRounds = Math.min(10, Math.max(1, s.quizRounds));
        if (typeof s.quizSeconds === "number") this.state.quizSeconds = Math.min(120, Math.max(5, s.quizSeconds));
        if (typeof s.quizInstantFeedback === "boolean") this.state.quizInstantFeedback = s.quizInstantFeedback;

        const validWordIds = new Set(WORD_CATEGORIES.map(c => c.id));
        if (Array.isArray(s.activeWordCats)) {
          const filtered = s.activeWordCats.filter(id => validWordIds.has(id));
          this.state.activeWordCats = new Set(filtered.length > 0 ? filtered : WORD_CATEGORIES.map(c => c.id));
        } else {
          this.state.activeWordCats = new Set(WORD_CATEGORIES.map(c => c.id));
        }

        const validQIds = new Set(QUESTION_CATEGORIES.map(c => c.id));
        if (Array.isArray(s.activeQuestionCats)) {
          const filteredQ = s.activeQuestionCats.filter(id => validQIds.has(id));
          this.state.activeQuestionCats = new Set(filteredQ.length > 0 ? filteredQ : QUESTION_CATEGORIES.map(c => c.id));
        } else {
          this.state.activeQuestionCats = new Set(QUESTION_CATEGORIES.map(c => c.id));
        }

        const validQuizIds = new Set(QUIZ_CATEGORIES.map(c => c.id));
        if (Array.isArray(s.activeQuizCats)) {
          const filteredZ = s.activeQuizCats.filter(id => validQuizIds.has(id));
          this.state.activeQuizCats = new Set(filteredZ.length > 0 ? filteredZ : QUIZ_CATEGORIES.map(c => c.id));
        } else {
          this.state.activeQuizCats = new Set(QUIZ_CATEGORIES.map(c => c.id));
        }
      }
    } catch (e) {}
  },

  loadVaultMeta() {
    try {
      const savedHash = localStorage.getItem("imposter_vault_pwhash");
      if (savedHash) {
        this.state.vaultPasswordHash = savedHash;
      }
    } catch (e) {}
  },

  saveEncryptedVaultToStorage() {
    this.savePersistentState();
    if (!this.state.vaultSessionKey) return;
    try {
      const payload = {
        wordCats: WORD_CATEGORIES,
        questionCats: QUESTION_CATEGORIES,
        quizCats: QUIZ_CATEGORIES
      };
      const encrypted = VaultCrypto.encrypt(payload, this.state.vaultSessionKey);
      localStorage.setItem("imposter_vault_cipher", encrypted);
    } catch (e) {}
  },

  tryDecryptVaultFromStorage(password) {
    try {
      const cipher = localStorage.getItem("imposter_vault_cipher");
      if (!cipher) return true;
      const data = VaultCrypto.decrypt(cipher, password);
      if (!data || !Array.isArray(data.wordCats) || !Array.isArray(data.questionCats)) {
        return false;
      }
      // Only overwrite if there is no unencrypted copy (the unencrypted copy is always the newest)
      const savedDataRaw = localStorage.getItem("imposter_vault_data_v3");
      if (!savedDataRaw) {
        WORD_CATEGORIES.length = 0;
        data.wordCats.forEach(c => WORD_CATEGORIES.push(c));
        QUESTION_CATEGORIES.length = 0;
        data.questionCats.forEach(c => QUESTION_CATEGORIES.push(c));
        if (Array.isArray(data.quizCats) && data.quizCats.length > 0) {
          QUIZ_CATEGORIES.length = 0;
          data.quizCats.forEach(c => QUIZ_CATEGORIES.push(c));
        }
      }
      this.updateVaultCounts();
      this.renderCategoriesGrid();
      this.savePersistentState();
      return true;
    } catch (e) {
      return false;
    }
  },

  isRoundCurrentlyProtected() {
    const imposterRound = Boolean(this.state.roundActiveLocked && this.state.currentRound && !this.state.currentRound.revealed);
    const quizRound = Boolean(
      this.state.quiz && !this.state.quiz.finished &&
      (this.nav.cur === "view-quiz-pass" || this.nav.cur === "view-quiz-play")
    );
    return imposterRound || quizRound;
  },

  updateVaultMenuLockUI() {
    const badge = document.getElementById("menuVaultLockBadge");
    const subtext = document.getElementById("menuVaultSubtext");
    const iconBox = document.getElementById("menuVaultIconBox");
    if (!badge || !subtext || !iconBox) return;

    if (this.isRoundCurrentlyProtected()) {
      badge.className = "text-[9px] font-mono-num uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0";
      badge.innerHTML = `<i class="fa-solid fa-ban text-[8px]"></i> Gesperrt`;
      subtext.textContent = "Während einer laufenden Runde unzugänglich";
      iconBox.className = "w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-400 shrink-0";
    } else {
      badge.className = "text-[9px] font-mono-num uppercase px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 shrink-0";
      badge.innerHTML = `<i class="fa-solid fa-lock text-[8px]"></i> Passwort`;
      subtext.textContent = "Anpassen & eigene Kategorien";
      iconBox.className = "w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0";
    }
  },

  toggleLogoMenu() {
    sfx.click();
    this.updateVaultMenuLockUI();
    if (this.state.logoMenuOpen) {
      this.closeLogoMenu();
    } else {
      this.state.logoMenuOpen = true;
      const menu = document.getElementById("logoDropdownMenu");
      const chevron = document.getElementById("logoMenuChevron");
      menu.classList.remove("hidden", "menu-exit");
      menu.classList.add("menu-enter");
      if (chevron) chevron.style.transform = "rotate(180deg)";
    }
  },

  closeLogoMenu() {
    if (!this.state.logoMenuOpen) return;
    this.state.logoMenuOpen = false;
    const menu = document.getElementById("logoDropdownMenu");
    const chevron = document.getElementById("logoMenuChevron");
    if (chevron) chevron.style.transform = "rotate(0deg)";
    if (menu) {
      menu.classList.remove("menu-enter");
      menu.classList.add("menu-exit");
      setTimeout(() => {
        if (!this.state.logoMenuOpen) {
          menu.classList.add("hidden");
          menu.classList.remove("menu-exit");
        }
      }, 210);
    }
  },

  showToast(message, icon = "fa-circle-info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "surface-card px-4 py-2.5 rounded-2xl border border-white/20 text-xs font-semibold text-white flex items-center gap-2.5 shadow-2xl view-enter pointer-events-auto";
    toast.innerHTML = `<i class="fa-solid ${icon} text-zinc-300"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-8px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 260);
    }, 2600);
  },

  switchView(viewId, opts = {}) {
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.add("hidden");
      sec.classList.remove("view-enter");
    });
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.remove("hidden");
      void target.offsetWidth;
      target.classList.add("view-enter");
    }
    const quickHome = document.getElementById("headerQuickHomeBtn");
    if (quickHome) {
      quickHome.classList.toggle("hidden", viewId === "view-home" || viewId === "view-welcome");
    }
    if (viewId !== "view-quiz-play") this.stopQuizTimer();
    if (!opts.fromPop) this.syncHistory(viewId);
    this.nav.cur = viewId;
  },

  goHome() {
    sfx.click();
    this.stopTimer();
    this.state.roundActiveLocked = false;
    this.updateVaultMenuLockUI();
    this.switchView("view-home");
  },

  selectGameMode(mode) {
    sfx.click();
    this.state.mode = mode === "question" ? "question" : mode === "quiz" ? "quiz" : "word";
    this.savePersistentState();
    this.openSetup();
  },

  openSetup() {
    sfx.click();
    this.stopTimer();
    this.state.roundActiveLocked = false;
    this.updateVaultMenuLockUI();
    this.prepareSetupUI();
    this.switchView("view-setup");
  },

  prepareSetupUI() {
    const mode = this.state.mode;
    const isWord = mode === "word";
    const isQuiz = mode === "quiz";
    const isQuestion = mode === "question";
    const badge = document.getElementById("setupModeBadge");
    if (badge) {
      badge.textContent = isQuiz ? "Quiz" : isWord ? "Wort-Imposter" : "Fragen-Imposter";
    }

    document.getElementById("wordHintSettingBox").classList.toggle("hidden", !isWord);
    document.getElementById("wordCategorySettingBox").classList.toggle("hidden", !isWord);
    document.getElementById("questionSubmodeSettingBox").classList.toggle("hidden", !isQuestion);
    document.getElementById("questionInputSettingBox").classList.toggle("hidden", !isQuestion);
    ["optImposterBox", "optStarterBox", "optTimerBox"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle("hidden", isQuiz);
    });
    ["quizRoundsBox", "quizSecondsBox", "quizFeedbackBox"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle("hidden", !isQuiz);
    });

    this.updateSetupOptionLabels();
    this.renderPlayersSetup();
    this.renderCategoriesGrid();
  },

  getMaxImposters() {
    return Math.max(1, this.state.playerCount - 1);
  },

  updateSetupOptionLabels() {
    const maxImp = this.getMaxImposters();
    if (this.state.imposterCount > maxImp) {
      this.state.imposterCount = maxImp;
    }

    const pCountLbl = document.getElementById("playerCountLabel");
    if (pCountLbl) pCountLbl.textContent = this.state.playerCount;

    const randBtn = document.getElementById("randomImposterToggleBtn");
    const stepper = document.getElementById("imposterStepperBox");
    const impLabel = document.getElementById("imposterCountLabel");
    const impSub = document.getElementById("imposterModeSubtext");

    if (this.state.randomImposterCount) {
      randBtn.className = "px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 bg-white text-black border-white shadow-sm";
      stepper.classList.add("opacity-40", "pointer-events-none");
      impLabel.textContent = "?";
      impSub.textContent = `Zufällig (1 bis ${maxImp} Imposter möglich)`;
    } else {
      randBtn.className = "px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 bg-black/40 border-white/10 text-zinc-400 hover:text-white";
      stepper.classList.remove("opacity-40", "pointer-events-none");
      impLabel.textContent = this.state.imposterCount;
      impSub.textContent = `Feste Anzahl (max. ${maxImp} bei ${this.state.playerCount} Spielern)`;
    }

    // Starter player label
    const starterLbl = document.getElementById("starterSelectionLabel");
    if (starterLbl) {
      if (this.state.starterMode === "random" || this.state.starterMode >= this.state.playerCount) {
        this.state.starterMode = "random";
        starterLbl.textContent = "Zufällig";
      } else {
        starterLbl.textContent = this.state.players[this.state.starterMode]?.name || "Zufällig";
      }
    }

    // Hint mode buttons
    const onBtn = document.getElementById("hintModeOnBtn");
    const offBtn = document.getElementById("hintModeOffBtn");
    if (onBtn && offBtn) {
      if (this.state.showImposterHint) {
        onBtn.className = "py-2 px-3 rounded-xl text-xs font-semibold transition-all bg-white text-black flex items-center justify-center gap-1.5 shadow-sm";
        offBtn.className = "py-2 px-3 rounded-xl text-xs font-semibold transition-all text-zinc-400 hover:text-white flex items-center justify-center gap-1.5";
      } else {
        onBtn.className = "py-2 px-3 rounded-xl text-xs font-semibold transition-all text-zinc-400 hover:text-white flex items-center justify-center gap-1.5";
        offBtn.className = "py-2 px-3 rounded-xl text-xs font-semibold transition-all bg-white text-black flex items-center justify-center gap-1.5 shadow-sm";
      }
    }

    this.toggleSwitchUI("toggleCatVisibilityBtn", this.state.showImposterCategory);
    this.toggleSwitchUI("toggleWrittenAnswersBtn", this.state.collectWrittenAnswers);

    // Question Submode button label
    const qSubLbl = document.getElementById("questionSubmodeBtnLabel");
    const submodeShortMap = {
      all: "Beides (Alle)",
      slider: "Circa-Slider",
      classic: "Normale Fragen"
    };
    if (qSubLbl) {
      qSubLbl.textContent = submodeShortMap[this.state.questionSubmode] || "Beides (Alle)";
    }

    // Timer button label
    const timerBtnLbl = document.getElementById("timerDurationBtnLabel");
    const timerText = this.state.timerMinutes === 0 ? "Kein Timer" : `${this.state.timerMinutes} Min.`;
    if (timerBtnLbl) {
      timerBtnLbl.textContent = timerText;
    }

    // Update Compact Setup Hub Summaries
    const summaryPlayers = document.getElementById("setupSummaryPlayers");
    const badgePlayerCount = document.getElementById("setupBadgePlayerCount");
    if (summaryPlayers) {
      const namesPreview = this.state.players.slice(0, 4).map(p => p.name).join(", ");
      const more = this.state.players.length > 4 ? ` +${this.state.players.length - 4}` : "";
      summaryPlayers.textContent = `${namesPreview}${more}`;
    }
    if (badgePlayerCount) badgePlayerCount.textContent = this.state.playerCount;

    const summaryOptions = document.getElementById("setupSummaryOptions");
    if (summaryOptions) {
      const impPart = this.state.randomImposterCount
        ? `Zufall-Imposter`
        : `${this.state.imposterCount} Imposter`;
      const extraPart = this.state.mode === "word"
        ? (this.state.showImposterHint ? "Mit Hinweis" : "Ohne Hinweis")
        : (submodeShortMap[this.state.questionSubmode] || "Beides");
      summaryOptions.textContent = `${impPart} • ${timerText} • ${extraPart}`;
      if (this.state.mode === "quiz") {
        summaryOptions.textContent = `${this.state.quizRounds} Runden • ${this.state.quizSeconds} Sek. • ${this.state.quizInstantFeedback ? "Sofort-Feedback" : "Auflösung am Ende"}`;
      }
    }

    const qRoundsLbl = document.getElementById("quizRoundsLabel");
    if (qRoundsLbl) qRoundsLbl.textContent = this.state.quizRounds;
    const qSecLbl = document.getElementById("quizSecondsBtnLabel");
    if (qSecLbl) qSecLbl.textContent = `${this.state.quizSeconds} Sek.`;
    this.toggleSwitchUI("toggleQuizFeedbackBtn", this.state.quizInstantFeedback);
  },

  changePlayerCount(delta) {
    sfx.click();
    const next = Math.min(16, Math.max(3, this.state.playerCount + delta));
    if (next === this.state.playerCount) return;
    this.state.playerCount = next;

    while (this.state.players.length < next) {
      const num = this.state.players.length + 1;
      this.state.players.push({ name: `Spieler ${num}`, score: 0, votes: 0, answer: "" });
    }
    while (this.state.players.length > next) {
      this.state.players.pop();
    }

    const maxImp = this.getMaxImposters();
    if (this.state.imposterCount > maxImp) {
      this.state.imposterCount = maxImp;
    }

    this.updateSetupOptionLabels();
    this.renderPlayersSetup();
    this.renderScoreboard();
    this.savePersistentState();
  },

  setExactPlayerCount(targetCount) {
    const clamped = Math.min(16, Math.max(3, targetCount));
    const delta = clamped - this.state.playerCount;
    if (delta !== 0) {
      this.changePlayerCount(delta);
    } else {
      sfx.click();
    }
  },

  openCustomSelectPopup({ title, subtitle, selectedValue, options, onSelect }) {
    sfx.click();
    document.getElementById("customSelectModalTitle").textContent = title || "Auswahl treffen";
    document.getElementById("customSelectModalSubtitle").textContent = subtitle || "Wähle eine Option";
    const list = document.getElementById("customSelectOptionsList");
    list.innerHTML = "";

    options.forEach(opt => {
      const active = opt.value === selectedValue;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.onclick = () => {
        sfx.click();
        if (onSelect) onSelect(opt.value);
        this.closeModal("customSelectModal");
      };
      btn.className = `w-full p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
        active ? "bg-white/15 border-white/35 text-white" : "pill-button text-zinc-300"
      }`;
      btn.innerHTML = `
        <div class="flex items-center gap-3 min-w-0 pr-2">
          <div class="w-9 h-9 rounded-xl ${active ? "bg-white text-black" : "bg-white/10 text-zinc-300"} flex items-center justify-center shrink-0">
            <i class="fa-solid ${opt.icon || "fa-check"} text-xs"></i>
          </div>
          <div class="min-w-0">
            <div class="font-semibold text-xs sm:text-sm text-white truncate">${opt.label}</div>
            ${opt.sub ? `<div class="text-[11px] text-zinc-400 truncate">${opt.sub}</div>` : ""}
          </div>
        </div>
        <i class="fa-solid fa-check text-xs ${active ? "text-white" : "text-transparent"} shrink-0"></i>
      `;
      list.appendChild(btn);
    });

    this.animateOpenModal("customSelectModal");
  },

  openQuestionSubmodePopup() {
    this.openCustomSelectPopup({
      title: "Fragen-Typ auswählen",
      subtitle: "Wähle zwischen Schätzfragen mit Slider, normalen Fragen oder beidem",
      selectedValue: this.state.questionSubmode,
      options: [
        {
          value: "all",
          label: "Beides (Alle Fragen & Slider)",
          sub: "Abwechslungsreicher Mix aus Schätz-Slidern und Fragen-Duellen",
          icon: "fa-layer-group"
        },
        {
          value: "slider",
          label: "Nur Circa-Imposter (Slider)",
          sub: "Ausschließlich Schätz- und Skala-Fragen mit dem Progressiv-Slider",
          icon: "fa-sliders"
        },
        {
          value: "classic",
          label: "Nur Normale Fragen (Text)",
          sub: "Klassische Fragen-Duelle ohne Zahlen-Slider",
          icon: "fa-comments"
        }
      ],
      onSelect: (val) => {
        this.state.questionSubmode = val;
        this.updateSetupOptionLabels();
        this.savePersistentState();
      }
    });
  },

  removeSpecificPlayer(idx) {
    if (this.state.playerCount <= 3) {
      this.showToast("Mindestens 3 Spieler werden benötigt", "fa-circle-exclamation");
      return;
    }
    sfx.click();
    this.state.players.splice(idx, 1);
    this.state.playerCount = this.state.players.length;
    const maxImp = this.getMaxImposters();
    if (this.state.imposterCount > maxImp) this.state.imposterCount = maxImp;
    this.updateSetupOptionLabels();
    this.renderPlayersSetup();
    this.savePersistentState();
  },

  changeImposterCount(delta) {
    sfx.click();
    this.state.randomImposterCount = false;
    const maxImp = this.getMaxImposters();
    const next = Math.min(maxImp, Math.max(1, this.state.imposterCount + delta));
    this.state.imposterCount = next;
    this.updateSetupOptionLabels();
    this.savePersistentState();
  },

  toggleRandomImposterCount() {
    sfx.click();
    this.state.randomImposterCount = !this.state.randomImposterCount;
    this.updateSetupOptionLabels();
    this.savePersistentState();
  },

  openStarterModal() {
    sfx.click();
    this.renderStarterList();
    this.animateOpenModal("starterModal");
  },

  renderStarterList() {
    const list = document.getElementById("starterPlayerList");
    if (!list) return;
    list.innerHTML = "";

    const isRand = this.state.starterMode === "random";
    const randBtn = document.createElement("button");
    randBtn.type = "button";
    randBtn.onclick = () => this.selectStarterMode("random");
    randBtn.className = `w-full p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
      isRand ? "bg-white/15 border-white/35 text-white" : "pill-button text-zinc-300"
    }`;
    randBtn.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
          <i class="fa-solid fa-dice"></i>
        </div>
        <div>
          <div class="font-semibold text-sm text-white">Zufälliger Startspieler</div>
          <div class="text-xs text-zinc-400">Wird jede Runde neu ausgelost</div>
        </div>
      </div>
      <i class="fa-solid fa-check text-xs ${isRand ? "text-white" : "text-transparent"}"></i>
    `;
    list.appendChild(randBtn);

    this.state.players.forEach((p, idx) => {
      const active = this.state.starterMode === idx;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.onclick = () => this.selectStarterMode(idx);
      btn.className = `w-full p-2.5 sm:p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
        active ? "bg-white/15 border-white/35 text-white" : "pill-button text-zinc-300"
      }`;
      btn.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <span class="font-mono-num w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-zinc-200 shrink-0">${idx + 1}</span>
          <span class="font-semibold text-sm text-white truncate">${p.name}</span>
        </div>
        <i class="fa-solid fa-check text-xs ${active ? "text-white" : "text-transparent"} shrink-0"></i>
      `;
      list.appendChild(btn);
    });
  },

  selectStarterMode(mode) {
    sfx.click();
    this.state.starterMode = mode;
    this.updateSetupOptionLabels();
    this.savePersistentState();
    this.closeModal("starterModal");
  },

  renderPlayersSetup() {
    const grid = document.getElementById("playerNamesGrid");
    if (!grid) return;
    grid.innerHTML = "";
    this.state.players.forEach((p, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "flex items-center justify-between gap-2.5 bg-black/40 border border-white/10 hover:border-white/25 rounded-2xl p-2 sm:p-2.5 focus-within:border-white/40 transition-all group";
      wrap.innerHTML = `
        <div class="flex items-center gap-2.5 flex-1 min-w-0">
          <div class="w-8 h-8 rounded-xl bg-white/10 text-white font-mono-num text-xs font-bold flex items-center justify-center shrink-0">
            ${idx + 1}
          </div>
          <input type="text" value="${p.name.replace(/"/g, "&quot;")}" maxlength="18"
            placeholder="Name eingeben..."
            onchange="app.updatePlayerName(${idx}, this.value)"
            class="bg-transparent text-xs sm:text-sm font-semibold text-white w-full min-w-0 focus:outline-none truncate" />
        </div>
        ${
          this.state.playerCount > 3
            ? `<button type="button" onclick="app.removeSpecificPlayer(${idx})" class="w-7 h-7 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-300 flex items-center justify-center transition-colors shrink-0" title="Spieler entfernen">
                <i class="fa-solid fa-xmark text-xs"></i>
              </button>`
            : `<i class="fa-solid fa-pen text-[10px] text-zinc-500 pr-1.5 shrink-0"></i>`
        }
      `;
      grid.appendChild(wrap);
    });
  },

  updatePlayerName(idx, val) {
    if (this.state.players[idx]) {
      this.state.players[idx].name = val.trim() || `Spieler ${idx + 1}`;
      this.updateSetupOptionLabels();
      this.savePersistentState();
    }
  },

  toggleSwitchUI(btnId, active) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.className = active
      ? "w-12 h-7 rounded-full bg-white p-1 transition-all flex items-center justify-end shrink-0"
      : "w-12 h-7 rounded-full bg-white/15 p-1 transition-all flex items-center justify-start shrink-0";
    btn.innerHTML = `<span class="w-5 h-5 rounded-full ${active ? 'bg-black' : 'bg-zinc-400'} shadow-sm transition-transform"></span>`;
  },

  setImposterHintMode(enabled) {
    sfx.click();
    this.state.showImposterHint = Boolean(enabled);
    this.updateSetupOptionLabels();
    this.savePersistentState();
  },

  toggleImposterHint() {
    this.setImposterHintMode(!this.state.showImposterHint);
  },

  toggleImposterCategory() {
    sfx.click();
    this.state.showImposterCategory = !this.state.showImposterCategory;
    this.toggleSwitchUI("toggleCatVisibilityBtn", this.state.showImposterCategory);
    this.savePersistentState();
  },

  toggleWrittenAnswers() {
    sfx.click();
    this.state.collectWrittenAnswers = !this.state.collectWrittenAnswers;
    this.toggleSwitchUI("toggleWrittenAnswersBtn", this.state.collectWrittenAnswers);
    this.savePersistentState();
  },

  renderTimerPresets() {
    const grid = document.getElementById("timerPresetGrid");
    if (!grid) return;
    const presets = [
      { mins: 0, title: "Kein Timer", sub: "Ohne Zeitlimit" },
      { mins: 1, title: "1 Minute", sub: "Blitzrunde" },
      { mins: 2, title: "2 Minuten", sub: "Schnell & knackig" },
      { mins: 3, title: "3 Minuten", sub: "Standard" },
      { mins: 5, title: "5 Minuten", sub: "Ausführlich" },
      { mins: 8, title: "8 Minuten", sub: "Große Gruppe" }
    ];
    grid.innerHTML = "";
    presets.forEach(p => {
      const active = this.state.timerMinutes === p.mins;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.onclick = () => {
        sfx.click();
        this.setTimerMinutes(p.mins);
      };
      btn.className = `p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-1 ${
        active
          ? "bg-white/15 border-white/35 text-white"
          : "bg-black/30 border-white/10 text-zinc-400 hover:border-white/20 hover:text-white"
      }`;
      btn.innerHTML = `
        <div class="min-w-0">
          <div class="font-semibold text-xs sm:text-sm text-white truncate">${p.title}</div>
          <div class="text-[11px] text-zinc-400 truncate">${p.sub}</div>
        </div>
        <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
          active ? "bg-white text-black" : "border border-white/15 text-transparent"
        }">
          <i class="fa-solid fa-check"></i>
        </div>
      `;
      grid.appendChild(btn);
    });

    const slider = document.getElementById("customTimerRangeInput");
    const preview = document.getElementById("customTimerPreviewLabel");
    if (slider) slider.value = this.state.timerMinutes;
    if (preview) {
      preview.textContent = this.state.timerMinutes === 0 ? "Kein Timer" : `${this.state.timerMinutes} Minuten`;
    }
  },

  previewCustomTimer(val) {
    const parsed = parseInt(val, 10) || 0;
    this.setTimerMinutes(parsed);
  },

  setTimerMinutes(mins) {
    const parsed = parseInt(mins, 10);
    this.state.timerMinutes = isNaN(parsed) ? 3 : parsed;
    this.updateSetupOptionLabels();
    this.renderTimerPresets();
    this.savePersistentState();
  },

  renderCategoriesGrid() {
    const grid = document.getElementById("categoriesGrid");
    grid.innerHTML = "";
    const isWord = this.state.mode === "word";
    const isQuiz = this.state.mode === "quiz";
    const list = isQuiz ? QUIZ_CATEGORIES : (isWord ? WORD_CATEGORIES : QUESTION_CATEGORIES);
    const activeSet = this.getActiveCatSet();

    let totalItems = 0;

    list.forEach(cat => {
      const isSelected = activeSet.has(cat.id);
      const count = isQuiz ? cat.qs.length : (isWord ? cat.words.length : cat.pairs.length);
      if (isSelected) totalItems += count;

      const card = document.createElement("button");
      card.type = "button";
      card.onclick = () => this.toggleCategory(cat.id);
      card.className = `p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 sm:gap-2.5 min-w-0 ${
        isSelected
          ? "bg-white/[0.08] border-white/25 text-white"
          : "bg-black/20 border-white/5 text-zinc-500 opacity-55 hover:opacity-85"
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between w-full">
          <div class="w-8 h-8 rounded-xl ${isSelected ? 'bg-white text-black' : 'bg-white/5 text-zinc-400'} flex items-center justify-center text-xs transition-colors">
            <i class="fa-solid ${cat.icon}"></i>
          </div>
          <span class="w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
            isSelected ? "bg-white text-black" : "border border-white/15 text-transparent"
          }">
            <i class="fa-solid fa-check"></i>
          </span>
        </div>
        <div class="min-w-0">
          <div class="font-semibold text-xs text-white leading-snug break-words">${cat.name}</div>
          <div class="font-mono-num text-[10px] text-zinc-400 mt-0.5">${count} ${isQuiz ? "Fragen" : (isWord ? "Wörter" : "Paare")}</div>
        </div>
      `;
      grid.appendChild(card);
    });

    // Direct Shortcut Tile at the end of the Categories Grid
    const addShortcutTile = document.createElement("button");
    addShortcutTile.type = "button";
    addShortcutTile.onclick = () => this.openCustomCategoryModal();
    addShortcutTile.className = "p-3 sm:p-3.5 rounded-2xl border border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] text-left transition-all flex flex-col justify-between gap-2 sm:gap-2.5 group min-w-0";
    addShortcutTile.innerHTML = `
      <div class="flex items-center justify-between w-full">
        <div class="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-white group-hover:text-black text-white flex items-center justify-center text-xs transition-colors">
          <i class="fa-solid fa-plus"></i>
        </div>
      </div>
      <div>
        <div class="font-semibold text-xs text-white leading-snug">+ Eigene Kategorie</div>
        <div class="text-[10px] text-zinc-400 mt-0.5">Neu erstellen</div>
      </div>
    `;
    grid.appendChild(addShortcutTile);

    document.getElementById("categorySectionTitle").textContent = isQuiz
      ? `Quiz-Kategorien (${list.length})`
      : isWord
      ? `Wort-Kategorien (${list.length})`
      : `Fragen-Welten (${list.length})`;

    const statsText = isQuiz
      ? `${activeSet.size} / ${list.length} aktiv • ${totalItems} Quizfragen`
      : isWord
      ? `${activeSet.size} / ${list.length} aktiv • ${totalItems} Wörter`
      : `${activeSet.size} / ${list.length} aktiv • ${totalItems} Fragen-Duelle`;
    document.getElementById("categoryPoolStats").textContent = statsText;

    const summaryCats = document.getElementById("setupSummaryCategories");
    const badgeCatCount = document.getElementById("setupBadgeCategoryCount");
    if (summaryCats) summaryCats.textContent = statsText;
    if (badgeCatCount) badgeCatCount.textContent = `${activeSet.size}/${list.length}`;
  },

  toggleCategory(catId) {
    sfx.click();
    const activeSet = this.getActiveCatSet();
    if (activeSet.has(catId)) {
      if (activeSet.size <= 1) {
        this.showToast("Mindestens eine Kategorie muss aktiv bleiben", "fa-circle-exclamation");
        return;
      }
      activeSet.delete(catId);
    } else {
      activeSet.add(catId);
    }
    this.renderCategoriesGrid();
    this.savePersistentState();
  },

  selectAllCategories(selectAll) {
    sfx.click();
    const isWord = this.state.mode === "word";
    const list = this.state.mode === "quiz" ? QUIZ_CATEGORIES : (isWord ? WORD_CATEGORIES : QUESTION_CATEGORIES);
    const activeSet = this.getActiveCatSet();
    activeSet.clear();
    if (selectAll) {
      list.forEach(c => activeSet.add(c.id));
    } else {
      activeSet.add(list[0].id);
    }
    this.renderCategoriesGrid();
    this.savePersistentState();
  },

  startRound() {
    sfx.click();
    if (this.state.mode === "quiz") {
      this.startQuiz();
      return;
    }
    const isWord = this.state.mode === "word";
    const maxImp = this.getMaxImposters();

    // Determine number of imposters (random vs fixed)
    const actualImposterCount = this.state.randomImposterCount
      ? Math.floor(Math.random() * maxImp) + 1
      : Math.min(maxImp, this.state.imposterCount);

    const indices = Array.from({ length: this.state.playerCount }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const imposterIndices = new Set(indices.slice(0, actualImposterCount));

    this.state.players.forEach(p => {
      p.votes = 0;
      p.answer = "";
    });

    // Determine starter player (random vs chosen)
    const starterIndex =
      this.state.starterMode === "random" || this.state.starterMode >= this.state.playerCount
        ? Math.floor(Math.random() * this.state.playerCount)
        : this.state.starterMode;

    if (isWord) {
      const pool = [];
      WORD_CATEGORIES.forEach(cat => {
        if (this.state.activeWordCats.has(cat.id)) {
          cat.words.forEach(([word, hint]) => {
            if (!this.state.usedWords.has(word)) {
              pool.push({ categoryName: cat.name, categoryIcon: cat.icon, word, hint });
            }
          });
        }
      });

      if (pool.length === 0) {
        this.state.usedWords.clear();
        WORD_CATEGORIES.forEach(cat => {
          if (this.state.activeWordCats.has(cat.id)) {
            cat.words.forEach(([word, hint]) => {
              pool.push({ categoryName: cat.name, categoryIcon: cat.icon, word, hint });
            });
          }
        });
      }

      if (pool.length === 0) {
        this.showToast("Keine Wörter in den gewählten Kategorien gefunden!", "fa-circle-exclamation");
        return;
      }

      const chosen = pool[Math.floor(Math.random() * pool.length)];
      this.state.usedWords.add(chosen.word);

      this.state.currentRound = {
        mode: "word",
        imposterIndices,
        actualImposterCount,
        starterIndex,
        categoryName: chosen.categoryName,
        categoryIcon: chosen.categoryIcon,
        word: chosen.word,
        hint: chosen.hint,
        revealed: false
      };
    } else {
      const pool = [];
      QUESTION_CATEGORIES.forEach(cat => {
        if (this.state.activeQuestionCats.has(cat.id)) {
          cat.pairs.forEach(([mainQ, impQ, slider, fact]) => {
            const isSliderPair = Boolean(slider);
            if (this.state.questionSubmode === "slider" && !isSliderPair) return;
            if (this.state.questionSubmode === "classic" && isSliderPair) return;

            if (!this.state.usedQuestions.has(mainQ)) {
              pool.push({ categoryName: cat.name, categoryIcon: cat.icon, mainQ, impQ, slider: slider || null, fact: fact || null });
            }
          });
        }
      });

      if (pool.length === 0) {
        this.state.usedQuestions.clear();
        QUESTION_CATEGORIES.forEach(cat => {
          if (this.state.activeQuestionCats.has(cat.id)) {
            cat.pairs.forEach(([mainQ, impQ, slider, fact]) => {
              const isSliderPair = Boolean(slider);
              if (this.state.questionSubmode === "slider" && !isSliderPair) return;
              if (this.state.questionSubmode === "classic" && isSliderPair) return;
              pool.push({ categoryName: cat.name, categoryIcon: cat.icon, mainQ, impQ, slider: slider || null, fact: fact || null });
            });
          }
        });
      }

      if (pool.length === 0) {
        this.showToast("Keine passenden Fragen für diesen Filter in den gewählten Kategorien aktiv!", "fa-circle-exclamation");
        return;
      }

      const chosen = pool[Math.floor(Math.random() * pool.length)];
      this.state.usedQuestions.add(chosen.mainQ);

      this.state.currentRound = {
        mode: "question",
        imposterIndices,
        actualImposterCount,
        starterIndex,
        categoryName: chosen.categoryName,
        categoryIcon: chosen.categoryIcon,
        mainQ: chosen.mainQ,
        impQ: chosen.impQ,
        slider: chosen.slider,
        fact: chosen.fact || null,
        revealed: false
      };
    }

    this.state.roundActiveLocked = true;
    this.updateVaultMenuLockUI();
    this.state.passIndex = 0;
    this.preparePassScreen();
    this.switchView("view-pass");
  },

  timelineState: {
    floatIndex: 0,
    minIndex: 0,
    maxIndex: 100,
    isScale10: false,
    unit: "",
    isDragging: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    rafId: null,
    lastTickSoundIdx: -1
  },

  initTimelineSlider(isScale10 = false, startIdx = 0, unit = "") {
    const ts = this.timelineState;
    if (ts.rafId) {
      cancelAnimationFrame(ts.rafId);
      ts.rafId = null;
    }
    ts.isScale10 = isScale10;
    ts.unit = unit || "";
    ts.minIndex = isScale10 ? 1 : 0;
    ts.maxIndex = isScale10 ? 10 : UNIVERSAL_SLIDER_VALUES.length - 1;
    ts.floatIndex = Math.min(ts.maxIndex, Math.max(ts.minIndex, startIdx));
    ts.isDragging = false;
    ts.velocity = 0;
    ts.lastTickSoundIdx = Math.round(ts.floatIndex);

    const viewport = document.getElementById("timelineSliderViewport");
    const canvas = document.getElementById("timelineSliderCanvas");
    if (!viewport || !canvas) return;

    const tickSpacing = 62; // px per step on the timeline

    const syncValueFromFloat = (playTick = false) => {
      const rounded = Math.min(ts.maxIndex, Math.max(ts.minIndex, Math.round(ts.floatIndex)));
      const hiddenInput = document.getElementById("playerSecretSliderInput");
      if (hiddenInput) hiddenInput.value = rounded;
      if (playTick && rounded !== ts.lastTickSoundIdx) {
        ts.lastTickSoundIdx = rounded;
        sfx.playTone(460, "sine", 0.018, 0.018, 520);
      }
      this.updateSliderPreview(rounded, ts.unit, ts.isScale10);
      this.drawTimelineCanvas();
    };

    const startMomentum = () => {
      if (ts.rafId) cancelAnimationFrame(ts.rafId);
      const stepFrame = () => {
        if (ts.isDragging) return;
        if (Math.abs(ts.velocity) > 0.015) {
          ts.floatIndex += ts.velocity;
          if (ts.floatIndex < ts.minIndex) {
            ts.floatIndex = ts.minIndex;
            ts.velocity = 0;
          } else if (ts.floatIndex > ts.maxIndex) {
            ts.floatIndex = ts.maxIndex;
            ts.velocity = 0;
          }
          ts.velocity *= 0.91;
          syncValueFromFloat(true);
          ts.rafId = requestAnimationFrame(stepFrame);
        } else {
          // Smoothly snap floatIndex to exact integer tick under the center needle
          const target = Math.round(ts.floatIndex);
          const diff = target - ts.floatIndex;
          if (Math.abs(diff) > 0.008) {
            ts.floatIndex += diff * 0.28;
            syncValueFromFloat(false);
            ts.rafId = requestAnimationFrame(stepFrame);
          } else {
            ts.floatIndex = target;
            syncValueFromFloat(false);
            ts.rafId = null;
          }
        }
      };
      ts.rafId = requestAnimationFrame(stepFrame);
    };

    const onDown = (clientX, e) => {
      if (e) e.stopPropagation();
      if (ts.rafId) {
        cancelAnimationFrame(ts.rafId);
        ts.rafId = null;
      }
      ts.isDragging = true;
      ts.startX = clientX;
      ts.lastX = clientX;
      ts.lastTime = performance.now();
      ts.velocity = 0;
    };

    const onMove = (clientX, e) => {
      if (!ts.isDragging) return;
      if (e) {
        e.stopPropagation();
        if (e.cancelable) e.preventDefault();
      }
      const now = performance.now();
      const dt = Math.max(1, now - ts.lastTime);
      const dx = clientX - ts.lastX;
      ts.lastX = clientX;
      ts.lastTime = now;

      // Adaptive sensitivity: slow drag = exact 1-by-1 tick control; fast swipe = accelerated timeline glide
      const speedPxPerMs = Math.abs(dx) / dt;
      const accel = ts.isScale10 ? 1 : 1 + Math.min(3.5, speedPxPerMs * 1.45);
      const deltaIndex = (-dx / tickSpacing) * accel;

      ts.floatIndex = Math.min(ts.maxIndex, Math.max(ts.minIndex, ts.floatIndex + deltaIndex));
      ts.velocity = deltaIndex * (16 / dt) * 0.65;
      syncValueFromFloat(true);
    };

    const onUp = (e) => {
      if (!ts.isDragging) return;
      if (e) e.stopPropagation();
      ts.isDragging = false;
      startMomentum();
    };

    // Mouse events
    viewport.onmousedown = (e) => onDown(e.clientX, e);
    window.addEventListener("mousemove", (e) => onMove(e.clientX, e));
    window.addEventListener("mouseup", (e) => onUp(e));

    // Touch events
    viewport.ontouchstart = (e) => {
      if (e.touches && e.touches.length > 0) {
        onDown(e.touches[0].clientX, e);
      }
    };
    viewport.ontouchmove = (e) => {
      if (e.touches && e.touches.length > 0) {
        onMove(e.touches[0].clientX, e);
      }
    };
    viewport.ontouchend = (e) => onUp(e);
    viewport.ontouchcancel = (e) => onUp(e);

    // Mouse wheel support for desktop
    viewport.onwheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const dir = (e.deltaX || e.deltaY) > 0 ? 1 : -1;
      this.nudgeSlider(dir, ts.unit, ts.isScale10);
    };

    requestAnimationFrame(() => {
      syncValueFromFloat(false);
    });
  },

  drawTimelineCanvas() {
    const canvas = document.getElementById("timelineSliderCanvas");
    const viewport = document.getElementById("timelineSliderViewport");
    if (!canvas || !viewport) return;

    const rect = viewport.getBoundingClientRect();
    const width = Math.max(240, rect.width || 280);
    const height = Math.max(76, rect.height || 86);
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }

    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const ts = this.timelineState;
    const isLight = this.getResolvedColorMode() === "light";
    const accent = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#f43f5e";

    const centerX = width / 2;
    const tickSpacing = 62;
    const subTicks = 4;
    const subSpacing = tickSpacing / subTicks;

    const visibleHalfTicks = Math.ceil(width / (2 * tickSpacing)) + 2;
    const centerRounded = Math.round(ts.floatIndex);
    const startIdx = Math.max(ts.minIndex, Math.floor(ts.floatIndex) - visibleHalfTicks);
    const endIdx = Math.min(ts.maxIndex, Math.ceil(ts.floatIndex) + visibleHalfTicks);

    // Subtle horizontal baseline
    ctx.strokeStyle = isLight ? "rgba(15, 23, 42, 0.1)" : "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 26);
    ctx.lineTo(width, 26);
    ctx.stroke();

    // Draw ticks & numbers along the moving timeline
    for (let i = startIdx; i <= endIdx; i++) {
      const offsetTicks = i - ts.floatIndex;
      const x = centerX + offsetTicks * tickSpacing;

      // Sub-graduation marks between i and i + 1
      if (i < ts.maxIndex) {
        for (let s = 1; s < subTicks; s++) {
          const sx = x + s * subSpacing;
          if (sx < -10 || sx > width + 10) continue;
          ctx.strokeStyle = isLight ? "rgba(15, 23, 42, 0.16)" : "rgba(255, 255, 255, 0.14)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx, 14);
          ctx.lineTo(sx, 22);
          ctx.stroke();
        }
      }

      const distFromCenter = Math.abs(offsetTicks);
      const isActiveCenter = i === centerRounded && distFromCenter < 0.48;

      // Main tick line
      const tickTop = isActiveCenter ? 6 : 10;
      const tickBottom = isActiveCenter ? 32 : 26;
      ctx.strokeStyle = isActiveCenter
        ? accent
        : isLight
        ? "rgba(15, 23, 42, 0.38)"
        : "rgba(255, 255, 255, 0.36)";
      ctx.lineWidth = isActiveCenter ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(x, tickTop);
      ctx.lineTo(x, tickBottom);
      ctx.stroke();

      // Number label directly under the tick
      const actualVal = ts.isScale10 ? i : UNIVERSAL_SLIDER_VALUES[i];
      const labelStr = formatCompactTimelineTick(actualVal);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (isActiveCenter) {
        ctx.font = "700 13px 'JetBrains Mono', monospace";
        const textW = ctx.measureText(labelStr).width;
        const pillW = Math.max(36, textW + 16);
        const pillH = 24;
        const pillX = x - pillW / 2;
        const pillY = 44;

        ctx.fillStyle = isLight ? "rgba(15, 23, 42, 0.09)" : "rgba(255, 255, 255, 0.12)";
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 8);
        ctx.fill();

        ctx.fillStyle = isLight ? "#0f172a" : "#ffffff";
        ctx.fillText(labelStr, x, pillY + pillH / 2 + 0.5);
      } else {
        const alpha = Math.max(0.2, 0.75 - distFromCenter * 0.2);
        ctx.font = "500 11px 'JetBrains Mono', monospace";
        ctx.fillStyle = isLight
          ? `rgba(15, 23, 42, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;
        ctx.fillText(labelStr, x, 56);
      }
    }

    ctx.restore();
  },

  updateSliderPreview(rawSliderVal, unit = "", isScale10 = false) {
    const label = document.getElementById("sliderLiveValue");
    const stepHint = document.getElementById("sliderStepHintLabel");
    if (!label) return;
    if (isScale10) {
      label.textContent = `${formatNumberDE(rawSliderVal)}${unit}`;
    } else {
      const idx = Math.min(UNIVERSAL_SLIDER_VALUES.length - 1, Math.max(0, parseInt(rawSliderVal, 10) || 0));
      const actualVal = UNIVERSAL_SLIDER_VALUES[idx];
      label.textContent = `${formatNumberDE(actualVal)}${unit}`;
      if (stepHint) {
        let stepSize = 1;
        if (idx < UNIVERSAL_SLIDER_VALUES.length - 1) {
          stepSize = UNIVERSAL_SLIDER_VALUES[idx + 1] - UNIVERSAL_SLIDER_VALUES[idx];
        } else if (idx > 0) {
          stepSize = UNIVERSAL_SLIDER_VALUES[idx] - UNIVERSAL_SLIDER_VALUES[idx - 1];
        }
        stepHint.textContent = `Sprung: +${formatNumberDE(stepSize)}`;
      }
    }
  },

  nudgeSlider(delta, unit = "", isScale10 = false) {
    const sliderEl = document.getElementById("playerSecretSliderInput");
    if (!sliderEl) return;
    const step = parseFloat(sliderEl.step) || 1;
    const min = parseFloat(sliderEl.min) || 0;
    const max = parseFloat(sliderEl.max) || 100;
    const current = parseFloat(sliderEl.value) || 0;
    const next = Math.min(max, Math.max(min, current + delta * step));
    sliderEl.value = next;

    const ts = this.timelineState;
    if (ts.rafId) {
      cancelAnimationFrame(ts.rafId);
      ts.rafId = null;
    }
    ts.floatIndex = next;
    sfx.click();
    this.updateSliderPreview(next, unit, isScale10);
    this.drawTimelineCanvas();
  },

  getCurrentSliderFormattedAnswer(sliderEl, sl) {
    const unit = sl && sl.unit ? sl.unit : "";
    if (isScale10Slider(sl)) {
      return `${formatNumberDE(sliderEl.value)}${unit}`;
    }
    const idx = Math.min(UNIVERSAL_SLIDER_VALUES.length - 1, Math.max(0, parseInt(sliderEl.value, 10) || 0));
    const actualVal = UNIVERSAL_SLIDER_VALUES[idx];
    return `${formatNumberDE(actualVal)}${unit}`;
  },

  clearCardBackFaceNeutral() {
    const backFace = document.getElementById("cardBackFace");
    if (!backFace) return;
    backFace.className = "card-face card-face-back surface-card p-7 flex flex-col items-center justify-center text-center";
    backFace.innerHTML = `
      <div class="space-y-3 opacity-50">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
          <i class="fa-solid fa-shield-halved text-xl"></i>
        </div>
        <div class="text-xs font-medium text-zinc-400">Karte wird versiegelt…</div>
      </div>
    `;
  },

  preparePassScreen() {
    const idx = this.state.passIndex;
    const player = this.state.players[idx];
    const total = this.state.playerCount;

    this.state.cardFlipped = false;
    const cardInner = document.getElementById("roleCardInner");
    cardInner.classList.remove("is-flipped");

    // Keep back face completely neutral until the player actually clicks to flip!
    this.clearCardBackFaceNeutral();

    document.getElementById("passPlayerAvatar").textContent = idx + 1;
    document.getElementById("passPlayerName").textContent = player.name;
    document.getElementById("passProgressBadge").textContent = `${idx + 1} / ${total}`;
    document.getElementById("cardFrontPlayerTitle").textContent = player.name;
  },

  // Dynamically scales down long words or hints so they never overflow their container
  fitAdaptiveWordElements(rootEl = document) {
    const elements = rootEl.querySelectorAll("[data-adaptive-word]");
    elements.forEach(el => {
      const maxFontPx = parseInt(el.getAttribute("data-max-font") || "34", 10);
      const minFontPx = parseInt(el.getAttribute("data-min-font") || "14", 10);
      const text = (el.textContent || "").trim();
      const words = text.split(/\s+/);
      const longestToken = words.reduce((m, w) => Math.max(m, w.length), 0);

      // Initial heuristic based on character count
      let size = maxFontPx;
      if (longestToken > 20 || text.length > 26) size = Math.max(minFontPx, Math.round(maxFontPx * 0.56));
      else if (longestToken > 15 || text.length > 20) size = Math.max(minFontPx, Math.round(maxFontPx * 0.68));
      else if (longestToken > 11 || text.length > 14) size = Math.max(minFontPx, Math.round(maxFontPx * 0.82));

      el.style.fontSize = `${size}px`;

      // Fine-tune with actual DOM measurement
      let guard = 24;
      while (guard > 0 && size > minFontPx && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 8)) {
        size -= 1;
        el.style.fontSize = `${size}px`;
        guard--;
      }
    });
  },

  renderCardBackContent(playerIdx) {
    const round = this.state.currentRound;
    const isImposter = round.imposterIndices.has(playerIdx);
    const backFace = document.getElementById("cardBackFace");
    const isLastPlayer = playerIdx === this.state.playerCount - 1;
    const nextBtnText = isLastPlayer ? "Runde beginnen" : "Verbergen & weitergeben";

    if (round.mode === "word") {
      if (isImposter) {
        backFace.className = "card-face card-face-back surface-card p-7 flex flex-col justify-between text-center border border-rose-500/40";
        backFace.innerHTML = `
          <div class="flex items-center justify-between text-[11px] font-mono-num text-rose-400 uppercase tracking-widest gap-2">
            <span class="shrink-0">Geheimrolle</span>
            <span class="truncate">${this.state.showImposterCategory ? round.categoryName : "Verdeckt"}</span>
          </div>

          <div class="my-auto space-y-5 w-full min-w-0">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <i class="fa-solid fa-user-secret text-2xl"></i>
            </div>

            <div class="space-y-1">
              <div class="text-[11px] font-semibold uppercase tracking-widest text-rose-400">Tarnung</div>
              <h2 class="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                IMPOSTER
              </h2>
              <p class="pass-hint-text text-xs text-zinc-400 max-w-[230px] mx-auto">
                Du kennst das geheime Wort der Gruppe nicht.
              </p>
            </div>

            ${
              this.state.showImposterHint
                ? `<div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 w-full overflow-hidden">
                    <div class="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400">Dein Hinweis-Wort</div>
                    <div data-adaptive-word data-max-font="26" data-min-font="14" class="adaptive-word-fit font-display font-bold text-white tracking-tight min-h-[2.25rem]">${round.hint}</div>
                  </div>`
                : `<div class="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-zinc-500">
                    Modus: Ohne Hinweis-Wort
                  </div>`
            }
          </div>

          <button onclick="app.nextPlayerCard()" class="w-full py-3.5 rounded-2xl btn-accent text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0">
            <span>${nextBtnText}</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        `;
      } else {
        backFace.className = "card-face card-face-back surface-card p-7 flex flex-col justify-between text-center";
        backFace.innerHTML = `
          <div class="flex items-center justify-between text-[11px] font-mono-num text-zinc-400 uppercase tracking-widest gap-2">
            <span class="shrink-0">Crew</span>
            <span class="truncate">${round.categoryName}</span>
          </div>

          <div class="my-auto space-y-5 w-full min-w-0">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <i class="fa-solid ${round.categoryIcon} text-2xl"></i>
            </div>

            <div class="space-y-2 w-full">
              <div class="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">Geheimes Wort</div>
              <div class="w-full py-3.5 px-4 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <div data-adaptive-word data-max-font="34" data-min-font="15" class="adaptive-word-fit font-display font-extrabold text-white tracking-tight min-h-[2.75rem]">
                  ${round.word}
                </div>
              </div>
            </div>

            <p class="pass-hint-text text-xs text-zinc-400 max-w-[240px] mx-auto leading-relaxed">
              Nenne in der Runde ein passendes Wort, ohne es dem Imposter zu leicht zu machen.
            </p>
          </div>

          <button onclick="app.nextPlayerCard()" class="w-full py-3.5 rounded-2xl btn-primary text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0">
            <span>${nextBtnText}</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        `;
      }
      requestAnimationFrame(() => this.fitAdaptiveWordElements(backFace));
    } else {
      const assignedQuestion = isImposter ? round.impQ : round.mainQ;
      const sl = round.slider;

      let inputControlHTML = "";
      if (this.state.collectWrittenAnswers) {
        if (sl) {
          const safeUnit = (sl.unit || "").replace(/'/g, "\\'");
          const scale10 = isScale10Slider(sl);
          if (scale10) {
            const startVal = sl.default || 5;
            inputControlHTML = `
              <div onclick="event.stopPropagation()" class="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 sm:space-y-2.5 text-left">
                <div class="flex items-center justify-between gap-2">
                  <div class="min-w-0">
                    <span class="text-[11px] font-semibold text-zinc-300 block">Zeitstrahl (Skala 1–10)</span>
                    <span class="text-[10px] text-zinc-500">Nach links/rechts schieben</span>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button type="button" onclick="app.nudgeSlider(-1, '${safeUnit}', true)" class="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[10px] text-white shrink-0">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                    <span id="sliderLiveValue" class="font-mono-num font-bold text-base sm:text-lg text-white px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 min-w-[64px] text-center">
                      ${formatNumberDE(startVal)}${sl.unit || ""}
                    </span>
                    <button type="button" onclick="app.nudgeSlider(1, '${safeUnit}', true)" class="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[10px] text-white shrink-0">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>

                <input id="playerSecretSliderInput" type="hidden" min="1" max="10" step="1" value="${startVal}" />

                <div id="timelineSliderViewport" class="timeline-slider-viewport">
                  <canvas id="timelineSliderCanvas" class="w-full h-full block"></canvas>
                  <div class="timeline-edge-fade"></div>
                  <div class="timeline-center-marker">
                    <div class="timeline-center-triangle-top"></div>
                    <div class="timeline-center-line"></div>
                  </div>
                </div>
              </div>
            `;
          } else {
            // Universal Progressive Timeline Slider: identical range (0 .. 1 Mrd.) with center needle
            const startIdx = findClosestUniversalIndex(25);
            const startVal = UNIVERSAL_SLIDER_VALUES[startIdx];
            inputControlHTML = `
              <div onclick="event.stopPropagation()" class="p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 sm:space-y-2.5 text-left">
                <div class="flex items-center justify-between gap-2">
                  <div class="min-w-0">
                    <span class="text-[11px] font-semibold text-zinc-300 block">Zeitstrahl-Schätzung</span>
                    <span id="sliderStepHintLabel" class="text-[10px] font-mono-num text-zinc-400">Sprung: +1</span>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button type="button" onclick="app.nudgeSlider(-1, '${safeUnit}', false)" class="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[10px] text-white shrink-0" title="Einen Schritt zurück">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                    <span id="sliderLiveValue" class="font-mono-num font-bold text-base sm:text-lg text-white px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 min-w-[76px] text-center">
                      ${formatNumberDE(startVal)}${sl.unit || ""}
                    </span>
                    <button type="button" onclick="app.nudgeSlider(1, '${safeUnit}', false)" class="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-[10px] text-white shrink-0" title="Einen Schritt vor">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>

                <input id="playerSecretSliderInput" type="hidden" min="0" max="${UNIVERSAL_SLIDER_VALUES.length - 1}" step="1" value="${startIdx}" />

                <div id="timelineSliderViewport" class="timeline-slider-viewport">
                  <canvas id="timelineSliderCanvas" class="w-full h-full block"></canvas>
                  <div class="timeline-edge-fade"></div>
                  <div class="timeline-center-marker">
                    <div class="timeline-center-triangle-top"></div>
                    <div class="timeline-center-line"></div>
                  </div>
                </div>

                <div class="flex justify-between items-center text-[10px] text-zinc-500">
                  <span><i class="fa-solid fa-arrows-left-right mr-1"></i>Zeitstrahl verschieben</span>
                  <span class="font-mono-num">0 → 1 Mrd.</span>
                </div>
              </div>
            `;
          }
        } else {
          inputControlHTML = `
            <div class="text-left space-y-1.5">
              <label class="text-[11px] font-medium text-zinc-400 block">Deine Antwort einloggen</label>
              <input id="playerSecretAnswerInput" type="text" placeholder="Kurze Antwort eingeben..."
                class="w-full bg-black/45 border border-white/15 rounded-xl px-3.5 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/40" />
            </div>
          `;
        }
      } else {
        inputControlHTML = `<p class="text-xs text-zinc-400">Merke dir deine Antwort für die Diskussionsrunde.</p>`;
      }

      backFace.className = "card-face card-face-back surface-card p-5 sm:p-7 flex flex-col justify-between text-center";
      backFace.innerHTML = `
        <div class="flex items-center justify-between text-[11px] font-mono-num text-zinc-400 uppercase tracking-widest gap-2 shrink-0">
          <span class="shrink-0">${sl ? "Schätz-Duell" : "Fragen-Duell"}</span>
          <span class="truncate hidden sm:inline">${round.categoryName}</span>
        </div>

        <div class="my-auto space-y-3 w-full min-w-0">
          <div class="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-left">
            <div class="text-[10px] font-mono-num uppercase tracking-widest text-zinc-400">Deine Frage</div>
            <h3 class="question-readable text-base sm:text-xl text-white leading-snug">
              ${assignedQuestion}
            </h3>
          </div>

          ${inputControlHTML}
        </div>

        <button onclick="app.nextPlayerCard()" class="w-full py-3.5 rounded-2xl btn-primary text-xs sm:text-sm flex items-center justify-center gap-2 shrink-0">
          <span>${nextBtnText}</span>
          <i class="fa-solid fa-arrow-right text-xs"></i>
        </button>
      `;

      if (this.state.collectWrittenAnswers && sl) {
        const scale10 = isScale10Slider(sl);
        const initIdx = scale10 ? (sl.default || 5) : findClosestUniversalIndex(25);
        requestAnimationFrame(() => {
          this.initTimelineSlider(scale10, initIdx, sl.unit || "");
        });
      }
    }
  },

  flipCard(open) {
    if (this.state.cardTransitionBusy || this.state.cardFlipped === open) return;
    sfx.flip();
    if (open) {
      // Render the current player's secret role ONLY now when they actively flip the card open
      this.renderCardBackContent(this.state.passIndex);
    }
    this.state.cardFlipped = open;
    const cardInner = document.getElementById("roleCardInner");
    cardInner.classList.toggle("is-flipped", open);
  },

  nextPlayerCard() {
    if (this.state.cardTransitionBusy) return;
    sfx.click();
    const round = this.state.currentRound;
    if (round.mode === "question" && this.state.collectWrittenAnswers) {
      const sliderInp = document.getElementById("playerSecretSliderInput");
      const textInp = document.getElementById("playerSecretAnswerInput");

      if (sliderInp) {
        this.state.players[this.state.passIndex].answer = this.getCurrentSliderFormattedAnswer(sliderInp, round.slider);
      } else if (textInp) {
        const val = textInp.value.trim();
        if (!val) {
          this.showToast("Bitte gib kurz deine Antwort ein", "fa-pen");
          textInp.focus();
          return;
        }
        this.state.players[this.state.passIndex].answer = val;
      }
    }

    if (this.state.passIndex < this.state.playerCount - 1) {
      this.state.cardTransitionBusy = true;
      this.state.passIndex++;

      // Step 1: Immediately wipe the back face to neutral BEFORE rotating back,
      // so neither the current role nor the next player's role is visible while closing!
      this.clearCardBackFaceNeutral();
      this.state.cardFlipped = false;
      const cardInner = document.getElementById("roleCardInner");
      cardInner.classList.remove("is-flipped");

      // Step 2: Update front player details once the front side rotates into view
      setTimeout(() => {
        const idx = this.state.passIndex;
        const player = this.state.players[idx];
        const total = this.state.playerCount;
        document.getElementById("passPlayerAvatar").textContent = idx + 1;
        document.getElementById("passPlayerName").textContent = player.name;
        document.getElementById("passProgressBadge").textContent = `${idx + 1} / ${total}`;
        document.getElementById("cardFrontPlayerTitle").textContent = player.name;
      }, 260);

      setTimeout(() => {
        this.state.cardTransitionBusy = false;
      }, 580);
    } else {
      this.startDiscussionPhase();
    }
  },

  startDiscussionPhase() {
    const round = this.state.currentRound;
    const starter = this.state.players[round.starterIndex];

    const discView = document.getElementById("view-discussion");
    discView.dataset.mode = round.mode;
    discView.dataset.revealed = "false";

    document.getElementById("starterPlayerName").textContent = starter.name;
    document.getElementById("resolutionBox").classList.add("hidden");
    document.getElementById("revealImposterBtn").classList.remove("hidden");
    document.getElementById("postRevealActions").classList.add("hidden");

    const answersBoard = document.getElementById("collectedAnswersBoard");
    const majBanner = document.getElementById("majorityQuestionBanner");
    const majBtn = document.getElementById("revealMajorityQBtn");

    const headline = document.getElementById("discussionHeadline");
    // Fallback-Element, damit eine ältere zwischengespeicherte Oberfläche nie das Spiel blockiert
    const kicker = document.getElementById("discussionKicker") || document.createElement("div");

    if (round.mode === "question") {
      // Die Frage der Crew steht groß oben – sie ist die Grundlage der Diskussion
      const len = round.mainQ.length;
      const sizeCls = len <= 70 ? "text-xl sm:text-[1.75rem]" : len <= 110 ? "text-lg sm:text-2xl" : "text-base sm:text-xl";
      headline.className = `question-readable ${sizeCls} text-white leading-snug`;
      headline.textContent = round.mainQ;
      kicker.classList.remove("hidden");
      kicker.classList.add("flex");
      document.getElementById("discussionSubtext").textContent =
        "Einer von euch hatte eine andere Frage. Wessen Antwort passt nicht dazu? Jeder muss seine Antwort verteidigen!";
      answersBoard.classList.remove("hidden");
      // Die Frage steht jetzt als Überschrift, das zusätzliche Banner wird nicht mehr gebraucht
      document.getElementById("majorityQuestionText").textContent = round.mainQ;
      majBanner.classList.add("hidden");
      majBtn.classList.add("hidden");

      const grid = document.getElementById("answersListGrid");
      grid.innerHTML = "";
      this.state.players.forEach((p, i) => {
        const box = document.createElement("button");
        box.type = "button";
        box.title = "Ganze Antwort anzeigen";
        box.onclick = () => this.showAnswerDetail(i);
        box.className = "text-left px-2 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-black/30 border border-white/10 hover:border-white/30 active:scale-[0.98] transition-all flex items-center justify-between gap-2 sm:flex-col sm:items-start sm:justify-center sm:gap-0.5 min-w-0";
        box.innerHTML = `
          <div class="text-[11px] sm:text-xs font-medium text-zinc-400 truncate min-w-0 max-w-full">${i + 1}. ${this.escapeHTML(p.name)}</div>
          <div class="${round.slider ? "font-mono-num font-bold text-xs sm:text-lg" : "font-semibold text-xs sm:text-sm leading-snug"} text-white shrink-0 max-w-[60%] sm:max-w-full truncate">
            ${p.answer ? this.escapeHTML(p.answer) : "<span class='text-zinc-500 text-xs'>Mündlich</span>"}
          </div>
        `;
        grid.appendChild(box);
      });
    } else {
      headline.className = "font-display text-lg sm:text-3xl font-extrabold text-white tracking-tight leading-tight";
      kicker.classList.add("hidden");
      kicker.classList.remove("flex");
      document.getElementById("discussionHeadline").textContent = "Wer kennt das Wort nicht?";
      document.getElementById("discussionSubtext").textContent =
        "Jeder nennt reihum ein Wort als Assoziation. Wer orientiert sich nur am subtilen Hinweis-Wort?";
      answersBoard.classList.add("hidden");
      majBanner.classList.add("hidden");
    }

    this.renderSuspectVoting();

    const timerCtrl = document.getElementById("timerControlButtons");
    const timerDisp = document.getElementById("timerDisplay");
    if (this.state.timerMinutes === 0) {
      this.stopTimer();
      timerDisp.textContent = "Kein Limit";
      timerDisp.className = "font-display text-xl sm:text-3xl font-bold text-zinc-300 sm:mt-1";
      timerCtrl.classList.add("hidden");
    } else {
      timerCtrl.classList.remove("hidden");
      this.startTimer(this.state.timerMinutes * 60);
    }

    this.switchView("view-discussion");
  },

  // Ganze (ggf. abgeschnittene) Antwort eines Spielers im Pop-up zeigen
  showAnswerDetail(idx) {
    const p = this.state.players[idx];
    const round = this.state.currentRound;
    if (!p || !round) return;
    sfx.click();
    document.getElementById("answerDetailAvatar").textContent = idx + 1;
    document.getElementById("answerDetailName").textContent = p.name;
    document.getElementById("answerDetailText").textContent = p.answer || "Mündlich beantwortet";
    document.getElementById("answerDetailQuestion").textContent = round.mainQ || "";
    this.animateOpenModal("answerDetailModal");
  },

  revealMajorityQuestionOnly() {
    sfx.success();
    document.getElementById("majorityQuestionBanner").classList.remove("hidden");
    document.getElementById("revealMajorityQBtn").classList.add("hidden");
  },

  renderSuspectVoting() {
    const grid = document.getElementById("suspectVotingGrid");
    grid.innerHTML = "";
    const round = this.state.currentRound;

    this.state.players.forEach((p, idx) => {
      const isImp = round.revealed && round.imposterIndices.has(idx);
      const card = document.createElement("button");
      card.type = "button";
      card.onclick = () => this.voteSuspect(idx);
      card.className = `p-1.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center justify-between gap-1.5 min-w-0 ${
        isImp
          ? "bg-rose-500/20 border-rose-500/50"
          : p.votes > 0
          ? "bg-white/10 border-white/30"
          : "bg-black/25 border-white/5 hover:border-white/15"
      }`;

      card.innerHTML = `
        <div class="truncate pr-1 min-w-0">
          <div class="font-semibold text-xs sm:text-sm text-white truncate">${p.name}</div>
          <div class="text-[10px] text-zinc-400 ${isImp ? "" : "hidden sm:block"}">${
            isImp ? "<span class='text-rose-400 font-bold'>IMPOSTER</span>" : "Stimme"
          }</div>
        </div>
        <div class="font-mono-num px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl font-bold text-xs shrink-0 ${
          p.votes > 0 ? "bg-white text-black" : "bg-white/5 text-zinc-500"
        }">
          ${p.votes}
        </div>
      `;
      grid.appendChild(card);
    });
  },

  voteSuspect(idx) {
    sfx.click();
    this.state.players[idx].votes = (this.state.players[idx].votes + 1) % (this.state.playerCount + 1);
    this.renderSuspectVoting();
  },

  startTimer(seconds) {
    this.stopTimer();
    this.state.timerSecondsLeft = seconds;
    this.state.timerPaused = false;
    this.updateTimerUI();

    this.state.timerInterval = setInterval(() => {
      if (!this.state.timerPaused && this.state.timerSecondsLeft > 0) {
        this.state.timerSecondsLeft--;
        this.updateTimerUI();
        if (this.state.timerSecondsLeft === 0) {
          sfx.imposterReveal();
          this.showToast("Zeit abgelaufen – jetzt abstimmen!", "fa-bell");
        }
      }
    }, 1000);
  },

  stopTimer() {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
      this.state.timerInterval = null;
    }
  },

  toggleTimer() {
    sfx.click();
    this.state.timerPaused = !this.state.timerPaused;
    const btn = document.getElementById("timerToggleBtn");
    btn.innerHTML = this.state.timerPaused
      ? `<i class="fa-solid fa-play"></i><span>Weiter</span>`
      : `<i class="fa-solid fa-pause"></i><span>Pause</span>`;
  },

  addTimerSeconds(sec) {
    if (this.state.timerMinutes === 0) return;
    sfx.click();
    this.state.timerSecondsLeft += sec;
    this.updateTimerUI();
  },

  updateTimerUI() {
    const mins = Math.floor(this.state.timerSecondsLeft / 60);
    const secs = this.state.timerSecondsLeft % 60;
    const el = document.getElementById("timerDisplay");
    el.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    el.className =
      this.state.timerSecondsLeft <= 15
        ? "font-mono-num text-2xl sm:text-5xl font-bold text-rose-400 tracking-tight sm:mt-0.5 animate-pulse"
        : "font-mono-num text-2xl sm:text-5xl font-bold text-white tracking-tight sm:mt-0.5";
  },

  revealRoundResult() {
    sfx.imposterReveal();
    this.stopTimer();
    const round = this.state.currentRound;
    round.revealed = true;
    document.getElementById("view-discussion").dataset.revealed = "true";

    const impNames = Array.from(round.imposterIndices).map(i => this.state.players[i].name);
    const box = document.getElementById("resolutionBox");
    box.classList.remove("hidden");

    if (round.mode === "word") {
      box.innerHTML = `
        <div class="hidden sm:flex items-center justify-between text-[11px] font-mono-num text-zinc-400 uppercase tracking-widest gap-2">
          <span class="shrink-0">Auflösung</span>
          <span class="truncate">${round.categoryName}</span>
        </div>
        <div>
          <div class="text-xs text-zinc-400">Imposter (${impNames.length})</div>
          <div class="font-display text-lg sm:text-2xl font-extrabold text-rose-400 break-words">${impNames.join(" & ")}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1">
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <div class="text-[10px] font-mono-num uppercase text-zinc-400">Wort</div>
            <div data-adaptive-word data-max-font="18" data-min-font="12" class="adaptive-word-fit font-display font-bold text-white mt-0.5 justify-start text-left">${round.word}</div>
          </div>
          <div class="p-3 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <div class="text-[10px] font-mono-num uppercase text-zinc-400">Hinweis-Wort</div>
            <div data-adaptive-word data-max-font="18" data-min-font="12" class="adaptive-word-fit font-display font-bold text-white mt-0.5 justify-start text-left">${round.hint}</div>
          </div>
        </div>
        <div class="flex gap-2 sm:pt-2">
          <button onclick="app.awardPoints('crew')" class="flex-1 py-2 sm:py-2.5 px-3 rounded-xl pill-button text-xs font-semibold text-white">
            +1 Crew-Sieg
          </button>
          <button onclick="app.awardPoints('imposter')" class="flex-1 py-2 sm:py-2.5 px-3 rounded-xl pill-button text-xs font-semibold text-rose-300">
            +2 Imposter-Sieg
          </button>
        </div>
      `;
      requestAnimationFrame(() => this.fitAdaptiveWordElements(box));
    } else {
      document.getElementById("revealMajorityQBtn").classList.add("hidden");

      // Antworten der Imposter in der Liste markieren
      [...document.getElementById("answersListGrid").children].forEach((box, i) => {
        if (!round.imposterIndices.has(i)) return;
        box.classList.remove("bg-black/30", "border-white/10");
        box.classList.add("bg-rose-500/15", "border-rose-500/50");
        const nameEl = box.firstElementChild;
        if (nameEl) nameEl.innerHTML += ' <span class="text-rose-400 font-bold">· Imposter</span>';
      });

      const factHTML = round.fact
        ? `
          <div class="p-2 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 sm:space-y-1.5 text-left">
            <div class="flex items-center gap-1.5 text-[10px] font-mono-num uppercase text-emerald-300 font-bold">
              <i class="fa-solid fa-circle-check"></i>
              <span>Richtige Lösung / Fakten-Check</span>
            </div>
            <div class="text-[11px] sm:text-xs leading-snug text-white font-semibold">${round.fact.main}</div>
            ${
              round.fact.imp
                ? `<div class="text-[10px] sm:text-[11px] leading-snug text-zinc-300 pt-1 border-t border-white/10">
                    <span class="text-rose-300 font-semibold">Lösung Imposter-Frage:</span> ${round.fact.imp}
                  </div>`
                : ""
            }
          </div>
        `
        : "";

      box.innerHTML = `
        <div class="hidden sm:flex items-center justify-between text-[11px] font-mono-num text-zinc-400 uppercase tracking-widest gap-2">
          <span class="shrink-0">Auflösung</span>
          <span class="truncate">${round.categoryName}</span>
        </div>
        <div>
          <div class="text-xs text-zinc-400">Imposter</div>
          <div class="font-display text-lg sm:text-2xl font-extrabold text-rose-400 break-words">${impNames.join(" & ")}</div>
        </div>
        <div class="space-y-1.5 sm:space-y-2 sm:pt-1 text-left">
          <div class="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10">
            <div class="text-[10px] font-mono-num uppercase text-zinc-400">Frage der Crew</div>
            <div class="font-medium text-[11px] sm:text-xs leading-snug text-white mt-0.5">${round.mainQ}</div>
          </div>
          <div class="p-2 sm:p-3 rounded-xl bg-rose-500/10 border border-rose-500/25">
            <div class="text-[10px] font-mono-num uppercase text-rose-300">Frage des Imposters</div>
            <div class="font-medium text-[11px] sm:text-xs leading-snug text-white mt-0.5">${round.impQ}</div>
          </div>
          ${factHTML}
        </div>
        <div class="flex gap-2 sm:pt-2">
          <button onclick="app.awardPoints('crew')" class="flex-1 py-2 sm:py-2.5 px-3 rounded-xl pill-button text-xs font-semibold text-white">
            +1 Crew-Sieg
          </button>
          <button onclick="app.awardPoints('imposter')" class="flex-1 py-2 sm:py-2.5 px-3 rounded-xl pill-button text-xs font-semibold text-rose-300">
            +2 Imposter-Sieg
          </button>
        </div>
      `;
    }

    document.getElementById("revealImposterBtn").classList.add("hidden");
    document.getElementById("postRevealActions").classList.remove("hidden");
    this.state.roundActiveLocked = false;
    this.updateVaultMenuLockUI();
    this.renderSuspectVoting();
  },

  awardPoints(winnerTeam) {
    sfx.success();
    const round = this.state.currentRound;
    if (!round) return;

    this.state.players.forEach((p, idx) => {
      const isImp = round.imposterIndices.has(idx);
      if (winnerTeam === "imposter" && isImp) {
        p.score += 2;
      } else if (winnerTeam === "crew" && !isImp) {
        p.score += 1;
      }
    });

    this.renderScoreboard();
    this.savePersistentState();
    this.showToast(winnerTeam === "imposter" ? "+2 Punkte für Imposter verbucht" : "+1 Punkt für Crew verbucht", "fa-trophy");
  },

  animateOpenModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    const card = modal.firstElementChild;
    modal.classList.remove("hidden", "modal-backdrop-animate-out");
    modal.classList.add("modal-backdrop-animate-in");
    if (card) {
      card.classList.remove("view-enter", "modal-card-animate-out");
      void card.offsetWidth;
      card.classList.add("modal-card-animate-in");
    }
  },

  openModal(id) {
    if (id === "dbModal") {
      this.requestOpenVault("words");
      return;
    }
    sfx.click();
    if (id === "scoreModal") this.renderScoreboard();
    if (id === "timerModal") this.renderTimerPresets();
    if (id === "themeModal") this.applyAppearanceUI();
    this.animateOpenModal(id);
  },

  closeModal(id, callback) {
    sfx.click();
    const modal = document.getElementById(id);
    if (!modal || modal.classList.contains("hidden")) {
      if (callback) callback();
      return;
    }
    const card = modal.firstElementChild;
    modal.classList.remove("modal-backdrop-animate-in");
    modal.classList.add("modal-backdrop-animate-out");
    if (card) {
      card.classList.remove("modal-card-animate-in", "view-enter");
      card.classList.add("modal-card-animate-out");
    }
    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("modal-backdrop-animate-out");
      if (card) card.classList.remove("modal-card-animate-out");
      if (callback) callback();
    }, 210);
  },

  closeVaultModal() {
    // Auto-lock the vault when closing so subsequent players cannot peek without the password
    this.state.vaultUnlocked = false;
    this.closeModal("dbModal");
  },

  requestOpenVault(targetTab = "words") {
    sfx.click();
    if (this.isRoundCurrentlyProtected()) {
      this.showToast("Tresor ist während einer laufenden Runde komplett gesperrt!", "fa-lock");
      return;
    }

    this.state.pendingVaultTab = targetTab;
    const passInput = document.getElementById("vaultPasswordInput");
    const confInput = document.getElementById("vaultPasswordConfirmInput");
    const confWrap = document.getElementById("vaultPassConfirmWrap");
    const title = document.getElementById("vaultAuthTitle");
    const sub = document.getElementById("vaultAuthSubtitle");
    const desc = document.getElementById("vaultAuthDescription");
    const submitBtn = document.getElementById("vaultAuthSubmitBtn");
    const label1 = document.getElementById("vaultPassLabel1");

    passInput.value = "";
    confInput.value = "";

    if (!this.state.vaultPasswordHash) {
      this.state.vaultAuthMode = "setup";
      title.textContent = "Tresor-Passwort festlegen";
      sub.textContent = "Erstmalige Verschlüsselung einrichten";
      desc.textContent = "Lege beim ersten Öffnen ein Passwort fest. Damit wird der Wörter- & Fragen-Tresor verschlüsselt, sodass kein Mitspieler heimlich nachschauen kann.";
      label1.textContent = "Neues Tresor-Passwort";
      confWrap.classList.remove("hidden");
      submitBtn.textContent = "Passwort speichern & öffnen";
    } else {
      this.state.vaultAuthMode = "unlock";
      title.textContent = "Tresor entsperren";
      sub.textContent = "Passwortgeschützter Bereich";
      desc.textContent = "Gib das festgelegte Tresor-Passwort ein, um Wörter, Hinweise und Fragen einzusehen oder zu bearbeiten.";
      label1.textContent = "Tresor-Passwort";
      confWrap.classList.add("hidden");
      submitBtn.textContent = "Entsperren";
    }

    this.animateOpenModal("vaultAuthModal");
    setTimeout(() => passInput.focus(), 80);
  },

  changeVaultPasswordPrompt() {
    sfx.click();
    this.state.vaultAuthMode = "change";
    const passInput = document.getElementById("vaultPasswordInput");
    const confInput = document.getElementById("vaultPasswordConfirmInput");
    const confWrap = document.getElementById("vaultPassConfirmWrap");
    passInput.value = "";
    confInput.value = "";
    document.getElementById("vaultAuthTitle").textContent = "Tresor-Passwort ändern";
    document.getElementById("vaultAuthSubtitle").textContent = "Neuen Schlüssel festlegen";
    document.getElementById("vaultAuthDescription").textContent = "Gib ein neues Passwort für die Verschlüsselung des Tresors ein.";
    document.getElementById("vaultPassLabel1").textContent = "Neues Passwort";
    confWrap.classList.remove("hidden");
    document.getElementById("vaultAuthSubmitBtn").textContent = "Passwort aktualisieren";
    this.animateOpenModal("vaultAuthModal");
    setTimeout(() => passInput.focus(), 80);
  },

  submitVaultAuth() {
    const passInput = document.getElementById("vaultPasswordInput");
    const confInput = document.getElementById("vaultPasswordConfirmInput");
    const pw = passInput.value.trim();

    if (!pw) {
      this.showToast("Bitte ein Passwort eingeben", "fa-key");
      passInput.focus();
      return;
    }

    if (this.state.vaultAuthMode === "setup" || this.state.vaultAuthMode === "change") {
      const conf = confInput.value.trim();
      if (pw.length < 2) {
        this.showToast("Passwort muss mindestens 2 Zeichen lang sein", "fa-circle-exclamation");
        return;
      }
      if (pw !== conf) {
        this.showToast("Die Passwörter stimmen nicht überein", "fa-circle-exclamation");
        confInput.focus();
        return;
      }

      const hash = VaultCrypto.hashPassword(pw);
      this.state.vaultPasswordHash = hash;
      this.state.vaultSessionKey = pw;
      this.state.vaultUnlocked = true;
      try {
        localStorage.setItem("imposter_vault_pwhash", hash);
      } catch (e) {}
      this.saveEncryptedVaultToStorage();

      sfx.success();
      this.closeModal("vaultAuthModal", () => {
        this.showToast("Tresor-Passwort gespeichert & verschlüsselt", "fa-shield-halved");
        this.openUnlockedVault(this.state.pendingVaultTab);
      });
    } else {
      const hash = VaultCrypto.hashPassword(pw);
      if (hash !== this.state.vaultPasswordHash) {
        sfx.imposterReveal();
        this.showToast("Falsches Passwort – Zugriff verweigert!", "fa-lock");
        passInput.select();
        return;
      }

      this.state.vaultSessionKey = pw;
      this.state.vaultUnlocked = true;
      this.tryDecryptVaultFromStorage(pw);
      sfx.success();
      this.closeModal("vaultAuthModal", () => {
        this.openUnlockedVault(this.state.pendingVaultTab);
      });
    }
  },

  openUnlockedVault(tab = "words") {
    this.state.vaultSelectedCatId = null;
    this.populateVaultCategorySelects();
    this.switchDbTab(tab);
    this.animateOpenModal("dbModal");
  },

  getVaultCategoryList(tab = this.state.dbTab) {
    if (tab === "quiz") return QUIZ_CATEGORIES;
    if (tab === "questions") return QUESTION_CATEGORIES;
    return WORD_CATEGORIES;
  },

  populateVaultCategorySelects() {
    const wCat = WORD_CATEGORIES.find(c => c.id === this.state.globalWordTargetCatId) || WORD_CATEGORIES[0];
    this.state.globalWordTargetCatId = wCat.id;
    const wLbl = document.getElementById("customWordCategoryBtnLabel");
    if (wLbl) wLbl.textContent = wCat.name;

    const qCat = QUESTION_CATEGORIES.find(c => c.id === this.state.globalQuestionTargetCatId) || QUESTION_CATEGORIES[0];
    this.state.globalQuestionTargetCatId = qCat.id;
    const qLbl = document.getElementById("customQuestionCategoryBtnLabel");
    if (qLbl) qLbl.textContent = qCat.name;

    const zCat = QUIZ_CATEGORIES.find(c => c.id === this.state.globalQuizTargetCatId) || QUIZ_CATEGORIES[0];
    this.state.globalQuizTargetCatId = zCat ? zCat.id : null;
    const zLbl = document.getElementById("customQuizCategoryBtnLabel");
    if (zLbl && zCat) zLbl.textContent = zCat.name;

    const filterLbl = document.getElementById("dbCategoryFilterLabel");
    if (filterLbl) {
      const list = this.getVaultCategoryList();
      if (!this.state.vaultSelectedCatId) {
        filterLbl.textContent = `Kategorie-Übersicht (${list.length})`;
      } else {
        const found = list.find(c => c.id === this.state.vaultSelectedCatId);
        filterLbl.textContent = found ? found.name : `Kategorie-Übersicht (${list.length})`;
      }
    }
  },

  openVaultCategoryFilterPopup() {
    const tab = this.state.dbTab;
    const list = this.getVaultCategoryList();
    const options = [
      {
        value: "__overview__",
        label: `Kategorie-Übersicht (${list.length} Kategorien)`,
        sub: "Zeigt zuerst alle Kategorien übersichtlich als Kacheln",
        icon: "fa-grip"
      },
      ...list.map(c => ({
        value: c.id,
        label: c.name,
        sub: tab === "quiz" ? `${c.qs.length} Quizfragen` : tab === "questions" ? `${c.pairs.length} Fragen-Paare` : `${c.words.length} Wörter`,
        icon: c.icon
      }))
    ];

    this.openCustomSelectPopup({
      title: tab === "quiz" ? "Quiz-Kategorie wählen" : tab === "questions" ? "Fragen-Kategorie wählen" : "Wort-Kategorie wählen",
      subtitle: "Springe direkt in eine Kategorie oder zurück zur Übersicht",
      selectedValue: this.state.vaultSelectedCatId || "__overview__",
      options,
      onSelect: (val) => {
        this.selectVaultCategory(val === "__overview__" ? null : val);
      }
    });
  },

  openGlobalWordCatPopup() {
    this.openCustomSelectPopup({
      title: "Ziel-Kategorie für Wort",
      subtitle: "In welche Kategorie soll das neue Wort gespeichert werden?",
      selectedValue: this.state.globalWordTargetCatId,
      options: WORD_CATEGORIES.map(c => ({
        value: c.id,
        label: c.name,
        sub: `${c.words.length} Wörter`,
        icon: c.icon
      })),
      onSelect: (val) => {
        this.state.globalWordTargetCatId = val;
        this.populateVaultCategorySelects();
      }
    });
  },

  openGlobalQuestionCatPopup() {
    this.openCustomSelectPopup({
      title: "Ziel-Kategorie für Frage",
      subtitle: "In welche Fragen-Welt soll das Duell gespeichert werden?",
      selectedValue: this.state.globalQuestionTargetCatId,
      options: QUESTION_CATEGORIES.map(c => ({
        value: c.id,
        label: c.name,
        sub: `${c.pairs.length} Fragen-Duelle`,
        icon: c.icon
      })),
      onSelect: (val) => {
        this.state.globalQuestionTargetCatId = val;
        this.populateVaultCategorySelects();
      }
    });
  },

  openGlobalQuizCatPopup() {
    this.openCustomSelectPopup({
      title: "Ziel-Kategorie für Quizfrage",
      subtitle: "In welche Quiz-Kategorie soll die Frage gespeichert werden?",
      selectedValue: this.state.globalQuizTargetCatId,
      options: QUIZ_CATEGORIES.map(c => ({
        value: c.id,
        label: c.name,
        sub: `${c.qs.length} Quizfragen`,
        icon: c.icon
      })),
      onSelect: (val) => {
        this.state.globalQuizTargetCatId = val;
        this.populateVaultCategorySelects();
      }
    });
  },

  selectVaultCategory(catId) {
    sfx.click();
    this.state.vaultSelectedCatId = catId;
    this.populateVaultCategorySelects();
    this.renderVaultList();
  },

  renderNewCategoryIcons() {
    const grid = document.getElementById("newCategoryIconGrid");
    if (!grid) return;
    grid.innerHTML = "";
    CATEGORY_ICONS.forEach(ic => {
      const active = this.state.newCategoryIcon === ic;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.onclick = () => {
        sfx.click();
        this.state.newCategoryIcon = ic;
        this.renderNewCategoryIcons();
      };
      btn.className = `h-10 rounded-xl border flex items-center justify-center transition-all ${
        active ? "bg-white text-black border-white" : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
      }`;
      btn.innerHTML = `<i class="fa-solid ${ic} text-sm"></i>`;
      grid.appendChild(btn);
    });
  },

  openCustomCategoryModal() {
    sfx.click();
    if (this.isRoundCurrentlyProtected()) {
      this.showToast("Während einer laufenden Runde gesperrt", "fa-lock");
      return;
    }
    const dbOpen = !document.getElementById("dbModal").classList.contains("hidden");
    let type = this.state.mode === "quiz" ? "quiz" : this.state.mode === "question" ? "question" : "word";
    if (dbOpen && this.state.dbTab === "quiz") type = "quiz";
    else if (dbOpen && this.state.dbTab === "questions") type = "question";
    else if (dbOpen && this.state.dbTab === "words") type = "word";
    this.setNewCategoryType(type);
    document.getElementById("newCategoryNameInput").value = "";
    document.getElementById("newCategoryBulkInput").value = "";
    this.renderNewCategoryIcons();
    this.animateOpenModal("customCategoryModal");
  },

  setNewCategoryType(type) {
    this.state.newCategoryType = type;
    const btns = {
      word: document.getElementById("newCatTypeWordBtn"),
      question: document.getElementById("newCatTypeQuestionBtn"),
      quiz: document.getElementById("newCatTypeQuizBtn")
    };
    const bulkArea = document.getElementById("newCategoryBulkInput");
    const sectionHeader = document.querySelector("#newCatInitialWordsSection span:first-child");
    const sectionHint = document.querySelector("#newCatInitialWordsSection span:last-child");

    Object.entries(btns).forEach(([key, btn]) => {
      if (!btn) return;
      btn.className = key === type
        ? "py-2 rounded-xl text-xs font-semibold bg-white text-black transition-all"
        : "py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-all";
    });

    if (type === "word") {
      if (sectionHeader) sectionHeader.textContent = "Erste Wörter hinzufügen (optional)";
      if (sectionHint) sectionHint.textContent = "Format: Wort ; Hinweis";
      if (bulkArea) bulkArea.placeholder = "Ein Paar pro Zeile, z.B.:\nEckball ; Kurve\nMeer ; Höhenunterschied\nStammtisch ; Glocke";
    } else if (type === "question") {
      if (sectionHeader) sectionHeader.textContent = "Erste Fragen-Paare hinzufügen (optional)";
      if (sectionHint) sectionHint.textContent = "Format: Hauptfrage ; Imposter-Frage";
      if (bulkArea) bulkArea.placeholder = "Ein Fragen-Duell pro Zeile, z.B.:\nWas ist deine Lieblingsstadt? ; Welche Stadt empfiehlst du nicht?";
    } else {
      if (sectionHeader) sectionHeader.textContent = "Erste Quizfragen hinzufügen (optional)";
      if (sectionHint) sectionHint.textContent = "Format: Frage ; Richtig ; Falsch ; Falsch ; Falsch";
      if (bulkArea) bulkArea.placeholder = "Eine Quizfrage pro Zeile, z.B.:\nWie heißt unser Stammlokal? ; Zur Linde ; Zum Hirsch ; Krone ; Adler";
    }
  },

  // Liest eine Quizfrage aus "Frage ; Richtig ; Falsch ; Falsch ; Falsch" (fehlende falsche Antworten werden aufgefüllt)
  parseQuizLine(line) {
    const parts = line.split(";").map(p => p.trim()).filter(Boolean);
    if (parts.length < 2) return null;
    const wrong = parts.slice(2, 5);
    const fillers = ["Keine Ahnung", "Weiß niemand", "Alle anderen"];
    let f = 0;
    while (wrong.length < 3) wrong.push(fillers[f++]);
    return [parts[0], parts[1], ...wrong];
  },

  saveNewCategory() {
    const nameInp = document.getElementById("newCategoryNameInput");
    const bulkInp = document.getElementById("newCategoryBulkInput");
    const name = nameInp.value.trim();

    if (!name) {
      this.showToast("Bitte gib einen Namen für die Kategorie ein", "fa-circle-exclamation");
      nameInp.focus();
      return;
    }

    const id = "custom_" + Date.now();
    const rawLines = bulkInp.value
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);

    if (this.state.newCategoryType === "word") {
      const parsedWords = [];
      rawLines.forEach(line => {
        const parts = line.includes(";") ? line.split(";") : line.split(",");
        const w = (parts[0] || "").trim();
        const h = (parts[1] || "Begriff").trim();
        if (w) parsedWords.push([w, h]);
      });
      if (parsedWords.length === 0) {
        parsedWords.push(["Geheimtipp", "Insider"]);
      }
      WORD_CATEGORIES.push({
        id,
        name,
        icon: this.state.newCategoryIcon,
        words: parsedWords
      });
      this.state.activeWordCats.add(id);
    } else if (this.state.newCategoryType === "question") {
      const parsedPairs = [];
      rawLines.forEach(line => {
        const parts = line.split(";");
        const mQ = (parts[0] || "").trim();
        const iQ = (parts[1] || "Was denkst du über das Gegenteil?").trim();
        if (mQ) parsedPairs.push([mQ, iQ]);
      });
      if (parsedPairs.length === 0) {
        parsedPairs.push([
          `Was verbindest du am meisten mit „${name}“?`,
          `Was nervt dich manchmal an „${name}“?`
        ]);
      }
      QUESTION_CATEGORIES.push({
        id,
        name,
        icon: this.state.newCategoryIcon,
        pairs: parsedPairs
      });
      this.state.activeQuestionCats.add(id);
    } else {
      const parsedQs = rawLines.map(l => this.parseQuizLine(l)).filter(Boolean);
      if (parsedQs.length === 0) {
        parsedQs.push([`Worum geht es in der Kategorie „${name}“?`, name, "Etwas anderes", "Nichts", "Alles"]);
      }
      QUIZ_CATEGORIES.push({
        id,
        name,
        icon: this.state.newCategoryIcon,
        qs: parsedQs
      });
      this.state.activeQuizCats.add(id);
    }

    this.saveEncryptedVaultToStorage();
    this.updateVaultCounts();
    this.populateVaultCategorySelects();
    this.renderCategoriesGrid();
    if (!document.getElementById("dbModal").classList.contains("hidden") && this.state.dbTab !== "custom") {
      this.renderVaultList();
    }
    sfx.success();
    this.closeModal("customCategoryModal", () => {
      this.showToast(`Kategorie „${name}“ wurde erstellt!`, "fa-folder-plus");
    });
  },

  applyAppearanceUI() {
    const themeName = this.state.theme || "obsidian";
    const resolvedColorMode = this.getResolvedColorMode();
    document.body.setAttribute("data-theme", themeName);
    document.body.setAttribute("data-color-mode", resolvedColorMode);

    // Update theme checkmarks
    ["obsidian", "emerald", "nordic", "amber", "mono"].forEach(t => {
      const chk = document.getElementById(`themeCheck_${t}`);
      if (chk) {
        chk.className = `fa-solid fa-check text-xs ${t === themeName ? "text-white" : "text-transparent"}`;
      }
    });

    // Update Theme Modal System / Dark / Light buttons
    const sysBtn = document.getElementById("themeModalSystemBtn");
    const darkBtn = document.getElementById("themeModalDarkBtn");
    const lightBtn = document.getElementById("themeModalLightBtn");
    const activeClass = "py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all bg-white text-black shadow-sm";
    const inactiveClass = "py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-zinc-400 hover:text-white";

    if (sysBtn && darkBtn && lightBtn) {
      sysBtn.className = this.state.colorMode === "system" ? activeClass : inactiveClass;
      darkBtn.className = this.state.colorMode === "dark" ? activeClass : inactiveClass;
      lightBtn.className = this.state.colorMode === "light" ? activeClass : inactiveClass;
    }

    // Sound UI
    const sIcon = document.getElementById("soundIcon");
    const sTxt = document.getElementById("soundStatusText");
    if (sIcon) sIcon.className = sfx.enabled ? "fa-solid fa-volume-high text-emerald-400" : "fa-solid fa-volume-xmark text-zinc-500";
    if (sTxt) sTxt.textContent = sfx.enabled ? "Aktiv" : "Stumm";
  },

  setColorMode(mode) {
    sfx.click();
    this.state.colorMode = (mode === "light" || mode === "dark") ? mode : "system";
    this.applyAppearanceUI();
    this.savePersistentState();
    const labelMap = {
      system: "Geräte-Modus (Automatisch) aktiviert",
      dark: "Black Mode aktiviert",
      light: "White Mode aktiviert"
    };
    const iconMap = {
      system: "fa-laptop-mobile",
      dark: "fa-moon",
      light: "fa-sun"
    };
    this.showToast(labelMap[this.state.colorMode], iconMap[this.state.colorMode]);
  },

  toggleColorMode() {
    const resolved = this.getResolvedColorMode();
    this.setColorMode(resolved === "light" ? "dark" : "light");
  },

  setTheme(themeName) {
    sfx.click();
    if (themeName === "light") {
      this.setColorMode("light");
      return;
    }
    this.state.theme = themeName;
    this.applyAppearanceUI();
    this.savePersistentState();
    this.closeModal("themeModal");
    this.showToast("Farbschema aktualisiert", "fa-swatchbook");
  },

  toggleSound() {
    sfx.enabled = !sfx.enabled;
    this.applyAppearanceUI();
    this.savePersistentState();
    if (sfx.enabled) sfx.click();
  },

  renderScoreboard() {
    const list = document.getElementById("scoreboardList");
    list.innerHTML = "";
    this.state.players.forEach((p, idx) => {
      const row = document.createElement("div");
      row.className = "p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2";
      row.innerHTML = `
        <div class="flex items-center gap-3 min-w-0">
          <span class="font-mono-num w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-zinc-300 shrink-0">${idx + 1}</span>
          <span class="font-semibold text-sm text-white truncate">${p.name}</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button onclick="app.adjustPlayerScore(${idx}, -1)" class="w-7 h-7 rounded-lg pill-button text-xs text-white">-</button>
          <span class="font-mono-num font-bold text-sm text-white w-7 text-center">${p.score}</span>
          <button onclick="app.adjustPlayerScore(${idx}, 1)" class="w-7 h-7 rounded-lg pill-button text-xs text-white">+</button>
        </div>
      `;
      list.appendChild(row);
    });
  },

  adjustPlayerScore(idx, delta) {
    sfx.click();
    this.state.players[idx].score = Math.max(0, this.state.players[idx].score + delta);
    this.renderScoreboard();
    this.savePersistentState();
  },

  resetScores() {
    sfx.click();
    this.state.players.forEach(p => (p.score = 0));
    this.renderScoreboard();
    this.savePersistentState();
    this.showToast("Punktestand zurückgesetzt", "fa-rotate-left");
  },

  switchDbTab(tab) {
    sfx.click();
    this.state.dbTab = tab;
    this.state.vaultSelectedCatId = null;
    const activeCls = "px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-black transition-all";
    const inactiveCls = "px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold pill-button text-zinc-300 transition-all";
    [["dbTabWords", "words"], ["dbTabQuestions", "questions"], ["dbTabQuiz", "quiz"], ["dbTabCustom", "custom"]].forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.className = tab === key ? activeCls : inactiveCls;
    });

    document.getElementById("dbFilterToolbar").classList.toggle("hidden", tab === "custom");
    const vaultContainer = document.getElementById("dbVaultContainer");
    const customCreator = document.getElementById("dbCustomCreator");
    vaultContainer.classList.toggle("hidden", tab === "custom");
    customCreator.classList.toggle("hidden", tab !== "custom");

    if (tab === "custom") {
      document.getElementById("dbCategoryDetailHeader").classList.add("hidden");
      customCreator.classList.remove("view-enter");
      void customCreator.offsetWidth;
      customCreator.classList.add("view-enter");
    } else {
      vaultContainer.classList.remove("view-enter");
      void vaultContainer.offsetWidth;
      vaultContainer.classList.add("view-enter");
    }
    this.populateVaultCategorySelects();
    if (tab !== "custom") this.renderVaultList();
  },

  renderVaultList() {
    const container = document.getElementById("dbVaultList");
    const detailHeader = document.getElementById("dbCategoryDetailHeader");
    const searchInput = document.getElementById("dbSearchInput");
    if (!container) return;

    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const tab = this.state.dbTab;
    const isWords = tab === "words";
    const isQuiz = tab === "quiz";
    const categories = this.getVaultCategoryList(tab);
    const selectedCatId = this.state.vaultSelectedCatId;
    const countOf = (cat) => (isQuiz ? cat.qs.length : isWords ? cat.words.length : cat.pairs.length);
    const unit = isQuiz ? "Fragen" : isWords ? "Wörter" : "Paare";

    container.innerHTML = "";

    // Show Category Overview Grid if no category is selected and search is empty
    if (!selectedCatId && !query) {
      detailHeader.classList.add("hidden");
      container.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5";

      categories.forEach(cat => {
        const count = countOf(cat);
        const card = document.createElement("button");
        card.type = "button";
        card.onclick = () => this.selectVaultCategory(cat.id);
        card.className = "p-3 sm:p-4 rounded-2xl pill-button text-left flex flex-col justify-between gap-2 sm:gap-3 group min-w-0";
        card.innerHTML = `
          <div class="flex items-center justify-between w-full">
            <div class="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white group-hover:text-black text-white flex items-center justify-center text-sm transition-colors">
              <i class="fa-solid ${cat.icon}"></i>
            </div>
            <span class="font-mono-num text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
              ${count} ${unit}
            </span>
          </div>
          <div class="flex items-center justify-between gap-2">
            <div class="font-semibold text-sm text-white truncate">${this.escapeHTML(cat.name)}</div>
            <i class="fa-solid fa-chevron-right text-[10px] text-zinc-500 group-hover:translate-x-0.5 transition-transform shrink-0"></i>
          </div>
        `;
        container.appendChild(card);
      });

      const newCatCard = document.createElement("button");
      newCatCard.type = "button";
      newCatCard.onclick = () => this.openCustomCategoryModal();
      newCatCard.className = "p-3 sm:p-4 rounded-2xl border border-dashed border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.06] text-left flex flex-col justify-between gap-2 sm:gap-3 group transition-all";
      newCatCard.innerHTML = `
        <div class="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-white group-hover:text-black text-white flex items-center justify-center text-sm transition-colors">
          <i class="fa-solid fa-plus"></i>
        </div>
        <div>
          <div class="font-semibold text-sm text-white">+ Eigene Kategorie</div>
          <div class="text-[11px] text-zinc-400">Neue Themenwelt anlegen</div>
        </div>
      `;
      container.appendChild(newCatCard);
      return;
    }

    // Show Category Detail Header if a category is selected
    if (selectedCatId) {
      const catObj = categories.find(c => c.id === selectedCatId);
      if (catObj) {
        detailHeader.classList.remove("hidden");
        document.getElementById("dbDetailCatIcon").className = `fa-solid ${catObj.icon} text-white text-sm`;
        document.getElementById("dbDetailCatTitle").textContent = catObj.name;
        document.getElementById("dbDetailCatCount").textContent = `${countOf(catObj)} ${isQuiz ? "Fragen" : isWords ? "Wörter" : "Fragen"}`;
        document.getElementById("dbDirectAddWordBar").classList.toggle("hidden", tab !== "words");
        document.getElementById("dbDirectAddQuestionBar").classList.toggle("hidden", tab !== "questions");
        document.getElementById("dbDirectAddQuizBar").classList.toggle("hidden", tab !== "quiz");
      } else {
        detailHeader.classList.add("hidden");
      }
    } else {
      detailHeader.classList.add("hidden");
    }

    container.className = isWords
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
      : isQuiz
      ? "grid grid-cols-1 sm:grid-cols-2 gap-2"
      : "grid grid-cols-1 gap-2";

    categories.forEach((cat, catIdx) => {
      if (selectedCatId && cat.id !== selectedCatId) return;

      if (isWords) {
        cat.words.forEach(([w, h], itemIdx) => {
          if (query && !w.toLowerCase().includes(query) && !h.toLowerCase().includes(query) && !cat.name.toLowerCase().includes(query)) {
            return;
          }
          const item = document.createElement("button");
          item.type = "button";
          item.onclick = () => this.openEditVaultItemModal("word", catIdx, itemIdx);
          item.className = "p-3 rounded-xl bg-black/30 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between gap-2 transition-all group min-w-0";
          item.innerHTML = `
            <div class="min-w-0">
              <div class="font-semibold text-xs text-white truncate">${this.escapeHTML(w)}</div>
              <div class="text-[11px] text-zinc-400 truncate">Hinweis: <span class="text-zinc-300">${this.escapeHTML(h)}</span></div>
            </div>
            <i class="fa-solid fa-pen text-[10px] text-zinc-500 group-hover:text-white shrink-0"></i>
          `;
          container.appendChild(item);
        });
      } else if (isQuiz) {
        cat.qs.forEach((q, itemIdx) => {
          const [question, right, ...wrong] = q;
          const hay = [question, right, ...wrong, cat.name].join(" ").toLowerCase();
          if (query && !hay.includes(query)) return;
          const item = document.createElement("button");
          item.type = "button";
          item.onclick = () => this.openEditVaultItemModal("quiz", catIdx, itemIdx);
          item.className = "p-3 rounded-xl bg-black/30 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between gap-3 transition-all group min-w-0";
          item.innerHTML = `
            <div class="space-y-1 min-w-0 flex-1">
              ${query ? `<span class="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300 max-w-full truncate inline-block">${this.escapeHTML(cat.name)}</span>` : ""}
              <div class="font-semibold text-xs text-white">${this.escapeHTML(question)}</div>
              <div class="text-[11px] text-emerald-300 font-semibold"><i class="fa-solid fa-check mr-1"></i>${this.escapeHTML(right)}</div>
              <div class="text-[11px] text-zinc-400 truncate">Falsch: ${wrong.map(x => this.escapeHTML(x)).join(" · ")}</div>
            </div>
            <i class="fa-solid fa-pen text-xs text-zinc-500 group-hover:text-white shrink-0"></i>
          `;
          container.appendChild(item);
        });
      } else {
        cat.pairs.forEach(([mQ, iQ, sl], itemIdx) => {
          if (query && !mQ.toLowerCase().includes(query) && !iQ.toLowerCase().includes(query) && !cat.name.toLowerCase().includes(query)) {
            return;
          }
          const item = document.createElement("button");
          item.type = "button";
          item.onclick = () => this.openEditVaultItemModal("question", catIdx, itemIdx);
          item.className = "p-3 sm:p-3.5 rounded-xl bg-black/30 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between gap-3 transition-all group min-w-0";
          item.innerHTML = `
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-300 max-w-full truncate">${this.escapeHTML(cat.name)}</span>
                ${sl ? `<span class="text-[10px] font-mono-num px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Slider</span>` : ""}
              </div>
              <div class="font-semibold text-xs text-white">${this.escapeHTML(mQ)}</div>
              <div class="text-[11px] text-rose-300/90">Imposter: ${this.escapeHTML(iQ)}</div>
            </div>
            <i class="fa-solid fa-pen text-xs text-zinc-500 group-hover:text-white shrink-0"></i>
          `;
          container.appendChild(item);
        });
      }
    });

    if (!container.children.length) {
      container.innerHTML = `<div class="col-span-full p-6 text-center text-xs text-zinc-400">Keine Einträge gefunden.</div>`;
    }
  },

  addDirectInSelectedCategory() {
    const catId = this.state.vaultSelectedCatId;
    if (!catId) return;

    if (this.state.dbTab === "words") {
      const cat = WORD_CATEGORIES.find(c => c.id === catId);
      if (!cat) return;
      const wInp = document.getElementById("directCatWordInput");
      const hInp = document.getElementById("directCatHintInput");
      const w = wInp.value.trim();
      const h = hInp.value.trim();
      if (!w || !h) {
        this.showToast("Bitte Wort und Ein-Wort-Hinweis eingeben", "fa-circle-exclamation");
        return;
      }
      cat.words.unshift([w, h]);
      wInp.value = "";
      hInp.value = "";
      this.saveEncryptedVaultToStorage();
      this.updateVaultCounts();
      this.renderVaultList();
      this.renderCategoriesGrid();
      sfx.success();
      this.showToast(`„${w}“ direkt hinzugefügt`, "fa-check");
    } else if (this.state.dbTab === "quiz") {
      const cat = QUIZ_CATEGORIES.find(c => c.id === catId);
      if (!cat) return;
      const ids = ["directQuizQInput", "directQuizRightInput", "directQuizWrong1Input", "directQuizWrong2Input", "directQuizWrong3Input"];
      const vals = ids.map(id => document.getElementById(id).value.trim());
      if (vals.some(v => !v)) {
        this.showToast("Bitte Frage, richtige und drei falsche Antworten eingeben", "fa-circle-exclamation");
        return;
      }
      if (new Set(vals.slice(1).map(v => v.toLowerCase())).size < 4) {
        this.showToast("Die vier Antworten müssen sich unterscheiden", "fa-circle-exclamation");
        return;
      }
      cat.qs.unshift(vals);
      ids.forEach(id => { document.getElementById(id).value = ""; });
      this.saveEncryptedVaultToStorage();
      this.updateVaultCounts();
      this.renderVaultList();
      this.renderCategoriesGrid();
      sfx.success();
      this.showToast("Quizfrage direkt hinzugefügt", "fa-check");
    } else {
      const cat = QUESTION_CATEGORIES.find(c => c.id === catId);
      if (!cat) return;
      const mInp = document.getElementById("directCatMainQInput");
      const iInp = document.getElementById("directCatImpQInput");
      const mQ = mInp.value.trim();
      const iQ = iInp.value.trim();
      if (!mQ || !iQ) {
        this.showToast("Bitte Hauptfrage und Imposter-Frage eingeben", "fa-circle-exclamation");
        return;
      }
      cat.pairs.unshift([mQ, iQ]);
      mInp.value = "";
      iInp.value = "";
      this.saveEncryptedVaultToStorage();
      this.updateVaultCounts();
      this.renderVaultList();
      this.renderCategoriesGrid();
      sfx.success();
      this.showToast("Fragen-Duell direkt hinzugefügt", "fa-check");
    }
  },

  resetDeleteConfirmButtonUI() {
    this.state.deleteConfirmArmed = false;
    const btn = document.getElementById("deleteVaultItemBtn");
    const txt = document.getElementById("deleteVaultItemBtnText");
    if (btn) {
      btn.className = "px-4 py-3 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center gap-1.5 transition-all";
    }
    if (txt) txt.textContent = "Löschen";
  },

  openEditVaultItemModal(type, catIdx, itemIdx) {
    sfx.click();
    this.state.editingItem = { type, catIdx, itemIdx };
    this.resetDeleteConfirmButtonUI();

    const titleEl = document.getElementById("editVaultModalTitle");
    const bodyEl = document.getElementById("editVaultModalBody");
    const inputCls = "w-full bg-black/45 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white/40";
    const attr = (v) => this.escapeHTML(v);

    if (type === "word") {
      const [w, h] = WORD_CATEGORIES[catIdx].words[itemIdx];
      titleEl.textContent = "Wort & Hinweis bearbeiten";
      bodyEl.innerHTML = `
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-zinc-400">Geheimes Wort (Crew)</label>
          <input id="editWordValInput" type="text" value="${attr(w)}" class="${inputCls}" />
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-zinc-400">Ein-Wort-Hinweis (Imposter)</label>
          <input id="editHintValInput" type="text" value="${attr(h)}" class="${inputCls}" />
        </div>
      `;
    } else if (type === "quiz") {
      const [q, right, w1, w2, w3] = QUIZ_CATEGORIES[catIdx].qs[itemIdx];
      titleEl.textContent = "Quizfrage bearbeiten";
      bodyEl.innerHTML = `
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-zinc-400">Frage</label>
          <textarea id="editQuizQInput" rows="2" class="w-full bg-black/45 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/40">${attr(q)}</textarea>
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-emerald-300">Richtige Antwort</label>
          <input id="editQuizRightInput" type="text" value="${attr(right)}" class="${inputCls}" />
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-rose-300">Falsche Antworten</label>
          <div class="grid grid-cols-1 gap-2">
            <input id="editQuizWrong1Input" type="text" value="${attr(w1)}" class="${inputCls}" />
            <input id="editQuizWrong2Input" type="text" value="${attr(w2)}" class="${inputCls}" />
            <input id="editQuizWrong3Input" type="text" value="${attr(w3)}" class="${inputCls}" />
          </div>
        </div>
      `;
    } else {
      const [mQ, iQ] = QUESTION_CATEGORIES[catIdx].pairs[itemIdx];
      titleEl.textContent = "Fragen-Duell bearbeiten";
      bodyEl.innerHTML = `
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-zinc-400">Hauptfrage für die Crew</label>
          <textarea id="editMainQValInput" rows="2" class="w-full bg-black/45 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/40">${attr(mQ)}</textarea>
        </div>
        <div class="space-y-1.5">
          <label class="text-xs font-semibold text-zinc-400">Abweichende Frage für den Imposter</label>
          <textarea id="editImpQValInput" rows="2" class="w-full bg-black/45 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white/40">${attr(iQ)}</textarea>
        </div>
      `;
    }

    this.animateOpenModal("editVaultItemModal");
  },

  saveEditedVaultItem() {
    const edit = this.state.editingItem;
    if (!edit) return;

    if (edit.type === "word") {
      const w = document.getElementById("editWordValInput").value.trim();
      const h = document.getElementById("editHintValInput").value.trim();
      if (!w || !h) {
        this.showToast("Bitte Wort und Hinweis ausfüllen", "fa-circle-exclamation");
        return;
      }
      WORD_CATEGORIES[edit.catIdx].words[edit.itemIdx] = [w, h];
    } else if (edit.type === "quiz") {
      const ids = ["editQuizQInput", "editQuizRightInput", "editQuizWrong1Input", "editQuizWrong2Input", "editQuizWrong3Input"];
      const vals = ids.map(id => document.getElementById(id).value.trim());
      if (vals.some(v => !v)) {
        this.showToast("Bitte Frage und alle vier Antworten ausfüllen", "fa-circle-exclamation");
        return;
      }
      if (new Set(vals.slice(1).map(v => v.toLowerCase())).size < 4) {
        this.showToast("Die vier Antworten müssen sich unterscheiden", "fa-circle-exclamation");
        return;
      }
      QUIZ_CATEGORIES[edit.catIdx].qs[edit.itemIdx] = vals;
    } else {
      const mQ = document.getElementById("editMainQValInput").value.trim();
      const iQ = document.getElementById("editImpQValInput").value.trim();
      if (!mQ || !iQ) {
        this.showToast("Bitte beide Fragen ausfüllen", "fa-circle-exclamation");
        return;
      }
      const oldPair = QUESTION_CATEGORIES[edit.catIdx].pairs[edit.itemIdx];
      const newPair = [mQ, iQ];
      if (oldPair[2]) newPair.push(oldPair[2]);
      if (oldPair[3]) {
        if (newPair.length === 2) newPair.push(null);
        newPair.push(oldPair[3]);
      }
      QUESTION_CATEGORIES[edit.catIdx].pairs[edit.itemIdx] = newPair;
    }

    this.saveEncryptedVaultToStorage();
    this.renderVaultList();
    this.renderCategoriesGrid();
    sfx.success();
    this.closeModal("editVaultItemModal", () => {
      this.showToast("Eintrag aktualisiert & gespeichert", "fa-check");
    });
  },

  deleteCurrentEditingVaultItem() {
    const edit = this.state.editingItem;
    if (!edit) return;

    // First click: Arm confirmation
    if (!this.state.deleteConfirmArmed) {
      sfx.click();
      this.state.deleteConfirmArmed = true;
      const btn = document.getElementById("deleteVaultItemBtn");
      const txt = document.getElementById("deleteVaultItemBtnText");
      if (btn) {
        btn.className = "px-4 py-3 rounded-2xl bg-rose-600 text-white border border-rose-400 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all";
      }
      if (txt) txt.textContent = "Wirklich löschen? (Bestätigen)";
      return;
    }

    // Second click: Execute deletion
    if (edit.type === "word") {
      const cat = WORD_CATEGORIES[edit.catIdx];
      if (cat.words.length <= 1) {
        this.showToast("Mindestens ein Eintrag muss in der Kategorie bleiben", "fa-circle-exclamation");
        return;
      }
      cat.words.splice(edit.itemIdx, 1);
    } else if (edit.type === "quiz") {
      const cat = QUIZ_CATEGORIES[edit.catIdx];
      if (cat.qs.length <= 1) {
        this.showToast("Mindestens eine Quizfrage muss bleiben", "fa-circle-exclamation");
        return;
      }
      this.rememberDeletedDefault("quiz", cat.qs[edit.itemIdx][0]);
      cat.qs.splice(edit.itemIdx, 1);
    } else {
      const cat = QUESTION_CATEGORIES[edit.catIdx];
      if (cat.pairs.length <= 1) {
        this.showToast("Mindestens ein Fragen-Paar muss bleiben", "fa-circle-exclamation");
        return;
      }
      this.rememberDeletedDefault("question", cat.pairs[edit.itemIdx][0]);
      cat.pairs.splice(edit.itemIdx, 1);
    }

    this.resetDeleteConfirmButtonUI();
    this.saveEncryptedVaultToStorage();
    this.updateVaultCounts();
    this.renderVaultList();
    this.renderCategoriesGrid();
    sfx.click();
    this.closeModal("editVaultItemModal", () => {
      this.showToast("Eintrag endgültig gelöscht", "fa-trash");
    });
  },

  // Gelöschte Standard-Fragen merken, damit sie beim nächsten Laden nicht wieder auftauchen
  rememberDeletedDefault(kind, text) {
    const key = kind === "quiz" ? "deletedQuiz" : "deletedQuestions";
    if (!this.state[key].includes(text)) this.state[key].push(text);
  },

  addCustomWord() {
    const wInp = document.getElementById("customWordInput");
    const hInp = document.getElementById("customHintInput");
    const w = wInp.value.trim();
    const h = hInp.value.trim();
    if (!w || !h) {
      this.showToast("Bitte Wort und Ein-Wort-Hinweis eingeben", "fa-circle-exclamation");
      return;
    }
    const targetCat = WORD_CATEGORIES.find(c => c.id === this.state.globalWordTargetCatId) || WORD_CATEGORIES[0];
    targetCat.words.unshift([w, h]);
    wInp.value = "";
    hInp.value = "";
    this.popCustomCreator();

    this.saveEncryptedVaultToStorage();
    this.updateVaultCounts();
    this.populateVaultCategorySelects();
    this.renderCategoriesGrid();
    sfx.success();
    this.showToast(`„${w}“ (${h}) in ${targetCat.name} gespeichert`, "fa-check");
  },

  addCustomQuestion() {
    const mInp = document.getElementById("customMainQInput");
    const iInp = document.getElementById("customImpQInput");
    const m = mInp.value.trim();
    const i = iInp.value.trim();
    if (!m || !i) {
      this.showToast("Bitte beide Fragen eingeben", "fa-circle-exclamation");
      return;
    }
    const targetCat = QUESTION_CATEGORIES.find(c => c.id === this.state.globalQuestionTargetCatId) || QUESTION_CATEGORIES[0];
    targetCat.pairs.unshift([m, i]);
    mInp.value = "";
    iInp.value = "";
    this.popCustomCreator();

    this.saveEncryptedVaultToStorage();
    this.updateVaultCounts();
    this.populateVaultCategorySelects();
    this.renderCategoriesGrid();
    sfx.success();
    this.showToast(`Fragen-Paar in ${targetCat.name} gespeichert`, "fa-check");
  },

  addCustomQuiz() {
    const ids = ["customQuizQInput", "customQuizRightInput", "customQuizWrong1Input", "customQuizWrong2Input", "customQuizWrong3Input"];
    const vals = ids.map(id => document.getElementById(id).value.trim());
    if (vals.some(v => !v)) {
      this.showToast("Bitte Frage, richtige und drei falsche Antworten eingeben", "fa-circle-exclamation");
      return;
    }
    if (new Set(vals.slice(1).map(v => v.toLowerCase())).size < 4) {
      this.showToast("Die vier Antworten müssen sich unterscheiden", "fa-circle-exclamation");
      return;
    }
    const targetCat = QUIZ_CATEGORIES.find(c => c.id === this.state.globalQuizTargetCatId) || QUIZ_CATEGORIES[0];
    targetCat.qs.unshift(vals);
    ids.forEach(id => { document.getElementById(id).value = ""; });
    this.popCustomCreator();

    this.saveEncryptedVaultToStorage();
    this.updateVaultCounts();
    this.populateVaultCategorySelects();
    this.renderCategoriesGrid();
    sfx.success();
    this.showToast(`Quizfrage in ${targetCat.name} gespeichert`, "fa-check");
  },

  popCustomCreator() {
    const creatorBox = document.getElementById("dbCustomCreator");
    if (creatorBox) {
      creatorBox.classList.remove("item-added-pop");
      void creatorBox.offsetWidth;
      creatorBox.classList.add("item-added-pop");
    }
  },

  // CSV Backup Export & Import
  escapeCSVField(val) {
    const str = String(val ?? "");
    if (str.includes(";") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  },

  parseCSVRow(line, delimiter = ";") {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === delimiter) {
          result.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
    }
    result.push(cur);
    return result;
  },

  exportBackupCSV() {
    sfx.click();
    const rows = [
      ["Typ", "Kategorie_ID", "Kategorie_Name", "Kategorie_Icon", "Wort_oder_Hauptfrage", "Hinweis_oder_Imposterfrage", "Slider_JSON"].join(";")
    ];

    WORD_CATEGORIES.forEach(cat => {
      cat.words.forEach(([w, h]) => {
        rows.push([
          "WORD",
          this.escapeCSVField(cat.id),
          this.escapeCSVField(cat.name),
          this.escapeCSVField(cat.icon || "fa-star"),
          this.escapeCSVField(w),
          this.escapeCSVField(h),
          ""
        ].join(";"));
      });
    });

    QUESTION_CATEGORIES.forEach(cat => {
      cat.pairs.forEach(([mQ, iQ, sl]) => {
        rows.push([
          "QUESTION",
          this.escapeCSVField(cat.id),
          this.escapeCSVField(cat.name),
          this.escapeCSVField(cat.icon || "fa-sliders"),
          this.escapeCSVField(mQ),
          this.escapeCSVField(iQ),
          sl ? this.escapeCSVField(JSON.stringify(sl)) : ""
        ].join(";"));
      });
    });

    // Quiz: Frage | richtige Antwort | falsche Antworten als JSON-Liste in der letzten Spalte
    QUIZ_CATEGORIES.forEach(cat => {
      cat.qs.forEach(([q, right, ...wrong]) => {
        rows.push([
          "QUIZ",
          this.escapeCSVField(cat.id),
          this.escapeCSVField(cat.name),
          this.escapeCSVField(cat.icon || "fa-circle-question"),
          this.escapeCSVField(q),
          this.escapeCSVField(right),
          this.escapeCSVField(JSON.stringify(wrong))
        ].join(";"));
      });
    });

    // Prepend UTF-8 BOM so Excel opens umlauts properly
    const csvContent = "﻿" + rows.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute("download", `imposter-tresor-backup-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    sfx.success();
    this.showToast("CSV-Backup erfolgreich heruntergeladen", "fa-file-csv");
  },

  triggerImportCSV() {
    sfx.click();
    const inp = document.getElementById("csvBackupFileInput");
    if (inp) {
      inp.value = "";
      inp.click();
    }
  },

  handleImportCSVFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target.result || "").replace(/^﻿/, "");
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) {
          this.showToast("CSV-Datei enthält keine gültigen Einträge", "fa-circle-exclamation");
          return;
        }

        const delimiter = lines[0].includes(";") ? ";" : ",";
        const wordMap = new Map();
        const questionMap = new Map();
        const quizMap = new Map();
        let importedWords = 0;
        let importedQuestions = 0;
        let importedQuiz = 0;

        for (let i = 0; i < lines.length; i++) {
          const cols = this.parseCSVRow(lines[i], delimiter).map(c => c.trim());
          if (i === 0 && (cols[0].toUpperCase() === "TYP" || cols[0].toUpperCase() === "TYPE")) {
            continue;
          }
          const type = (cols[0] || "").toUpperCase();

          // Support both full 7-column backup format and simple 3-column (Kategorie;Wort;Hinweis) format
          if (cols.length >= 6 && (type === "WORD" || type === "QUESTION" || type === "QUIZ")) {
            const catId = cols[1] || ("custom_" + i);
            const catName = cols[2] || "Importiert";
            const catIcon = cols[3] || (type === "WORD" ? "fa-star" : type === "QUIZ" ? "fa-circle-question" : "fa-sliders");
            const val1 = cols[4];
            const val2 = cols[5];
            const extraRaw = cols[6] || "";

            if (!val1 || !val2) continue;

            if (type === "WORD") {
              if (!wordMap.has(catId)) {
                wordMap.set(catId, { id: catId, name: catName, icon: catIcon, words: [] });
              }
              wordMap.get(catId).words.push([val1, val2]);
              importedWords++;
            } else if (type === "QUIZ") {
              let wrong = [];
              try { wrong = JSON.parse(extraRaw); } catch (err) {}
              if (!Array.isArray(wrong) || wrong.length < 3) continue;
              if (!quizMap.has(catId)) {
                quizMap.set(catId, { id: catId, name: catName, icon: catIcon, qs: [] });
              }
              quizMap.get(catId).qs.push([val1, val2, ...wrong.slice(0, 3).map(String)]);
              importedQuiz++;
            } else {
              if (!questionMap.has(catId)) {
                questionMap.set(catId, { id: catId, name: catName, icon: catIcon, pairs: [] });
              }
              let sliderObj = null;
              if (extraRaw) {
                try { sliderObj = JSON.parse(extraRaw); } catch (err) {}
              }
              questionMap.get(catId).pairs.push(sliderObj ? [val1, val2, sliderObj] : [val1, val2]);
              importedQuestions++;
            }
          } else if (cols.length >= 2) {
            // Simple CSV fallback: [CategoryName, Word, Hint] or [Word, Hint]
            const catName = cols.length >= 3 ? cols[0] : "CSV-Import";
            const w = cols.length >= 3 ? cols[1] : cols[0];
            const h = cols.length >= 3 ? cols[2] : cols[1];
            if (!w || !h) continue;
            const catId = "csv_" + catName.toLowerCase().replace(/[^a-z0-9]/g, "_");
            if (!wordMap.has(catId)) {
              wordMap.set(catId, { id: catId, name: catName, icon: "fa-file-csv", words: [] });
            }
            wordMap.get(catId).words.push([w, h]);
            importedWords++;
          }
        }

        if (importedWords === 0 && importedQuestions === 0 && importedQuiz === 0) {
          this.showToast("Keine gültigen Zeilen in der CSV-Datei erkannt", "fa-circle-exclamation");
          return;
        }

        // Merge or replace categories cleanly (key = index of the entry in an item)
        const mergeInto = (targetList, importedMap, itemsKey, activeSet) => {
          importedMap.forEach((importedCat) => {
            const existing = targetList.find(c => c.id === importedCat.id || c.name.toLowerCase() === importedCat.name.toLowerCase());
            if (existing) {
              existing.name = importedCat.name;
              existing.icon = importedCat.icon || existing.icon;
              importedCat[itemsKey].forEach(item => {
                const idx = existing[itemsKey].findIndex(p => p[0].toLowerCase() === item[0].toLowerCase());
                if (idx === -1) existing[itemsKey].push(item);
                else existing[itemsKey][idx] = item;
              });
              activeSet.add(existing.id);
            } else {
              targetList.push(importedCat);
              activeSet.add(importedCat.id);
            }
          });
        };
        mergeInto(WORD_CATEGORIES, wordMap, "words", this.state.activeWordCats);
        mergeInto(QUESTION_CATEGORIES, questionMap, "pairs", this.state.activeQuestionCats);
        mergeInto(QUIZ_CATEGORIES, quizMap, "qs", this.state.activeQuizCats);

        this.saveEncryptedVaultToStorage();
        this.updateVaultCounts();
        this.populateVaultCategorySelects();
        this.renderCategoriesGrid();
        if (this.state.dbTab !== "custom") {
          this.renderVaultList();
        }
        sfx.success();
        this.showToast(`CSV-Import: ${importedWords} Wörter, ${importedQuestions} Fragen & ${importedQuiz} Quizfragen geladen!`, "fa-file-circle-check");
      } catch (err) {
        this.showToast("Fehler beim Lesen der CSV-Datei", "fa-circle-exclamation");
      }
    };
    reader.readAsText(file, "UTF-8");
  },

  updateVaultCounts() {
    const totalWords = WORD_CATEGORIES.reduce((acc, c) => acc + c.words.length, 0);
    const totalQuestions = QUESTION_CATEGORIES.reduce((acc, c) => acc + c.pairs.length, 0);
    const totalQuiz = QUIZ_CATEGORIES.reduce((acc, c) => acc + c.qs.length, 0);
    document.getElementById("dbTabWords").textContent = `${totalWords} Wörter`;
    document.getElementById("dbTabQuestions").textContent = `${totalQuestions} Fragen`;
    const quizTab = document.getElementById("dbTabQuiz");
    if (quizTab) quizTab.textContent = `${totalQuiz} Quiz`;
  }
};

window.app = app;

function initAmbientCanvas() {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const dots = Array.from({ length: 28 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
    alpha: Math.random() * 0.35 + 0.1
  }));

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = width;
      if (d.x > width) d.x = 0;
      if (d.y < 0) d.y = height;
      if (d.y > height) d.y = 0;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(render);
  }

  render();
}

window.onload = function () {
  app.init();
};
