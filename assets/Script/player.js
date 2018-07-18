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
        endCanvas:{
            default: null,
            type: cc.Node,
        },
        scoreLabel:{
            type: cc.Label,
            default: null,
        },
        gravity: 0,
        jumpSpeed: 0,
    },

    onLoad: function(){
        this.anim = this.getComponent(cc.Animation);
        this.anim.play('fly');
        this.currentSpeed = 0;

        cc.director.getCollisionManager().enabled = true;
    },

    jump: function(){
        this.currentSpeed = this.jumpSpeed;
    },

    update: function(dt){
        if(!GlobalGame.gameOn)
            return;
        this.node.y += this.currentSpeed * dt;
        this.currentSpeed -= this.gravity * dt;
    },

    onCollisionEnter: function (other, self){
        console.log('collision enter');
        GlobalGame.gameOn = false;
        this.anim.stop('fly');
        this.endCanvas.active = true;
        this.scoreLabel.getComponent('score').passScore();
        this.schedule(function(){
            cc.director.loadScene('RankingView');
        }, 2);
    },
});
