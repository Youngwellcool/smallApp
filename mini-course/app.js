//app.js
App({
  /*网络访问方式
  同一局域网可以使用本机ip
  不同局域网可以使用穿透*/
  serverUrl: "http://hkw.yunjy.com.cn",
  userInfo: true, //null,
  setGllobalUserInfo: function (user) {
    //设置本地缓存
    wx.setStorageSync("userInfo", user)
  },
  getGllobalUserInfo: function () {
    //获取本地缓存内容
    return wx.getStorageSync("userInfo")
  },
  removeUserInfo: function () {
    wx.removeStorageSync("userInfo")
  },
  globalData: {
    video: null
  }
})