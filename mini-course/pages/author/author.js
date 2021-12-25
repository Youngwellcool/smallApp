// pages/author/author.js
const app = getApp()
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: app.serverUrl,
    author: null,
    userId: 0,
    like: 0,
    likeVideoList: null,
    production: 0,
    productionNum: 0,
    isAttention: null,
    attentionText: '关注'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thar = this;
    wx:wx.request({
      url: app.serverUrl + '/mobile/user/creatorInfo',
      data: {
        uid: options.userId,
        cid: options.id
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        if (res.data.code == 200){
          thar.setData({
            author: res.data.data,
            userId: options.userId
          });
        }else{
          Toast(res.data.msg);
        }
      },
      fail: function(res) {
        Notify('请求失败，请重试');
      }
    })
    thar.getProduction(options.id);
    thar.getLike(options.id);
    thar.isAttentionAuthor(options.userId, options.id);
  },

  //获取作品列表
  getProduction: function(authorId){
    var thar = this;
    wx.request({
      url: app.serverUrl + '/mobile/video/creatorVideoList',
      method: 'POST',
      data: {
        cid: authorId
      },
      success(res){
        if(res.data.code == 200){
          thar.setData({
            production: res.data.data.data,
            productionNum: res.data.data.total
          });
        }else{
          Toast(res.data.msg);
        }
      },
      fail(res){
        Notify('请求作品失败');
      }
    })
  },

  //获取喜欢的列表
  getLike: function(userId){
    var thar = this;
    wx.request({
      url: app.serverUrl + '/mobile/video/favoriteVideoList',
      method: "POST",
      data: {
        uid: userId
      },
      success(res){
        if (res.data.code == 200) {
          thar.setData({
            likeVideoList: res.data.data.data,
            like: res.data.data.total
          });
        } else {
          Toast(res.data.msg);
        }
      },
      fail(res){
        Notify('请求喜欢的作品列表失败');
      }
    })
  },
  //点击视频封面跳转到首页播放
  clickCover: function (e) {
    var video = [];
    video[0] = e.currentTarget.dataset.video;
    app.globalData.video = video;
    wx.switchTab({
      url: '/pages/index/index',
      success: function () {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  //查询是否关注了作者
  isAttentionAuthor: function(userId,authorId){
    var thar = this;
    wx.request({
      url: app.serverUrl +'/mobile/user/isAttention',
      method: "POST",
      data: {
        uid: userId,
        cid: authorId
      },
      success(res){
        if (res.data.code == 200){
          if (res.data.msg == '已关注'){
            thar.setData({
              isAttention: 1,
              attentionText: res.data.msg
            });
          }
        }else{
          Toast(res.data.msg);
        }
      },
      fail(res){
        Notify('获取关注状态失败');
      }
    })
  },
  //关注和取消关注
  btnAttention: function(e){
    var thar = this;
    var type = '';
    if (thar.data.isAttention){
      type = 1;
    }
    wx.request({
      url: app.serverUrl + '/mobile/user/attentionUser',
      method: "POST",
      data: {
        uid: thar.data.userId,
        cid: thar.data.author.id,
        type: type
      },
      success(res){
        if (res.data.code == 200){
          if (thar.data.isAttention){
            thar.setData({
              isAttention: null,
              attentionText: '关注'
            });
            Toast.success('已取消关注');
          }else{
            thar.setData({
              isAttention: 1,
              attentionText: '已关注'
            });
            Toast.success('已关注');
          }
        }else{
          Toast(res.data.msg);
        }
      },
      fail(res){
        Notify('请求失败，请重试');
      }
    })
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