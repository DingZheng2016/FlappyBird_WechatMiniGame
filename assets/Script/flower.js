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
        flowerPrefab:{
            default:null,
            type:cc.Prefab,
        },
        leafPrefab:{
            default:null,
            type:cc.Prefab,
        },
        pipe:{
            default:null,
            type:cc.Node,
        },
        finalX:0,
        horizontalVelocity: 0,
        verticalVelocity: 0,
        flowerHeight:0,
        leafHeight:0,
        verticalUpMoving:true,
    },

   onLoad: function () {
       this.flower = null;
       this.leaf = null;
       this.pipeVertical = false;
       this.pipeDownMoving = true;
       this.flowerMaxHeight = 0;
       this.flowerMinHeight = 0;
       this.leafMaxHeight = 0;
       this.leafMinHeight = 0;
       this.pipePosY = 0;
       this.flowerPosY = 0;
       this.leafPosY = 0;
   },

    spawnNewFlower: function(pos,isVertical,isDownMoving) {
        if(this.flower && this.leaf)
            return;
        this.leaf = cc.instantiate(this.leafPrefab);
        this.leafMaxHeight = 0.5*(this.pipe.getComponent('pipe').pipeHeight+this.leafHeight);
        this.leafMinHeight = 0.5*(this.pipe.getComponent('pipe').pipeHeight-this.leafHeight)-this.flowerHeight;
        this.node.addChild(this.leaf);
        let leafPosY = Math.random() * (this.leafMaxHeight - this.leafMinHeight) +this.leafMinHeight;
        this.leaf.setPosition(cc.p(pos.x,pos.y + leafPosY));
        //console.log('spanNewLeaf:    '+ this.leaf.y);

        this.flower = cc.instantiate(this.flowerPrefab);
        this.flowerMaxHeight = this.leafMaxHeight+0.5*(this.leafHeight+this.flowerHeight)-10;
        this.flowerMinHeight = this.leafMinHeight+0.5*(this.leafHeight+this.flowerHeight)-10;
        this.node.addChild(this.flower);
        this.flower.setPosition(cc.p(pos.x,pos.y + leafPosY + 0.5 * (this.leafHeight+this.flowerHeight)-10));
        //console.log('spanNewFlower:    '+ this.flower.y);

        this.pipeVertical = isVertical;
        this.pipeDownMoving = isDownMoving;
        this.pipePosY = pos.y;
        this.leafPosY = leafPosY;
        this.flowerPosY = leafPosY + 0.5 * (this.leafHeight+this.flowerHeight)-10;
    },

    dealWithCollision: function() {

    },

    update: function(dt){
        if(!GlobalGame.gameOn)
            return;
        if(!this.flower && !this.leaf)
            return;

        this.flower.x += this.horizontalVelocity * dt;
        this.leaf.x += this.horizontalVelocity * dt;

        if(this.pipeVertical){
            if(this.pipeDownMoving){
                this.pipePosY -= this.pipe.getComponent('pipe').pipeVerticalVelocity * dt;
                if(this.pipePosY <= this.pipe.getComponent('pipe').minHeight - (this.pipe.getComponent('pipe').pipeHeight + this.pipe.getComponent('pipe').verticalDis))
                    this.pipeDownMoving = false;
            }
            else{
                this.pipePosY += this.pipe.getComponent('pipe').pipeVerticalVelocity * dt;
                if(this.pipePosY >= this.pipe.getComponent('pipe').maxHeight - (this.pipe.getComponent('pipe').pipeHeight + this.pipe.getComponent('pipe').verticalDis))
                    this.pipeDownMoving = true;
            }
        }

        if(this.verticalUpMoving){
            if(this.flowerPosY + this.verticalVelocity * dt >= this.flowerMaxHeight){
                this.flowerPosY = this.flowerMaxHeight;
                this.leafPosY = this.leafMaxHeight;
                this.verticalUpMoving = false;
            }
            else{
                this.flowerPosY += this.verticalVelocity * dt;
                this.leafPosY += this.verticalVelocity * dt;
            }
        }
        else{
            if(this.flowerPosY - this.verticalVelocity * dt <= this.flowerMinHeight){
                this.flowerPosY = this.flowerMinHeight;
                this.leafPosY = this.leafMinHeight;
                this.verticalUpMoving = true;
            }
            else{
                this.flowerPosY -= this.verticalVelocity * dt;
                this.leafPosY -= this.verticalVelocity * dt;
            }
        }
        //console.log(this.flowerPosY);

        this.flower.y = this.pipePosY + this.flowerPosY;
        this.leaf.y = this.pipePosY + this.leafPosY;

        //console.log(this.flower.y);

        /*for(let i = 0; i < this.flowerProperty.length; i++){
            this.flowerProperty[i]['flowerPrefab'].x += this.horizontalVelocity * dt;
            //console.log("leafMove:  "+this.leaf.x);
            if(this.flowerProperty[i]['pipeVertical']){
                if(this.flowerProperty[i]['pipeDownMoving']){
                    this.flowerProperty[i]['maxHeight'] -= this.pipe.getComponent('pipe').pipeVerticalVelocity * dt;
                    this.flowerProperty[i]['minHeight'] -= this.pipe.getComponent('pipe').pipeVerticalVelocity * dt;
                    if(this.flowerProperty[i]['verticalUpMoving']){
                        if(this.flowerProperty[i]['flowerPrefab'].y + this.verticalVelocity * dt - this.pipe.getComponent('pipe').pipeVerticalVelocity * dt >= this.flowerProperty[i]['maxHeight']){
                            this.flowerProperty[i]['flowerPrefab'].y = this.flowerProperty[i]['maxHeight'];
                            this.flowerProperty[i]['verticalUpMoving'] = false;
                        }
                        else this.flowerProperty[i]['flowerPrefab'].y = this.flowerProperty[i]['flowerPrefab'].y + this.verticalVelocity * dt - this.pipe.getComponent('pipe').pipeVerticalVelocity * dt;
                    }
                    else{
                        if(this.flowerProperty[i]['flowerPrefab'].y - this.verticalVelocity * dt - this.pipe.getComponent('pipe').pipeVerticalVelocity * dt <= this.flowerProperty[i]['minHeight']){
                            this.flowerProperty[i]['flowerPrefab'].y = this.flowerProperty[i]['minHeight'];
                            this.flowerProperty[i]['verticalUpMoving'] = true;
                        }
                        else this.flowerProperty[i]['flowerPrefab'].y =this.flowerProperty[i]['flowerPrefab'].y - this.verticalVelocity * dt - this.pipe.getComponent('pipe').pipeVerticalVelocity * dt;
                    }
                }
                else {
                    this.flowerProperty[i]['maxHeight'] += this.pipe.getComponent('pipe').pipeVerticalVelocity * dt;
                    this.flowerProperty[i]['minHeight'] += this.pipe.getComponent('pipe').pipeVerticalVelocity * dt;
                    if (this.flowerProperty[i]['verticalUpMoving']) {
                        if (this.flowerProperty[i]['flowerPrefab'].y + this.verticalVelocity * dt + this.pipe.getComponent('pipe').pipeVerticalVelocity * dt >= this.flowerProperty[i]['maxHeight']) {
                            this.flowerProperty[i]['flowerPrefab'].y = this.flowerProperty[i]['maxHeight'];
                            this.flowerProperty[i]['verticalUpMoving'] = false;
                        }
                        else this.flowerProperty[i]['flowerPrefab'].y = this.flowerProperty[i]['flowerPrefab'].y + this.verticalVelocity * dt + this.pipe.getComponent('pipe').pipeVerticalVelocity * dt;
                    }
                    else{
                        if(this.flowerProperty[i]['flowerPrefab'].y - this.verticalVelocity * dt + this.pipe.getComponent('pipe').pipeVerticalVelocity <= this.flowerProperty[i]['minHeight']){
                            this.flowerProperty[i]['flowerPrefab'].y = this.flowerProperty[i]['minHeight'];
                            this.flowerProperty[i]['verticalUpMoving'] = true;
                        }
                        else this.flowerProperty[i]['flowerPrefab'].y =this.flowerProperty[i]['flowerPrefab'].y - this.verticalVelocity * dt + this.pipe.getComponent('pipe').pipeVerticalVelocity;
                    }
                }
            }
            else{
                if(this.flowerProperty[i]['verticalUpMoving']){
                    if(this.flowerProperty[i]['flowerPrefab'].y + this.verticalVelocity * dt >= this.flowerProperty[i]['maxHeight']){
                        this.flowerProperty[i]['flowerPrefab'].y = this.flowerProperty[i]['maxHeight'];
                        this.flowerProperty[i]['verticalUpMoving'] = false;
                    }
                    else this.flowerProperty[i]['flowerPrefab'].y += this.verticalVelocity * dt;
                }
                else{
                    if(this.flowerProperty[i]['flowerPrefab'].y - this.verticalVelocity * dt <= this.flowerProperty[i]['minHeight']){
                        this.flowerProperty[i]['flowerPrefab'].y = this.flowerProperty[i]['minHeight'];
                        this.flowerProperty[i]['verticalUpMoving'] = true;
                    }
                    else this.flowerProperty[i]['flowerPrefab'].y -= this.verticalVelocity * dt;
                }
            }
        }*/

        if(this.flower.x <= this.finalX){
            this.flower.destroy();
            this.flower = null;
        }
        if(this.leaf.x <= this.finalX){
            this.leaf.destroy();
            this.leaf = null;
        }
    },
});
