//index.js
//获取应用实例
//const app = getApp();
console.log(Page)
Page({
  data: {},
  handlerGobackClick(delta) {
    const pages = getCurrentPages();
    if (pages.length >= 2) {
      wx.navigateBack({
        delta: delta
      });
    } else {
      wx.navigateTo({
        url: '/pages/index/index'
      });
    }
  },
  handlerGohomeClick() {
    wx.navigateTo({
      url: '/pages/index/index'
    });
  },

  tapTips(e) {
    console.log('点击了页面中的提示文字')
  }
});
