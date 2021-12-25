// pages/canvas-demo/canvas-demo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 组件所需的参数
        nvabarData: {
            showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
            title: 'canvas-demo页面', //导航栏 中间的标题
            backAlert: 1, // 点击返回按钮是否弹出提示  1表示弹出    0表示不弹出
        },
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
        this.ctx = wx.createCanvasContext('myCanvas');
        console.log(this.ctx)
        this.ctx.save();
        let width = 300, height = 500;
        this.ctx.translate(width / 2, height / 2);
        this.ctx.setFillStyle('#f00');
        this.ctx.fillRect(-(width / 2), -(height / 2), width, height);
        console.log(this.ctx.measureText('fdasfdsa').width)
        // this.ctx.restore();
        this.ctx.draw()

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