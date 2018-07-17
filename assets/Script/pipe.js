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
        maxHeight: 0,
        minHeight: 0,
        verticalDis: 0,
        horizontalDis: 0,
        pipeHeight: 0,
        pipeVelocity: 0,
        initialX: 0,
        finalX: 0,
        scoreX: 0,
    },

    spawnNewPrefab: function(){
        this.total += 1;
        this.pipetop.push(cc.instantiate(this.pipetopPrefab));
        this.pipebottom.push(cc.instantiate(this.pipebottomPrefab));
        this.scoreCounted.push(false);

        this.node.addChild(this.pipetop[this.pipetop.length - 1]);
        this.node.addChild(this.pipebottom[this.pipebottom.length - 1]);
        let pos = this.getNewPipePosition();
        this.pipetop[this.pipetop.length - 1].setPosition(pos[0]);
        this.pipebottom[this.pipebottom.length - 1].setPosition(pos[1]);
    },

    getNewPipePosition: function(){
        let randX = this.initialX;
        let randY = this.minHeight + (this.maxHeight - this.minHeight) * Math.random();
        let maxX = this.node.width/2;
        return [cc.p(randX, randY), cc.p(randX, randY - this.pipeHeight - this.verticalDis)];
    },

    onLoad: function(){
        this.pipetop = [];
        this.pipebottom = [];
        this.scoreCounted = [];
        this.total = 0;
        this.spawnNewPrefab();
    },

    update: function (dt) {

        if(!GlobalGame.gameOn)
            return;

        for(let i = 0; i < this.pipetop.length; ++i){
            this.pipebottom[i].x += this.pipeVelocity * dt;
            this.pipetop[i].x += this.pipeVelocity * dt;
        }

        if(this.pipetop.length > 0 && this.pipetop[0].x <= this.scoreX && !this.scoreCounted[0]){
            this.score.getComponent('score').scorePlus(1);
            this.scoreCounted[0] = true;
        }
        if(this.pipetop.length > 0 && this.pipetop[0].x <= this.finalX){
            this.pipetop[0].destroy();
            this.pipebottom[0].destroy();
            this.pipetop.shift();
            this.pipebottom.shift();
            this.scoreCounted.shift();
        }
        if(this.pipetop.length > 0 && Math.abs(this.pipetop[this.pipetop.length - 1].x - this.initialX) >= this.horizontalDis)
            this.spawnNewPrefab();
    },
});
