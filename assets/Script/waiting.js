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
        socketlayer: {
            default: null,
            type: cc.Node,
        },
        player1Pic: {
            default: null,
            type: cc.Sprite,
        },
        player1Name: {
            default: null,
            type: cc.Label,
        },
        back: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad: function(){
        if(!CC_WECHATGAME)
            return ;        
        this.socket = this.socketlayer.getComponent('socket');
        let self = this;
        wx.getUserInfo({
            success: function(res) {
                let data = {};
                data['type'] = 'request';
                data['nickName'] = res.userInfo.nickName;
                data['avatarUrl'] = res.userInfo.avatarUrl;
                console.log(data);
                self.socket.sendSocketMessage(data);
                self.player1Name.string = data['nickName'];

                try {
                    let image = wx.createImage();
                    image.onload = () => {
                        try {
                            let texture = new cc.Texture2D();
                            texture.initWithElement(image);
                            texture.handleLoadedTexture();
                            self.player1Pic.spriteFrame = new cc.SpriteFrame(texture);
                        } catch (e) {
                            cc.log(e);
                            self.player1Pic.node.active = false;
                        }
                    };
                    image.src = data['avatarUrl'];
                }catch (e) {
                    cc.log(e);
                    self.player1Pic.node.active = false;
                }
            }
        });

        this.registerInput();
    },

    registerInput: function(){
        this.back.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.socket.close();
            cc.director.loadScene('startgame');
        }, this);
    },

});
