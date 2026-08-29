const TOTAL_PAGES = 4;
const CLIPS_PER_PAGE = 10;

let currentPage = 1;

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

function getFrameForClip(clipNumber) {
  if (clipNumber >= 21 && clipNumber <= 40) {
    return "assets/clip-frame-grid.png";
  }

  return "assets/clip-frame.png";
}

function openClip(clipNumber) {
  const clipStage = getClipStage();
  const clipStageBackground = getClipStageBackground();

  if (!vault || !clipStage || !clipStageBackground) {
    console.error(`Clip ${String(clipNumber).padStart(2, "0")} kann nicht geöffnet werden.`);
    return;
  }

  clipStage.dataset.activeClip = String(clipNumber);
  clipStageBackground.src = getFrameForClip(clipNumber);

  vault.style.display = "none";
  clipStage.hidden = false;
  clipStage.style.setProperty("display", "block", "important");
}

function closeClip() {
  const clipStage = getClipStage();

  if (!vault || !clipStage) return;

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
