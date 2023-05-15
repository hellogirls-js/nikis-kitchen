import { Achievments } from "./Achievement.js";
import { CG_BOX, FOOD_QUEUE, GAME_CONTAINER, HUNGRY_SPEECH, ING_LIST, MONEY_INCREMENT, MONEY_LABEL, NIKI, NIKI_IMG, NIKI_SRC, NIKI_HUNGRY_SRC, SERVE_BUTTON, STOMACH_BAR, ROTATE_DEVICE, GAME_BOX, ACHIEVEMENT, ACHIEVEMENT_TEXT, ACHIEVEMENT_TEXTBOX, ACH_TOOLTIP_TITLE, ACH_TOOLTIP_DESC } from "./CONSTANTS.js";
import { CutsceneList } from "./Cutscene.js";
import { Food, FoodList } from "./Food.js";

class GameSession {
  default_session = {
    newGame: true,
    level: 0,
    money: 200,
    foodQueue: [],
    foodQueueFull: false,
    stomach: 100,
    stomachInterval: 500,
    customersServed: 0,
    feedAmt: 0,
    foodTypesFed: [{foodId: 0, amtFed: 0}, {foodId: 1, amtFed: 0}],
    foodTypesServed: [{foodId: 0, amtServed: 0}, {foodId: 1, amtFed: 0}],
    canServe: false,
    canFeed: false,
    // showCG: true,
    // playGame: false,
    showCG: false,
    playGame: true,
    currentCGIndex: 0
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
    this.session.showCG = val;
    GAME_CONTAINER.style.display = val ? "none" : "flex";
    CG_BOX.style.display = val ? "block" : "none";
    // CutsceneList[this.session.currentCGIndex].setCG(CutsceneList[this.session.currentCGIndex].cg_list[CutsceneList[this.session.currentCGIndex].cgIndex]);
  }

  /**
   * go to the next cg when the previous cg is done
   */
  incrementCGIndex() {
    this.toggleShowCG(false);
    this.session.currentCGIndex++;
    // CutsceneList[this.session.currentCGIndex].setCG(CutsceneList[this.session.currentCGIndex].cg_list[CutsceneList[this.session.currentCGIndex].cgIndex]);
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
    console.log("w!");
    let ach = Achievments.find(a => a.id === i);
    ach.unlock();
    ACHIEVEMENT_TEXTBOX.innerHTML = ach.name;
    ACH_TOOLTIP_TITLE.innerHTML = ach.name;
    ACH_TOOLTIP_DESC.innerHTML = ach.description;
    if (ACHIEVEMENT.classList.contains("hide")) ACHIEVEMENT.classList.remove("hide");
    ACHIEVEMENT.classList.add("show");
  }

  closeAchievement() {
    console.log("girl bye");
    if (ACHIEVEMENT.classList.contains("show")) ACHIEVEMENT.classList.remove("show");
    ACHIEVEMENT.classList.add("hide");
  }

  /**
   * 
   * @param {number} amt adjust the amount of money by [amt], positive to increase, negative to decrease
   */
  incrementMoney(amt) {
    this.session.money += amt;
    MONEY_LABEL.innerHTML = this.session.money;
    MONEY_INCREMENT.innerHTML = `${amt > 0 ? "+" : "-"}${Math.abs(amt)}`;
    MONEY_INCREMENT.classList.remove("hide-inc");
    MONEY_INCREMENT.classList.add("show-inc");
    if (amt > 0) {
      MONEY_INCREMENT.classList.contains("decrease") && MONEY_INCREMENT.classList.remove("decrease");
      MONEY_INCREMENT.classList.add("increase");
      this.unlockAchievement(this.session.money >= 420, 14);
      this.unlockAchievement(this.session.money >= 1000, 15);
      this.unlockAchievement(this.session.money >= 10000, 16);
      this.unlockAchievement(this.session.money >= 100000, 17);
      this.unlockAchievement(this.session.money >= 1000000, 18);
    } else {
      MONEY_INCREMENT.classList.contains("increase") && MONEY_INCREMENT.classList.remove("increase");
      MONEY_INCREMENT.classList.add("decrease");
      this.unlockAchievement(this.session.money <= 0, 13);
    }
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
    if (this.session.foodQueue.length + item.amount <= 10 ) {
      this.incrementMoney(item.price * -1);
      for (let i = 0; i < item.amount; i++) {
        this.session.foodQueue.push(item);
        item.createFoodQueueItem();
      }
      if (this.session.foodQueue.length === 10) {
        this.toggleFoodQueueFull(true);
      }
      if (this.session.money < item.price || this.session.foodQueue.length + item.amount > 10) {
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
    console.log(this.session.foodQueue, FOOD_QUEUE);
    this.session.foodQueue.shift();
    FOOD_QUEUE.removeChild(FOOD_QUEUE.firstElementChild);
    for (let i = 0; i < ING_LIST.children.length; i++) {
      let ing = ING_LIST.children.item(i);
      const food = FoodList[i];
      if (this.session.foodQueue.length <= 0) {
        this.toggleCanFeedNiki(false);
        this.toggleCanServe(false);
      }
      if (food.price < this.session.money && this.session.foodQueue.length + food.amount <= 10) {
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
      NIKI.classList.contains("hungry") && NIKI.classList.remove("hungry");
      NIKI.classList.add("normal");
      NIKI_IMG.src = NIKI_SRC;
      HUNGRY_SPEECH.classList.contains("show") && HUNGRY_SPEECH.classList.remove("show");
      HUNGRY_SPEECH.classList.add("hide");
    } else if (this.session.stomach >= 20 && this.session.stomach < 50) {
      STOMACH_BAR.classList.contains("good") && STOMACH_BAR.classList.remove("good");
      STOMACH_BAR.classList.contains("low") && STOMACH_BAR.classList.remove("low");
      STOMACH_BAR.classList.add("mid");
      NIKI.classList.contains("hungry") && NIKI.classList.remove("hungry");
      NIKI.classList.add("normal");
      NIKI_IMG.src = NIKI_SRC;
      HUNGRY_SPEECH.classList.contains("hide") && HUNGRY_SPEECH.classList.remove("hide");
      HUNGRY_SPEECH.classList.add("show");
      HUNGRY_SPEECH.innerHTML = "I'm hungry..."; 
    } else {
      STOMACH_BAR.classList.contains("good") && STOMACH_BAR.classList.remove("good");
      STOMACH_BAR.classList.contains("mid") && STOMACH_BAR.classList.remove("mid");
      STOMACH_BAR.classList.add("low");
      NIKI.classList.contains("normal") && NIKI.classList.remove("normal");
      NIKI.classList.add("hungry");
      NIKI_IMG.src = NIKI_HUNGRY_SRC;
      HUNGRY_SPEECH.classList.contains("hide") && HUNGRY_SPEECH.classList.remove("hide");
      HUNGRY_SPEECH.classList.add("show");
      HUNGRY_SPEECH.innerHTML = "I'm starving...!!!";
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
      // sandwich achievements
      this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 10, 30);
      this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 100, 31);
      this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 500, 32);
      this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 1000, 33);
      this.unlockAchievement(this.session.foodTypesFed[0].amtFed >= 5000, 34);
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
    this.unlockAchievement(index === 0 && this.session.foodTypesServed[index].amtServed >= 10, 1);
    this.unlockAchievement(index === 0 && this.session.foodTypesServed[index].amtServed >= 50, 2);
    this.unlockAchievement(index === 0 && this.session.foodTypesServed[index].amtServed >= 100, 3);
    this.unlockAchievement(index === 0 && this.session.foodTypesServed[index].amtServed >= 200, 4);
    this.unlockAchievement(index === 0 && this.session.foodTypesServed[index].amtServed >= 500, 5);
    this.unlockAchievement(index === 0 && this.session.foodTypesServed[index].amtServed >= 1000, 6);
  }

  /**
   * remove the first item in the food queue and earn money
   */
  serve() {
    if (this.session.canServe) {
      console.log("serve queen");
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

}

export default GameSession;