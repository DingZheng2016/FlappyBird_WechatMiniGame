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
        scoreDisplay: {
            default: null,
            type: cc.Label,
        },

        endLabel:{
            default: null,
            type: cc.Label,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.score = 0;
        this.gainScore();
    },

    scorePlus: function (ds){
        this.score += ds;
        this.scoreDisplay.string = 'Score: ' + this.score;
    },

    passScore: function(){
        if (CC_WECHATGAME) {
            console.log('Main: pass score');
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "x1",
                score: this.score,
            });
        } else {
            cc.log("提交得分: x1 : " + this.score)
        }
    },

    gainScore: function(){
        if(CC_WECHATGAME){
            console.log('Main: gain score');
            window.wx.postMessage({
                messageType: 4,
                MAIN_MENU_NUM: "x1",
            });
        } else {
            console.log("gain score");
        }
    },

    setEndScore: function(){
        this.endLabel.string = '最终得分：' + this.score;
    }
});
