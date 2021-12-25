//获取应用实例
const app = getApp()

Page({
  data: {

  },

  // 当组件输入数字6位数时的自定义函数
  initData(e) {
    console.log(e)
    // 模态交互效果
    wx.showToast({
      title: '支付成功'
    })
  }
})