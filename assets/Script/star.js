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
        score:{
            default: null,
            type: cc.Label,
        },
        starPrefab:{
            default: null,
            type: cc.Prefab,
        },
        plus:{
            default: null,
            type: cc.Node,
        },
        audioScore1: {
            default: null,
            type: cc.AudioSource,
        },
        maxHeight: 0,
        minHeight: 0,
        finalX:0,
        horizontalVelocity: 0,
        gravity: 0,
        initialVerticalVelocity: 0,
    },

    onLoad: function(){
        this.star = null;
        this.velocity = 0;
    },

    spawnNewStar: function(posx) {
        if(this.star)
            return;
        this.star = cc.instantiate(this.starPrefab);
        this.node.addChild(this.star);
        this.velocity = this.initialVerticalVelocity;
        this.star.setPosition(cc.p(posx, Math.random() * (this.maxHeight - this.minHeight) + this.minHeight));
    },

    dealWithCollision: function() {
        if(this.star){
            this.audioScore1.play();
            this.plus.getComponent('plus').spawnPlus(1, this.star.x, this.star.y);
            this.star.destroy();
            this.star = null;
            this.score.getComponent('score').scorePlus(1);
        }
    },

    update: function(dt){
        if(!GlobalGame.gameOn)
            return;
        if(this.star) {
            this.star.y += this.velocity * dt;
            this.velocity -= this.gravity * dt;
            if(this.velocity <= -this.initialVerticalVelocity)
                this.velocity = this.initialVerticalVelocity;
            this.star.x += this.horizontalVelocity * dt;
            if(this.star.x <= this.finalX){
                this.star.destroy();
                this.star = null;
            }
        }
    },
});
