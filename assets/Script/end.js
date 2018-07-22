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
        endLabel: {
            type: cc.Label,
            default: null,
        },
        opacityVelocity: 0,
    },

    onLoad: function () {
        //console.log('end');
        //this.node.active = false;
        this.endLabel.string = '';
        this.levelUp = false;
        this.end = false;
    },

    setSingleEnd: function(score) {
        this.end = true;
        this.node.opacity = 255;
        this.endLabel.string = '最终得分：' + score;
    },

    setDoubleEnd: function(score1, score2) {
        this.end = true;
        this.node.opacity = 255;
        let info = '';
        if(score2 < score1)
            info = '你赢了';
        else if(score2 > score1)
            info = '你输了';
        else
            info = '平局';
        this.endLabel.string = info + ' ' + score1 + ':' + score2;
    },

    setLevelUp: function () {
        this.endLabel.string = 'Level Up';
        this.levelUp = true;
    },

    update: function(dt) {
        if(!this.levelUp || this.end)
            return;
        this.node.opacity -= this.opacityVelocity * dt;
        if(this.node.opacity <= 0){
            this.endLabel.string = '';
            this.levelUp = false;
            this.node.opacity = 255;
        }
    },
});
