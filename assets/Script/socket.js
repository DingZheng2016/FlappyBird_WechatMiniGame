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
                            self.player2Pic.node.active = false;
                        }
                    };
                    image.src = dict['avatarUrl'];
                }catch (e) {
                    cc.log(e);
                    self.player2Pic.node.active = false;
                }
            }else if(dict['type'] === 'jump'){
                self.player2.getComponent('player').jump();
            }else if(dict['type'] === 'score'){
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
            }
        });
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
        else
            this.socketMsgQueue.push(msg);
    },

    close: function(){
        if(this.socketOpen){
            try{
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

    sendJump: function() {
        this.sendSocketMessage({
            type: 'jump',
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
});
