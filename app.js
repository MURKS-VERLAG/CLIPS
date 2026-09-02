const TOTAL_PAGES = 4;
const CLIPS_PER_PAGE = 10;

let currentPage = 1;
let clip01RunToken = 0;
let clip01Raf = null;
const clip01Timers = new Set();

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

  setTimeout(() => puff.remove(), 1450);
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
  const orbitDone = await orbitSymbols(orbiters, 2300, token);
  if (!orbitDone || token !== clip01RunToken) return;

  if (!(await waitClip01(180, token))) return;

  // 4) Alle Außensymbole fahren gleichzeitig an ihre Stammposition.
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

  clipStage.dataset.activeClip = String(clipNumber);

  if (clipNumber === 1) {
    clipStageBackground.src = "assets/clip01/frame-clean.png";
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
  }
}

function closeClip() {
  const clipStage = getClipStage();

  if (!vault || !clipStage) return;

  stopClip01Animation();

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