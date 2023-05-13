import GameSession from "./GameSession.js";
import { FoodList } from "./Food.js";
import { ACHIEVEMENT, ACHIEVEMENT_OVERLAY, ACHIEVEMENT_OVERLAY_CLOSE, ACHIEVEMENT_OVERLAY_CONTAINER, ACHIEVEMENT_SETTING_BUTTON, ACHIEVEMENT_TEXT, ACHIEVEMENT_TOOLTIP, ACHIEVEMENT_X, CG_BOX, CONTAINER, GAME_BOX, GAME_CONTAINER, INFO_CLOSE, INFO_OVERLAY, INFO_OVERLAY_CONTAINER, INFO_SETTING_BUTTON, LOADER, MONEY_LABEL, NIKI, SERVE_BUTTON, SETTINGS_SETTING_BUTTON, SETTING_BUTTONS, STOMACH_BAR, TEXTBOX_NEXT } from "./CONSTANTS.js";
import { CutsceneList } from "./Cutscene.js";

const GAME = new GameSession();

function initGame() {
  LOADER.style.display = "none";
  CG_BOX.style.display = GAME.session.showCG ? "flex" : "none";
  GAME_CONTAINER.style.display = GAME.session.showCG ? "none" : "flex";

  TEXTBOX_NEXT.addEventListener("click", () => { 
    if (CutsceneList[GAME.session.currentCGIndex].dialogueIndex + 1 === CutsceneList[GAME.session.currentCGIndex].dialogue.length - 1) {
      // if the dialogue is finished switch out of CG mode
      GAME.toggleShowCG(false);
      if (GAME.session.currentCGIndex === 0) GAME.setNewGame(false);
      GAME.incrementCGIndex();
      GAME.togglePlayGame(true);
    } else {
      CutsceneList[GAME.session.currentCGIndex].changeDialogue();
    }
  });

  MONEY_LABEL.innerHTML = GAME.session.money;
  STOMACH_BAR.style.width = `${GAME.session.stomach}%`;
  NIKI.onclick = () => {
    if (GAME.session.canFeed) {
      GAME.feed();
    }
  }
  SERVE_BUTTON.onclick = () => {
    if (GAME.session.canServe) {
      GAME.serve();
    }
  }
  ACHIEVEMENT_X.onclick = () => {
    GAME.closeAchievement();
  }
  ACHIEVEMENT_TEXT.onmouseenter = () => {
    if (ACHIEVEMENT_TOOLTIP.classList.contains("hide")) ACHIEVEMENT_TOOLTIP.classList.remove("hide");
    ACHIEVEMENT_TOOLTIP.classList.add("show");
  }
  ACHIEVEMENT_TEXT.onmouseleave = () => {
    if (ACHIEVEMENT_TOOLTIP.classList.contains("show")) ACHIEVEMENT_TOOLTIP.classList.remove("show");
    ACHIEVEMENT_TOOLTIP.classList.add("hide");
  }
  ACHIEVEMENT_TEXT.onclick = () => {
    GAME.toggleSettingOverlay(ACHIEVEMENT_OVERLAY_CONTAINER, ACHIEVEMENT_OVERLAY);
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
    SETTINGS_SETTING_BUTTON.addEventListener("click", (e) => { 
      showSowwyOverlay(); 
    });
    INFO_SETTING_BUTTON.addEventListener("click", (e) => {
      GAME.toggleSettingOverlay(INFO_OVERLAY_CONTAINER, INFO_OVERLAY);
    });
    INFO_CLOSE.addEventListener("mousedown", (e) => {
      GAME.toggleSettingOverlay(INFO_OVERLAY_CONTAINER, INFO_OVERLAY);
    });
    ACHIEVEMENT_SETTING_BUTTON.addEventListener("click", (e) => {
      GAME.toggleSettingOverlay(ACHIEVEMENT_OVERLAY_CONTAINER, ACHIEVEMENT_OVERLAY);
    })
    ACHIEVEMENT_OVERLAY_CLOSE.addEventListener("mousedown", (e) => {
      GAME.toggleSettingOverlay(ACHIEVEMENT_OVERLAY_CONTAINER, ACHIEVEMENT_OVERLAY);
    })
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