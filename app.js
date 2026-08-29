const TOTAL_PAGES = 2;
const CLIPS_PER_PAGE = 10;

let currentPage = 1;

const clipGrid = document.getElementById("clipGrid");
const pageLabel = document.getElementById("pageLabel");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");

function ensureClipStageStyles() {
  if (document.getElementById("clipStageStyles")) return;

  const style = document.createElement("style");
  style.id = "clipStageStyles";
  style.textContent = `
    .clip-stage {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: grid;
      place-items: center;
      padding: 28px;
      background:
        radial-gradient(circle at 50% 45%, rgba(214, 173, 84, 0.04), transparent 46%),
        #050505;
    }

    .clip-stage__frame {
      position: relative;
      width: min(94vw, 1760px);
      aspect-ratio: 16 / 9;
      max-height: 92vh;
      background: #080808;
      border: 2px solid #d6ad54;
      box-shadow:
        inset 0 0 0 7px #080808,
        inset 0 0 0 8px rgba(214, 173, 84, 0.5),
        inset 0 0 40px rgba(214, 173, 84, 0.05),
        0 0 28px rgba(214, 173, 84, 0.18);
      overflow: hidden;
    }

    .clip-stage__frame::before,
    .clip-stage__frame::after {
      content: "";
      position: absolute;
      left: 8%;
      right: 8%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(214, 173, 84, 0.55) 18%,
        #f4cf78 50%,
        rgba(214, 173, 84, 0.55) 82%,
        transparent
      );
    }

    .clip-stage__frame::before {
      top: 18px;
    }

    .clip-stage__frame::after {
      bottom: 18px;
    }

    .clip-stage__corner {
      position: absolute;
      width: 78px;
      height: 78px;
      filter: drop-shadow(0 0 7px rgba(244, 207, 120, 0.28));
    }

    .clip-stage__corner::before,
    .clip-stage__corner::after {
      content: "";
      position: absolute;
      background: #d6ad54;
    }

    .clip-stage__corner::before {
      width: 48px;
      height: 2px;
    }

    .clip-stage__corner::after {
      width: 2px;
      height: 48px;
    }

    .clip-stage__corner--tl {
      top: 14px;
      left: 14px;
      border-top: 4px double #d6ad54;
      border-left: 4px double #d6ad54;
      border-radius: 22px 0 0 0;
    }

    .clip-stage__corner--tl::before {
      top: 15px;
      left: 11px;
      transform: rotate(45deg);
      transform-origin: left center;
    }

    .clip-stage__corner--tl::after {
      top: 11px;
      left: 15px;
      transform: rotate(-45deg);
      transform-origin: center top;
    }

    .clip-stage__corner--tr {
      top: 14px;
      right: 14px;
      border-top: 4px double #d6ad54;
      border-right: 4px double #d6ad54;
      border-radius: 0 22px 0 0;
    }

    .clip-stage__corner--tr::before {
      top: 15px;
      right: 11px;
      transform: rotate(-45deg);
      transform-origin: right center;
    }

    .clip-stage__corner--tr::after {
      top: 11px;
      right: 15px;
      transform: rotate(45deg);
      transform-origin: center top;
    }

    .clip-stage__corner--bl {
      bottom: 14px;
      left: 14px;
      border-bottom: 4px double #d6ad54;
      border-left: 4px double #d6ad54;
      border-radius: 0 0 0 22px;
    }

    .clip-stage__corner--bl::before {
      bottom: 15px;
      left: 11px;
      transform: rotate(-45deg);
      transform-origin: left center;
    }

    .clip-stage__corner--bl::after {
      bottom: 11px;
      left: 15px;
      transform: rotate(45deg);
      transform-origin: center bottom;
    }

    .clip-stage__corner--br {
      bottom: 14px;
      right: 14px;
      border-bottom: 4px double #d6ad54;
      border-right: 4px double #d6ad54;
      border-radius: 0 0 22px 0;
    }

    .clip-stage__corner--br::before {
      bottom: 15px;
      right: 11px;
      transform: rotate(45deg);
      transform-origin: right center;
    }

    .clip-stage__corner--br::after {
      bottom: 11px;
      right: 15px;
      transform: rotate(-45deg);
      transform-origin: center bottom;
    }

    .clip-stage__ornament {
      position: absolute;
      color: #f4cf78;
      font-family: Georgia, "Times New Roman", serif;
      text-shadow: 0 0 9px rgba(244, 207, 120, 0.36);
      user-select: none;
    }

    .clip-stage__ornament--top,
    .clip-stage__ornament--bottom {
      left: 50%;
      font-size: 1.3rem;
      transform: translateX(-50%) rotate(45deg);
    }

    .clip-stage__ornament--top {
      top: 8px;
    }

    .clip-stage__ornament--bottom {
      bottom: 8px;
    }

    .clip-stage__ornament--left,
    .clip-stage__ornament--right {
      top: 50%;
      font-size: 1.3rem;
      transform: translateY(-50%);
    }

    .clip-stage__ornament--left {
      left: 10px;
    }

    .clip-stage__ornament--right {
      right: 10px;
    }
  `;

  document.head.appendChild(style);
}

function openClipOne() {
  if (document.getElementById("clipStage")) return;

  ensureClipStageStyles();

  const clipStage = document.createElement("section");
  clipStage.className = "clip-stage";
  clipStage.id = "clipStage";
  clipStage.setAttribute("aria-label", "Clip 01 Testfläche");

  clipStage.innerHTML = `
    <div class="clip-stage__frame">
      <span class="clip-stage__corner clip-stage__corner--tl"></span>
      <span class="clip-stage__corner clip-stage__corner--tr"></span>
      <span class="clip-stage__corner clip-stage__corner--bl"></span>
      <span class="clip-stage__corner clip-stage__corner--br"></span>

      <span class="clip-stage__ornament clip-stage__ornament--top">◆</span>
      <span class="clip-stage__ornament clip-stage__ornament--bottom">◆</span>
      <span class="clip-stage__ornament clip-stage__ornament--left">✦</span>
      <span class="clip-stage__ornament clip-stage__ornament--right">✦</span>
    </div>
  `;

  document.body.appendChild(clipStage);
}

function closeClipStage() {
  const clipStage = document.getElementById("clipStage");

  if (clipStage) {
    clipStage.remove();
  }
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
  if (event.key === "Escape") {
    closeClipStage();
  }
});

renderPage();
