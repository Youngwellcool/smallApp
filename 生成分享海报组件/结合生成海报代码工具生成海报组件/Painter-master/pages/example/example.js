import Card from '../../palette/card';

// src/pages/xml2can/xml2can.js
Page({
  imagePath: '',

  /**
   * 页面的初始数据
   */
  data: {
    template: {},
    imagePath: ''
  },

  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      imagePath: this.imagePath
    });
    console.log(e);
  },

  saveImage() {
    console.log(this.imagePath)
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.setData({
      template: new Card().palette({
        title: '范德萨范德萨范德萨范德萨范德萨',
        hot: '5436',
        day: '345',
        name: '分列第',
        type: 'course'
      })
    });
  }
});
