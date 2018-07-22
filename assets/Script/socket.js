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
        player2Pic: {
            default: null,
            type: cc.Sprite,
        },
        player2Name: {
            default: null,
            type: cc.Label,
        },
        info: {
            default: null,
            type: cc.Label,
        },
        player2: {
            default: null,
            type: cc.Node,
        },
        score2: {
            default: null,
            type: cc.Label,
        },
        scoreLabel: {
            default: null,
            type: cc.Label,
        },
        endCanvas:{
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function() {
        console.log('socket onload');
        if(!CC_WECHATGAME || !GlobalGame.isDouble)
            return ;
        console.log('isDouble = true');
        this.socketOpen = false;
        this.socketMsgQueue = [];
        let self = this;
        console.log(this);

        wx.connectSocket({
            url: 'wss://dingz16.iterator-traits.com',
        });

        wx.onSocketOpen(function(res) {
            console.log(res);
            self.socketOpen = true;
            for (let i = 0; i < self.socketMsgQueue.length; i++){
                self.sendSocketMessage(self.socketMsgQueue[i]);
            }
            self.socketMsgQueue = [];
            self.sendSocketMessage({type: 'connect', uuid: GlobalGame.uuid});
            /*
            self.schedule(function(){
                self.testDelay.call(self);
            } ,5);
            */
        });

        wx.onSocketMessage(function(res) {
            console.log('receive from server:');
            let dict = JSON.parse(res.data);
            console.log(dict);
            if(dict['type'] === 'matched'){
                self.player2Name.string = dict['nickName'];
                GlobalGame.uuid = dict['uuid'];
                try {
                    let image = wx.createImage();
                    image.onload = () => {
                        try {
                            let texture = new cc.Texture2D();
                            texture.initWithElement(image);
                            texture.handleLoadedTexture();
                            self.player2Pic.spriteFrame = new cc.SpriteFrame(texture);
                            self.info.string = '准备...';
                            self.close();
                            self.scheduleOnce(function(){
                                GlobalGame.isDouble = true;
                                cc.director.loadScene('game');
                            }, 2);
                        } catch (e) {
                            cc.log(e);
                            console.log('fetch error 1')
                            //self.player2Pic.node.active = false;
                        }
                    };
                    image.src = dict['avatarUrl'];
                }catch (e) {
                    cc.log(e);
                    console.log('fetch error 2');
                    //self.player2Pic.node.active = false;
                }
            }else if(dict['type'] === 'jump'){
                //let timestamp2 = (new Date()).valueOf();
                //let timestamp1 = dict['timestamp'];
                //let dt = timestamp2 - timestamp1;
                //console.log(dt);
                /*
                let dt = parseInt(dict['delay']) + GlobalGame.delayTime;
                dt = dt * 0.001;
                console.log('dt: ' + dt);
                let currentSpeed = self.player2.getComponent('player').currentSpeed;
                let gravity = self.player2.getComponent('player').gravity;
                console.log((- currentSpeed - dt * gravity) * dt)
                self.player2.y += (- currentSpeed - dt * gravity) * dt;
                */
                self.offline = false;
                self.player2.y = parseInt(dict['posy']);
                self.player2.getComponent('player').jump();
            }else if(dict['type'] === 'score'){
                self.offline = false;
                self.score2.string = 'Score: ' + dict['score'];
            }else if(dict['type'] === 'die'){
                self.player2.active = false;
            }else if(dict['type'] === 'finish'){
                GlobalGame.gameOn = false;
                self.endCanvas.active = true;
                self.scoreLabel.getComponent('score').passScore();
                console.log('passScore end');
                console.log(self.score2.string.split(' ')[1]);
                self.scoreLabel.getComponent('score').setDoubleEnd(parseInt(self.score2.string.split(' ')[1]));
                console.log('setScore end');
                self.close();
                self.scheduleOnce(function(){
                    GlobalGame.access = 0;
                    cc.director.loadScene('RankingView');
                }, 2);
            }else if(dict['type'] === 'delay'){
                self.totalDelay += (new Date()).valueOf() - dict['timestamp'];
                self.totalReceive += 1;
                if(self.totalReceive === 12){
                    GlobalGame.delayTime = self.totalDelay / 2 / 12;
                }
            }
        });
    },

    startDoubleGame: function() {
        let self = this;
        self.offline = false;
        self.schedule(function() {
            console.log(self.offline);
            if(self.offline === true){
                self.player2.active = false;
                if(GlobalGame.isDoubleDead){
                    GlobalGame.gameOn = false;
                    self.endCanvas.active = true;
                    self.scoreLabel.getComponent('score').passScore();
                    self.scoreLabel.getComponent('score').setDoubleEnd(parseInt(self.score2.string.split(' ')[1]));
                    self.close();
                    self.scheduleOnce(function(){
                        GlobalGame.access = 0;
                        cc.director.loadScene('RankingView');
                    }, 2);
                }
            }else{
                self.offline = true;
            }
        }, 4);
    },

    sendSocketMessage: function(msg) {
        if(!CC_WECHATGAME){
            console.log('sendSocketMessage: ' + msg);
            return ;
        }
        console.log(this.socketOpen + ': ' + JSON.stringify(msg));
        if (this.socketOpen){
            wx.sendSocketMessage({
                data: JSON.stringify(msg)
            });
        }
        else{
            console.log('error');
            try{
                this.socketMsgQueue.push(msg);
            }catch(e){
                console.log(this);
                console.log(e);
            }
        }
    },

    close: function(){
        if(this.socketOpen){
            try{
                this.sendSocketMessage({
                    type: 'close',
                    uuid: GlobalGame.uuid,
                });
                this.socketOpen = false;
                wx.closeSocket();
            }catch(e){
                console.log(e);
            }
        }
    },

    sendRequest(nickName, avatarUrl){
        console.log('sendRequest');
        this.sendSocketMessage({
            type: 'request',
            nickName: nickName,
            avatarUrl: avatarUrl,
        });
    },

    sendJump: function(posy) {
        this.sendSocketMessage({
            type: 'jump',
            posy: posy,
            uuid: GlobalGame.uuid,
        });
    },

    sendScore: function(score){
        this.sendSocketMessage({
            type: 'score',
            uuid: GlobalGame.uuid,
            score: score,
        });
    },

    sendDie: function(){
        this.sendSocketMessage({
            type: 'die',
            uuid: GlobalGame.uuid,
        });
    },

    testDelay: function(){
        this.totalDelay = 0;
        this.totalReceive = 0;
        for(let i = 0; i < 12; ++i){
            this.sendSocketMessage({
                type: 'delay',
                timestamp: (new Date()).valueOf(),
            });
        }  
    },
});
