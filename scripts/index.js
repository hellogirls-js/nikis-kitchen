import GameSession from "./GameSession.js";
import { FoodList } from "./Food.js";
import { CG_BOX, GAME_BOX, GAME_CONTAINER, LOADER, MONEY_LABEL, NIKI, SERVE_BUTTON, STOMACH_BAR } from "./CONSTANTS.js";
import { CutsceneList } from "./Cutscene.js";

const GAME = new GameSession();

function initGame() {
  CG_BOX.style.display = GAME.session.showCG ? "flex" : "none";
  GAME_CONTAINER.style.display = GAME.session.showCG ? "none" : "flex";
  if (GAME.session.showCG) {
    CutsceneList[GAME.session.currentCGIndex].setCG(CutsceneList[GAME.session.currentCGIndex].cg_list[CutsceneList[GAME.session.currentCGIndex].cgIndex]);
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

document.addEventListener("readystatechange", (e) => {
  if (e.target.readyState !== "complete") {
    console.log("i am loading");
    GAME_BOX.style.display = "none";
    LOADER.style.display = "block";
  } else {
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