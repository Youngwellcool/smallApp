//index.js
const app = getApp()

Page({
  data: {

  },

  onLoad: function () {


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log(options)
    return {
      title: '巴南区研修学习平台',
      desc: '教师研修小程序，资源丰富，应有尽有!',
      path: '/pages/index/index',
    }
  }

})