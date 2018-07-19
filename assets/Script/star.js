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
            default:null,
            type:cc.Prefab,
        },
        maxHeight: 0,
        minHeight: 0,
        finalX:0,
        horizontalVelocity: 0,
    },

    onLoad: function(){
        this.star=null;
    },

    spawnNewStar: function(posx) {
        if(this.star)
            return;
        console.log('spawnNewStar');
        this.star=cc.instantiate(this.starPrefab);
        this.node.addChild(this.star);
        this.star.setPosition(cc.p(posx, Math.random() * (this.maxHeight - this.minHeight) + this.minHeight));
    },

    dealWithCollision: function(other, self) {
        if(this.star){
            console.log('star');
            this.star.destroy();
            this.star = null;
            this.score.getComponent('score').scorePlus(5);
        }
    },

    update: function(dt){
        if(!GlobalGame.gameOn)
            return;
        if(this.star) {
            this.star.x += this.horizontalVelocity * dt;
            if(this.star.x<=this.finalX){
                this.star.destroy();
                this.star = null;
            }
        }


    },
});
