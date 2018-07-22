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
        socketlayer: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function(){

        GlobalGame.globalHorizontalVelocity = -300;
        
        if(GlobalGame.isDouble && CC_WECHATGAME){
            console.log('_getComponent');
            this.socket = this.socketlayer.getComponent('socket');
            this.socket.startDoubleGame();
            console.log('getComponent_');
            GlobalGame.isDoubleDead = false;
        } else {
            this.node.getChildByName('player2').active = false;
            this.node.getChildByName('score2').active = false;
        }
        this.setInputControl();
        GlobalGame.gameOn = true;
        this.audioBg.play();
    },

    setInputControl: function(){
        let self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if(GlobalGame.isDouble)
                self.socket.sendJump(self.player.y);
            self.player.getComponent('player').jump();
        }, this);
    },
});
