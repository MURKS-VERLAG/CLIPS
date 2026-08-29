const TOTAL_PAGES = 2;
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

function openClipOne() {
  const clipStage = getClipStage();

  if (!vault || !clipStage) {
    console.error("Clip 01 kann nicht geöffnet werden: vault oder clipStage fehlt.");
    return;
  }

  vault.style.display = "none";
  clipStage.hidden = false;
  clipStage.style.setProperty("display", "grid", "important");
}

function closeClipOne() {
  const clipStage = getClipStage();

  if (!vault || !clipStage) return;

  clipStage.hidden = true;
  clipStage.style.setProperty("display", "none", "important");
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

/*
  Event-Delegation statt Einzel-Listener:
  Dadurch funktioniert Clip 01 auch nach jedem erneuten renderPage().
*/
clipGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".clip-card");

  if (!card || !clipGrid.contains(card)) return;

  const clipNumber = Number(card.dataset.clip);

  if (clipNumber === 1) {
    openClipOne();
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
    closeClipOne();
  }
});

renderPage();
