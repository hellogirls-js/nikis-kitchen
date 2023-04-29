export class Achievement {

  /**
   * 
   * @param {number} id the achievement id
   * @param {string} name the name of the achievement
   * @param {string} description the achievement description
   * @param {*} unlockFunction the function that unlocks the given achievement
   */
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.unlocked = false;
  }

  unlock() {
    this.unlocked = true;
  }
}

export const FoodAchievements = [
  new Achievement(0, "Eat fresh!", "Serve 10 sandwiches"), 
  new Achievement(1, "Jimmy John's", "Serve 50 sandwiches"), 
  new Achievement(2, "Quiznos", "Serve 100 sandwiches"),
  new Achievement(3, "Firehouse Subs", "Serve 200 sandwiches"),
  new Achievement(4, "Potbelly", "Serve 500 sandwiches"),
  new Achievement(5, "Subway", "Serve 1000 sandwiches"),
]

export const MoneyAchievements = [
  new Achievement(6, "Nice", "Obtain $420"),
  new Achievement(7, "Good", "Obtain $1000"),
  new Achievement(8, "Perfect", "Obtain $10000"),
  new Achievement(9, "Amazing!", "Obtain $100000")
]