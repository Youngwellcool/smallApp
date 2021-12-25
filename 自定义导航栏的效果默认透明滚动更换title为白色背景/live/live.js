// live/live.js
const key = 'YFNBZ-TEUWP-DEFDV-LYZYH-HJMMK-FIFLW'; //使用在腾讯位置服务申请的key
const referer = '百思不得骑姊22'; //调用插件的app的名称
const category = '生活服务,娱乐休闲';
const chooseLocation = requirePlugin('chooseLocation');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

//   toLive() {
//     let roomId = [1] // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
//     let customParams = encodeURIComponent(JSON.stringify({ path: 'live/live', pid: 1 })) // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
//     wx.navigateTo({
//       url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
//     })
// // 其中wx2b03c6e691cd7370是直播组件appid不能修改
//   },

  choose() {
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&category=${category}`
    });
  },


  getLocation() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          latitude,
          longitude,
          success: function(op) {
            console.log(op)
          },
        })
      }
     })
  },

  toqr() {
    wx.navigateTo({
      url: '/qr/qr',
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
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    console.log(location)
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