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
  new Achievement(1, "Eat fresh!", "Serve 10 sandwiches"), 
  new Achievement(2, "Jimmy John's", "Serve 50 sandwiches"), 
  new Achievement(3, "Quiznos", "Serve 100 sandwiches"),
  new Achievement(4, "Firehouse Subs", "Serve 200 sandwiches"),
  new Achievement(5, "Potbelly", "Serve 500 sandwiches"),
  new Achievement(6, "Subway has gone out of business", "Serve 1000 sandwiches"),
  new Achievement(7, "Popping off", "Sell 5 bottles of soda"),
  new Achievement(8, "Is it soda, pop, or coke?", "Sell 50 bottles of soda"),
  new Achievement(9, "One hundred bottles of pop on the wall", "Sell 100 bottles of soda"),
  new Achievement(10, "Micky D's Sprite connoisseur", "Sell 200 bottles of soda"),
  new Achievement(11, "Baja Blast super-fan", "Sell 500 bottles of soda"),
  new Achievement(12, "Coca-Cola factory", "Sell 1000 bottles of soda")
];

export const MoneyAchievements = [
  new Achievement(13, "Miss...", "Let Niki go broke"),
  new Achievement(14, "Nice", "Obtain $420"),
  new Achievement(15, "Good", "Obtain $1000"),
  new Achievement(16, "Perfect", "Obtain $10000"),
  new Achievement(17, "Amazing!", "Obtain $100000"),
  new Achievement(18, "Nikillionaire", "Obtain $1000000")
];

export const ServeAchievements = [
  new Achievement(19, "At your service!", "Serve 5 customers"),
  new Achievement(20, "Could I get a smile with that?", "Serve 100 customers"),
  new Achievement(21, "This is way over my paygrade.", "Serve 1000 customers"),
  new Achievement(22, "Can I take a lunch break?", "Serve 5000 customers"),
  new Achievement(23, "Nutritional Niki smile for the heart~!", "Serve 10000 customers")
];

export const FeedAchievements = [
  new Achievement(24, "Homph! :3", "Feed Niki 5 times"),
  new Achievement(25, "Wakka wakka wakka", "Feed Niki 100 times"),
  new Achievement(26, "Almost full... Almost.", "Feed Niki 500 times"),
  new Achievement(27, "Pro Tamagotchi owner", "Feed Niki 1000 times"),
  new Achievement(28, "Thank you for taking care of Niki!", "Feed Niki 5000 times"),
  new Achievement(29, "Starving child starving to death.", "Let Niki's stomach empty"),
  new Achievement(30, "Peanut Butter Jelly Time", "Feed Niki 10 sandwiches"),
  new Achievement(31, "Is this enough to make a footlong?", "Feed Niki 100 sandwiches"),
  new Achievement(32, "What *is* in this sandwich?", "Feed Niki 500 sandwiches"),
  new Achievement(33, "You're telling me it's called a sand witch?", "Feed Niki 1000 sandwiches"),
  new Achievement(34, "Become one with the sandwich", "Feed Niki 5000 sandwiches"),
  new Achievement(35, "Sugary goodness", "Feed Niki 10 bottles of soda"),
  new Achievement(36, "I have to pee.", "Feed Niki 100 bottles of soda"),
  new Achievement(37, "*Burp* E-excuse me!", "Feed Niki 500 bottles of soda"),
  new Achievement(38, "My tummy isn't feeling so yummy...", "Feed Niki 1000 bottles of soda"),
  new Achievement(39, "Died from sugar overdose", "Feed Niki 5000 bottles of soda")
];

export const CharacterAchievements = [
  new Achievement(40, "Taking a risk...", "Have Rinne pay a visit"),
  new Achievement(41, "Thank you, Kohaku-chan!", "Recruit Kohaku")
];