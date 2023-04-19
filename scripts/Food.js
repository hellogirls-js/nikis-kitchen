import { FOOD_QUEUE } from "./CONSTANTS.js";
import GameSession from "./GameSession.js";

export class Food {
  /**
   * 
   * @param {number} index the index number
   * @param {string} name the name of the food
   * @param {number} price how much the food ingredients cost
   * @param {number} sell how much the food sells for
   * @param {string} desc food description
   * @param {number} amount the amount of this food you can make at once
   * @param {number} fill how much it fills the stomach
   * @param {boolean} unlocked whether the ingredient is unlocked or not
   * @param {boolean} visible whether the ingredient is visible or not
   */
  constructor(index, name, price, sell, desc, amount, fill, unlocked = false, visible = false) {
    this.index = index;
    this.name = name;
    this.price = price;
    this.sell = sell;
    this.desc = desc;
    this.amount = amount;
    this.fill = fill;
    this.unlocked = unlocked;
    this.visible = visible;
  }

  /**
   * creates a clickable html box for the ingredient list
   * @param {GameSession} game the game session
   */
  createIngredientBox(game) {
    // create clickable box
    const ingBox = document.createElement("div");
    ingBox.id = `ing${this.index}`;
    ingBox.className = `ingredient ${this.unlocked ? "unlocked" : "locked"} ${this.visible ? "show" : "hide"}`;
    ingBox.onclick = (event) => {
      if (this.unlocked) {
        game.addToFoodQueue(this);
      } else {
        console.log("not allowed");
      }
    }
    // create info box
    const ingInfo = document.createElement("div");
    ingInfo.className = "ing-label ing-info";
    //create icon
    const ingIcon = document.createElement("div");
    ingIcon.className = "ing-label ing-icon";
    const ingImg = document.createElement("img");
    ingImg.src = `../images/food_sprites/${this.name.toLowerCase()}_sprite.png`;
    ingIcon.appendChild(ingImg);
    // add descriptions
    const ingName = document.createElement("div");
    ingName.className = "ing-label ing-name";
    ingName.innerHTML = this.name;
    const ingPrice = document.createElement("div");
    ingPrice.className = "ing-label ing-price";
    const ingPriceIcon = document.createElement("i");
    ingPriceIcon.className = "ti ti-coin";
    ingPrice.appendChild(ingPriceIcon);
    ingPrice.innerHTML += this.price;
    const ingDesc = document.createElement("div");
    ingDesc.className = "ing-label ing-desc";
    ingDesc.innerHTML = this.desc;

    //append everything
    ingInfo.appendChild(ingName);
    ingInfo.appendChild(ingPrice);
    ingInfo.appendChild(ingDesc);
    ingBox.appendChild(ingIcon);
    ingBox.appendChild(ingInfo);
    document.getElementById("ing-list").appendChild(ingBox);
  }

  /**
   * 
   * @param {boolean} val the lock value, true = unlocked
   */
  toggleLock(val) {
    this.unlocked = val;
    const ing = document.getElementById(`ing${this.index}`);
    if (val && ing.classList.contains("locked")) {
      ing.classList.replace("locked", "unlocked");
    } else {
      ing.classList.replace("unlocked", "locked");
    }
  }

  /**
   * 
   * @param {boolean} val the visibility value
   */
  toggleVisible(val) {
    this.visible = val;
  }

  createFoodQueueItem() {
    const foodItem = document.createElement("div");
    foodItem.className = `${this.name.toLowerCase()}-queue-item food-queue-item`;
    FOOD_QUEUE.append(foodItem);
  }
}

export const Sandwich = new Food(0, "Sandwich", 10, 10, "Makes 5 sandwiches", 5, 10, true, true);
export const Soda = new Food(1, "Soda", 5, 10, "Sweet soda that sells well, but isn't quite filling...", 5, 5);

export const FoodList = [Sandwich];