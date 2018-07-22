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
        bubbleLayer:{
            default: null,
            type: cc.Node,
        },
        starLayer:{
            default: null,
            type: cc.Node,
        },
        flowerLayer:{
            default: null,
            type: cc.Node,
        },
        audioDie: {
            default: null,
            type: cc.AudioSource,
        },
        audioEat: {
            default: null,
            type: cc.AudioSource,
        },
        gravity: 0,
        jumpSpeed: 0,
    },

    onLoad: function(){
        this.anim = this.getComponent(cc.Animation);
        this.anim.play('fly');
        this.currentSpeed = 0;
        this.isBubbled = false;

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
        /*
        other.tag: {
            0: pipe,leaf
            1: bubble,
            2: ground,
            3: star,
            4: flower,
        }
        */
        console.log('collision tag: ' + other.tag);
        if(other.tag === 2 || (other.tag === 0 && this.isBubbled === false)){
            this.audioDie.play();
            GlobalGame.gameOn = false;
            this.anim.stop('fly');
            this.anim.stop('flower');
            this.endCanvas.active = true;
            this.scoreLabel.getComponent('score').passScore();
            this.scoreLabel.getComponent('score').setEndScore();
            this.scheduleOnce(function(){
                GlobalGame.access = 1;
                cc.director.loadScene('RankingView');
            }, 2);
        }else if(other.tag === 0 && this.isBubbled === true){
            this.isBubbled = false;
            this.bubbleLayer.getComponent('bubble').cancel();
        }else if(other.tag === 1){
            this.bubbleLayer.getComponent('bubble').dealWithCollision();
            this.isBubbled = true;
        }else if(other.tag === 3){
            this.starLayer.getComponent('star').dealWithCollision();
        }else if(other.tag === 4 && this.isBubbled === true){
            this.isBubbled = false;
            this.bubbleLayer.getComponent('bubble').cancel();
        }
        else if(other.tag === 4 && this.isBubbled === false){
            this.audioEat.play();
            console.log('play');
            GlobalGame.gameOn = false;
            this.anim.stop('fly');
            this.anim.destroy();
            this.anim.stop('flower');
            this.endCanvas.active = true;
            this.scoreLabel.getComponent('score').passScore();
            this.scoreLabel.getComponent('score').setEndScore();
            this.scheduleOnce(function(){
                GlobalGame.access = 1;
                cc.director.loadScene('RankingView');
            }, 2);
        }
    },

    setBubbled: function(bubble){
        this.isBubbled = bubble;
    },
});
