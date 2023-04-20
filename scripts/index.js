import GameSession from "./GameSession.js";
import { FoodList } from "./Food.js";
import { CG_BOX, CONTAINER, GAME_BOX, GAME_CONTAINER, LOADER, MONEY_LABEL, NIKI, SERVE_BUTTON, SETTING_BUTTONS, STOMACH_BAR, TEXTBOX_NEXT } from "./CONSTANTS.js";
import { CutsceneList } from "./Cutscene.js";

const GAME = new GameSession();

function initGame() {
  CG_BOX.style.display = GAME.session.showCG ? "flex" : "none";
  GAME_CONTAINER.style.display = GAME.session.showCG ? "none" : "flex";

  TEXTBOX_NEXT.addEventListener("click", () => { 
    if (CutsceneList[GAME.session.currentCGIndex].dialogueIndex === CutsceneList[GAME.session.currentCGIndex].dialogue.length - 1) {
      // if the dialogue is finished switch out of CG mode
      GAME.toggleShowCG(false);
      GAME.incrementCGIndex();
      GAME.togglePlayGame(true);
    } else {
      CutsceneList[GAME.session.currentCGIndex].changeDialogue();
    }
  });

  if (GAME.session.showCG) {
    CutsceneList[GAME.session.currentCGIndex].formatTextbox();
  }
  MONEY_LABEL.innerHTML = GAME.session.money;
  STOMACH_BAR.style.width = `${GAME.session.stomach}%`;
  NIKI.onclick = () => {
    GAME.feed();
  }
  SERVE_BUTTON.onclick = () => {
    GAME.serve();
  }
  FoodList.forEach(food => {
    food.createIngredientBox(GAME);
  });
  NIKI.classList.add(GAME.session.canFeed ? "enabled" : "disabled");
  SERVE_BUTTON.classList.add(GAME.session.canServe ? "enabled" : "disabled");
  LOADER.style.display = "none";
  GAME_BOX.style.display = "flex";
}

function showSowwyOverlay() {
  let overlay = document.createElement("div");
  overlay.className = "sowwy-overlay";
  let overlayText = document.createElement("div");
  overlayText.className = "sowwy-overlay-text";
  overlayText.appendChild(document.createTextNode("This button doesn't do anything yet, sowwy..."));
  let overlayX = document.createElement("div");
  overlayX.className = "sowwy-overlay-x";
  let overlayXIcon = document.createElement("i");
  overlayXIcon.className = "ti ti-x";
  overlayX.addEventListener("click", (e) => {
    overlay.remove();
  })
  overlayX.appendChild(overlayXIcon);
  overlay.appendChild(overlayText);
  overlay.appendChild(overlayX);
  CONTAINER.appendChild(overlay);
  setTimeout(() => {
    overlay.remove();
  }, 3000);
}

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState !== "complete") {
    GAME_BOX.style.display = "none";
    LOADER.style.display = "block";
  } else {
    for (let i = 0; i < SETTING_BUTTONS.length; i++) {
      SETTING_BUTTONS[i].addEventListener("click", (e) => { 
        console.log("clicky");
        showSowwyOverlay(); 
      });
    }
    initGame();
    if (GAME.session.playGame) {
      GAME.decreaseStomachBar();
    }
  }
});

window.addEventListener("resize", (e) => {
  GAME.toggleRotateDevice();
});

window.addEventListener("load", (e) => {
  GAME.toggleRotateDevice();
})