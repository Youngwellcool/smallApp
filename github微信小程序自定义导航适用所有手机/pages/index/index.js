//index.js
//获取应用实例
//const app = getApp();
console.log(Page)

import wx from '../../utils/promisify';
Page({
  data: {
    loading: false,
    color: '#000',
    background: '#fff',
    show: true,
    animated: false
  },

  onLoad: function() {
    console.log(1111)
    // console.log(wx.getSetting)
    wx.getSetting().then(res => {
      console.log(res)
    })
    
  },
  search: function() {
    wx.navigateTo({
      url: '/pages/demo1/index'
    })
  },
    to: function () {
        wx.navigateTo({
            url: '/pages/demo9/index'
        })
    },
});
