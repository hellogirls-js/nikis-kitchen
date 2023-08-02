import { BGM, BGM_ICON, VOICE_LINES, VOICE_LINE_ICON } from "./CONSTANTS.js";

class Settings {
  default_settings = {
    voiceVolume: 100,
    bgmVolume: 100
  }

  constructor() {
    this.settings = this.default_settings;
  }

  getVoiceVolume() {
    return this.settings.voiceVolume;
  }

  getBgmVolume() {
    return this.settings.voiceVolume;
  }

  setVoiceVolume(val) {
    this.settings.voiceVolume = val;
  }

  setBgmValue(val) {
    this.settings.bgmVolume = val;
  }

  adjustVoiceVolume() {
    VOICE_LINES.volume = this.getVoiceVolume() / 100;
    if (this.getVoiceVolume() < 1) {
      if (VOICE_LINE_ICON.classList.contains("ti-volume")) VOICE_LINE_ICON.classList.remove("ti-volume");
      if (VOICE_LINE_ICON.classList.contains("ti-volume-2")) VOICE_LINE_ICON.classList.remove("ti-volume-2");
      VOICE_LINE_ICON.classList.add("ti-volume-3");
    } else if (this.getVoiceVolume() >= 1 && this.getVoiceVolume() < 80) {
      if (VOICE_LINE_ICON.classList.contains("ti-volume")) VOICE_LINE_ICON.classList.remove("ti-volume");
      if (VOICE_LINE_ICON.classList.contains("ti-volume-3")) VOICE_LINE_ICON.classList.remove("ti-volume-3");
      VOICE_LINE_ICON.classList.add("ti-volume-2");
    } else {
      if (VOICE_LINE_ICON.classList.contains("ti-volume-2")) VOICE_LINE_ICON.classList.remove("ti-volume-2");
      if (VOICE_LINE_ICON.classList.contains("ti-volume-3")) VOICE_LINE_ICON.classList.remove("ti-volume-3");
      VOICE_LINE_ICON.classList.add("ti-volume");
    }
  }
  
  adjustBgmVolume() {
    BGM.volume = this.getVoiceVolume() / 100;
    if (this.getBgmVolume() < 1) {
      if (BGM_ICON.classList.contains("ti-volume")) BGM_ICON.classList.remove("ti-volume");
      if (BGM_ICON.classList.contains("ti-volume-2")) BGM_ICON.classList.remove("ti-volume-2");
      BGM_ICON.classList.add("ti-volume-3");
    } else if (this.getBgmVolume() >= 1 && this.getBgmVolume() < 80) {
      if (BGM_ICON.classList.contains("ti-volume")) BGM_ICON.classList.remove("ti-volume");
      if (BGM_ICON.classList.contains("ti-volume-3")) BGM_ICON.classList.remove("ti-volume-3");
      BGM_ICON.classList.add("ti-volume-2");
    } else {
      if (BGM_ICON.classList.contains("ti-volume-2")) BGM_ICON.classList.remove("ti-volume-2");
      if (BGM_ICON.classList.contains("ti-volume-3")) BGM_ICON.classList.remove("ti-volume-3");
      BGM_ICON.classList.add("ti-volume");
    }
  }
 }

 export default Settings;