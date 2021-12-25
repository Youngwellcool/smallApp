import drawQrcode from 'weapp-qrcode-canvas-2d'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  creatQr() {
    let that = this;
    const query = wx.createSelectorQuery()
query.select('#myQrcode')
    .fields({
        node: true,
        size: true
    })
    .exec((res) => {
        var canvas = res[0].node

        // 调用方法drawQrcode生成二维码
        drawQrcode({
            canvas: canvas,
            canvasId: 'myQrcode',
            width: 260,
            padding: 30,
            background: '#ffffff',
            foreground: '#000000',
            text: '大王顶真帅',
        })

        // 获取临时路径（得到之后，想干嘛就干嘛了）
        wx.canvasToTempFilePath({
            canvasId: 'myQrcode',
            canvas: canvas,
            // x: 0,
            // y: 0,
            // width: 260,
            // height: 260,
            // destWidth: 100,
            // destHeight: 100,
            success(res) {
                that.setData({
                  qrImg: res.tempFilePath
                })
                console.log('二维码临时路径：', res.tempFilePath)
            },
            fail(res) {
                console.error(res)
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