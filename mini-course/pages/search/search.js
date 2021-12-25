const app = getApp()
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: app.serverUrl,
    hotTags: [],
    videoList: [],
    searchValue: '',
    isSearch: null,
    currentPage: 0,
    lastPage: 0
  },

  //点击标签
  btnTag: function(e){
    var thar = this;
    thar.setData({
      searchValue: e.currentTarget.dataset.name
    });
    thar.onSearch();
  },

  //搜索框输入内容
  btnSearch: function(e){
    var thar = this;
    thar.setData({
      searchValue: e.detail
    });
  },

  //点击搜索按钮
  onSearch: function(){
    var thar = this;
    if(!thar.data.searchValue){
      Toast('请输入搜索关键词');
      return false;
    }
    thar.getSearchVideoList();
  },
  //搜索视频
  getSearchVideoList(){
    var thar = this;
    var page = thar.data.currentPage + 1;
    if (page > thar.data.lastPage && thar.data.lastPage != 0){
      return false;
    }
    //加载提示
    Toast.loading({
      mask: true,
      message: '搜索中...'
    });
    wx.request({
      url: app.serverUrl + '/mobile/video/searchVideo',
      method: "GET",
      data: {
        keyword: thar.data.searchValue,
        page: page
      },
      success(res) {
        var list = thar.data.videoList;
        if (res.data.code == 200) {
          thar.setData({
            videoList: list.concat(res.data.data.data),
            isSearch: 1,
            currentPage: res.data.data.current_page,
            lastPage: res.data.data.last_page
          });
          Toast.clear();
        } else {
          Toast("获取搜索列表失败，请重试");
        }
      },
      fail(res) {
        Notify("请求搜索服务失败，请重试");
      }
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
    var thar = this;
    wx.request({
      url: app.serverUrl + '/mobile/video/videoHotSearch',
      method: "POST",
      success(res){
        if (res.data.code == 200){
          thar.setData({
            hotTags: res.data.data
          });
        }else{
          Toast('获取热门标签失败');
        }
      },
      fail(res){
        Notify("请求热门标签失败");
      }
    })
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
    var thar = this;
    thar.getSearchVideoList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})