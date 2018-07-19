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
        pipetopPrefab: {
            default: null,
            type: cc.Prefab,
        },
        pipebottomPrefab: {
            default: null,
            type: cc.Prefab,
        },
        score: {
            default: null,
            type: cc.Node,
        },
        plus: {
            default: null,
            type: cc.Node,
        },
        bubbleLayer:{
            default: null,
            type: cc.Node,
        },
        starLayer: {
            default: null,
            type: cc.Node,
        },
        audioScore1:{
            default: null,
            type: cc.AudioSource,
        },
        audioScore2: {
            default: null,
            type: cc.AudioSource,
        },
        maxHeight: 0,
        minHeight: 0,
        verticalDis: 0,
        horizontalDis: 0,
        pipeHeight: 0,
        pipeHorizontalVelocity: 0,
        initialX: 0,
        finalX: 0,
        scoreX: 0,
        pipeVerticalVelocity: 0,
    },

    spawnNewPrefab: function(){
        this.total += 1;
        let pipe = {};
        pipe['pipetop'] = cc.instantiate(this.pipetopPrefab);
        pipe['pipebottom'] = cc.instantiate(this.pipebottomPrefab);
        pipe['scoreCounted'] = false;
        pipe['num'] = this.total;
        pipe['verticalMoving'] = this.getVerticalMoving(this.total);
        pipe['verticalDownMoving'] = true;
        

        this.node.addChild(pipe['pipetop']);
        this.node.addChild(pipe['pipebottom']);
        let pos = this.getNewPipePosition();
        pipe['pipetop'].setPosition(pos[0]);
        pipe['pipebottom'].setPosition(pos[1]);
        this.pipeProperty.push(pipe);
    },

    getNewPipePosition: function(){
        let randX = this.initialX;
        let randY = this.minHeight + (this.maxHeight - this.minHeight) * Math.random();
        let maxX = this.node.width/2;
        return [cc.p(randX, randY), cc.p(randX, randY - this.pipeHeight - this.verticalDis)];
    },

    getVerticalMoving: function(num){
        if(num <= 10)
            return false;
        if(Math.random() < Math.min(num / 100 + 0.1, 0.8))
            return true;
    },

    onLoad: function(){
        this.pipeProperty = [];
        this.total = 0;
        this.spawnNewPrefab();
        this.spawnBonus = false;

        //this.plus.node.color = new cc.color(255, 0, 255, 255);
    },

    update: function (dt) {

        if(!GlobalGame.gameOn)
            return;

        for(let i = 0; i < this.pipeProperty.length; ++i){
            this.pipeProperty[i]['pipebottom'].x += this.pipeHorizontalVelocity * dt;
            this.pipeProperty[i]['pipetop'].x += this.pipeHorizontalVelocity * dt;
            if(this.pipeProperty[i]['verticalMoving']){
                if(this.pipeProperty[i]['verticalDownMoving']){
                    this.pipeProperty[i]['pipebottom'].y -= this.pipeVerticalVelocity * dt;
                    this.pipeProperty[i]['pipetop'].y -= this.pipeVerticalVelocity * dt;
                    if(this.pipeProperty[i]['pipetop'].y <= this.minHeight)
                        this.pipeProperty[i]['verticalDownMoving'] = false;
                }
                else{
                    this.pipeProperty[i]['pipebottom'].y += this.pipeVerticalVelocity * dt;
                    this.pipeProperty[i]['pipetop'].y += this.pipeVerticalVelocity * dt;
                    if(this.pipeProperty[i]['pipetop'].y >= this.maxHeight)
                        this.pipeProperty[i]['verticalDownMoving'] = true;
                }
            }
        }

        if(this.pipeProperty.length > 0 && this.pipeProperty[0]['pipetop'].x <= this.scoreX && !this.pipeProperty[0]['scoreCounted']){
            if(this.pipeProperty[0]['verticalMoving']){
                this.audioScore2.play();
                this.score.getComponent('score').scorePlus(2);
                this.plus.getComponent('plus').spawnPlus(2, this.pipeProperty[0]['pipetop'].x, this.pipeProperty[0]['pipetop'].y - 512 - this.verticalDis / 2)
            }
            else{
                this.audioScore1.play();
                this.score.getComponent('score').scorePlus(1);
                this.plus.getComponent('plus').spawnPlus(1, this.pipeProperty[0]['pipetop'].x, this.pipeProperty[0]['pipetop'].y - 512 - this.verticalDis / 2)
            }
            this.pipeProperty[0]['scoreCounted'] = true;
        }
        if(this.pipeProperty.length > 0 && this.pipeProperty[0]['pipetop'].x <= this.finalX){
            this.pipeProperty[0]['pipebottom'].destroy();
            this.pipeProperty[0]['pipetop'].destroy();
            this.pipeProperty.shift();
        }
        if(this.pipeProperty.length > 0 && Math.abs(this.pipeProperty[this.pipeProperty.length - 1]['pipetop'].x - this.initialX) >= this.horizontalDis){
            this.spawnNewPrefab();
            this.spawnBonus = true;
        }
        
        if(this.spawnBonus && this.pipeProperty.length >= 2){
            if(Math.random() < 0.3){
                let r = Math.random();
                if(r < 0.5)
                    this.bubbleLayer.getComponent('bubble').spawnNewBubble((this.pipeProperty[this.pipeProperty.length - 1]['pipetop'].x + this.pipeProperty[this.pipeProperty.length - 2]['pipetop'].x) / 2);
                else
                    this.starLayer.getComponent('star').spawnNewStar((this.pipeProperty[this.pipeProperty.length - 1]['pipetop'].x + this.pipeProperty[this.pipeProperty.length - 2]['pipetop'].x) / 2);
            }
            this.spawnBonus = false;
        }
    },
});
