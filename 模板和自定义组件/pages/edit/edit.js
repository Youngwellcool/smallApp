Page({

    /**
     * 页面的初始数据
     */
    data: {
        input: '',
        focus: true,
        maxlength: 30,  // 标题限制30个字，文本内容无限制 -1
        autoHeight: true,  // 当为标题编辑时false，文本内容为true
        type: 1,  // 1为编辑标题，2为编辑文本内容
        index: '',  // 当前正在编辑的文本的index
        leftWordNum: 0, // 已经输入的字数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            type: options.type,
            index: options.index,
        })
        if(options.type == 1) {
            this.setData({
                maxlength: 30,
                autoHeight: false,
            })
        }else {
            this.setData({
                maxlength: -1,
                autoHeight: true,
            })
        }
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