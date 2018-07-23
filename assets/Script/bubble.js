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
        bubble2Prefab: {
            default: null,
            type: cc.Prefab,
        },
        player: {
            default: null,
            type: cc.Node,
        },
        player2: {
            default: null,
            type: cc.Node,
        },
        audioBubble:{
            default: null,
            type: cc.AudioSource,
        },
        socketLayer:{
            default: null,
            type: cc.Node,
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
        this.doubleBubble = null;
        this.isGoingToDisappearDouble = false;

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
        if(GlobalGame.isDouble){
            this.socketLayer.getComponent('socket').sendStartBubble();
        }
        if(this.bubbleAttached){
            this.bubbleAttached.destroy();
            this.bubbleAttached = null;
        }
        console.log(this.bubble);
        this.bubbleAttached = this.bubble['bubble'];
        this.bubbleAttached.opacity = 255;
        this.isGoingToDisappear = false;
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

        if(GlobalGame.isDouble && this.doubleBubble){
            this.doubleBubble.x = this.player2.x;
            this.doubleBubble.y = this.player2.y;
        }
    },

    cancel: function() {
        if(this.isGoingToDisappear)
            return ;
        this.isGoingToDisappear = true;
        //this.time = 0.1;
        this.schedule(this.winkle, this.winkyTime);
        this.scheduleOnce(this.over, 1);
    },

    winkle: function() {
        if(this.bubbleAttached && this.isGoingToDisappear)
            this.bubbleAttached.opacity = 255 - this.bubbleAttached.opacity;
    },

    over: function() {
        if(!this.bubbleAttached)
            return ;
        this.isGoingToDisappear = false;
        this.unschedule(this.cancel);
        this.unschedule(this.winkle);
        this.bubbleAttached.destroy();
        this.bubbleAttached = null;
        this.player.getComponent('player').setBubbled(false);
    },

    startDoubleBubble: function() {
        if(this.doubleBubble){
            this.doubleBubble.destroy();
            this.doubleBubble = null;
        }
        console.log('startDoubleBubble');
        this.doubleBubble = cc.instantiate(this.bubble2Prefab);
        this.node.addChild(this.doubleBubble);
        console.log(this.player2.x + ' ' + this.player2.y);
        this.doubleBubble.setPosition(cc.p(this.player2.x, this.player2.y));
        this.doubleBubble.opacity = 120;
        this.isGoingToDisappearDouble = false;
        this.unschedule(this.endDoubleBubble);
        this.unschedule(this.winkleDouble);
        this.unschedule(this.overDouble);
        this.scheduleOnce(this.endDoubleBubble, this.bubbleMaxTime);
    },

    endDoubleBubble: function() {
        if(this.isGoingToDisappearDouble)
            return ;
        this.isGoingToDisappearDouble = true;
        this.schedule(this.winkleDouble, this.winkyTime);
        this.scheduleOnce(this.overDouble, 1);
    },

    winkleDouble: function() {
        if(this.doubleBubble && this.isGoingToDisappearDouble)
            this.doubleBubble.opacity = 120 - this.doubleBubble.opacity;
    },

    overDouble: function() {
        if(!this.doubleBubble)
            return ;
        this.unschedule(this.endDoubleBubble);
        this.unschedule(this.winkleDouble);
        this.doubleBubble.destroy();
        this.doubleBubble = null;
    },
});
