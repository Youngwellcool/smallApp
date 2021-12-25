const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        msg: '初始化中，请稍后……'
    },

    action: null,

    takePhoto() {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                this.setData({
                    src: res.tempImagePath
                })
            }
        })
    },

    error(e) {
        console.log(e.detail)
    },

    // 拍照
    snapshot(action) {
        let that = this;
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'high',
            success: res => {
                console.log(res)
                console.log(res.tempImagePath)
                this.setData({
                    src: res.tempImagePath
                })
                wx.getFileSystemManager().readFile({
                    filePath: res.tempImagePath,
                    encoding: 'base64',
                    success: res => {
                        console.log(res)
                        let faceImg = `data:image/jpeg;base64,${res.data}`;
                        that.setData({
                            base64: faceImg
                        })
                        that.face(action, faceImg)
                    }
                })
            }
        })
    },

    bindStart() {
        let that = this;
        this.ctx.start({
            success: res => {
                console.log('start success')

            },
            fail: res => {
                console.log('start fail')
            }
        })
    },

    launchAppError(e) {
        console.log('跳转APP失败')
        console.log(e)
    },
    bindlaunchapp(e) {
        console.log('跳转APP成功')
        console.log(e)
    },
    cameraDone(e) {
        /*console.log(e)
        let {code} = e.detail;
        // console.log('live-pusher code:', e.detail.code)
        if(code == -1307) {
            this.bindStart()
        }
        if(code == 1003) {
            if(!this.action && !this.passOk) {
                this.setData({
                    msg: '请将脸放入框中保持不动'
                })
                clearInterval(this.timer)
                this.timer = null;
                this.timer = setInterval(() => {
                    this.snapshot('ready')
                }, 2000)
            }
        }*/
        console.log(e)
        if(!this.action && !this.passOk) {
            this.setData({
                msg: '请将脸放入框中保持不动'
            })
            clearInterval(this.timer)
            this.timer = null;
            this.timer = setInterval(() => {
                this.snapshot('ready')
            }, 2000)
        }
    },

    face(action, faceImg) {
        app.api.face({
            code: "200",
            msg: action,
            face: faceImg
        }).then(result => {
              if(result.code == 200) {
                 console.log('then*********')
                 clearInterval(this.timer2)
                 this.timer2 = null;
                this.action = null;
                this.passOk = true;
                 this.setData({
                     msg: '验证通过',
                 })
            }
        }).catch(result => {
            if(result.code == 5) {  // 容错检测失败

            }else if(result.code == 4) {  // 容错检测成功
                actionHandle(action)
            }else if(result.code == 3) {  // 人脸初始化识别成功
                console.log('人脸初始化识别成功')
                this.action = result.data && result.data.action;
                clearInterval(this.timer)
                this.timer = null;
                this.setData({
                    msg: '请摇摇头',
                })
                this.timer2 = setInterval(() => {
                    this.snapshot(this.action)
                }, 500)
            }else if(result.code == 0) {  // 人脸初始化识别失败
                console.log('人脸初始化识别失败')
                flag = true;
                readyFlag = false;
            }else if(result.code == 2){  // 按要求的动作操作成功
                action = result.result && result.data.action;
                console.log(result.msg);
                actionHandle(action)
                //$('.err-tips').hide()
            }else if(result.code == 1){  // 按要求的动作操作失败
                actionHandle(action)
                //$('.err-tips').html(data.msg).show()
            }
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.ctx = wx.createLivePusherContext('pusher')

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        clearInterval(this.timer)
        this.timer = null;
        clearInterval(this.timer2)
        this.timer2 = null;
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})