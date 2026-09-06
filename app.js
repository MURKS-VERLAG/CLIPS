const TOTAL_PAGES = 4;
const CLIPS_PER_PAGE = 10;

let currentPage = 1;
let clip01RunToken = 0;
let clip01Raf = null;
const clip01Timers = new Set();

let clip02RunToken = 0;
let clip02Raf = null;
const clip02Timers = new Set();

let clip03RunToken = 0;
const clip03Timers = new Set();
const clip03Soundtrack = new Audio("assets/clip03/lumen-in-tenebris.mp3");
clip03Soundtrack.preload = "auto";
clip03Soundtrack.volume = 1;

const clip03GedoresImage = "assets/clip03/gedoes-hubacker.webp";
const clip03NuwensteinImage = "assets/clip03/nuwenstein.webp";
const clip03BerenbachImage = "assets/clip03/berenbach.webp";
const clip03HansNuwensteinImage = "assets/clip03/johann-hans-nuwenstein.webp";
const clip03AnnaNuwensteinImage = "assets/clip03/anna-nuwenstein.webp";
const clip03NuwensteinChildren = [
  { src: "assets/clip03/heinrich-nuwenstein.webp", name: "Heinrich Nuwenstein" },
  { src: "assets/clip03/johann-nuwenstein.webp", name: "Johann Nuwenstein" },
  { src: "assets/clip03/ottilie-nuwenstein.webp", name: "Ottilie Nuwenstein" },
  { src: "assets/clip03/nothburga-nuwenstein.webp", name: "Nothburga Nuwenstein" },
  { src: "assets/clip03/adelheid-nuwenstein.webp", name: "Adelheid Nuwenstein" },
  { src: "assets/clip03/berthold-nuwenstein.webp", name: "Berthold Nuwenstein" }
];
const clip03JohannBerenbachImage = "assets/clip03/johann-berenbach.webp";
const clip03OttilieBerenbachImage = "assets/clip03/ottilie-nuwenstein-berenbach.webp";
const clip03BuerkelinBerenbachImage = "assets/clip03/buerkelin-berenbach.webp";
const clip03JohannesBerenbachImage = "assets/clip03/johannes-berenbach.webp";
const clip03WomanRest = "assets/clip03/woman-rest.webp";
const clip03WomanSingImages = [
  "assets/clip03/woman-sing-01.webp",
  "assets/clip03/woman-sing-02.webp",
  "assets/clip03/woman-sing-03.webp",
  "assets/clip03/woman-sing-04.webp",
  "assets/clip03/woman-sing-05.webp",
  "assets/clip03/woman-sing-06.webp",
  "assets/clip03/woman-sing-07.webp",
  "assets/clip03/woman-sing-08.webp"
];
const clip03WomanEndImages = [
  "assets/clip03/woman-end-01.webp",
  "assets/clip03/woman-end-02.webp",
  "assets/clip03/woman-end-03.webp",
  "assets/clip03/woman-end-04.webp",
  "assets/clip03/woman-end-05.webp",
  "assets/clip03/woman-end-06.webp",
  "assets/clip03/woman-end-07.webp"
];
const clip03DialogLeftImage01 = "assets/clip03/dialog-left-01-red.webp";
const clip03DialogLeftImage02 = "assets/clip03/dialog-left-02-red-wave.webp";
const clip03DialogRightImage01 = "assets/clip03/dialog-right-01-blue.webp";
const clip03DialogRightImage02 = "assets/clip03/dialog-right-02-blue-wave.webp";
const clip03DialogCenterImage01 = "assets/clip03/dialog-center-01-judge.png";
const clip03DialogLeftImage03 = "assets/clip03/dialog-left-03-shocked.png";
const clip03DialogRightImage03 = "assets/clip03/dialog-right-03-shocked.png";
const clip03DialogCenterImage02 = "assets/clip03/dialog-center-02-fist.png";
const clip03DialogCenterImage03 = "assets/clip03/dialog-center-03-slam.png";
const clip03DialogCenterImage04 = "assets/clip03/dialog-center-04-knight.png";
const clip03DialogGoatImage01 = "assets/clip03/dialog-goat-01-tongue.png";
const clip03DialogGoatImage02 = "assets/clip03/dialog-goat-02-front.png";
const clip03DialogGoatImage03 = "assets/clip03/dialog-goat-03-blank.png";
const clip03FamilyJohannesBerenbachImage = "assets/clip03/dialog-family-johannes-berenbach.webp";
const clip03FamilyBurkhartBerenbachImage = "assets/clip03/dialog-family-burkhart-berenbach.webp";
const clip03FamilyNothburgaNuwensteinImage = "assets/clip03/dialog-family-nothburga-nuwenstein.webp";

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

function getClip03Layer() {
  return document.getElementById("clip03AnimationLayer");
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


function waitClip03(ms, token) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      clip03Timers.delete(timer);
      resolve(token === clip03RunToken);
    }, ms);
    clip03Timers.add(timer);
  });
}

function stopClip03Animation() {
  clip03RunToken += 1;

  clip03Timers.forEach((timer) => clearTimeout(timer));
  clip03Timers.clear();

  try {
    clip03Soundtrack.pause();
    clip03Soundtrack.currentTime = 0;
  } catch (_) {}

  const layer = getClip03Layer();
  if (layer) layer.innerHTML = "";
}

function createClip03StaticSymbolIn(container, config) {
  if (!container) return null;

  const img = document.createElement("img");
  img.className = "clip03-symbol";

  if (config.mirrored) {
    img.classList.add("is-mirrored");
  }

  img.src = config.src;
  img.alt = "";
  img.draggable = false;
  img.style.setProperty("--clip03-symbol-width", config.width);
  img.style.setProperty("--clip03-symbol-scale", String(config.scale || 1));
  img.style.left = `${config.x}%`;
  img.style.top = `${config.y}%`;

  container.appendChild(img);
  return img;
}

function buildClip03FinalScene(container) {
  if (!container) return;

  const background = document.createElement("img");
  background.className = "clip03-scene-background";
  background.src = "assets/clip01/frame-clean.png";
  background.alt = "";
  background.draggable = false;
  container.appendChild(background);

  createClip03StaticSymbolIn(container, {
    src: "assets/clip01/goat.png",
    width: "12.2vw",
    x: 50.0,
    y: 10.2,
    scale: .93
  });

  createClip03StaticSymbolIn(container, {
    src: "assets/clip01/helmet.png",
    width: "7.0vw",
    x: 4.6,
    y: 8.1,
    scale: .72
  });

  createClip03StaticSymbolIn(container, {
    src: "assets/clip01/helmet.png",
    width: "7.0vw",
    x: 95.0,
    y: 8.1,
    scale: .72,
    mirrored: true
  });

  createClip03StaticSymbolIn(container, {
    src: "assets/clip01/sword.png",
    width: "10.2vw",
    x: 4.3,
    y: 50.2,
    scale: .88
  });

  createClip03StaticSymbolIn(container, {
    src: "assets/clip01/sword.png",
    width: "10.2vw",
    x: 95.3,
    y: 50.2,
    scale: .88
  });

  createClip03StaticSymbolIn(container, {
    src: "assets/clip01/cup.png",
    width: "8.7vw",
    x: 5.2,
    y: 91.6,
    scale: .64
  });

  createClip03StaticSymbolIn(container, {
    src: "assets/clip01/wheel.png",
    width: "8.5vw",
    x: 94.4,
    y: 91.4,
    scale: .68
  });

  createClip03StaticSymbolIn(container, {
    src: "assets/clip01/bottom-shield.png",
    width: "9.3vw",
    x: 50.0,
    y: 92.2,
    scale: .84
  });
}

function createClip03GedoresCard(layer) {
  const card = document.createElement("div");
  card.className = "clip03-gedoes-card";

  const img = document.createElement("img");
  img.className = "clip03-gedoes-image";
  img.src = clip03GedoresImage;
  img.alt = "";
  img.draggable = false;

  const title = document.createElement("div");
  title.className = "clip03-gedoes-title";
  title.innerHTML = `
    <strong>DAS GEDÖS</strong>
    <em>das Getöse</em>
    <strong class="clip03-gedoes-subtitle">Talenge bei Hubacker</strong>
  `;

  card.appendChild(img);
  card.appendChild(title);
  layer.appendChild(card);
  return card;
}

function showClip03GedoresCard(card) {
  if (!card) return;
  requestAnimationFrame(() => card.classList.add("is-visible"));
}

function hideClip03GedoresCard(card) {
  if (!card) return;
  card.classList.remove("is-visible");
  card.classList.add("is-fading-out");
}


function createClip03CastleSequence(layer) {
  const sequence = document.createElement("div");
  sequence.className = "clip03-castle-sequence";

  const makeCard = (src, titleHtml, extraClass) => {
    const card = document.createElement("div");
    card.className = `clip03-castle-card ${extraClass}`;

    const img = document.createElement("img");
    img.className = "clip03-castle-image";
    img.src = src;
    img.alt = "";
    img.draggable = false;

    const title = document.createElement("div");
    title.className = "clip03-castle-title";
    title.innerHTML = titleHtml;

    card.appendChild(img);
    card.appendChild(title);
    sequence.appendChild(card);
    return { card, title };
  };

  const nuwenstein = makeCard(
    clip03NuwensteinImage,
    `
      <strong>NUWENSTEIN</strong>
      <em>Neuenstein</em>
      <span>Als „Burgstall Alt-Neuenstein“ dokumentiert</span>
      <span>Waldgebiet Hubackerhof</span>
    `,
    "clip03-castle-card--nuwenstein"
  );

  const berenbach = makeCard(
    clip03BerenbachImage,
    `
      <strong>BERNBACH / BERENBACH</strong>
      <em>Burg Bärenbach</em>
      <span>Otschenfeld bei Ramsbach</span>
    `,
    "clip03-castle-card--berenbach"
  );

  layer.appendChild(sequence);
  return { sequence, nuwenstein, berenbach };
}

function showClip03CastleCard(entry) {
  if (!entry?.card) return;
  entry.card.classList.remove("is-fading-out");
  requestAnimationFrame(() => entry.card.classList.add("is-visible"));
}

function hideClip03CastleCard(entry) {
  if (!entry?.card) return;
  entry.card.classList.remove("is-visible");
  entry.card.classList.add("is-fading-out");
}

function showClip03CastleTitle(entry) {
  if (!entry?.title) return;
  requestAnimationFrame(() => entry.title.classList.add("is-visible"));
}

function hideClip03CastleTitle(entry) {
  if (!entry?.title) return;
  entry.title.classList.remove("is-visible");
}


function createClip03NuwensteinFamilySequence(layer) {
  const sequence = document.createElement("div");
  sequence.className = "clip03-family-sequence";

  const houseTitle = document.createElement("div");
  houseTitle.className = "clip03-house-title";
  houseTitle.textContent = "HAUS NUWENSTEIN";

  const hans = document.createElement("div");
  hans.className = "clip03-family-person clip03-family-person--hans";
  hans.innerHTML = `
    <div class="clip03-family-name">JOHANN "HANS" NUWENSTEIN</div>
    <img class="clip03-family-image" src="${clip03HansNuwensteinImage}" alt="" draggable="false">
  `;

  const anna = document.createElement("div");
  anna.className = "clip03-family-person clip03-family-person--anna";
  anna.innerHTML = `
    <div class="clip03-family-name">ANNA NUWENSTEIN</div>
    <img class="clip03-family-image" src="${clip03AnnaNuwensteinImage}" alt="" draggable="false">
  `;

  const rings = document.createElement("div");
  rings.className = "clip03-marriage-rings";
  rings.innerHTML = `
    <span class="clip03-marriage-ring clip03-marriage-ring--left"></span>
    <span class="clip03-marriage-ring clip03-marriage-ring--right"></span>
  `;

  sequence.appendChild(houseTitle);
  sequence.appendChild(hans);
  sequence.appendChild(anna);
  sequence.appendChild(rings);
  layer.appendChild(sequence);

  return { sequence, houseTitle, hans, anna, rings };
}

function showClip03FamilyElement(el) {
  if (!el) return;
  el.classList.remove("is-fading-out");
  requestAnimationFrame(() => el.classList.add("is-visible"));
}

function hideClip03FamilyElement(el) {
  if (!el) return;
  el.classList.remove("is-visible");
  el.classList.add("is-fading-out");
}

function hideClip03NuwensteinFamily(sequence) {
  if (!sequence) return;
  [sequence.houseTitle, sequence.hans, sequence.anna, sequence.rings].forEach(hideClip03FamilyElement);
}


function createClip03ChildrenSequence(layer) {
  const sequence = document.createElement("div");
  sequence.className = "clip03-children-sequence";

  const entries = clip03NuwensteinChildren.map((child, index) => {
    const card = document.createElement("div");
    card.className = "clip03-child-card";
    card.style.setProperty("--child-index", String(index));

    const name = document.createElement("div");
    name.className = "clip03-child-name";
    name.textContent = child.name;

    const img = document.createElement("img");
    img.className = "clip03-child-image";
    img.src = child.src;
    img.alt = "";
    img.draggable = false;

    card.appendChild(name);
    card.appendChild(img);
    sequence.appendChild(card);

    return card;
  });

  layer.appendChild(sequence);
  return { sequence, entries };
}

function showClip03Child(card) {
  if (!card) return;
  card.classList.remove("is-fading-out");
  requestAnimationFrame(() => card.classList.add("is-visible"));
}

function hideClip03Child(card) {
  if (!card) return;
  card.classList.remove("is-visible");
  card.classList.add("is-fading-out");
}


function createClip03BerenbachFamilySequence(layer) {
  const sequence = document.createElement("div");
  sequence.className = "clip03-berenbach-family-sequence";

  const houseTitle = document.createElement("div");
  houseTitle.className = "clip03-berenbach-house-title";
  houseTitle.textContent = "HAUS BERENBACH";

  const johann = document.createElement("div");
  johann.className = "clip03-berenbach-person clip03-berenbach-person--johann";
  johann.innerHTML = `
    <div class="clip03-berenbach-name">JOHANN BERENBACH</div>
    <img class="clip03-berenbach-image" src="${clip03JohannBerenbachImage}" alt="" draggable="false">
  `;

  const ottilie = document.createElement("div");
  ottilie.className = "clip03-berenbach-person clip03-berenbach-person--ottilie";
  ottilie.innerHTML = `
    <div class="clip03-berenbach-name">OTTILIE NUWENSTEIN</div>
    <img class="clip03-berenbach-image" src="${clip03OttilieBerenbachImage}" alt="" draggable="false">
  `;

  const rings = document.createElement("div");
  rings.className = "clip03-berenbach-rings";
  rings.innerHTML = `
    <span class="clip03-berenbach-ring clip03-berenbach-ring--left"></span>
    <span class="clip03-berenbach-ring clip03-berenbach-ring--right"></span>
  `;

  const buerkelin = document.createElement("div");
  buerkelin.className = "clip03-berenbach-child clip03-berenbach-child--buerkelin";
  buerkelin.innerHTML = `
    <div class="clip03-berenbach-child-name">BÜRKELIN BERENBACH</div>
    <img class="clip03-berenbach-child-image" src="${clip03BuerkelinBerenbachImage}" alt="" draggable="false">
  `;

  const johannes = document.createElement("div");
  johannes.className = "clip03-berenbach-child clip03-berenbach-child--johannes";
  johannes.innerHTML = `
    <div class="clip03-berenbach-child-name">JOHANNES BERENBACH</div>
    <img class="clip03-berenbach-child-image" src="${clip03JohannesBerenbachImage}" alt="" draggable="false">
  `;

  sequence.appendChild(houseTitle);
  sequence.appendChild(johann);
  sequence.appendChild(ottilie);
  sequence.appendChild(rings);
  sequence.appendChild(buerkelin);
  sequence.appendChild(johannes);
  layer.appendChild(sequence);

  return { sequence, houseTitle, johann, ottilie, rings, buerkelin, johannes };
}

function showClip03BerenbachElement(el) {
  if (!el) return;
  el.classList.remove("is-fading-out");
  requestAnimationFrame(() => el.classList.add("is-visible"));
}

function hideClip03BerenbachElement(el) {
  if (!el) return;
  el.classList.remove("is-visible");
  el.classList.add("is-fading-out");
}

function getClip03Woman(layer) {
  if (!layer) return null;

  let woman = layer.querySelector(".clip03-woman");
  if (woman) return woman;

  woman = document.createElement("img");
  woman.className = "clip03-woman";
  woman.alt = "";
  woman.draggable = false;
  layer.appendChild(woman);
  return woman;
}

function setClip03WomanImage(layer, src) {
  const woman = getClip03Woman(layer);
  if (!woman) return null;
  woman.src = src;
  return woman;
}

function showClip03Woman(layer, src, fadeIn = false) {
  const woman = setClip03WomanImage(layer, src);
  if (!woman) return null;

  woman.classList.remove("is-fading-out");

  if (fadeIn) {
    woman.classList.remove("is-visible");
    void woman.offsetWidth;
    requestAnimationFrame(() => woman.classList.add("is-visible"));
  } else {
    woman.classList.add("is-visible");
  }

  return woman;
}

function hideClip03Woman(layer) {
  const woman = layer?.querySelector(".clip03-woman");
  if (!woman) return;
  woman.classList.add("is-fading-out");
  woman.classList.remove("is-visible");
}

function createClip03ShuffleBag(previousSrc = null) {
  const bag = [...clip03WomanSingImages];

  for (let i = bag.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }

  // Auch über die Grenze zweier Durchläufe hinweg kein direktes Doppelbild.
  if (bag.length > 1 && bag[0] === previousSrc) {
    [bag[0], bag[1]] = [bag[1], bag[0]];
  }

  return bag;
}

function startClip03Singing(layer, token, isAllowed) {
  let bag = [];
  let previousSrc = null;

  const nextFrame = () => {
    if (token !== clip03RunToken || !isAllowed()) return;

    if (bag.length === 0) {
      bag = createClip03ShuffleBag(previousSrc);
    }

    const src = bag.shift();
    previousSrc = src;

    // Harter Bildwechsel alle 0,3 Sekunden: bewusst KEIN Crossfade.
    showClip03Woman(layer, src, false);

    const timer = setTimeout(() => {
      clip03Timers.delete(timer);
      nextFrame();
    }, 300);

    clip03Timers.add(timer);
  };

  nextFrame();
}


function createClip03LargeSmoke(container, className) {
  const smoke = document.createElement("div");
  smoke.className = `clip03-large-smoke ${className}`;

  for (let index = 0; index < 10; index += 1) {
    const wisp = document.createElement("span");
    wisp.className = "clip03-large-smoke__wisp";
    wisp.style.setProperty("--smoke-index", String(index));
    smoke.appendChild(wisp);
  }

  container.appendChild(smoke);

  requestAnimationFrame(() => {
    smoke.classList.add("is-active");
  });

  return smoke;
}

async function fadeClip03SmokeAway(smoke, token, holdMs = 1200, fadeMs = 2200) {
  if (!smoke) return true;
  if (!(await waitClip03(holdMs, token))) return false;
  smoke.classList.add("is-ending");
  if (!(await waitClip03(fadeMs, token))) return false;
  smoke.remove();
  return true;
}

function createClip03QuestionMark(layer) {
  const mark = document.createElement("div");
  mark.className = "clip03-question-mark";
  mark.textContent = "?";
  layer.appendChild(mark);
  requestAnimationFrame(() => mark.classList.add("is-visible"));
  return mark;
}

function createClip03PostPuffDialogue(layer) {
  const scene = document.createElement("div");
  scene.className = "clip03-post-dialogue";

  const left = document.createElement("div");
  left.className = "clip03-dialog-character clip03-dialog-character--left";
  left.innerHTML = `<img src="${clip03DialogLeftImage01}" alt="" draggable="false">`;

  const right = document.createElement("div");
  right.className = "clip03-dialog-character clip03-dialog-character--right";
  right.innerHTML = `<img src="${clip03DialogRightImage01}" alt="" draggable="false">`;

  const leftBubble = document.createElement("div");
  leftBubble.className = "clip03-dialog-bubble clip03-dialog-bubble--left";
  leftBubble.textContent = "GRÜß GOTT JOHANN!";

  const rightBubble = document.createElement("div");
  rightBubble.className = "clip03-dialog-bubble clip03-dialog-bubble--right";
  rightBubble.textContent = "TAG JOHANN!";

  const centerBubble = document.createElement("div");
  centerBubble.className = "clip03-dialog-bubble clip03-dialog-bubble--center";
  centerBubble.textContent = "ICH BIN AUCH JOHANN!!!";

  const centerReveal = document.createElement("div");
  centerReveal.className = "clip03-dialog-center-reveal";
  const center = document.createElement("div");
  center.className = "clip03-dialog-center-character";
  center.innerHTML = `<img src="${clip03DialogCenterImage01}" alt="" draggable="false">`;
  centerReveal.appendChild(center);

  scene.append(left, right, leftBubble, rightBubble, centerBubble, centerReveal);
  layer.appendChild(scene);
  return {scene, left, right, leftBubble, rightBubble, centerBubble, centerReveal, center};
}

function setClip03DialogImage(entry, src) {
  const img = entry?.querySelector("img");
  if (img) img.src = src;
}

function showClip03DialogElement(el) {
  if (!el) return;
  el.classList.remove("is-fading-out");
  requestAnimationFrame(() => el.classList.add("is-visible"));
}

function hideClip03DialogElement(el) {
  if (!el) return;
  el.classList.remove("is-visible");
  el.classList.add("is-fading-out");
}

function getClip03TopGoat(layer) {
  return Array.from(layer?.querySelectorAll(".clip03-symbol") || []).find(
    img => img.getAttribute("src") === "assets/clip01/goat.png" ||
           img.classList.contains("clip03-dialog-goat")
  ) || null;
}

async function playClip03GoatReaction(layer, token) {
  const goat = getClip03TopGoat(layer);
  if (!goat || token !== clip03RunToken) return;

  goat.classList.add("clip03-dialog-goat");
  goat.classList.remove("is-mirrored");
  goat.src = clip03DialogGoatImage01;

  if (!(await waitClip03(800, token))) return;
  goat.classList.add("is-mirrored");

  if (!(await waitClip03(800, token))) return;
  goat.classList.remove("is-mirrored");
  goat.src = clip03DialogGoatImage02;

  if (!(await waitClip03(2000, token))) return;
  goat.src = clip03DialogGoatImage03;
}

async function fadeOutClip03DialogSidesWithSmoke(d, token) {
  if (token !== clip03RunToken) return false;

  const leftSmoke = createClip03LargeSmoke(d.scene, "clip03-large-smoke--dialog-left");
  const rightSmoke = createClip03LargeSmoke(d.scene, "clip03-large-smoke--dialog-right");

  d.left.classList.add("is-smoke-fading-out");
  d.right.classList.add("is-smoke-fading-out");
  d.left.classList.remove("is-visible");
  d.right.classList.remove("is-visible");

  // Figuren selbst verschwinden weich; der Rauch bleibt sichtbar und zieht danach langsam ab.
  if (!(await waitClip03(1100, token))) return false;
  d.left.remove();
  d.right.remove();

  leftSmoke.classList.add("is-ending");
  rightSmoke.classList.add("is-ending");

  if (!(await waitClip03(2600, token))) return false;
  leftSmoke.remove();
  rightSmoke.remove();
  return true;
}


function createClip03WaldstrasseFamily(d) {
  const scene = d.scene;

  const centerName = document.createElement("div");
  centerName.className = "clip03-waldstrasse-name clip03-waldstrasse-name--center";
  centerName.innerHTML = `JOHANN<br><span>"WALDSTRAßE/SNEITE"</span><br>BERENBACH`;

  const johannes = document.createElement("div");
  johannes.className = "clip03-waldstrasse-person clip03-waldstrasse-person--johannes";
  johannes.innerHTML = `
    <img src="${clip03FamilyJohannesBerenbachImage}" alt="" draggable="false">
    <div class="clip03-waldstrasse-name clip03-waldstrasse-name--green">JOHANNES BERENBACH</div>
  `;

  const burkhart = document.createElement("div");
  burkhart.className = "clip03-waldstrasse-person clip03-waldstrasse-person--burkhart";
  burkhart.innerHTML = `
    <img src="${clip03FamilyBurkhartBerenbachImage}" alt="" draggable="false">
    <div class="clip03-waldstrasse-name clip03-waldstrasse-name--green">BURKHART BERENBACH</div>
  `;

  const nothburga = document.createElement("div");
  nothburga.className = "clip03-waldstrasse-person clip03-waldstrasse-person--nothburga";
  nothburga.innerHTML = `
    <img src="${clip03FamilyNothburgaNuwensteinImage}" alt="" draggable="false">
    <div class="clip03-waldstrasse-name clip03-waldstrasse-name--blue">NOTHBURGA NUWENSTEIN</div>
  `;

  const rings = document.createElement("div");
  rings.className = "clip03-waldstrasse-rings";
  rings.innerHTML = `
    <span class="clip03-waldstrasse-ring clip03-waldstrasse-ring--left"></span>
    <span class="clip03-waldstrasse-ring clip03-waldstrasse-ring--right"></span>
  `;

  scene.append(centerName, johannes, burkhart, nothburga, rings);

  return { centerName, johannes, burkhart, nothburga, rings };
}

function showClip03WaldstrasseElement(el) {
  if (!el) return;
  el.classList.remove("is-fading-out");
  requestAnimationFrame(() => el.classList.add("is-visible"));
}

function hideClip03WaldstrasseElement(el) {
  if (!el) return;
  el.classList.remove("is-visible");
  el.classList.add("is-fading-out");
}

async function playClip03WaldstrasseFamily(d, token) {
  if (token !== clip03RunToken) return;

  const family = createClip03WaldstrasseFamily(d);

  // Flackern ist vorbei: Mittelcharakter bleibt auf seinem Grundbild stehen.
  // Direkt auf ihm erscheint sein dreizeiliger Name.
  showClip03WaldstrasseElement(family.centerName);

  // Ganz links Johannes.
  showClip03WaldstrasseElement(family.johannes);

  // Eine Sekunde später direkt rechts daneben Burkhart.
  if (!(await waitClip03(1000, token))) return;
  showClip03WaldstrasseElement(family.burkhart);

  // Fünf Sekunden später Nothburga rechts vom Mittelcharakter.
  if (!(await waitClip03(5000, token))) return;
  showClip03WaldstrasseElement(family.nothburga);

  // Eine Sekunde nach Nothburgas Einblendung die Eheringe zwischen Mitte und ihr.
  if (!(await waitClip03(1000, token))) return;
  showClip03WaldstrasseElement(family.rings);

  // Sobald alles vollständig eingeblendet ist: jetzt 10 Sekunden stehen lassen.
  if (!(await waitClip03(10000, token))) return;

  // Alles außer dem Mittelcharakter selbst fadet gemeinsam smooth heraus.
  [
    family.centerName,
    family.johannes,
    family.burkhart,
    family.nothburga,
    family.rings
  ].forEach(hideClip03WaldstrasseElement);
}

async function flickerClip03Center(d, layer, token) {
  if (token !== clip03RunToken) return;

  let showKnightNext = false;
  let running = true;

  // Ziegenfolge startet ERST jetzt – also exakt beim Beginn des Flackerns.
  playClip03GoatReaction(layer, token);

  const flicker = () => {
    if (!running || token !== clip03RunToken) return;

    setClip03DialogImage(
      d.center,
      showKnightNext ? clip03DialogCenterImage04 : clip03DialogCenterImage03
    );
    showKnightNext = !showKnightNext;

    const timer = setTimeout(() => {
      clip03Timers.delete(timer);
      flicker();
    }, 400);
    clip03Timers.add(timer);
  };

  // Start direkt mit Anhang 6.
  setClip03DialogImage(d.center, clip03DialogCenterImage04);
  showKnightNext = false;

  const first = setTimeout(() => {
    clip03Timers.delete(first);
    flicker();
  }, 400);
  clip03Timers.add(first);

  // Flackern endet nochmals 1,6 Sekunden früher: jetzt 3,6 Sekunden.
  if (!(await waitClip03(3600, token))) {
    running = false;
    return;
  }

  running = false;

  // Mittelcharakter zurück auf Anhang 1 und stehen lassen.
  setClip03DialogImage(d.center, clip03DialogCenterImage01);

  // Danach direkt die neue Waldstraße/Berenbach-Familienfolge.
  await playClip03WaldstrasseFamily(d, token);
}

async function playClip03PostPuffDialogue(layer, token) {
  if (token !== clip03RunToken) return;

  const d = createClip03PostPuffDialogue(layer);

  showClip03DialogElement(d.left);
  if (!(await waitClip03(2000, token))) return;

  showClip03DialogElement(d.right);
  if (!(await waitClip03(4000, token))) return;

  setClip03DialogImage(d.right, clip03DialogRightImage02);
  showClip03DialogElement(d.rightBubble);

  if (!(await waitClip03(2000, token))) return;

  setClip03DialogImage(d.left, clip03DialogLeftImage02);
  showClip03DialogElement(d.leftBubble);

  // Rechte Sprechblase insgesamt 3 Sekunden.
  if (!(await waitClip03(1000, token))) return;
  hideClip03DialogElement(d.rightBubble);

  // Linke Sprechblase ab ihrem Erscheinen exakt 4 Sekunden.
  if (!(await waitClip03(3000, token))) return;
  hideClip03DialogElement(d.leftBubble);

  // Danach: "ICH BIN AUCH JOHANN!!!" für 3 Sekunden.
  showClip03DialogElement(d.centerBubble);
  if (!(await waitClip03(3000, token))) return;
  hideClip03DialogElement(d.centerBubble);

  // Mitte fährt jetzt DEUTLICH langsamer hoch.
  // Außenfiguren wechseln sofort auf ihre Reaktionsbilder.
  setClip03DialogImage(d.left, clip03DialogLeftImage03);
  setClip03DialogImage(d.right, clip03DialogRightImage03);
  showClip03DialogElement(d.centerReveal);

  // Schon kurz nachdem der Mittelcharakter sichtbar hochgefahren ist,
  // verschwinden links/rechts weich und werden von großem Rauch ersetzt.
  if (!(await waitClip03(1700, token))) return;
  fadeOutClip03DialogSidesWithSmoke(d, token);

  // Gesamte Hochfahrt jetzt 7 Sekunden.
  if (!(await waitClip03(5300, token))) return;

  // Erst NACH vollständig abgeschlossener Hochfahrt:
  // Mitte Anhang 4 -> 0,8 s -> Anhang 5 -> 0,8 s.
  setClip03DialogImage(d.center, clip03DialogCenterImage02);
  if (!(await waitClip03(800, token))) return;

  setClip03DialogImage(d.center, clip03DialogCenterImage03);
  if (!(await waitClip03(800, token))) return;

  // Erst JETZT beginnt das 5/6-Flackern UND gleichzeitig die Ziegenfolge.
  await flickerClip03Center(d, layer, token);
}

function playClip03WomanEndSequence(layer, token) {
  return new Promise((resolve) => {
    const durations = [1000, 1500, 500, 800, 500, 500, 800];
    let index = 0;

    const next = () => {
      if (token !== clip03RunToken) {
        resolve(false);
        return;
      }

      if (index >= clip03WomanEndImages.length) {
        resolve(true);
        return;
      }

      showClip03Woman(layer, clip03WomanEndImages[index], false);

      const duration = durations[index];
      index += 1;

      const timer = setTimeout(() => {
        clip03Timers.delete(timer);
        next();
      }, duration);

      clip03Timers.add(timer);
    };

    next();
  });
}

async function finishClip03WomanWithPuff(layer, token, questionMark = null) {
  if (token !== clip03RunToken) return;

  const woman = layer?.querySelector(".clip03-woman");
  const smoke = createClip03LargeSmoke(layer, "clip03-large-smoke--woman");

  // Frau verschwindet selbst nur noch smooth – KEIN weißer Puff mehr.
  if (woman) {
    woman.classList.remove("is-visible");
    woman.classList.remove("is-puffing-out");
    woman.classList.add("is-smoke-fading-out");
  }

  if (!(await waitClip03(1100, token))) return;
  if (woman) woman.remove();

  // Fragezeichen bleibt bis zum langsamen Rauch-Ausgang gekoppelt.
  smoke.classList.add("is-ending");
  if (questionMark) {
    questionMark.classList.remove("is-visible");
    questionMark.classList.add("is-fading-out");
  }

  if (!(await waitClip03(2600, token))) return;

  smoke.remove();
  if (questionMark) questionMark.remove();

  playClip03PostPuffDialogue(layer, token);
}

async function playClip03() {
  stopClip03Animation();
  const token = clip03RunToken;

  const current = getClipStageBackground();
  const next = getClipStageBackgroundNext();
  const layer = getClip03Layer();

  if (!current || !next || !layer) return;

  // Clip 03 startet DIREKT mit Hintergrund 2 / der fertigen Symbolszene.
  // Kein Anfangs-Fade, keine Iris, keine Wartezeit.
  current.src = "assets/clip01/frame-clean.png";
  current.style.opacity = "1";
  next.style.transition = "none";
  next.style.opacity = "0";
  next.src = "";
  layer.innerHTML = "";

  const scene = document.createElement("div");
  scene.className = "clip03-final-scene is-active";
  buildClip03FinalScene(scene);
  layer.appendChild(scene);

  const gedoesCard = createClip03GedoresCard(layer);
  const castleSequence = createClip03CastleSequence(layer);
  const familySequence = createClip03NuwensteinFamilySequence(layer);
  const childrenSequence = createClip03ChildrenSequence(layer);
  const berenbachFamily = createClip03BerenbachFamilySequence(layer);

  // Clip-03-Bilder vorladen, damit alle Einblendungen sauber bleiben.
  [
    clip03GedoresImage,
    clip03NuwensteinImage,
    clip03BerenbachImage,
    clip03HansNuwensteinImage,
    clip03AnnaNuwensteinImage,
    ...clip03NuwensteinChildren.map((child) => child.src),
    clip03JohannBerenbachImage,
    clip03OttilieBerenbachImage,
    clip03BuerkelinBerenbachImage,
    clip03JohannesBerenbachImage,
    clip03WomanRest,
    ...clip03WomanSingImages,
    ...clip03WomanEndImages,
    clip03DialogLeftImage01,
    clip03DialogLeftImage02,
    clip03DialogRightImage01,
    clip03DialogRightImage02,
    clip03DialogCenterImage01,
    clip03DialogLeftImage03,
    clip03DialogRightImage03,
    clip03DialogCenterImage02,
    clip03DialogCenterImage03,
    clip03DialogCenterImage04,
    clip03DialogGoatImage01,
    clip03DialogGoatImage02,
    clip03DialogGoatImage03,
    clip03FamilyJohannesBerenbachImage,
    clip03FamilyBurkhartBerenbachImage,
    clip03FamilyNothburgaNuwensteinImage
  ].forEach((src) => {
    const preload = new Image();
    preload.src = src;
  });

  // Song startet sofort mit Clip 03.
  try {
    clip03Soundtrack.currentTime = 0;
    clip03Soundtrack.volume = 1;
    await clip03Soundtrack.play();
  } catch (_) {
    return;
  }

  if (token !== clip03RunToken) return;

  let phase = "before12";
  let singingRun = 0;
  let castlePhase = "before12";
  let castleTitlePhase = "before12";
  let familyPhase = "before24";
  let childrenShown = 0;
  let berenbachPhase = "before43";
  let womanEndStarted = false;

  const tick = () => {
    if (token !== clip03RunToken) return;

    const t = clip03Soundtrack.currentTime;

    if (t >= 3 && t < 11 && !gedoesCard.classList.contains("is-visible")) {
      showClip03GedoresCard(gedoesCard);
    }

    if (t >= 11 && !gedoesCard.classList.contains("is-fading-out")) {
      hideClip03GedoresCard(gedoesCard);
    }


    // Burgfolge parallel zur singenden Frau.
    if (t >= 12 && t < 17 && castlePhase !== "nuwenstein") {
      castlePhase = "nuwenstein";
      showClip03CastleCard(castleSequence.nuwenstein);
      hideClip03CastleCard(castleSequence.berenbach);
    }

    if (t >= 12 && t < 17 && castleTitlePhase !== "nuwenstein-title") {
      castleTitlePhase = "nuwenstein-title";
      showClip03CastleTitle(castleSequence.nuwenstein);
    }

    if (t >= 17 && t < 22 && castlePhase !== "berenbach") {
      castlePhase = "berenbach";
      hideClip03CastleTitle(castleSequence.nuwenstein);
      hideClip03CastleCard(castleSequence.nuwenstein);
      showClip03CastleCard(castleSequence.berenbach);
    }

    if (t >= 17 && t < 22 && castleTitlePhase !== "berenbach-title") {
      castleTitlePhase = "berenbach-title";
      showClip03CastleTitle(castleSequence.berenbach);
    }

    if (t >= 22 && castlePhase !== "done") {
      castlePhase = "done";
      hideClip03CastleCard(castleSequence.nuwenstein);
      hideClip03CastleCard(castleSequence.berenbach);
      hideClip03CastleTitle(castleSequence.nuwenstein);
      hideClip03CastleTitle(castleSequence.berenbach);
    }


    /*
      HAUS NUWENSTEIN:
      22–24 s Pause
      24–26 s Haus-Titel
      27 s Hans
      28 s Anna
      29 s Eheringe
      32 s alles gemeinsam smooth raus
    */
    if (t >= 24 && t < 26 && familyPhase === "before24") {
      familyPhase = "house-title";
      showClip03FamilyElement(familySequence.houseTitle);
    }

    if (t >= 26 && t < 27 && familyPhase === "house-title") {
      familyPhase = "house-title-out";
      hideClip03FamilyElement(familySequence.houseTitle);
    }

    if (t >= 27 && t < 28 && familyPhase === "house-title-out") {
      familyPhase = "hans";
      showClip03FamilyElement(familySequence.hans);
    }

    if (t >= 28 && t < 29 && familyPhase === "hans") {
      familyPhase = "anna";
      showClip03FamilyElement(familySequence.anna);
    }

    if (t >= 29 && t < 32 && familyPhase === "anna") {
      familyPhase = "rings";
      showClip03FamilyElement(familySequence.rings);
    }

    if (t >= 32 && familyPhase === "rings") {
      // Eltern + Eheringe bleiben bewusst stehen, während die Kinder dazukommen.
      familyPhase = "holding-with-children";
    }


    /*
      Kinderfolge:
      Ab 33 s jede Sekunde ein weiteres Kind von links nach rechts.
      Eltern + Eheringe bleiben sichtbar.
      Nach dem letzten Kind bleibt die komplette Familie 3 Sekunden stehen.
    */
    while (
      childrenShown < childrenSequence.entries.length &&
      t >= 33 + childrenShown
    ) {
      showClip03Child(childrenSequence.entries[childrenShown]);
      childrenShown += 1;
    }


    // Letztes Kind erscheint bei 38 s. Danach bleibt die komplette Familie 3 s stehen.
    // Ab 42 s fadet alles gemeinsam smooth aus.
    if (t >= 42 && familyPhase === "holding-with-children") {
      familyPhase = "family-done";
      hideClip03FamilyElement(familySequence.hans);
      hideClip03FamilyElement(familySequence.anna);
      hideClip03FamilyElement(familySequence.rings);
      childrenSequence.entries.forEach(hideClip03Child);
    }


    /*
      HAUS BERENBACH – gleiche Rhythmik wie zuvor, jetzt rechts neben der Sängerin:
      43–45 s Haus-Titel
      46 s Johann
      47 s Ottilie
      48 s Eheringe
      49 s Bürkelin
      50 s Johannes
      50–53 s komplette Familie gemeinsam
      ab 53 s gemeinsamer Smooth-Fade
    */
    if (t >= 43 && t < 45 && berenbachPhase === "before43") {
      berenbachPhase = "house-title";
      showClip03BerenbachElement(berenbachFamily.houseTitle);
    }

    if (t >= 45 && t < 46 && berenbachPhase === "house-title") {
      berenbachPhase = "house-title-out";
      hideClip03BerenbachElement(berenbachFamily.houseTitle);
    }

    if (t >= 46 && t < 47 && berenbachPhase === "house-title-out") {
      berenbachPhase = "johann";
      showClip03BerenbachElement(berenbachFamily.johann);
    }

    if (t >= 47 && t < 48 && berenbachPhase === "johann") {
      berenbachPhase = "ottilie";
      showClip03BerenbachElement(berenbachFamily.ottilie);
    }

    if (t >= 48 && t < 49 && berenbachPhase === "ottilie") {
      berenbachPhase = "rings";
      showClip03BerenbachElement(berenbachFamily.rings);
    }

    if (t >= 49 && t < 50 && berenbachPhase === "rings") {
      berenbachPhase = "buerkelin";
      showClip03BerenbachElement(berenbachFamily.buerkelin);
    }

    if (t >= 50 && t < 53 && berenbachPhase === "buerkelin") {
      berenbachPhase = "johannes";
      showClip03BerenbachElement(berenbachFamily.johannes);
    }

    if (t >= 53 && berenbachPhase === "johannes") {
      berenbachPhase = "done";
      hideClip03BerenbachElement(berenbachFamily.johann);
      hideClip03BerenbachElement(berenbachFamily.ottilie);
      hideClip03BerenbachElement(berenbachFamily.rings);
      hideClip03BerenbachElement(berenbachFamily.buerkelin);
      hideClip03BerenbachElement(berenbachFamily.johannes);
    }


    /*
      Neue Endsequenz der Sängerin:
      Berenbach ist ab 53 s raus.
      2 Sekunden später (55 s) Musik abrupt STOP.
      Danach 7 feste Reaktionsbilder in exakten Dauern,
      anschließend großer weißer Rauch-Puff.
    */
    if (t >= 55 && !womanEndStarted) {
      womanEndStarted = true;
      phase = "woman-end";
      singingRun += 1;

      try {
        clip03Soundtrack.pause();
      } catch (_) {}

      const questionMark = createClip03QuestionMark(layer);

      playClip03WomanEndSequence(layer, token).then((completed) => {
        if (!completed || token !== clip03RunToken) return;
        finishClip03WomanWithPuff(layer, token, questionMark);
      });

      return;
    }

    if (t >= 12 && t < 20 && phase !== "sing12") {
      phase = "sing12";
      singingRun += 1;
      const run = singingRun;
      showClip03Woman(layer, clip03WomanSingImages[0], true);
      startClip03Singing(layer, token, () =>
        token === clip03RunToken &&
        phase === "sing12" &&
        singingRun === run &&
        clip03Soundtrack.currentTime < 20
      );
    }

    if (t >= 20 && t < 22 && phase !== "rest20") {
      phase = "rest20";
      singingRun += 1;
      showClip03Woman(layer, clip03WomanRest, false);
    }

    if (t >= 22 && t < 43 && phase !== "hidden22") {
      phase = "hidden22";
      singingRun += 1;
      hideClip03Woman(layer);
    }

    if (t >= 43 && t < 45 && phase !== "rest43") {
      phase = "rest43";
      singingRun += 1;
      showClip03Woman(layer, clip03WomanRest, true);
    }

    if (t >= 45 && t < 80 && phase !== "sing45") {
      phase = "sing45";
      singingRun += 1;
      const run = singingRun;
      showClip03Woman(layer, clip03WomanSingImages[0], false);
      startClip03Singing(layer, token, () =>
        token === clip03RunToken &&
        phase === "sing45" &&
        singingRun === run &&
        clip03Soundtrack.currentTime < 80
      );
    }

    if (!womanEndStarted && !clip03Soundtrack.ended) {
      const timer = setTimeout(() => {
        clip03Timers.delete(timer);
        tick();
      }, 25);
      clip03Timers.add(timer);
    }
  };

  tick();
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
  stopClip03Animation();

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
  } else if (clipNumber === 3) {
    requestAnimationFrame(() => playClip03());
  }
}

function closeClip() {
  const clipStage = getClipStage();

  if (!vault || !clipStage) return;

  stopClip01Animation();
  stopClip02Animation();
  stopClip03Animation();

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