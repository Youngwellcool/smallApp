Page({

    /**
     * 页面的初始数据
     */
    data: {
        item2: {
            index: 1,
            msg: '我是msgItem2模板',
            time: '2018-12-05'
        },
      // 组件所需的参数
      nvabarData: {
        showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
        title: 'a页面', //导航栏 中间的标题
        backAlert: 1, // 点击返回按钮是否弹出提示  1表示弹出    0表示不弹出
      },
    },

    jump: function(e) {
      wx.navigateTo({
        url: '../canvas-image/canvas-image',
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