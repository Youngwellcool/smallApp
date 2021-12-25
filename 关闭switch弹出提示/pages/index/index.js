//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    show: true,
  },


  switchChange: function (e) {
    var that = this;
    if (!this.data.show) {
      that.setData({
        show: true,
      })
      return;
    }
    //  TODO 关闭switch开关时弹出提示
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success(res) {
        if (res.confirm) {
          that.setData({
           show: false
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },





 
})
