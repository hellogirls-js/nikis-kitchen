import { Achievments } from "./Achievement.js";
import { CG_BOX, CG_LOADING, FOOD_QUEUE, GAME_CONTAINER, HUNGRY_SPEECH, ING_LIST, MONEY_CONTAINER, MONEY_INCREMENT, MONEY_LABEL, NIKI, NIKI_IMG, NIKI_SRC, NIKI_HUNGRY_SRC, 
        SERVE_BUTTON, STOMACH_BAR, ROTATE_DEVICE, GAME_BOX, ACHIEVEMENT, ACHIEVEMENT_TEXTBOX, ACH_TOOLTIP_TITLE, ACH_TOOLTIP_DESC, ACHIEVEMENT_CONTAINER, BGM_SRC, BGM, RINNE_BUTTON, 
        LIVE_RINNE_REACTION, NIKI_MAD_SRC, NIKI_PISSED_SRC } from "./CONSTANTS.js";
import { CutsceneList } from "./Cutscene.js";
import { Food, FoodList } from "./Food.js";

class GameSession {
  default_session = {
    newGame: true,
    level: 0,
    money: 200,
    foodQueue: [],
    foodQueueFull: false,
    foodQueueMax: 10,
    stomach: 100,
    stomachInterval: 500,
    customersServed: 0,
    feedAmt: 0,
    foodTypesFed: [{foodId: 0, amtFed: 0}, {foodId: 1, amtFed: 0}],
    foodTypesServed: [{foodId: 0, amtServed: 0}, {foodId: 1, amtServed: 0}],
    canServe: false,
    canFeed: false,
    showCG: true,
    playGame: false,
    currentCGIndex: 0,
    rinneTrigger: false,
    rinneLeeching: false,
  }

  // if no save is found
  constructor() {
    this.session = this.default_session;
    this.currentCutscene = CutsceneList[this.session.currentCGIndex];
  }

  /**
   * 
   * @param {boolean} val set as false if this isn't a new session
   */
  setNewGame(val) {
    this.session.newGame = val;
  }

  /**
   * show or hide the overlay
   * @param {HTMLDivElement} container the container element to show
   * @param {HTMLDivElement} overlay the overlay element to show
   */
  toggleSettingOverlay(container, overlay) {
    if (container.classList.contains("hide")) {
      if (container.id === "achievements-overlay-container") {
        Achievments.forEach(ach => {
          ach.createAchievementCell();
        })
      }
      this.togglePlayGame(false);
      container.classList.replace("hide", "show");
      overlay.classList.replace("hide", "show");
    } else {
      container.classList.replace("show", "hide");
      overlay.classList.replace("show", "hide");
      if (container.id === "achievements-overlay-container") {
        document.getElementById("achievement-overlay-grid").innerHTML = "";
      }
      this.togglePlayGame(true);
    }
  }

  /**
   * prompts the user to rotate their mobile device if they are on portrait mode
   */
  toggleRotateDevice() {
    let aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio < 1) {
      ROTATE_DEVICE.style.display = "block";
      GAME_BOX.style.display = "none";
    } else {
      ROTATE_DEVICE.style.display = "none";
      GAME_BOX.style.display = "flex";
    }
  }

  /**
   * 
   * @param {boolean} val set as true if you want the game to play; false if the game is paused
   */
  togglePlayGame(val) {
    this.session.playGame = val;
    if (val) {
      switch (this.session.level) {
        case 0:
          console.log("play bgm");
          if (!BGM.src || BGM.src !== "../sounds/bgm/stage_1_cafe_shiinamon.wav") BGM.src = "../sounds/bgm/stage_1_cafe_shiinamon.wav";
          if (BGM.paused) BGM.play();
          break;
        default:
          break;
      }
      this.decreaseStomachBar();
    } else {
      this.pauseStomachBar();
    }
  }

  /**
   * 
   * @param {boolean} val if true, display a cutscene
   */
  toggleShowCG(val) {
    if (!BGM.paused) BGM.pause();
    this.session.showCG = val;
    CG_LOADING.style.display = val ? "flex" : "none";
    GAME_CONTAINER.style.display = val ? "none" : "flex";
    MONEY_CONTAINER.style.display = val ? "none" : "flex";
    CG_BOX.style.display = val ? "flex" : "none";
    ACHIEVEMENT_CONTAINER.style.display = val ? "none" : "block";
    if (val) {
      this.togglePlayGame(false);
      CutsceneList[this.session.currentCGIndex].addCGs();
      CutsceneList[this.session.currentCGIndex].createDialogue();
      setTimeout(() => {
        CG_LOADING.style.display = "none";
      }, 1500);
    }
  }

  /**
   * go to the next cg when the previous cg is done
   */
  incrementCGIndex() {
    this.toggleShowCG(false);
    if (this.session.currentCGIndex === 1) {
      this.toggleRinneButton(false);
      FoodList[1].toggleVisible(true);
      if (this.session.money >= FoodList[1].price) {
        FoodList[1].toggleLock(true);
      }
      this.setRinneLeeching(true);
    }
    this.session.currentCGIndex++;
    if (CutsceneList[this.session.currentCGIndex]) {
      CutsceneList[this.session.currentCGIndex].setCG(CutsceneList[this.session.currentCGIndex].cg_list[CutsceneList[this.session.currentCGIndex].cgIndex]);
    }
  }

  /**
   * 
   * @param {number} i the achievement id
   */
  getAchievement(i) {
    return Achievments.find(ach => ach.id === i);
  }

  /**
   * 
   * @param {boolean} condition the condition to unlock the achievement
   * @param {number} i achievement id
   */
  unlockAchievement(condition, i) {
    if (condition && !this.getAchievement(i).unlocked) {
      this.showAchievement(i);
    }
  }

  /**
   * 
   * @param {number} i the achievement id
   */
  showAchievement(i) {
    let ach = Achievments.find(a => a.id === i);
    ach.unlock();
    ACHIEVEMENT_TEXTBOX.innerHTML = ach.name;
    ACH_TOOLTIP_TITLE.innerHTML = ach.name;
    ACH_TOOLTIP_DESC.innerHTML = ach.description;
    if (ACHIEVEMENT.classList.contains("hide")) ACHIEVEMENT.classList.remove("hide");
    ACHIEVEMENT.classList.add("show");
  }

  closeAchievement() {
    if (ACHIEVEMENT.classList.contains("show")) ACHIEVEMENT.classList.remove("show");
    ACHIEVEMENT.classList.add("hide");
  }

  setMoney(amt) {
    this.session.money = amt;
    MONEY_LABEL.innerHTML = this.session.money;
  }

  originalMoneyAmt;
  /**
   * 
   * @param {number} amt adjust the amount of money by [amt], positive to increase, negative to decrease
   */
  incrementMoney(amt) {
    let money = this.session.money;
    this.setMoney(money + amt);
    MONEY_INCREMENT.innerHTML = `${amt > 0 ? "+" : "-"}${Math.abs(amt)}`;
    MONEY_INCREMENT.classList.remove("hide-inc");
    MONEY_INCREMENT.classList.add("show-inc");
    if (amt > 0) {
      MONEY_INCREMENT.classList.contains("decrease") && MONEY_INCREMENT.classList.remove("decrease");
      MONEY_INCREMENT.classList.add("increase");
      // unlock foods
      FoodList.forEach(food => {
        if (!food.unlocked && this.session.money >= food.price && this.session.foodQueue.length + food.amount <= this.session.foodQueueMax) {
          food.toggleLock(true);
        }
      });
      this.unlockAchievement(this.session.money >= 420, 14);
      this.unlockAchievement(this.session.money >= 1000, 15);
      this.unlockAchievement(this.session.money >= 10000, 16);
      this.unlockAchievement(this.session.money >= 100000, 17);
      this.unlockAchievement(this.session.money >= 1000000, 18);
      // rinne has arrived
      if (this.session.money >= 2000 && !this.session.rinneTrigger) {
        this.toggleRinneButton(true);
      }
    } else {
      MONEY_INCREMENT.classList.contains("increase") && MONEY_INCREMENT.classList.remove("increase");
      MONEY_INCREMENT.classList.add("decrease");
      // lock food if there isnt enough money
      FoodList.forEach(food => {
        if (food.unlocked && this.session.money < food.price) {
          food.toggleLock(false);
        }
      });
      // if rinne is leeching, change niki's expression
      if (this.session.rinneLeeching) {
        if (this.session.money <= (2 * this.originalMoneyAmt) / 3) {
          NIKI_IMG.src = NIKI_MAD_SRC;
        }
        if (this.session.money <= this.originalMoneyAmt / 3) {
          NIKI.classList.contains("normal") && NIKI.classList.remove("normal");
          NIKI.classList.add("hungry");
          NIKI_IMG.src = NIKI_PISSED_SRC;
        }
      }
      // stop rinne from leeching
      if (this.session.money <= 0 && this.session.rinneLeeching) {
        this.setMoney(0);
        this.setRinneLeeching(false);
        // show the cg here
        setTimeout(() => {
          this.toggleShowCG(true);
        }, 500);
        
      }
      this.unlockAchievement(this.session.money <= 0, 13);
    }
    // show the increment amount
    setTimeout(() => {
      MONEY_INCREMENT.classList.remove("show-inc");
      MONEY_INCREMENT.classList.add("hide-inc");
    }, 4000);
  }

  /**
   * go to the next restaurant level
   */
  gainLevel() {
    this.session.level++;
  }

  // FOOD QUEUE FUNCTIONS

  /**
   * add food to the queue
   * @param {Food} item food item to add to queue
   */
  addToFoodQueue(item) {
    if (this.session.foodQueue.length + item.amount <= this.session.foodQueueMax ) {
      this.incrementMoney(item.price * -1);
      for (let i = 0; i < item.amount; i++) {
        this.session.foodQueue.push(item);
        item.createFoodQueueItem();
      }
      if (this.session.foodQueue.length === this.session.foodQueueMax) {
        this.toggleFoodQueueFull(true);
      }
      if (this.session.money < item.price || this.session.foodQueue.length + item.amount > this.session.foodQueueMax) {
        item.toggleLock(false);
      }
      if (NIKI.classList.contains("disabled") && this.session.stomach < 100) {
        this.toggleCanFeedNiki(true);
      }
      if (this.session.stomach > 0) {
        this.toggleCanServe(true);
      }
    }
  }

  /**
   * remove first item from food queue
   */
  removeFromFoodQueue() {
    this.session.foodQueue.shift();
    FOOD_QUEUE.removeChild(FOOD_QUEUE.firstElementChild);
    for (let i = 0; i < ING_LIST.children.length; i++) {
      let ing = ING_LIST.children.item(i);
      const food = FoodList[i];
      if (this.session.foodQueue.length <= 0) {
        this.toggleCanFeedNiki(false);
        this.toggleCanServe(false);
      }
      if (food.price < this.session.money && this.session.foodQueue.length + food.amount <= this.session.foodQueueMax) {
        // if the user can still afford the food, enable the ingredient
        if (ing.classList.contains("locked")) {
          food.toggleLock(true);
        }
      }
    }
  }

  /**
   * 
   * @param {boolean} val sets food queue as full or not and lock items if full
   */
  toggleFoodQueueFull(val) {
    this.foodQueueFull = val;
    FoodList.forEach(food => food.toggleLock(!val));
  }

  /**
   * 
   * @param {boolean} val sets the stomach interval (changes depending on the food)
   */
  setStomachInterval(val) {
    this.session.stomachInterval = val;
  }

  // STOMACH FUNCTIONS

  /**
   * 
   * @param {number} amt adjust the stomach value by [amt], positive to increase, negative to decrease
   */
  incrementStomach(amt) {
    this.session.stomach += amt;
    STOMACH_BAR.style.width = `${this.session.stomach}%`;
    if (this.session.stomach <= 0 || this.session.foodQueue.length <= 0) {
      this.toggleCanServe(false);
    }
    if (this.session.foodQueue.length > 0 && this.session.stomach > 0) {
      this.toggleCanServe(true);
    }
    let food = this.session.foodQueue[0];
    let nextFood = this.session.foodQueue[1];
    if (food) {
      if (this.session.stomach + food.fill <= 100 && this.session.foodQueue.length > 0) {
      this.toggleCanFeedNiki(true);
     }
    }
    if ((nextFood !== undefined && this.session.stomach + nextFood.fill >= 100) || food === undefined) {
      this.toggleCanFeedNiki(false);
    }

    if (this.session.stomach >= 50) {
      STOMACH_BAR.classList.contains("mid") && STOMACH_BAR.classList.remove("mid");
      STOMACH_BAR.classList.contains("low") && STOMACH_BAR.classList.remove("low");
      STOMACH_BAR.classList.add("good");
      if (!this.session.rinneLeeching) {
        NIKI.classList.contains("hungry") && NIKI.classList.remove("hungry");
        NIKI.classList.add("normal");
        NIKI_IMG.src = NIKI_SRC; 
      }
      HUNGRY_SPEECH.classList.contains("show") && HUNGRY_SPEECH.classList.remove("show");
      HUNGRY_SPEECH.classList.add("hide");
    } else if (this.session.stomach >= 20 && this.session.stomach < 50) {
      STOMACH_BAR.classList.contains("good") && STOMACH_BAR.classList.remove("good");
      STOMACH_BAR.classList.contains("low") && STOMACH_BAR.classList.remove("low");
      STOMACH_BAR.classList.add("mid");
      if (!this.session.rinneLeeching) {
        NIKI.classList.contains("hungry") && NIKI.classList.remove("hungry");
        NIKI.classList.add("normal");
        NIKI_IMG.src = NIKI_SRC;
        HUNGRY_SPEECH.classList.contains("hide") && HUNGRY_SPEECH.classList.remove("hide");
        HUNGRY_SPEECH.classList.add("show");
        HUNGRY_SPEECH.innerHTML = "I'm hungry...";
      }
    } else {
      STOMACH_BAR.classList.contains("good") && STOMACH_BAR.classList.remove("good");
      STOMACH_BAR.classList.contains("mid") && STOMACH_BAR.classList.remove("mid");
      STOMACH_BAR.classList.add("low");
      if (!this.session.rinneLeeching) {
        NIKI.classList.contains("normal") && NIKI.classList.remove("normal");
        NIKI.classList.add("hungry");
        NIKI_IMG.src = NIKI_HUNGRY_SRC;
        HUNGRY_SPEECH.classList.contains("hide") && HUNGRY_SPEECH.classList.remove("hide");
        HUNGRY_SPEECH.classList.add("show");
        HUNGRY_SPEECH.innerHTML = "I'm starving...!!!";
      }
    }

    this.unlockAchievement(this.session.stomach <= 0, 29);
  }

  stomachInterval = setInterval(() => {
    if (this.stomach > 0) {
      this.incrementStomach(-1);
    }
  }, this.stomachInterval);

  /**
    * decrease the stomach bar value at an interval set by the game
    */
  decreaseStomachBar() {
    this.stomachInterval = setInterval(() => {
      if (this.session.stomach > 0) {
        this.incrementStomach(-1);
      }
    }, this.session.stomachInterval);
  }

  /**
   * pause the stomach bar
   */
  pauseStomachBar() {
    clearInterval(this.stomachInterval);
  }

  /**
   * @param {Food} food the food eaten to fill the stomach
   * increase the stomach bar when fed
   */
  fillStomachBar(food) {
    this.incrementStomach(food.amount);
  }

  /**
   * true if you have food and niki's stomach isn't full
   * @param {boolean} val the feed value
   */
  toggleCanFeedNiki(val) {
    this.session.canFeed = val;
    if (val) {
      if (NIKI.classList.contains("disabled")) NIKI.classList.remove("disabled");
      NIKI.classList.add("enabled");
    } else {
      if (NIKI.classList.contains("enabled")) NIKI.classList.remove("enabled");
      NIKI.classList.add("disabled");
    }
  }

  /**
   * 
   * @param {Food} food food that was fed
   */
  addFoodTypeFed(food) {
    const index = this.getFoodTypeFed(food);
    this.session.foodTypesFed[index].amtFed++;
    // sandwich achievements
    this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 10, 30);
    this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 100, 31);
    this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 500, 32);
    this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 1000, 33);
    this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 5000, 34);
    // soda achievements
    this.unlockAchievement(this.session.foodTypesFed[1].amtFed >= 10, 35);
    this.unlockAchievement(this.session.foodTypesFed[1].amtFed >= 100, 36);
    this.unlockAchievement(this.session.foodTypesFed[1].amtFed >= 500, 37);
    this.unlockAchievement(this.session.foodTypesFed[1].amtFed >= 1000, 38);
    this.unlockAchievement(this.session.foodTypesFed[1].amtFed >= 5000, 38);
  }

  /**
   * 
   * @param {Food} food food to get fed stats for
   */
  getFoodTypeFed(food) {
    return this.session.foodTypesFed.findIndex(type => type.foodId === food.index);
  }

  /**
   * feed niki some food!
   */
  feed() {
    let food = this.session.foodQueue[0];
    let nextFood = this.session.foodQueue[1];
    if (this.session.canFeed) {
      this.incrementStomach(food.fill);
      this.session.feedAmt++;
      this.addFoodTypeFed(food);
      this.removeFromFoodQueue();
      // general feed achievements
      this.unlockAchievement(this.session.feedAmt >= 5, 24);
      this.unlockAchievement(this.session.feedAmt >= 100, 25);
      this.unlockAchievement(this.session.feedAmt >= 500, 26); 
      this.unlockAchievement(this.session.unlockAchievement >= 1000, 27);
      this.unlockAchievement(this.session.unlockAchievement >= 5000, 28);
      if ((nextFood !== undefined && this.session.stomach + nextFood.fill > 100) || this.session.foodQueue.length === 0) {
        this.toggleCanFeedNiki(false);
      }
    }
  }

  // SERVING
  
  /**
   * true if niki's stomach isn't empty and if there is a food queue
   * @param {boolean} val can serve value
   */
  toggleCanServe(val) {
    this.session.canServe = val
    if (val) {
      if (SERVE_BUTTON.classList.contains("disabled")) SERVE_BUTTON.classList.remove("disabled")
      SERVE_BUTTON.classList.add("enabled");   
    } else {
      if (SERVE_BUTTON.classList.contains("enabled")) SERVE_BUTTON.classList.remove("enabled");
      SERVE_BUTTON.classList.add("disabled");
    }
  }

  /**
   * 
   * @param {Food} food food that was served
   */
  addFoodTypeServed(food) {
    const index = this.session.foodTypesServed.findIndex(type => type.foodId === food.index);
    this.session.foodTypesServed[index].amtServed++; 
    this.unlockAchievement(this.session.foodTypesServed[0].amtServed >= 10, 1);
    this.unlockAchievement(this.session.foodTypesServed[0].amtServed >= 50, 2);
    this.unlockAchievement(this.session.foodTypesServed[0].amtServed >= 100, 3);
    this.unlockAchievement(this.session.foodTypesServed[0].amtServed >= 200, 4);
    this.unlockAchievement(this.session.foodTypesServed[0].amtServed >= 500, 5);
    this.unlockAchievement(this.session.foodTypesServed[0].amtServed >= 1000, 6);
    this.unlockAchievement(this.session.foodTypesServed[1].amtServed >= 10, 7);
    this.unlockAchievement(this.session.foodTypesServed[1].amtServed >= 50, 8);
    this.unlockAchievement(this.session.foodTypesServed[1].amtServed >= 100, 9);
    this.unlockAchievement(this.session.foodTypesServed[1].amtServed >= 200, 10);
    this.unlockAchievement(this.session.foodTypesServed[1].amtServed >= 500, 11);
    this.unlockAchievement(this.session.foodTypesServed[1].amtServed >= 1000, 12);
  }

  /**
   * remove the first item in the food queue and earn money
   */
  serve() {
    if (this.session.canServe) {
      let food = this.session.foodQueue[0];
      if (this.session.foodQueue.length > 0) {
        this.incrementMoney(food.sell);
        this.addFoodTypeServed(food);
        this.removeFromFoodQueue();
        this.session.customersServed++;
        this.unlockAchievement(this.session.customersServed >= 5, 19);
        this.unlockAchievement(this.session.customersServed >= 100, 20);
        this.unlockAchievement(this.session.customersServed >= 1000, 21);
        this.unlockAchievement(this.session.customersServed >= 5000, 22);
        this.unlockAchievement(this.session.unlockAchievement >= 10000, 23);
        this.unlockAchievement
        if (this.session.foodQueue.length <= 0) {
          this.toggleCanServe(false);
        }
      }
    }
  }

  setRinneTrigger(val) {
    this.session.rinneTrigger = val;
  }

  setRinneLeeching(val) {
    this.session.rinneLeeching = val;
    LIVE_RINNE_REACTION.style.display = val ? "block" : "none";
    if (val) {
      this.originalMoneyAmt = this.session.money;
      this.unlockAchievement(val, 40);
      this.startRinneLeeching();
    } else {
      this.stopRinneLeeching();
    }
  }

  rinneLeechMultiplier = 1;
  rinneLeechInterval = null;

  startRinneLeeching() {
    this.rinneLeechInterval = setInterval(() => {
      this.incrementMoney(-50 * this.rinneLeechMultiplier);
      MONEY_LABEL.style.color = "#f368a2";
      setTimeout(() => {
        MONEY_LABEL.style.color = "#dfd2e7";
      }, 500);
      this.rinneLeechMultiplier++;
    }, 3000);
  }

  stopRinneLeeching() {
    clearInterval(this.rinneLeechInterval);
  }

  toggleRinneButton(val) {
    RINNE_BUTTON.style.display = val ? "block" : "none";
  }

}

export default GameSession;