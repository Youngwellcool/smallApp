const app = getApp()
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/vant-weapp/notify/notify';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: app.serverUrl,
    userInfo: app.userInfo,
    videoDetail: '',
    start: 0,
    current: 0,
    startTouch: '',
    startNum: '0',
    videoList: [], //接口返回的视频列表。
    touch: false,
    touchStartTime: 0, //触摸开始时间
    touchEndTime: 0, // 触摸结束时间
    lastTapTime: 0, // 单击事件点击后要触发的函数
    lastTapTimeoutFunc: null,
    switchTo: true,
    isLike: null,
    show: null,
    //评论框的高度
    focusInput: false,
    height: '',
    isInput: false,
    review: null,
    reviewVideoId: null,
    reviewList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thar = this;
    //加载用户数据
    var user = app.getGllobalUserInfo('userInfo');
    if(user){
      thar.setData({
        userInfo: user
      })
    }
    
    //从其他页面跳转带过来的视频
    if (app.globalData.video){
      thar.setData({
        videoList : app.globalData.video
      });
      thar.isLike(app.globalData.video[0].vid);
      //隐藏播放按钮
      this.setData({
        play: false
      })
    }
    thar.dataList();
  },
  //微信授权登录
  onGotUserInfo: function(e){
    //定义
    var thar = this;
    var user = e.detail.userInfo;
    wx.getUserInfo({
      success() {
        //加载提示
        Toast.loading({
          mask: true,
          message: '正在登录...'
        });
        wx.login({
          success(res) {

            if (res.code) {
              //发起网络请求
              wx.request({
                url: app.serverUrl + '/mobile/wechatMini/login',
                data: {
                  code: res.code,
                  nickname: user.nickName,
                  avatar: user.avatarUrl,
                  third_party: 1
                },
                success(data) {

                  if (data.data.code == 200) {
                    //把用户信息写到缓存中
                    app.setGllobalUserInfo(data.data.data);
                    thar.setData({
                      userInfo: data.data.data
                    });
                    Toast.clear();
                    Toast.success('授权成功')
                  }
                },
                fail(data) {
                  console.log(data.data)
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
      fail() {
        Dialog.alert({
          title: '用户未授权',
          message: '如需正常使用小程序全部功能，请选择允许并在【我的】页面点击授权按钮。'
        }).then(() => {
          // on close
        });
      }
    })
  },
  //跳转作者页
  btnAuthor: function(e){
    var thar = this;
    if (!thar.data.userInfo){
      return false;
    }
    //获取video
    this.videoContext = wx.createVideoContext('videoplayer')
    //暂停播放视频
    this.videoContext.pause();
    this.setData({
      play: true
    });
    var authorId = e.currentTarget.dataset.id;
    var userId = thar.data.userInfo.id;
    //如果作者是当前用户，则跳转到我的页
    if (authorId == userId){
      wx.switchTab({
        url: '/pages/my/my',
      });
      return false;
    }
    wx.navigateTo({
      url: '/pages/author/author?id=' + authorId + '&userId=' + userId
    })
  },
  //喜欢和取消喜欢
  btnLike: function(e){
    var thar = this; 
    var videoId = e.currentTarget.dataset.id;
    if (thar.data.userInfo != null){
      var userId = thar.data.userInfo.id;
      var type = '';
      if (thar.data.isLike){
        type = '1';
      }
      wx.request({
        url: app.serverUrl + '/mobile/video/favorite',
        data:{
          uid: userId,
          vid: videoId,
          type: type
        },
        success(res){
          if (res.data.code == 200){
            if (thar.data.isLike == null){
              thar.setData({
                isLike: '1'
              })
              Toast.success('已喜欢');
            }else{
              thar.setData({
                isLike: null
              })
              Toast.success('已取消喜欢');
            }
          }else{
            Toast(res.data.msg);
          }
        },
        fail(res){
          Notify('请求失败，请重试');
        }
      })
    }
  },
  //查询是否喜欢视频
  isLike: function(videoId){
    var thar = this;
    if (!thar.data.userInfo){
      return false;
    }
    wx.request({
      url: app.serverUrl + '/mobile/video/isFavorite',
      method: "POST",
      data: {
        uid: thar.data.userInfo.id,
        vid: videoId
      },
      success(res){
        if (res.data.code == 200){
          if (res.data.msg == '已喜欢'){
            thar.setData({
              isLike: '1'
            });
          }else{
            thar.setData({
              isLike: null
            });
          }
        }else{
          Toast(res.data.msg);
        }
      },
      fail(res){
        Notify('查询是否喜欢失败，请重试');
      }
    })
  },
  //视频开始播放
  videoPlay: function(e){
    var thar = this;
    thar.isLike(e.currentTarget.dataset.id);
  },
  //评论框
  btnReview: function(e){
    var thar = this;
    //获取video
    this.videoContext = wx.createVideoContext('videoplayer')
    //暂停播放视频
    this.videoContext.pause();
    this.setData({
      play: true,
      show: true,
      reviewVideoId: e.currentTarget.dataset.id
    });
    wx.request({
      url: app.serverUrl + '/mobile/video/getReviewByVideoId',
      method: "POST",
      data: {
        vid: e.currentTarget.dataset.id
      },
      success(res){
        if (res.data.code == 200){
          thar.setData({
            reviewList: res.data.data.data
          });
        }else{
          Toast('获取评论失败');
        }
      },
      fail(res){
        Notify("请求评论失败");
      }
    })
  },
  onClose() {
    //获取video
    this.videoContext = wx.createVideoContext('videoplayer')
    //开始播放视频
    this.videoContext.play();
    this.setData({
      play: false,
      show: false,
      reviewVideoId: null,
      reviewList: []
    });
  },
  inputFocus(e) {
    console.log(e, '键盘弹起')
    this.setData({
      height: e.detail.height,
      isInput: true
    })
  },
  inputBlur() {
    console.log('键盘收起')
    this.setData({
      isInput: false
    })
  },
  focusButn: function () {
    this.setData({
      focusInput: true,
      isInput: true
    })
  },
  //输入评论
  inputReview: function(e){
    var thar = this;
    if (e.detail.value){
      thar.setData({
        review: e.detail.value
      });
    }
  },
  //发表评论
  sendReview: function(){
    var thar = this;
    var review = thar.data.review;
    if(!review){
      Toast("请输入评论内容");
      return false;
    }
    //加载提示
    Toast.loading({
      mask: true,
      message: '发表中...'
    });
    wx.request({
      url: app.serverUrl + '/mobile/video/sendReview',
      method: "POST",
      data: {
        uid: thar.data.userInfo.id,
        vid: thar.data.reviewVideoId,
        review: review
      },
      success(res){
        if (res.data.code == 200){
          var list = thar.data.reviewList;
          thar.setData({
            reviewList: list.concat(res.data.data),
            review: null
          });
          Toast.clear();
          Toast.success('发表成功');
        }else{
          Toast(res.data.msg);
        } 
      },
      fail(res){
        Notify("请求发表评论失败");
      }
    })
  },
  //点击搜索图标
  btnSearch: function(){
    //获取video
    this.videoContext = wx.createVideoContext('videoplayer')
    //暂停播放视频
    this.videoContext.pause();
    this.setData({
      play: true
    });
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('videoplayer');
    this.setData({
      updateState: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var thar = this;
    //加载用户数据
    var user = app.getGllobalUserInfo('userInfo');
    if (!thar.userInfo && user){
      this.onLoad()
    }
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
    console.log(222)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(1111)
  },
  //获取视频列表
  dataList: function () {//加载数据
    var that = this;

    /*wx.request({
      url: app.serverUrl + '/mobile/video/videoList',//把这里换成自己的接口地址
      data: {
        uid: '1',
        type: '2'
      },
      // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        // console.log(res.data)
        var listTem = that.data.videoList;
        var dataList = res.data.data.data;
        //console.log(dataList)
        //添加新任务列表
        that.setData({
          videoList: listTem.concat(dataList)
        })
        if (res.data.data.data.length < 5) {
          that.setData({
            startNum: '0',
            current: 0
          })
        }
      }
    })*/


      // console.log(res.data)
      var listTem = that.data.videoList;
      var dataList = [
          {
              "id": "178",
              "uid": "1",
              "video_name": "/video/WeChat_20191231111847.mp4",
              "title": "测试全屏视频01",
              "video_duration": "00:23",
              "video_size": "6.96MB",
              "cover": "",
              "video_cover": "视频封面",
              "about": "测试视频",
              "behaviour": "1",
              "favorite_num": "0",
              "unfavorite_num": "0",
              "share_num": "0",
              "create_time": "1567844064",
              "vid": "178",
              "user_nickname": "admin",
              "avatar": "https://upload.yx.yunjy.com.cn/avatar/8500/110815191.jpg",
              "sex": "0",
              "playURL": "http://pgcvideo.cdn.xiaodutv.com/1608456785_2379536931_2017082413303520170824143015.mp4?authorization=bce-auth-v1%2Fc308a72e7b874edd9115e4614e1d62f6%2F2017-08-24T06%3A48%3A43Z%2F-1%2F%2F5460c10927732b683a1b6a9350c9263e8441505354e29a9f302223f043e7bc3b&responseCacheControl=max-age%3D8640000&responseExpires=Sat%2C+02+Dec+2017+14%3A48%3A43+GMTmp4&time=1577858062&xcode=0c1ce288bc60c92c4120d10ceac9d0ae63c8943955bd16f1&_=1577771678916",
              "video_tag": ""
          },
          {
              "id": "178",
              "uid": "1",
              "video_name": "竖屏视频",
              "title": "测试全屏视频01",
              "video_duration": "00:23",
              "video_size": "6.96MB",
              "cover": "",
              "video_cover": "视频封面",
              "about": "测试视频",
              "behaviour": "1",
              "favorite_num": "0",
              "unfavorite_num": "0",
              "share_num": "0",
              "create_time": "1567844064",
              "vid": "178",
              "user_nickname": "admin",
              "avatar": "https://upload.yx.yunjy.com.cn/avatar/8500/110815191.jpg",
              "sex": "0",
              "playURL": "//f.us.sinaimg.cn/000sehjClx07vMCkrHNS010412001UTE0E010.mp4?label=mp4_hd&template=480x852.24.0&trans_finger=8b4ba5dd910e61a4f562dadf6cd9a4e8&Expires=1577775831&ssig=XrBcX1Eylj&KID=unistore,video",
              "video_tag": ""
          },
          {
              "id": "179",
              "uid": "1",
              "video_name": "/video/WeChat_20191231111824.mp4",
              "title": "测试全屏视频02",
              "video_duration": "00:21",
              "video_size": "4.52MB",
              "cover": "",
              "video_cover": "视频封面",
              "about": "测试视频",
              "behaviour": "1",
              "favorite_num": "0",
              "unfavorite_num": "0",
              "share_num": "0",
              "create_time": "1567844102",
              "vid": "179",
              "user_nickname": "dk",
              "avatar": "http://hk.yunjy.com.cn/files/course/2019/04-22/114951fe1410837802.jpg",
              "sex": "0",
              "playURL": "http://pgcvideo.cdn.xiaodutv.com/2595338315_2928838224_2017051610103120170516102316.mp4?authorization=bce-auth-v1%2Fc308a72e7b874edd9115e4614e1d62f6%2F2017-05-16T02%3A27%3A55Z%2F-1%2F%2F668d825b6709cfb7184df0c941434541f0470dcee198ad5520cd7c235a653f4c&responseCacheControl=max-age%3D8640000&responseExpires=Thu%2C+24+Aug+2017+10%3A27%3A55+GMTmp4&time=1577858056&xcode=0c1ce288bc60c92c8455d301a05128ca23d10f05b0259c94&_=1577771670261",
              "video_tag": ""
          },
          {
              "id": "179",
              "uid": "1",
              "video_name": "/video/WeChat_20191231111824.mp4",
              "title": "测试全屏视频02",
              "video_duration": "00:21",
              "video_size": "4.52MB",
              "cover": "",
              "video_cover": "视频封面",
              "about": "测试视频",
              "behaviour": "1",
              "favorite_num": "0",
              "unfavorite_num": "0",
              "share_num": "0",
              "create_time": "1567844102",
              "vid": "179",
              "user_nickname": "dk",
              "avatar": "http://hk.yunjy.com.cn/files/course/2019/04-22/114951fe1410837802.jpg",
              "sex": "0",
              "playURL": "//f.video.weibocdn.com/001dCRWLlx07zLLsCHFm01041203Kale0E020.mp4?label=mp4_720p&template=1280x720.25.0&trans_finger=1f0da16358befad33323e3a1b7f95fc9&Expires=1577775968&ssig=FiuH1tqdXF&KID=unistore,video",
              "video_tag": ""
          },
          {
              "id": "179",
              "uid": "1",
              "video_name": "网络视频",
              "title": "测试全屏视频02",
              "video_duration": "00:21",
              "video_size": "4.52MB",
              "cover": "",
              "video_cover": "视频封面",
              "about": "测试视频",
              "behaviour": "1",
              "favorite_num": "0",
              "unfavorite_num": "0",
              "share_num": "0",
              "create_time": "1567844102",
              "vid": "179",
              "user_nickname": "dk",
              "avatar": "http://hk.yunjy.com.cn/files/course/2019/04-22/114951fe1410837802.jpg",
              "sex": "0",
              "playURL": "http://pgcvideo.cdn.xiaodutv.com/3009839239_3256510743_2017021514331120170215143905.mp4?authorization=bce-auth-v1%2Fc308a72e7b874edd9115e4614e1d62f6%2F2017-02-15T06%3A41%3A26Z%2F-1%2F%2Fab89e4623a8e890940e3a9f7a84708f630d4df96b11267e6803af4adbba79733&responseCacheControl=max-age%3D8640000&responseExpires=Fri%2C+26+May+2017+14%3A41%3A26+GMTmp4&time=1577851454&xcode=9a6a19f0d9ab6523db1e1b19795b5995de4da4d94bc0c375&_=1577765071079",
              "video_tag": ""
          },
          {
              "id": "179",
              "uid": "1",
              "video_name": "网络视频",
              "title": "测试全屏视频02",
              "video_duration": "00:21",
              "video_size": "4.52MB",
              "cover": "",
              "video_cover": "视频封面",
              "about": "测试视频",
              "behaviour": "1",
              "favorite_num": "0",
              "unfavorite_num": "0",
              "share_num": "0",
              "create_time": "1567844102",
              "vid": "179",
              "user_nickname": "dk",
              "avatar": "http://hk.yunjy.com.cn/files/course/2019/04-22/114951fe1410837802.jpg",
              "sex": "0",
              "playURL": "http://f.video.weibocdn.com/003U8pyNlx07zME13tqo01041200QkwW0E010.mp4?label=mp4_ld&template=360x636.24.0&trans_finger=81b11b8c5ffb62d33ceb3244bdd17e7b&Expires=1577776061&ssig=DRqhTsm%2FOU&KID=unistore,video",
              "video_tag": ""
          }
      ];
      //console.log(dataList)
      //添加新任务列表
      that.setData({
          videoList: listTem.concat(dataList)
      })
      if (res.data.data.data.length < 5) {
          that.setData({
              startNum: '0',
              current: 0
          })
      }

    return true;
  },
  // 下面主要模仿滑动事件
  touchstart: function (e) {
    this.setData({
      touchStartTime: e.timeStamp,
      showGuide: false
    })
    let startTouch = e.changedTouches[0]
    this.setData({
      startTouch: startTouch,
      touch: false
    })
  },
  touchmove: function (e) {
    let Y = e.changedTouches[0].pageY - this.data.startTouch.pageY;
  },
  touchend: function (e) {
    this.setData({
      touchEndTime: e.timeStamp
    })
    this.getDirect(this.data.startTouch, e.changedTouches[0])
    //console.log(e.target.dataset)
  },
  touchcancel: function (e) {
    this.getDirect(this.data.startTouch, e.changedTouches[0])
  },
  // 计算滑动方向
  getDirect: function (start, end) {
    var thar = this;
    var X = end.pageX - start.pageX,
      Y = end.pageY - start.pageY;
    if (Math.abs(X) > Math.abs(Y) && X > 0) {//向右划动
      thar.btnSearch();
    }
    else if (Math.abs(X) > Math.abs(Y) && X < 0) {//向左划动
      console.log("right 2 left");
    }
    else if (Math.abs(Y) > Math.abs(X) && Y > 40) {
      if (this.data.current > 0) {
        this.setData({
          touch: true,
          transitionOver: false
        })
        this.pre()
      } else {
        this.setData({
          current: 0
        })
      }
    }
    else if (Math.abs(Y) > Math.abs(X) && Y < -40) {
      if (this.data.current < this.data.videoList.length - 2) {
        this.setData({
          touch: true
        })
        this.next()
      } else {
        var startNum = parseInt(this.data.startNum) + 5;
        this.setData({
          startNum: startNum,
        })
        this.dataList();
        this.setData({
          current: this.data.videoList.length - 1
        })
      }
    }
  },
  // 播放上一个
  pre: function () {
    var thar = this;
    thar.setData({
      current: thar.data.current - 1,
      play: false
    })
    //获取切换后的视频id
    const query = wx.createSelectorQuery();
    query.select('#videoplayer').boundingClientRect();
    query.exec(function (res) {
      thar.isLike(res[0].dataset.id);
    })
  },

  // 播放下一个
  next: function () {
    var thar = this;
    thar.setData({
      current: thar.data.current + 1,
      play: false
    })
    //获取切换后的视频id
    const query = wx.createSelectorQuery();
    query.select('#videoplayer').boundingClientRect();
    query.exec(function (res) {
      thar.isLike(res[0].dataset.id);
    })
  },
  //点击暂停/开始
  videoTap: function () {
    //获取video
    this.videoContext = wx.createVideoContext('videoplayer')
    if (this.data.play) {
      //开始播放
      this.videoContext.play()//开始播放
      this.setData({
        play: false
      })
    } else {
      //当play==false 显示图片 暂停
      this.videoContext.pause()//暂停播放
      this.setData({
        play: true
      })
    }
  },
  //播放条时间改表触发
  videoUpdate(e) {
    if (this.data.updateState) { //判断拖拽完成后才触发更新，避免拖拽失效
      let sliderValue = e.detail.currentTime / e.detail.duration * 100;
      this.setData({
        sliderValue: sliderValue,
        duration: e.detail.duration
      })
    }
  },
  sliderChanging(e) {
    this.setData({
      updateState: false //拖拽过程中，不允许更新进度条
    })
  },
  //拖动进度条触发事件
  sliderChange(e) {
    if (this.data.duration) {
      this.videoContext.seek(e.detail.value / 100 * this.data.duration); 
      //完成拖动后，计算对应时间并跳转到指定位置
      this.setData({
        sliderValue: e.detail.value,
        updateState: true //完成拖动后允许更新滚动条
      })
    }
  },
})