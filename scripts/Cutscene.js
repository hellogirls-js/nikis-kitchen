import { CG_BOX, TEXTBOX, TEXTBOX_CONTENT, TEXTBOX_NAME, TEXTBOX_NEXT, TEXTBOX_TEXT } from "./CONSTANTS.js";

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
    this.closeCG = false;

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
    
    for (let i = 0; i < this.cg_list.length; i++) {
      const dirs = this.cg_list[(this.cg_list.length - 1) - i].split('/');
      let cgDiv = document.createElement("div");
      cgDiv.className = "cg-bg";
      if (dirs[2] === "CUTSCENE_1" && dirs[3] == "cg_1.png") cgDiv.classList.add("cg-shake");
      cgDiv.style.backgroundImage = `url("${this.cg_list[(this.cg_list.length - 1) - i]}")`;
      CG_BOX.appendChild(cgDiv);
    }
  }
    

  changeCG() {
    this.cgIndex++;
    this.setCG(this.cg_list[this.cgIndex]);
  }

  changeDialogue() {
    if (this.dialogueIndex + 1 <= this.dialogue.length) {
      this.dialogueIndex++;
      if (this.dialogue[this.dialogueIndex].name === undefined && this.dialogue[this.dialogueIndex].content === "/CHANGE/" && this.cgIndex + 1 <= this.cg_list.length) {
        this.cgIndex++;
        this.setCG(this.cg_list[this.cgIndex]);
        TEXTBOX_CONTENT.style.visibility = "hidden";
        TEXTBOX_NAME.innerHTML = "";
        TEXTBOX_TEXT.innerHTML = "";
      } else if (this.dialogue[this.dialogueIndex].name) {
        if (TEXTBOX_CONTENT.style.visibility === "hidden") TEXTBOX_CONTENT.style.visibility = "visible";
        this.formatTextbox();
      } else {
        console.log("We are fucked!");
      }
    }
  }

  setCG() {
    let cgs = document.getElementsByClassName("cg-bg");
    document.getElementsByClassName("cg-bg")[cgs.length - 1].classList.add("out");
    setTimeout(() => {
      document.getElementsByClassName("cg-bg")[cgs.length - 1].remove();
    }, 500);
  }

  toggleTextbox(val) {
    this.showTextbox = val;
    TEXTBOX.style.display = val ? "block" : "none";
  }

  formatTextbox() {
    if (this.dialogue[this.dialogueIndex].name) {
      TEXTBOX_NAME.innerHTML = this.dialogue[this.dialogueIndex].name;
      TEXTBOX_TEXT.innerHTML = this.dialogue[this.dialogueIndex].content;
    }
  }
}

export const CUTSCENE_1 = new Cutscene(0, ["../images/CUTSCENE_1/cg_1.png", "../images/CUTSCENE_1/cg_2.png", "../images/CUTSCENE_1/cg_3.png", "../images/CUTSCENE_1/cg_4.png", "../images/CUTSCENE_1/cg_5.png"]);

export const CutsceneList = [CUTSCENE_1];