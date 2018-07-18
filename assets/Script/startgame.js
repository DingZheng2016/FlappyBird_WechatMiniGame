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
        startGame:{
            default:null,
            type:cc.Node,
        },
        ranking:{
            default:null,
            type:cc.Node,
        },
        battle:{
            default:null,
            type:cc.Node,
        },
        player:{
            default:null,
            type:cc.Node,
        }
    },

    onLoad: function(){
        this.registerInput();
    },

    registerInput: function(){
        this.startGame.on(cc.Node.EventType.TOUCH_START, function(event){
            cc.director.loadScene('game');
        }, this);

        this.ranking.on(cc.Node.EventType.TOUCH_START, function(event){
            cc.director.loadScene('RankingView');
        }, this);
    },

    start: function () {
        let anim = this.node.getChildByName('player').getComponent(cc.Animation);
        anim.play('fly');
    }
});
