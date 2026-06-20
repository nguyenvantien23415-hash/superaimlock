const sections = {
  home: document.getElementById("homeSection"),
  premium: document.getElementById("premiumSection"),
  booster: document.getElementById("boosterSection"),
  monitor: document.getElementById("monitorSection"),
  settings: document.getElementById("setupSection"),
};

const navButtons = {
  home: document.getElementById("homeBottom"),
  premium: document.getElementById("functionBottom"),
  booster: document.getElementById("boosterBottom"),
  monitor: document.getElementById("monitorBottom"),
  settings: document.getElementById("settingsBottom"),
};

const viewButtons = document.querySelectorAll("[data-view-target]");
const soundToggles = document.querySelectorAll(".sound-toggle");
const modalBackdrop = document.getElementById("modalBackdrop");
const limitModal = document.getElementById("limitModal");
let modalTimer;
let lastSliderSoundAt = 0;

const BOOSTER_DEFAULTS = {
  ff: {
    aimlock: 0,
    stabilityAssist: 0,
    aimHold: 0,
    headshotFix: 0,
    bulletAlign: 0,
  },
  ffm: {
    aimLockdown: 0,
    sensitivityBoost: 0,
    screenBoost: 0,
    shakeFix: 0,
    headshotFix: 0,
  },
};

function createAudioContext() {
  const AC = window.AudioContext || window.webkitAudioContext;
  return AC ? new AC() : null;
}

const audioContext = createAudioContext();

function cloneDefaults() {
  return JSON.parse(JSON.stringify(BOOSTER_DEFAULTS));
}

function getSoundSettingToggle() {
  return document.getElementById("settings-sound-toggle");
}

function getNotificationSettingToggle() {
  return document.getElementById("settings-notification-toggle");
}

function isSoundEnabled() {
  const toggle = getSoundSettingToggle();
  return !toggle || toggle.checked;
}

function isNotificationEnabled() {
  const toggle = getNotificationSettingToggle();
  return !toggle || toggle.checked;
}

function playToggleSound(force = false) {
  if (!force && !isSoundEnabled()) return;
  if (!audioContext) return;
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  const now = audioContext.currentTime;
  const master = audioContext.createGain();
  master.gain.value = 7.0;
  master.connect(audioContext.destination);

  function note(freq, delay, duration) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const start = now + delay;
    const end = start + duration;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, start);
    oscillator.connect(gain);
    gain.connect(master);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(0.14, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.start(start);
    oscillator.stop(end + 0.02);
  }

  note(1340, 0, 0.16);
  note(1680, 0.07, 0.18);
}

function playSliderSound(value, force = false) {
  if (!force && !isSoundEnabled()) return;
  if (!audioContext) return;

  const nowTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  if (!force && nowTime - lastSliderSoundAt < 18) return;
  lastSliderSoundAt = nowTime;

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  const now = audioContext.currentTime;
  const master = audioContext.createGain();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  const frequency = 620 + normalized * 5.8;

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.linearRampToValueAtTime(frequency + 36, now + 0.045);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.045, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

  oscillator.connect(gain);
  gain.connect(master);
  master.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.085);
}

function updateFeatureState(toggle) {
  const card = toggle.closest(".func-card, .feature-item");
  if (!card) return;
  card.classList.toggle("is-on", toggle.checked);
  card.classList.toggle("on", toggle.checked);
}

function closeLimitModal() {
  document.body.classList.remove("modal-open");
  modalBackdrop?.classList.remove("is-open");
  limitModal?.classList.remove("is-open");
}

function openLimitModal() {
  document.body.classList.add("modal-open");
  modalBackdrop?.classList.add("is-open");
  limitModal?.classList.add("is-open");
  clearTimeout(modalTimer);
  modalTimer = setTimeout(closeLimitModal, 2600);
}

function updateNavigation(type) {
  Object.entries(navButtons).forEach(([key, button]) => {
    if (!button) return;
    button.classList.toggle("is-active", key === type);
  });
}

function showSection(type) {
  Object.entries(sections).forEach(([key, section]) => {
    if (!section) return;
    const active = key === type;
    section.hidden = !active;
  });

  updateNavigation(type);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindNavigation() {
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-view-target");
      if (!target) return;
      playToggleSound();
      showSection(target);
    });
  });
}

function bindFeatureToggles() {
  soundToggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      playToggleSound();

      if (toggle.checked) {
        const enabledCount = document.querySelectorAll(".sound-toggle:checked").length;
        if (enabledCount > 9) {
          toggle.checked = false;
          updateFeatureState(toggle);
          openLimitModal();
          return;
        }
      }

      updateFeatureState(toggle);
    });

    updateFeatureState(toggle);
  });

  modalBackdrop?.addEventListener("click", closeLimitModal);
}

function loadBoosterProfiles() {
  return cloneDefaults();
}

function saveBoosterProfiles(state) {
  return state;
}

function updateBoosterRow(input, value) {
  const row = input.closest(".tune-row");
  const output = row ? row.querySelector(".tune-value") : null;
  input.style.setProperty("--value", value);
  if (output) output.textContent = `${value}%`;
}

function updateBoosterPreview(profile, state) {
  const values = Object.values(state[profile]);
  const average = values.length
    ? Math.round(values.reduce((sum, current) => sum + Number(current || 0), 0) / values.length)
    : 0;

  const score = document.querySelector(`[data-profile-score="${profile}"]`);
  const dial = score?.closest(".preview-dial");
  if (score) score.textContent = `${average}%`;
  if (dial) dial.style.setProperty("--dial", average);

  document
    .querySelectorAll(`.preview-item[data-preview-profile="${profile}"]`)
    .forEach((item) => {
      const key = item.getAttribute("data-preview-setting");
      const value = Number(state[profile][key] ?? 0);
      const text = item.querySelector("[data-preview-value]");
      const fill = item.querySelector("[data-preview-fill]");
      if (text) text.textContent = `${value}%`;
      if (fill) fill.style.setProperty("--value", value);
    });
}

function setActiveBooster(profile) {
  document.querySelectorAll("[data-booster-target]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-booster-target") === profile);
  });

  document.querySelectorAll("[data-booster-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.getAttribute("data-booster-panel") === profile);
  });
}

function initBoosterProfiles() {
  const state = loadBoosterProfiles();
  window.__boosterState = state;
  const inputs = document.querySelectorAll(".tune-slider[data-profile][data-setting]");

  inputs.forEach((input) => {
    const profile = input.getAttribute("data-profile");
    const key = input.getAttribute("data-setting");
    const value = Number(state[profile]?.[key] ?? input.value ?? 0);
    input.value = String(value);
    updateBoosterRow(input, value);
  });

  updateBoosterPreview("ff", state);
  updateBoosterPreview("ffm", state);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const profile = input.getAttribute("data-profile");
      const key = input.getAttribute("data-setting");
      const value = Number(input.value);
      playSliderSound(value);
      state[profile][key] = value;
      updateBoosterRow(input, value);
      updateBoosterPreview(profile, state);
      saveBoosterProfiles(state);
    });
  });

  document.querySelectorAll("[data-booster-target]").forEach((button) => {
    button.addEventListener("click", () => {
      playToggleSound();
      setActiveBooster(button.getAttribute("data-booster-target"));
    });
  });

  setActiveBooster("ff");
}

const ANDROID = /Android/i.test(navigator.userAgent);
const IOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

const FF_PLAY = "https://play.google.com/store/apps/details?id=com.dts.freefireth";
const FFM_PLAY = "https://play.google.com/store/apps/details?id=com.dts.freefiremax";
const FF_APPSTORE = "https://apps.apple.com/vn/app/free-fire/id1300146617";
const FFM_APPSTORE = "https://apps.apple.com/vn/app/free-fire-max/id1480516829";

function showToast(text) {
  if (!isNotificationEnabled()) return;
  const toast = document.createElement("div");
  toast.className = "boost-toast";
  toast.textContent = text;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 240);
  }, 1500);
}

function launchGame({ scheme, toast, fallback }) {
  playToggleSound();
  showToast(toast);

  let hidden = false;
  const onVisibility = () => {
    hidden = document.visibilityState === "hidden";
  };

  document.addEventListener("visibilitychange", onVisibility);
  setTimeout(() => {
    window.location.href = scheme;
  }, 220);

  setTimeout(() => {
    document.removeEventListener("visibilitychange", onVisibility);
    if (!hidden && fallback) {
      window.location.href = fallback;
    }
  }, 1600);
}

function openFF() {
  const fallback = IOS ? FF_APPSTORE : ANDROID ? FF_PLAY : null;
  launchGame({
    scheme: "freefire://",
    toast: "Launching Free Fire...",
    fallback,
  });
}

function openFFM() {
  const fallback = IOS ? FFM_APPSTORE : ANDROID ? FFM_PLAY : null;
  launchGame({
    scheme: "freefiremax://",
    toast: "Launching Free Fire Max...",
    fallback,
  });
}

window.openFF = openFF;
window.openFFM = openFFM;
window.openGame = function openGame(link) {
  window.location.href = link;
};

function bindLaunchButtons() {
  const launchFF = document.getElementById("launchFF");
  const launchFFM = document.getElementById("launchFFM");

  launchFF?.addEventListener("click", openFF);
  launchFFM?.addEventListener("click", openFFM);
}

function resetConfiguration() {
  soundToggles.forEach((toggle) => {
    toggle.checked = false;
    updateFeatureState(toggle);
  });

  closeLimitModal();

  const state = cloneDefaults();
  window.__boosterState = state;
  const inputs = document.querySelectorAll(".tune-slider[data-profile][data-setting]");
  inputs.forEach((input) => {
    const profile = input.getAttribute("data-profile");
    const key = input.getAttribute("data-setting");
    const value = Number(state[profile]?.[key] ?? input.value ?? 0);
    input.value = String(value);
    updateBoosterRow(input, value);
  });

  updateBoosterPreview("ff", state);
  updateBoosterPreview("ffm", state);
  saveBoosterProfiles(state);
  setActiveBooster("ff");

  const soundSetting = getSoundSettingToggle();
  const notificationSetting = getNotificationSettingToggle();
  if (soundSetting) soundSetting.checked = true;
  if (notificationSetting) notificationSetting.checked = true;

  showToast("Đã đặt lại cấu hình.");
}

function initSettings() {
  const soundSetting = getSoundSettingToggle();
  const notificationSetting = getNotificationSettingToggle();
  const resetButton = document.getElementById("settings-reset-btn");
  const logoutButton = document.getElementById("settings-logout-btn");

  soundSetting?.addEventListener("change", () => {
    if (soundSetting.checked) playToggleSound(true);
  });

  notificationSetting?.addEventListener("change", () => {
    if (notificationSetting.checked) {
      showToast("Đã bật thông báo.");
    }
  });

  resetButton?.addEventListener("click", () => {
    playToggleSound(true);
    resetConfiguration();
  });

  logoutButton?.addEventListener("click", () => {
    playToggleSound(true);
    if (window.VSHKeyGate?.reset) {
      window.VSHKeyGate.reset();
      return;
    }
    if (window.VSHKeyGate?.show) {
      window.VSHKeyGate.show();
    }
  });
}

function initRealtimeMonitor() {
  const consoleView = document.getElementById("consoleView");
  const cpuCanvas = document.getElementById("cpuCanvas");
  const ramCanvas = document.getElementById("ramCanvas");

  if (!consoleView || !cpuCanvas || !ramCanvas) return;

  const mLogs = document.getElementById("mLogs");
  const mErrs = document.getElementById("mErrs");
  const mFps = document.getElementById("mFps");
  const mFrame = document.getElementById("mFrame");
  const mCpu = document.getElementById("mCpu");
  const mRam = document.getElementById("mRam");
  const mTarget = document.getElementById("mTarget");

  const btnLock = document.getElementById("btnLock");
  const btnClearConsole = document.getElementById("btnClearConsole");
  const btnCleanRam = document.getElementById("btnCleanRam");
  const btnCleanCpu = document.getElementById("btnCleanCpu");
  const btnOptRam = document.getElementById("btnOptRam");
  const btnOptCpu = document.getElementById("btnOptCpu");
  const btnOptFps = document.getElementById("btnOptFps");
  const cmd = document.getElementById("cmd");
  const btnExec = document.getElementById("btnExec");

  if (
    !btnLock ||
    !btnClearConsole ||
    !btnCleanRam ||
    !btnCleanCpu ||
    !btnOptRam ||
    !btnOptCpu ||
    !btnOptFps ||
    !cmd ||
    !btnExec
  ) {
    return;
  }

  const MAX_LOG_LINES = 400;
  const logLines = [];
  let logCount = 0;
  let errCount = 0;

  function ts() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    const ms = String(d.getMilliseconds()).padStart(3, "0");
    return `${hh}:${mm}:${ss}.${ms}`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[ch]);
  }

  function renderConsole() {
    consoleView.innerHTML = logLines
      .map((line) => {
        const raw = String(line.text);
        const splitIndex = raw.indexOf(" > ");
        let body = escapeHtml(raw);

        if (splitIndex !== -1) {
          const prefix = escapeHtml(raw.slice(0, splitIndex));
          const rest = escapeHtml(raw.slice(splitIndex + 3));
          body = `<span class="prefix">${prefix}</span> <span class="prefix">&gt;</span> ${rest}`;
        }

        return `<p class="logLine ${line.level}"><span class="t">[${line.time}]</span> ${body}</p>`;
      })
      .join("");

    consoleView.scrollTop = consoleView.scrollHeight;
    if (mLogs) mLogs.textContent = String(logCount);
    if (mErrs) mErrs.textContent = String(errCount);
  }

  function pushLine(level, text) {
    logLines.push({ level, text: String(text), time: ts() });
    if (logLines.length > MAX_LOG_LINES) {
      logLines.splice(0, logLines.length - MAX_LOG_LINES);
    }
    renderConsole();
  }

  function updateLine(index, text) {
    if (!logLines[index]) return;
    logLines[index].text = String(text);
    renderConsole();
  }

  function buildSnippets(mode) {
    const base = [
      "init: sync state -> verify checksum -> handoff to runtime",
      "cache: warm layers -> align buffers -> prefetch hot paths",
      "graph: update nodes -> rebuild edges -> commit topology",
      "scheduler: tick -> re-order tasks -> apply budget guard",
      "buffer: reuse pools -> clear stale refs -> seal frame",
      "signal: smooth sample -> clamp noise -> emit spectrum",
      "metrics: commit frame -> write counters -> flush telemetry",
      "kernel: apply filters -> normalize output -> release locks",
      "io: flush queue -> ack packets -> update latency map",
      "core: stabilize loop -> reduce jitter -> sync cadence",
    ];

    const ram = [
      "mem: scan heap -> mark free -> schedule compaction",
      "mem: compact blocks -> merge regions -> defrag map",
      "mem: clear temp buffers -> drop refs -> request GC hint",
      "mem: release cache -> shrink slabs -> free arenas",
      "mem: trim pools -> rebalance buckets -> reduce churn",
    ];

    const cpu = [
      "cpu: balance load -> reassign workers -> smooth peaks",
      "cpu: coalesce tasks -> batch ops -> cut overhead",
      "cpu: throttle spikes -> cap bursts -> normalize frame",
      "cpu: reduce jitter -> align cycles -> lock cadence",
      "cpu: align cycles -> optimize loop -> stabilize budget",
    ];

    const fps = [
      "fps: lock timing -> set target -> clamp drift",
      "fps: stabilize cadence -> smooth delta -> reduce jitter",
      "fps: clamp drift -> align frame -> snap pacing",
      "fps: sync v-blank -> align swap -> reduce tear",
      "fps: optimize pacing -> tune budget -> steady loop",
    ];

    if (mode === "clean-ram") return base.concat(ram, ["gc: sweep", "gc: finalize"]);
    if (mode === "clean-cpu") return base.concat(cpu, ["thread: park idle"]);
    if (mode === "opt-ram") return base.concat(ram, ["heap: optimize layout"]);
    if (mode === "opt-cpu") return base.concat(cpu, ["pipeline: optimize"]);
    if (mode === "opt-fps") return base.concat(fps, ["frame: optimize path"]);
    return base;
  }

  function runProgress(label, mode) {
    const total = 40 + Math.floor(Math.random() * 31);
    const durationMs = 5000;
    const intervalMs = Math.floor(durationMs / total);
    const lineIndex = logLines.length;
    const snippets = buildSnippets(mode);
    const levels = ["info", "info", "info", "warn", "error"];
    let current = 0;

    pushLine("info", `${label}: 0%`);

    const timer = setInterval(() => {
      current += 1;
      const percent = Math.min(100, Math.round((current / total) * 100));
      updateLine(lineIndex, `${label}: ${percent}%`);
      pushLine(
        levels[Math.floor(Math.random() * levels.length)],
        `${label} > ${snippets[Math.floor(Math.random() * snippets.length)]}`
      );

      if (current >= total) {
        clearInterval(timer);
      }
    }, intervalMs);
  }

  const native = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: console.info.bind(console),
  };

  function log(...args) {
    logCount += 1;
    pushLine(
      "info",
      args.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(" ")
    );
    native.log(...args);
  }

  function warn(...args) {
    logCount += 1;
    pushLine(
      "warn",
      args.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(" ")
    );
    native.warn(...args);
  }

  function err(...args) {
    logCount += 1;
    errCount += 1;
    pushLine(
      "error",
      args.map((item) => (typeof item === "string" ? item : JSON.stringify(item))).join(" ")
    );
    native.error(...args);
  }

  console.log = log;
  console.warn = warn;
  console.error = err;
  console.info = log;

  window.addEventListener("error", (event) => {
    err(`Uncaught: ${event.message} @ ${event.filename}:${event.lineno}:${event.colno}`);
  });

  window.addEventListener("unhandledrejection", (event) => {
    err(`UnhandledRejection: ${event.reason}`);
  });

  window.log = log;
  window.warn = warn;
  window.err = err;
  window.help = () => {
    log("Commands:", "log(x), warn(x), err(x)", "burn(ms)", "alloc(mb)", "clearConsole()");
  };

  let tempTrash = [];
  window.burn = (ms = 8) => {
    const start = performance.now();
    while (performance.now() - start < ms) {
      // Burn a little CPU intentionally for demo graphs.
    }
    log(`burn(${ms}) done`);
  };

  window.alloc = (mb = 20) => {
    const bytes = Math.max(1, mb) * 1024 * 1024;
    const chunk = new Uint8Array(bytes);
    chunk[0] = 1;
    tempTrash.push(chunk);
    log(`alloc(${mb}MB) -> tempTrash chunks = ${tempTrash.length}`);
  };

  window.clearConsole = () => {
    logLines.length = 0;
    consoleView.innerHTML = "";
    logCount = 0;
    errCount = 0;
    if (mLogs) mLogs.textContent = "0";
    if (mErrs) mErrs.textContent = "0";
  };

  const cpuCtx = cpuCanvas.getContext("2d", { alpha: false, desynchronized: true });
  const ramCtx = ramCanvas.getContext("2d", { alpha: false, desynchronized: true });
  const samples = 240;
  const cpuBuf = new Float32Array(samples);
  const ramBuf = new Float32Array(samples);

  let idx = 0;
  let unlock120Enabled = false;
  let targetFps = 120;
  let targetDt = 1000 / targetFps;
  let fps = 0;
  let frames = 0;
  let lastFpsT = performance.now();
  let cpuEst = 0;
  let lastT = performance.now();
  let accumulator = 0;
  let lastRenderT = lastT;
  let sampleAcc = 0;
  let targetAcc = 0;
  let cpuScale = 1;
  let ramScale = 1;
  let waveJitter = 0.022;
  let ramSmooth = 0;
  let ramPhase = 0;
  let ramDrift = 0;

  const hasMem = !!(performance && performance.memory && performance.memory.usedJSHeapSize);
  if (!hasMem) {
    warn("performance.memory không có. RAM realtime sẽ hiển thị N/A.");
  }

  function setUnlockButtonState() {
    btnLock.textContent = `UnLock 120 FPS : ${unlock120Enabled ? "ON" : "OFF"}`;
    btnLock.classList.toggle("toggleOn", unlock120Enabled);
  }

  function setTrend(mode) {
    switch (mode) {
      case "clean-ram":
        ramScale = 0.6;
        waveJitter = 0.015;
        log("Trend: Dọn RAM -> sóng RAM giảm dần.");
        break;
      case "clean-cpu":
        cpuScale = 0.66;
        waveJitter = 0.014;
        log("Trend: Dọn CPU -> sóng CPU giảm dần.");
        break;
      case "opt-ram":
        ramScale = 0.78;
        waveJitter = 0.013;
        log("Trend: Tối Ưu RAM -> dao động thấp hơn.");
        break;
      case "opt-cpu":
        cpuScale = 0.8;
        waveJitter = 0.012;
        log("Trend: Tối Ưu CPU -> dao động ổn định hơn.");
        break;
      case "opt-fps":
        cpuScale = 0.84;
        ramScale = 0.9;
        waveJitter = 0.01;
        log("Trend: Tối Ưu FPS -> sóng mượt và ổn định.");
        break;
      default:
        cpuScale = 1;
        ramScale = 1;
        waveJitter = 0.022;
    }
  }

  function resizeCanvasToDPR(canvas, ctx) {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width * dpr));
    const height = Math.max(150, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  function drawWave(ctx, canvas, buf, colorStroke, label, valueText, autoScale = true) {
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "#030102";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255, 108, 124, 0.08)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < 6; i += 1) {
      const x = (width * i) / 6;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let i = 1; i < 4; i += 1) {
      const y = (height * i) / 4;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    let maxValue = 1;
    if (autoScale) {
      for (let i = 0; i < samples; i += 1) {
        maxValue = Math.max(maxValue, buf[i]);
      }
    }

    ctx.strokeStyle = colorStroke;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    const step = width / (samples - 1);
    for (let i = 0; i < samples; i += 1) {
      const bufferIndex = (idx + i) % samples;
      const normalized = autoScale ? buf[bufferIndex] / maxValue : buf[bufferIndex];
      const x = i * step;
      const y = height - normalized * (height - 24) - 12;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 224, 228, 0.94)";
    ctx.font = "12px Consolas, 'Courier New', monospace";
    ctx.fillText(label, 12, 18);

    ctx.fillStyle = "rgba(255, 154, 165, 0.96)";
    ctx.fillText(valueText, 12, height - 10);
  }

  function loop(t) {
    const dt = t - lastT;
    lastT = t;
    accumulator += dt;
    sampleAcc += dt;

    if (unlock120Enabled && accumulator < targetDt) {
      requestAnimationFrame(loop);
      return;
    }

    if (unlock120Enabled) {
      accumulator %= targetDt;
    }

    const workStart = performance.now();
    resizeCanvasToDPR(cpuCanvas, cpuCtx);
    resizeCanvasToDPR(ramCanvas, ramCtx);

    const frameMs = t - lastRenderT;
    lastRenderT = t;
    frames += 1;

    if (t - lastFpsT >= 800) {
      fps = Math.round((frames * 1000) / (t - lastFpsT));
      frames = 0;
      lastFpsT = t;

      if (mFps) {
        const displayed = unlock120Enabled
          ? Math.round(92 + Math.random() * 24)
          : Math.round(42 + Math.random() * 18);
        mFps.textContent = String(displayed);
      }
    }

    if (mFrame) {
      mFrame.textContent = frameMs.toFixed(1);
    }

    let usedMB = Number.NaN;
    if (hasMem) {
      usedMB = performance.memory.usedJSHeapSize / 1048576;
      if (mRam) {
        mRam.textContent = `${usedMB.toFixed(0)} MB`;
      }
    } else {
      ramPhase += dt * 0.0009;
      ramDrift += (Math.random() - 0.5) * 0.18;
      ramDrift = Math.max(-6, Math.min(6, ramDrift));
      const simulated = 190 + 12 * Math.sin(ramPhase) + 6 * Math.sin(ramPhase * 0.35) + ramDrift;
      usedMB = Math.max(120, simulated);
      if (mRam) {
        mRam.textContent = `${usedMB.toFixed(0)} MB`;
      }
    }

    const workEnd = performance.now();
    const busyMs = workEnd - workStart;
    const budget = unlock120Enabled ? targetDt : 16.67;
    const cpuNow = Math.max(0, Math.min(1, (busyMs / budget) * 0.9));
    cpuEst = cpuEst * 0.88 + cpuNow * 0.12;

    if (sampleAcc >= 140) {
      sampleAcc %= 140;
      const drift = 0.18 + 0.12 * Math.sin(t / 700) + 0.06 * Math.sin(t / 2100);
      const cpuNoise = (Math.random() - 0.5) * waveJitter * 2;
      cpuBuf[idx] = Math.max(0.05, Math.min(0.96, cpuEst * 0.5 * cpuScale + drift + cpuNoise));

      const ramValue = Number.isFinite(usedMB) ? usedMB : ramSmooth;
      ramSmooth = ramSmooth ? ramSmooth * 0.96 + ramValue * 0.04 : ramValue;
      ramBuf[idx] = ramSmooth * ramScale;
      idx = (idx + 1) % samples;
    }

    drawWave(
      cpuCtx,
      cpuCanvas,
      cpuBuf,
      "rgba(255, 74, 96, 0.98)",
      "CPU est (%)",
      `FPS: ${fps} | Frame: ${frameMs.toFixed(1)}ms`,
      false
    );

    drawWave(
      ramCtx,
      ramCanvas,
      ramBuf,
      "rgba(255, 136, 148, 0.96)",
      "RAM (MB)",
      hasMem ? `Heap Used: ${usedMB.toFixed(0)} MB` : "Heap Used: N/A",
      true
    );

    if (mCpu) {
      mCpu.textContent = String(Math.round(cpuEst * 100));
    }

    if (mTarget) {
      targetAcc += dt;
      if (targetAcc >= 900) {
        targetAcc = 0;
        mTarget.textContent = String(unlock120Enabled ? 120 : 120);
      }
    }

    requestAnimationFrame(loop);
  }

  btnLock.addEventListener("click", () => {
    playToggleSound();
    unlock120Enabled = !unlock120Enabled;
    setUnlockButtonState();
    log("UnLock FPS:", unlock120Enabled ? "ON (120 FPS)" : "OFF (native rAF)");
  });

  btnClearConsole.addEventListener("click", () => {
    playToggleSound();
    window.clearConsole();
    log("Console cleared.");
  });

  btnCleanRam.addEventListener("click", () => {
    playToggleSound();
    tempTrash = [];
    ramBuf.fill(0);
    idx = 0;
    log("Dọn RAM: xóa bộ nhớ giả lập và reset RAM wave.");
    setTrend("clean-ram");
    runProgress("Dọn RAM", "clean-ram");
  });

  btnCleanCpu.addEventListener("click", () => {
    playToggleSound();
    cpuBuf.fill(0);
    idx = 0;
    log("Dọn CPU: reset CPU wave và giảm tải demo.");
    setTrend("clean-cpu");
    runProgress("Dọn CPU", "clean-cpu");
  });

  btnOptRam.addEventListener("click", () => {
    playToggleSound();
    tempTrash = [];
    ramBuf.fill(0);
    idx = 0;
    log("Tối Ưu RAM: dọn dữ liệu giả lập, ưu tiên heap sạch.");
    setTrend("opt-ram");
    runProgress("Tối Ưu RAM", "opt-ram");
  });

  btnOptCpu.addEventListener("click", () => {
    playToggleSound();
    cpuBuf.fill(0);
    idx = 0;
    log("Tối Ưu CPU: reset wave, ưu tiên frame ổn định.");
    setTrend("opt-cpu");
    runProgress("Tối Ưu CPU", "opt-cpu");
  });

  btnOptFps.addEventListener("click", () => {
    playToggleSound();
    unlock120Enabled = true;
    targetFps = 120;
    targetDt = 1000 / targetFps;
    setUnlockButtonState();
    log("Tối Ưu FPS: bật UnLock 120 FPS.");
    setTrend("opt-fps");
    runProgress("Tối Ưu FPS", "opt-fps");
  });

  function execCmd() {
    const value = cmd.value.trim();
    if (!value) return;
    cmd.value = "";

    try {
      const fn = new Function("log", "warn", "err", `"use strict"; return (${value});`);
      const out = fn(log, warn, err);
      if (out !== undefined) log(out);
    } catch {
      try {
        const fn = new Function("log", "warn", "err", `"use strict"; ${value}`);
        const out = fn(log, warn, err);
        if (out !== undefined) log(out);
      } catch (error) {
        err(String(error));
      }
    }
  }

  cmd.addEventListener("keydown", (event) => {
    if (event.key === "Enter") execCmd();
  });
  btnExec.addEventListener("click", execCmd);

  setUnlockButtonState();
  log("Ready. Type help() to see commands.");
  requestAnimationFrame(loop);
}

function initApp() {
  bindNavigation();
  bindFeatureToggles();
  initBoosterProfiles();
  bindLaunchButtons();
  initSettings();
  initRealtimeMonitor();
  showSection("home");
}

window.showSection = showSection;
initApp();
