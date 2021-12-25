// pages/setData操作数据量巨大的list/setData操作数据量巨大的list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pullDownList: [],
    i: 0,
    j: -1,
  },

/**
 * 上拉加载更多
 */
  getList: function(){
    let i = this.data.i;
    let max = i + 20;
    let length = this.data.list.length;
    let newList = [];
    while(i < max) {
      newList.push({
        num: i
      })
      i++
    }
    this.setData({
      i,
      [`list[${length}]`]: newList  // 把 list 的数据结构从一维数组改为二维数组：list = [newList, newList]， 每次分页，可以直接将整个 newList数组 赋值到 list 作为一个子数组，不使用this.data.list.concat(newList)的原因是当分页数量过大时，就会造成list数据巨大，使用this.setData来操作list.concat就是对整个 list 重新赋值，造成性能损失，而且还会报 exceed max data size 错误。
    })
  },

  /**
   * 下拉加载最新的数据
   * 维护一个下拉加载数据的二维数组pullDownList，最新的排在数组的最前面，反转的逻辑代码在wxml中的wxs中
   */
  getPullDownList: function() {
    let j = this.data.j;
    let max = j - 10;
    let length = this.data.pullDownList.length;
    let newList = [];
    while (j > max) {
      newList.push({
        num: j
      })
      j--
    }
    this.setData({
      j,
      [`pullDownList[${length}]`]: newList  // 原理与getList中的操作list一致，
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log(3)
    this.getList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
    this.getPullDownList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})