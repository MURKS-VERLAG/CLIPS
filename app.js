const TOTAL_PAGES = 4;
const CLIPS_PER_PAGE = 10;

let currentPage = 1;
let clip01RunToken = 0;
let clip01Raf = null;
const clip01Timers = new Set();

let clip02RunToken = 0;
let clip02Raf = null;
const clip02Timers = new Set();
const clip02Soundtrack = new Audio("assets/clip02/soundtrack.mp3");
clip02Soundtrack.preload = "auto";
clip02Soundtrack.volume = 1;

const clip01Sounds = {
  impact: new Audio("assets/clip01/sound-impact.mp3"),
  orbit: new Audio("assets/clip01/sound-orbit.mp3"),
  travel: new Audio("assets/clip01/sound-travel.mp3")
};

Object.values(clip01Sounds).forEach((audio) => {
  audio.preload = "auto";
  audio.volume = 1;
});

function playClip01Sound(name) {
  const audio = clip01Sounds[name];
  if (!audio) return;

  try {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = 1;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  } catch (_) {}
}

function stopClip01Sounds() {
  Object.values(clip01Sounds).forEach((audio) => {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (_) {}
  });
}

const vault = document.getElementById("vault");
const clipGrid = document.getElementById("clipGrid");
const pageLabel = document.getElementById("pageLabel");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");

function getClipStage() {
  return document.getElementById("clipStage");
}

function getClipStageBackground() {
  return document.getElementById("clipStageBackground");
}

function getClipStageBackgroundNext() {
  return document.getElementById("clipStageBackgroundNext");
}

function getClip01Layer() {
  return document.getElementById("clip01AnimationLayer");
}

function getClip02Layer() {
  return document.getElementById("clip02AnimationLayer");
}

const clip02Images = [
  "assets/clip02/01-murks.webp",
  "assets/clip02/02-firefly.webp",
  "assets/clip02/03-sagen-renchtal.webp",
  "assets/clip02/04-archivkarte.webp",
  "assets/clip02/05-lautenbach.webp",
  "assets/clip02/06-waldplatz.webp",
  "assets/clip02/07-burgruine.webp",
  "assets/clip02/08-sagen-schwarzwald.webp",
  "assets/clip02/09-urkunde.webp",
  "assets/clip02/10-baerenbach-seite.webp",
  "assets/clip02/11-siegel-wedel.webp",
  "assets/clip02/12-allerheiligen.webp",
  "assets/clip02/13-siegel-kelch.webp",
  "assets/clip02/14-steinfigur.webp",
  "assets/clip02/15-steinkreuz.webp",
  "assets/clip02/16-schreibtisch-final.webp"
];

const clip02CueTimes = clip02Images.map((_, index) => index === 0 ? 1 : 1.25 + index * 4);

function clearClip02Timers() {
  clip02Timers.forEach((timer) => clearTimeout(timer));
  clip02Timers.clear();
}

function stopClip02Animation() {
  clip02RunToken += 1;

  if (clip02Raf) {
    cancelAnimationFrame(clip02Raf);
    clip02Raf = null;
  }

  clearClip02Timers();

  try {
    clip02Soundtrack.pause();
    clip02Soundtrack.currentTime = 0;
  } catch (_) {}

  const layer = getClip02Layer();
  if (layer) layer.innerHTML = "";
}

function createClip02Image(src, isFinal = false) {
  const layer = getClip02Layer();
  if (!layer) return null;

  layer.innerHTML = "";

  const safeZone = document.createElement("div");
  safeZone.className = "clip02-safe-zone";

  const img = document.createElement("img");
  img.className = `clip02-image${isFinal ? " clip02-image--final" : ""}`;
  img.src = src;
  img.alt = "";
  img.draggable = false;

  safeZone.appendChild(img);
  layer.appendChild(safeZone);

  requestAnimationFrame(() => {
    img.classList.add("is-active");
  });

  return img;
}

function showClip02TimedImage(src, token) {
  if (token !== clip02RunToken) return;

  const img = createClip02Image(src, false);
  if (!img) return;

  const timer = setTimeout(() => {
    clip02Timers.delete(timer);
    if (token !== clip02RunToken) return;
    const layer = getClip02Layer();
    if (layer) layer.innerHTML = "";
  }, 1100);

  clip02Timers.add(timer);
}

function showClip02FinalImage(src, token) {
  if (token !== clip02RunToken) return;

  const img = createClip02Image(src, true);
  if (!img) return;

  const safeZone = img.closest(".clip02-safe-zone");
  if (!safeZone) return;

  const smoke = document.createElement("div");
  smoke.className = "clip02-cigarette-smoke";

  for (let index = 0; index < 6; index += 1) {
    const wisp = document.createElement("span");
    wisp.className = "clip02-cigarette-smoke__wisp";
    wisp.style.setProperty("--smoke-index", String(index));
    smoke.appendChild(wisp);
  }

  safeZone.appendChild(smoke);

  requestAnimationFrame(() => {
    smoke.classList.add("is-active");
  });
}

async function playClip02() {
  stopClip02Animation();
  const token = clip02RunToken;
  const layer = getClip02Layer();

  if (!layer) return;

  layer.innerHTML = "";

  // Preload all sequence images without changing the visible frame.
  clip02Images.forEach((src) => {
    const preload = new Image();
    preload.src = src;
  });

  try {
    clip02Soundtrack.currentTime = 0;
    clip02Soundtrack.volume = 1;
    await clip02Soundtrack.play();
  } catch (_) {
    return;
  }

  if (token !== clip02RunToken) return;

  let nextCueIndex = 0;

  const tick = () => {
    if (token !== clip02RunToken) return;

    const currentTime = clip02Soundtrack.currentTime;

    while (
      nextCueIndex < clip02CueTimes.length &&
      currentTime >= clip02CueTimes[nextCueIndex]
    ) {
      const isFinal = nextCueIndex === clip02Images.length - 1;

      if (isFinal) {
        showClip02FinalImage(clip02Images[nextCueIndex], token);
      } else {
        showClip02TimedImage(clip02Images[nextCueIndex], token);
      }

      nextCueIndex += 1;
    }

    if (!clip02Soundtrack.ended) {
      clip02Raf = requestAnimationFrame(tick);
    } else {
      clip02Raf = null;

      // Neues Schreibtisch-Endbild bleibt bis exakt zum Songende stehen und fadet dann sauber aus.
      const finalImg = layer.querySelector(".clip02-image--final");
      if (finalImg) {
        finalImg.classList.add("is-ending");

        const timer = setTimeout(() => {
          clip02Timers.delete(timer);
          if (token === clip02RunToken) layer.innerHTML = "";
        }, 520);

        clip02Timers.add(timer);
      }
    }
  };

  clip02Raf = requestAnimationFrame(tick);
}

function getFrameForClip(clipNumber) {
  if (clipNumber >= 21 && clipNumber <= 40) {
    return "assets/clip-frame-grid.png";
  }

  return "assets/clip-frame.png";
}

function waitClip01(ms, token) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clip01Timers.delete(timer);
      resolve(token === clip01RunToken);
    }, ms);
    clip01Timers.add(timer);
  });
}

function stopClip01Animation() {
  clip01RunToken += 1;
  stopClip01Sounds();

  if (clip01Raf) {
    cancelAnimationFrame(clip01Raf);
    clip01Raf = null;
  }

  clip01Timers.forEach((timer) => clearTimeout(timer));
  clip01Timers.clear();

  const layer = getClip01Layer();
  if (layer) layer.innerHTML = "";

  const next = getClipStageBackgroundNext();
  if (next) {
    next.style.transition = "none";
    next.style.opacity = "0";
    next.src = "";
  }
}

function createClip01Symbol(config) {
  const layer = getClip01Layer();
  const img = document.createElement("img");

  img.className = "clip01-symbol";
  if (config.mirrored) img.classList.add("is-mirrored");

  img.src = config.src;
  img.alt = "";
  img.draggable = false;
  img.dataset.key = config.key;
  img.style.setProperty("--symbol-width", config.width);
  img.style.left = `${config.start.x}%`;
  img.style.top = `${config.start.y}%`;

  layer.appendChild(img);
  return { ...config, el: img };
}

function fadeInSymbol(symbol, duration = 560) {
  const mirrored = symbol.mirrored ? -1 : 1;
  return symbol.el.animate(
    [
      {
        opacity: 0,
        transform: `translate(-50%, -50%) scaleX(${mirrored}) scale(.82)`
      },
      {
        opacity: 1,
        transform: `translate(-50%, -50%) scaleX(${mirrored}) scale(1)`
      }
    ],
    {
      duration,
      easing: "cubic-bezier(.2,.75,.25,1)",
      fill: "forwards"
    }
  ).finished.catch(() => {});
}

function orbitSymbols(symbols, duration, token) {
  const center = { x: 50, y: 50 };
  const ellipseYScale = 0.82;

  /*
    WICHTIG:
    Jeder Orbit startet EXAKT an der aktuellen sichtbaren Startposition
    des Symbols und endet nach 360° wieder EXAKT dort.
    Damit gibt es vor und nach der Kreisfahrt keinen Sprung mehr.
  */
  const orbitData = symbols.map((symbol) => {
    const dx = symbol.start.x - center.x;
    const dy = symbol.start.y - center.y;

    const radiusX = Math.hypot(dx, dy / ellipseYScale);
    const angle = Math.atan2(
      dy / ellipseYScale,
      dx
    );

    return {
      symbol,
      radiusX,
      radiusY: radiusX * ellipseYScale,
      angle
    };
  });

  return new Promise((resolve) => {
    const startTime = performance.now();

    const tick = (now) => {
      if (token !== clip01RunToken) {
        resolve(false);
        return;
      }

      const t = Math.min(1, (now - startTime) / duration);
      const eased = t < .5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

      const rotation = eased * Math.PI * 2;

      orbitData.forEach(({ symbol, radiusX, radiusY, angle }) => {
        const a = angle + rotation;
        const x = center.x + Math.cos(a) * radiusX;
        const y = center.y + Math.sin(a) * radiusY;

        symbol.el.style.left = `${x}%`;
        symbol.el.style.top = `${y}%`;
      });

      if (t < 1) {
        clip01Raf = requestAnimationFrame(tick);
      } else {
        clip01Raf = null;

        // Exakt auf Ausgangskoordinaten fixieren.
        symbols.forEach((symbol) => {
          symbol.el.style.left = `${symbol.start.x}%`;
          symbol.el.style.top = `${symbol.start.y}%`;
        });

        resolve(true);
      }
    };

    clip01Raf = requestAnimationFrame(tick);
  });
}

function animateToTarget(symbol, duration) {
  const mirrored = symbol.mirrored ? -1 : 1;

  const animation = symbol.el.animate(
    [
      {
        left: `${symbol.start.x}%`,
        top: `${symbol.start.y}%`,
        transform: `translate(-50%, -50%) scaleX(${mirrored}) scale(1)`,
        opacity: 1
      },
      {
        left: `${symbol.target.x}%`,
        top: `${symbol.target.y}%`,
        transform: `translate(-50%, -50%) scaleX(${mirrored}) scale(${symbol.targetScale || 1})`,
        opacity: 1
      }
    ],
    {
      duration,
      easing: "cubic-bezier(.34,.04,.18,1)",
      fill: "forwards"
    }
  );

  return animation.finished.catch(() => {});
}

function puffAt(x, y, type = "dark") {
  const layer = getClip01Layer();
  const puff = document.createElement("div");

  puff.className = `clip01-puff clip01-puff--${type}`;
  puff.style.left = `${x}%`;
  puff.style.top = `${y}%`;

  layer.appendChild(puff);

  requestAnimationFrame(() => {
    puff.classList.add("is-active");
  });

  setTimeout(() => puff.remove(), 2550);
}

function borderPuff() {
  const layer = getClip01Layer();
  if (!layer) return;

  const puff = document.createElement("div");
  puff.className = "clip01-border-puff";
  layer.appendChild(puff);

  requestAnimationFrame(() => {
    puff.classList.add("is-active");
  });

  setTimeout(() => puff.remove(), 1250);
}

function impactShake() {
  const stage = getClipStage();
  if (!stage) return;

  stage.classList.remove("is-impacting");
  void stage.offsetWidth;
  stage.classList.add("is-impacting");

  const timer = setTimeout(() => {
    clip01Timers.delete(timer);
    stage.classList.remove("is-impacting");
  }, 430);

  clip01Timers.add(timer);
}

async function crossfadeBackground(src, token) {
  const current = getClipStageBackground();
  const next = getClipStageBackgroundNext();

  if (!current || !next || token !== clip01RunToken) return false;

  next.style.transition = "none";
  next.style.opacity = "0";
  next.src = src;

  try {
    await next.decode();
  } catch (_) {}

  if (token !== clip01RunToken) return false;

  next.style.transition = "opacity 180ms ease-in-out";
  requestAnimationFrame(() => {
    next.style.opacity = "1";
  });

  const ok = await waitClip01(190, token);
  if (!ok) return false;

  current.src = src;
  next.style.transition = "none";
  next.style.opacity = "0";
  next.src = "";

  return true;
}

async function playClip01() {
  stopClip01Animation();
  const token = clip01RunToken;

  const current = getClipStageBackground();
  const next = getClipStageBackgroundNext();
  const layer = getClip01Layer();

  if (!current || !next || !layer) return;

  current.src = "assets/clip01/frame-clean.png";
  next.style.opacity = "0";
  next.src = "";
  layer.innerHTML = "";

  const goat = createClip01Symbol({
    key: "goat",
    src: "assets/clip01/goat.png",
    width: "12.2vw",
    start: { x: 50.0, y: 49.4 },
    target: { x: 50.0, y: 10.2 },
    targetScale: .93
  });

  const orbiters = [
    createClip01Symbol({
      key: "helmet-left",
      src: "assets/clip01/helmet.png",
      width: "7.0vw",
      start: { x: 47.2, y: 34.5 },
      target: { x: 4.6, y: 8.1 },
      targetScale: .72
    }),
    createClip01Symbol({
      key: "helmet-right",
      src: "assets/clip01/helmet.png",
      width: "7.0vw",
      mirrored: true,
      start: { x: 52.7, y: 34.5 },
      target: { x: 95.0, y: 8.1 },
      targetScale: .72
    }),
    createClip01Symbol({
      key: "sword-left",
      src: "assets/clip01/sword.png",
      width: "10.2vw",
      start: { x: 29.8, y: 49.8 },
      target: { x: 4.3, y: 50.2 },
      targetScale: .88
    }),
    createClip01Symbol({
      key: "sword-right",
      src: "assets/clip01/sword.png",
      width: "10.2vw",
      start: { x: 71.1, y: 49.8 },
      target: { x: 95.3, y: 50.2 },
      targetScale: .88
    }),
    createClip01Symbol({
      key: "cup",
      src: "assets/clip01/cup.png",
      width: "8.7vw",
      start: { x: 37.3, y: 49.3 },
      target: { x: 5.2, y: 91.6 },
      targetScale: .64
    }),
    createClip01Symbol({
      key: "wheel",
      src: "assets/clip01/wheel.png",
      width: "8.5vw",
      start: { x: 63.3, y: 49.3 },
      target: { x: 94.4, y: 91.4 },
      targetScale: .68
    }),
    createClip01Symbol({
      key: "bottom-shield",
      src: "assets/clip01/bottom-shield.png",
      width: "9.3vw",
      start: { x: 50.0, y: 67.1 },
      target: { x: 50.0, y: 92.2 },
      targetScale: .84
    })
  ];

  // 1) Bock erscheint zuerst.
  await fadeInSymbol(goat, 720);
  if (token !== clip01RunToken) return;

  // NEU: Bock steht exakt 2 Sekunden alleine.
  if (!(await waitClip01(2000, token))) return;

  // 2) Alle anderen Symbole erscheinen gemeinsam.
  await Promise.all(orbiters.map((symbol) => fadeInSymbol(symbol, 520)));
  if (token !== clip01RunToken) return;

  // NEU: Alle Symbole stehen 1,5 Sekunden ruhig, bevor die Kreisfahrt beginnt.
  if (!(await waitClip01(1500, token))) return;

  // 3) Eine komplette Kreisfahrt im Uhrzeigersinn.
  // Die beiden Helme bleiben dabei bewusst getrennt.
  playClip01Sound("orbit");
  const orbitDone = await orbitSymbols(orbiters, 2300, token);
  if (!orbitDone || token !== clip01RunToken) return;

  if (!(await waitClip01(180, token))) return;

  // 4) Alle Außensymbole fahren gleichzeitig an ihre Stammposition.
  playClip01Sound("travel");
  const travelDuration = 1750;
  await Promise.all(
    orbiters.map((symbol) => animateToTarget(symbol, travelDuration))
  );
  if (token !== clip01RunToken) return;

  // NEU: Außensymbole bleiben dort sichtbar stehen.
  if (!(await waitClip01(260, token))) return;

  // 5) Bock fährt jetzt allein nach oben.
  await animateToTarget(goat, 1350);
  if (token !== clip01RunToken) return;

  // 6) Sobald der Bock angekommen ist, verpuffen ALLE gleichzeitig.
  // Impact: Sound + kurzer Einschlag-Ruckler + leichter dunkler Puff am Goldrand.
  playClip01Sound("impact");
  impactShake();
  borderPuff();

  orbiters.forEach((symbol) => {
    puffAt(symbol.target.x, symbol.target.y, "dark");

    symbol.el.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: 180,
        easing: "ease-out",
        fill: "forwards"
      }
    );
  });

  puffAt(goat.target.x, goat.target.y, "gold");

  goat.el.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    {
      duration: 180,
      easing: "ease-out",
      fill: "forwards"
    }
  );

  /*
    Zwischenbild entfällt komplett.
    Während die Puffs den Bildschirm kaschieren, wechseln wir direkt
    vom Startbild auf das endgültige Goldrahmen-Bild.
  */
  await crossfadeBackground("assets/clip-frame.png", token);
  if (token !== clip01RunToken) return;

  orbiters.forEach((symbol) => symbol.el.remove());
  goat.el.remove();
}

function openClip(clipNumber) {
  const clipStage = getClipStage();
  const clipStageBackground = getClipStageBackground();
  const clipStageBackgroundNext = getClipStageBackgroundNext();

  if (!vault || !clipStage || !clipStageBackground || !clipStageBackgroundNext) {
    console.error(`Clip ${String(clipNumber).padStart(2, "0")} kann nicht geöffnet werden.`);
    return;
  }

  stopClip01Animation();
  stopClip02Animation();

  clipStage.dataset.activeClip = String(clipNumber);

  if (clipNumber === 1) {
    clipStageBackground.src = "assets/clip01/frame-clean.png";
  } else if (clipNumber === 2) {
    // Clip 02: ursprünglicher Goldrahmen bleibt permanent als Hintergrund sichtbar.
    clipStageBackground.src = "assets/clip-frame.png";
  } else {
    clipStageBackground.src = getFrameForClip(clipNumber);
  }

  clipStageBackgroundNext.style.opacity = "0";
  clipStageBackgroundNext.src = "";

  vault.style.display = "none";
  clipStage.hidden = false;
  clipStage.style.setProperty("display", "block", "important");

  if (clipNumber === 1) {
    requestAnimationFrame(() => playClip01());
  } else if (clipNumber === 2) {
    requestAnimationFrame(() => playClip02());
  }
}

function closeClip() {
  const clipStage = getClipStage();

  if (!vault || !clipStage) return;

  stopClip01Animation();
  stopClip02Animation();

  clipStage.hidden = true;
  clipStage.style.setProperty("display", "none", "important");
  clipStage.removeAttribute("data-active-clip");

  vault.style.display = "";
}

function renderPage() {
  if (!clipGrid) return;

  clipGrid.innerHTML = "";

  const firstClipNumber = (currentPage - 1) * CLIPS_PER_PAGE + 1;

  for (let index = 0; index < CLIPS_PER_PAGE; index += 1) {
    const clipNumber = firstClipNumber + index;

    const card = document.createElement("button");
    card.type = "button";
    card.className = "clip-card";
    card.dataset.clip = String(clipNumber);
    card.setAttribute(
      "aria-label",
      `Clip ${String(clipNumber).padStart(2, "0")}`
    );

    const number = document.createElement("span");
    number.className = "clip-card__number";
    number.textContent = String(clipNumber).padStart(2, "0");

    card.appendChild(number);
    clipGrid.appendChild(card);
  }

  pageLabel.textContent = `SEITE ${currentPage} / ${TOTAL_PAGES}`;
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === TOTAL_PAGES;
}

clipGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".clip-card");

  if (!card || !clipGrid.contains(card)) return;

  const clipNumber = Number(card.dataset.clip);

  if (clipNumber >= 1 && clipNumber <= 40) {
    openClip(clipNumber);
  }
});

prevPageButton.addEventListener("click", () => {
  if (currentPage <= 1) return;

  currentPage -= 1;
  renderPage();
});

nextPageButton.addEventListener("click", () => {
  if (currentPage >= TOTAL_PAGES) return;

  currentPage += 1;
  renderPage();
});

document.addEventListener("keydown", (event) => {
  const clipStage = getClipStage();

  if (event.key === "Escape" && clipStage && !clipStage.hidden) {
    closeClip();
  }
});

renderPage();