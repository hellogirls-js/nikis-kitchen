import { CG_BOX, TEXTBOX, TEXTBOX_CONTENT, TEXTBOX_NAME, TEXTBOX_NEXT, TEXTBOX_TEXT } from "./CONSTANTS.js";

export class Cutscene {
  /**
   * 
   * @param {number} order the order in which the cg occurs
   * @param {string} cg_list list of cg src in order
   */
  constructor(order, cg_list, voice_list) {
    this.order = order;
    this.cg_list = cg_list;
    this.voice_list = voice_list;
    this.showTextbox = true;
    this.cgIndex = 0;
    this.voiceIndex = 0;
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
        this.formatTextbox();
      });
    
    // add cg slides to the DOM
    for (let i = 0; i < this.cg_list.length; i++) {
      const dirs = this.cg_list[(this.cg_list.length - 1) - i].split('/');
      let cgDiv = document.createElement("div");
      cgDiv.className = "cg-bg";
      if (dirs[2] === "CUTSCENE_1" && dirs[3] == "cg_1.png") cgDiv.classList.add("cg-shake");
      cgDiv.style.backgroundImage = `url("${this.cg_list[(this.cg_list.length - 1) - i]}")`;
      CG_BOX.appendChild(cgDiv);
    }
  }
    
  /**
   * go to the next CG when prompted
   */
  changeCG() {
    this.cgIndex++;
    this.setCG(this.cg_list[this.cgIndex]);
  }

  /**
   * go to the next line of dialogue when the next button is clicked
   */
  changeDialogue() {
    if (this.dialogueIndex + 1 < this.dialogue.length - 1) {
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
        setTimeout(() => {
          this.playVoiceLine()
        }, 500);
      } else {
        console.log("We are fucked!");
      }
    }
  }

  /**
   * play the voice line
   */
  playVoiceLine() {
    this.voice_list[this.voiceIndex].play();
    if (this.voiceIndex < this.voice_list.length - 1) {
      this.voiceIndex++;
    }
  }

  /**
   * transition to the next CG by removing the previous one
   */
  setCG() {
    let cgs = document.getElementsByClassName("cg-bg");
    document.getElementsByClassName("cg-bg")[cgs.length - 1].classList.add("out");
    setTimeout(() => {
      document.getElementsByClassName("cg-bg")[cgs.length - 1].remove();
    }, 500);
  }

  /**
   * 
   * @param {boolean} val if val is true, show the textbox. otherwise, hide it
   */
  toggleTextbox(val) {
    this.showTextbox = val;
    TEXTBOX.style.display = val ? "block" : "none";
  }

  /**
   * put content in the textbox
   */
  formatTextbox() {
    if (this.dialogue[this.dialogueIndex].name) {
      TEXTBOX_NAME.innerHTML = this.dialogue[this.dialogueIndex].name;
      TEXTBOX_TEXT.innerHTML = this.dialogue[this.dialogueIndex].content;
    }
  }
}

export const CUTSCENE_1 = new Cutscene(
  0, 
  [
    "../images/CUTSCENE_1/cg_1.png", 
    "../images/CUTSCENE_1/cg_2.png", 
    "../images/CUTSCENE_1/cg_3.png", 
    "../images/CUTSCENE_1/cg_4.png", 
    "../images/CUTSCENE_1/cg_5.png"
  ],
  [
    "..sounds/voice_lines/niki_demo_1.wav", 
    "..sounds/voice_lines/niki_demo_2.wav", 
    "..sounds/voice_lines/niki_demo_3.wav", 
    "..sounds/voice_lines/niki_demo_4.wav", 
    "..sounds/voice_lines/niki_demo_5.wav", 
    "..sounds/voice_lines/niki_demo_6.wav",
    "..sounds/voice_lines/niki_demo_7.wav",
    "..sounds/voice_lines/niki_demo_8.wav",
    "..sounds/voice_lines/niki_demo_9.wav",
    "..sounds/voice_lines/niki_demo_10.wav"
  ]
);

/**
 * list of cutscenes for the GameSession object to use
 */
export const CutsceneList = [CUTSCENE_1];