var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchPageNum: 1, //页码，默认从一开始
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    callbackcount: 10,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    getImagePrefixHost: app.util.getImagePrefixHost(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.fetchSearchList();
  },

  //上拉加载滚动到底部触发事件 searchLoading"上拉加载"的变量，默认false，隐藏 searchLoadingComplete“没有数据”的变量，默认false，隐藏
  bindscrolltolower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.fetchSearchList();
    };
  },

  //请求数据方法
  fetchSearchList: function () {
    let that = this;
    let searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数
      callbackcount = that.data.callbackcount; //返回数据的个数

    app.util.getPort('/Upclasstwo/rank', {page: searchPageNum}).then((res) => {
      //console.log('---rank:' + JSON.stringify(res));//正确返回结果
      if (res.state === 1) {
        //判断是否有数据，有则取数据
        if (res.data == false) {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏
          });
        } else {
          let searchList = [];
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
          that.data.isFromSearch ? searchList = res.data : searchList = that.data.searchSongList.concat(res.data)
          that.setData({
            searchSongList: searchList, //获取数据数组
            searchLoading: true   //把"上拉加载"的变量设为false，显示
          });
        }
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏
        });
        app.util.openToastFail('已没有数据', false);
      }
    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });
  },

  //查看成绩
  score(e) {
    console.log('---选中值：' + e.currentTarget.dataset.id)
    let data = { eid: e.currentTarget.dataset.id }
    app.util.getPort('/Upclasstwo/haveArtResult', data).then((res) => {
      console.log('---haveArtResult:' + JSON.stringify(res));//正确返回结果
      if (res.state === 1) {
        wx.navigateTo({
          url: '/pages/achievement/achievement?data=' + encodeURIComponent(JSON.stringify(res.data)),
        })
      } else {
        app.util.openToastFail('获取失败', false);
      }
    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });
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
    var _this = this;
    _this.fetchSearchList();
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

})