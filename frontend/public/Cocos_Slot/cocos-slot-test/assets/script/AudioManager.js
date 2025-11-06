// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    metal_audioSource: {
      type: cc.AudioSource,
      default: null
    },
    spinning_audioSource: {
      type: cc.AudioSource,
      default: null
    },
    winSound_audioSource: {
      type: cc.AudioSource,
      default: null
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {},

  // update (dt) {},
  playMetal: function() {
    this.metal_audioSource.play();
  },

  playSpinning: function() {
    this.spinning_audioSource.play();
  },

  pauseSpinning: function() {
    this.spinning_audioSource.pause();
  },

  playWinSound: function() {
    this.winSound_audioSource.play();
  }
});
