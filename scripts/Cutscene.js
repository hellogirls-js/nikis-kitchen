import { CG_BOX, TEXTBOX, TEXTBOX_CONTENT, TEXTBOX_NAME } from "./CONSTANTS.js";

export class Cutscene {
  /**
   * 
   * @param {number} order the order in which the cg occurs
   * @param {string} cg_list list of cg src in order
   */
  constructor(order, cg_list) {
    this.order = order;
    this.cg_list = cg_list;
    this.showTextbox = true;
    this.cgIndex = 0;
    this.dialogueIndex = 0;

    // generate dialogue
    fetch(`../text/script_${this.cgIndex + 1}.txt`)
      .then(response => response.text())
      .then(text => {
        let lines = text.split('\n');
        let dialogue = [];
        for (let i = 0; i < lines.length; i++) {
          let split = lines[i].split(": ");
          let dialogueObj;
          if (split.length > 1) {
            dialogueObj = {
              name: split[0],
              content: split[1]
            };
          } else {
            dialogueObj = {
              content: split[0]
            }
          }
          dialogue.push(dialogueObj);
        }
        this.dialogue = dialogue;
      });
  }
    

  changeCG() {
    this.cgIndex++;
    this.setCG(this.cg_list[this.cgIndex]);
  }

  setCG(src) {
    CG_BOX.style.backgroundImage = `url("${src}")`;
  }

  toggleTextbox(val) {
    this.showTextbox = val;
    TEXTBOX.style.display = val ? "block" : "none";
  }

  formatTextbox() {
    if (this.dialogue[this.dialogueIndex].name) {
      TEXTBOX_NAME.innerHTML = this.dialogue[this.cgIndex].name;
      TEXTBOX_CONTENT.innerHTML = this.dialogue[this.cgIndex].content;
    }
  }
}

export const CUTSCENE_1 = new Cutscene(0, ["../images/CUTSCENE_1/cg_1.png", "../images/CUTSCENE_1/cg_2.png", "../images/CUTSCENE_1/cg_3.png", "../images/CUTSCENE_1/cg_4.png", "../images/CUTSCENE_1/cg_5.png"]);

export const CutsceneList = [CUTSCENE_1];