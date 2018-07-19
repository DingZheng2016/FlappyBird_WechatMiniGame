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
        plus1Prefab: {
            default: null,
            type: cc.Prefab,
        },
        plus2Prefab: {
            default: null,
            type: cc.Prefab,
        },
        horizontalVelocity: 0,
        finalX: 0,
        verticalVelocity: 0,
        opacityVelocity: 0,
    },

    onLoad: function() {
        this.score = [];
    },

    spawnPlus: function(score, posx, posy) {
        if(score === 1)
            this.score.push(cc.instantiate(this.plus1Prefab));
        else if(score === 2)
            this.score.push(cc.instantiate(this.plus2Prefab));
        this.node.addChild(this.score[this.score.length - 1]);
        this.score[this.score.length - 1].setPosition(cc.p(posx, posy));
    },

    update: function(dt) {
        for(let i = 0; i < this.score.length; ++i){
            this.score[i].x += this.horizontalVelocity * dt;
            this.score[i].y += this.verticalVelocity * dt;
            this.score[i].opacity -= this.opacityVelocity * dt;
        }
        if(this.score.length > 0 && this.score[0].x <= this.finalX){
            this.score[0].destroy();
            this.score.shift();
        }
    },
});
