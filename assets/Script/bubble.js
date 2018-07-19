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
        maxHeight: 0,
        minHeight: 0,
        finalX: 0,
        gravity: 0,
        initialVerticalVelocity: 0,
        horizontalVelocity: 0,
        maxPipe: 0,
        pipeDis: 0,
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
        if(this.bubbleAttached){
            this.bubbleAttached['bubble'].destroy();
            this.bubbleAttached = null;
        }
        this.bubbleAttached = {
            bubble: this.bubble['bubble'],
            remain: (this.maxPipe + 0.5) * this.pipeDis,
        };
        this.bubble = null;
    },

    update: function(dt) {
        if(!GlobalGame.gameOn)
            return ;

        if(this.bubble){
            this.bubble['bubble'].x += this.horizontalVelocity * dt;
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
            this.bubbleAttached['remain'] += this.horizontalVelocity * dt;
            this.bubbleAttached['bubble'].x = this.player.x;
            this.bubbleAttached['bubble'].y = this.player.y;
            if(this.bubbleAttached['remain'] <= 0 && !this.isGoingToDisappear)
                this.cancel();
            if(this.isGoingToDisappear){
                if(this.time >= this.winkyTime){
                    this.bubbleAttached['bubble'].opacity = 255 - this.bubbleAttached['bubble'].opacity;     
                    this.time = 0;
                }
                this.time += dt;
            }
        }
    },

    cancel: function() {
        this.isGoingToDisappear = true;
        this.time = 0.1;
        this.scheduleOnce(function(){
            if(this.bubbleAttached){
                this.bubbleAttached['bubble'].destroy();
                this.bubbleAttached = null;
                this.player.getComponent('player').setBubbled(false);
            }
            this.isGoingToDisappear = false;
        }, 0.8);
    },
});
