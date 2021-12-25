var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        types: [
            {
                id: 0,
                name: '功能异常'
            },
            {
                id: 1,
                name: '体验问题'
            },
            {
                id: 2,
                name: '功能建议'
            },
            {
                id: 3,
                name: '其他'
            },
        ],
        type: 0, // 已选择的反馈类型
        content: '', //
        images: [], // 上传的图片
        mobile: '',

        imgs: []
    },

    /**
     * 选择反馈类型
     */
    chooseType: function (e) {
        console.log(e)
        var dataset = e.currentTarget.dataset;
        this.setData({
            type: dataset.id,
        })
    },

    /**
     * 选择图片
     */
    chooseImg: function (e) {
        var that = this;
        wx.chooseImage({
            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {
                console.log(res)
                that.setData({
                    images: that.data.images.concat(res.tempFilePaths[0])
                })
                /*app.api.upLoad(res.tempFilePaths[0]).then(resp=>{
                  that.setData({
                    images: that.data.images.concat(resp.url)
                  })
                })*/
            }
        })
    },
    muiltSubmit() {
        var that = this;
        const promiseArr = []
        for (let i = 0; i < this.data.images.length; i++) {
            let img = this.data.images[i]
            promiseArr.push(new Promise((resolve, reject) => {
                app.api.upLoad(img).then(resp => {
                    setTimeout(() => {
                        console.log('成功')
                        resolve()
                        that.setData({
                            imgs: that.data.imgs.concat(resp.url)
                        })
                    }, 1000)

                }).catch(err => {
                    console.log('失败')
                })
            }))
        }
        Promise.all(promiseArr).then(res => {
            console.log('批量完成')
        })
    },



    /**
     * 删除图片
     */
    delImg: function (e) {
        var index = e.currentTarget.dataset.index;
        var images = this.data.images.slice();
        images.splice(index, 1);
        this.setData({
            images: images
        })
    },

    /**
     * 反馈内容
     */
    textarea: function (e) {
        this.setData({
            content: e.detail.value,
        })
    },

    /**
     * 手机号码
     */
    input: function (e) {
        this.setData({
            mobile: e.detail.value,
        })
    },

    /**
     * 预览图片
     */
    prevImg: function (e) {
        var index = e.currentTarget.dataset.index;
        var images = this.data.images;
        wx.previewImage({
            urls: images,
            current: images[index]
        })
    },

    /**
     * 提交
     */

    submit: function () {
        var that = this;
        var url = '/yxapp/api/mobile/feedback/submit';
        var fileImageUrl = app.globalData.uploadUrl + wx.getStorageSync('userId');
        var type = this.data.type;
        var content = this.data.content;
        var files = this.data.images.join(',');
        var userContact = this.data.mobile;

        if (!content || content == '') {
            wx.showToast({
                title: '请填写反馈内容',
                image: '/assets/images/delete_photo.png',
                duration: 1500
            })
            return;
        }
        if (content.length > 200) {
            wx.showToast({
                title: '反馈内容在200字以内',
                image: '/assets/images/delete_photo.png',
                duration: 1500
            })
            return;
        }
        app.api.feedback({
            content,
            userContact,
            type,
            files
        }).then(res => {
            wx.showModal({
                title: '提交成功',
                content: '您已成功提交 ，感谢您抽出时间为我们提供宝贵的意见和反馈，您的每一次反馈都是我们最重要的事情。',
                showCancel: false,
                confirmText: '知道了',
                success(res) {
                    if (res.confirm) {
                        wx.navigateBack();
                    } else if (res.cancel) {
                        wx.navigateBack();
                    }
                }
            })
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