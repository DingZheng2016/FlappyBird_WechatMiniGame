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
        bubblePrefab: {
            default: null,
            type: cc.Prefab,
        },
        player: {
            default: null,
            type: cc.Node,
        },
        audioBubble:{
            default: null,
            type: cc.AudioSource,
        },
        maxHeight: 0,
        minHeight: 0,
        finalX: 0,
        gravity: 0,
        initialVerticalVelocity: 0,
        bubbleMaxTime: 0,
        winkyTime: 0,
    },

    onLoad: function() {
        this.bubble = null;
        this.bubbleAttached = null;
        this.isGoingToDisappear = false;

        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    spawnNewBubble: function(posx){
        if(this.bubble)
            return ;
        this.bubble = {};
        this.bubble['bubble'] = cc.instantiate(this.bubblePrefab);
        this.bubble['velocity'] = this.initialVerticalVelocity;
        this.node.addChild(this.bubble['bubble']);
        this.bubble['bubble'].setPosition(cc.p(posx, Math.random() * (this.maxHeight - this.minHeight) + this.minHeight));
    },

    dealWithCollision: function() {
        this.audioBubble.play();
        if(this.bubbleAttached){
            this.bubbleAttached.destroy();
            this.bubbleAttached = null;
        }
        console.log(this.bubble);
        this.bubbleAttached = this.bubble['bubble'];
        this.bubbleAttached.opacity = 255;
        //this.isGoingToDisappear = false;
        this.bubble = null;
        this.unschedule(this.winkle);
        this.unschedule(this.cancel);
        this.unschedule(this.over);
        this.scheduleOnce(this.cancel, this.bubbleMaxTime);
    },

    update: function(dt) {
        if(!GlobalGame.gameOn)
            return ;

        if(this.bubble){
            this.bubble['bubble'].x += GlobalGame.globalHorizontalVelocity * dt;
            this.bubble['bubble'].y += this.bubble['velocity'] * dt;
            this.bubble['velocity'] -= this.gravity * dt;
            if(this.bubble['velocity'] <= -this.initialVerticalVelocity)
                this.bubble['velocity'] = this.initialVerticalVelocity;
            if(this.bubble['bubble'].x <= this.finalX){
                this.bubble['bubble'].destroy();
                this.bubble = null;
            }
        }

        if(this.bubbleAttached){
            //this.bubbleAttached['remain'] += GlobalGame.globalHorizontalVelocity * dt;
            this.bubbleAttached.x = this.player.x;
            this.bubbleAttached.y = this.player.y;
            /*
            if(this.isGoingToDisappear){
                if(this.time >= this.winkyTime){
                    this.bubbleAttached.opacity = 255 - this.bubbleAttached.opacity;     
                    this.time = 0;
                }
                this.time += dt;
            }
            */
        }
    },

    cancel: function() {
        //this.isGoingToDisappear = true;
        //this.time = 0.1;
        this.schedule(this.winkle, this.winkyTime);
        this.scheduleOnce(this.over, 1);
    },

    winkle: function() {
        if(this.bubbleAttached)
            this.bubbleAttached.opacity = 255 - this.bubbleAttached.opacity;
    },

    over: function() {
        this.unschedule(this.cancel);
        this.unschedule(this.winkle);
        this.bubbleAttached.destroy();
        this.bubbleAttached = null;
        this.player.getComponent('player').setBubbled(false);
    },
});
