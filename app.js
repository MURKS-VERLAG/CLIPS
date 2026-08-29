const TOTAL_PAGES = 2;
const CLIPS_PER_PAGE = 10;

let currentPage = 1;

const vault = document.getElementById("vault");
const clipGrid = document.getElementById("clipGrid");
const pageLabel = document.getElementById("pageLabel");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const clipStage = document.getElementById("clipStage");

function openClipOne() {
  vault.style.display = "none";
  clipStage.hidden = false;
  clipStage.style.display = "grid";
}

function closeClipOne() {
  clipStage.hidden = true;
  clipStage.style.display = "none";
  vault.style.display = "";
}

function renderPage() {
  clipGrid.innerHTML = "";

  const firstClipNumber = (currentPage - 1) * CLIPS_PER_PAGE + 1;

  for (let index = 0; index < CLIPS_PER_PAGE; index += 1) {
    const clipNumber = firstClipNumber + index;

    const card = document.createElement("button");
    card.type = "button";
    card.className = "clip-card";
    card.dataset.clip = clipNumber;
    card.setAttribute("aria-label", `Clip ${String(clipNumber).padStart(2, "0")}`);

    const number = document.createElement("span");
    number.className = "clip-card__number";
    number.textContent = String(clipNumber).padStart(2, "0");

    card.appendChild(number);

    card.addEventListener("click", () => {
      if (clipNumber === 1) {
        openClipOne();
      }
    });

    clipGrid.appendChild(card);
  }

  pageLabel.textContent = `SEITE ${currentPage} / ${TOTAL_PAGES}`;
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === TOTAL_PAGES;
}

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
  if (event.key === "Escape" && !clipStage.hidden) {
    closeClipOne();
  }
});

renderPage();
