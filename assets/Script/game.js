// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        player:{
            default: null,
            type: cc.Node,
        },
        audioBg: {
            default: null,
            type: cc.AudioSource,
        },
    },

    onLoad: function(){
        this.setInputControl();
        GlobalGame.gameOn = true;
        this.audioBg.play();
    },

    setInputControl: function(){
        let self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.player.getComponent('player').jump();
        }, this);
    },
});
