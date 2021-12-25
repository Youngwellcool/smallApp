// pages/my/my.js
//获取应用实例
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
    attentionNum: 0,
    fansNum: 0,
    like: 0,
    likeVideoList: [],
    likeCurrentPage: 0,
    likeLastPage: 0,
    production: [],
    productionNum: 0,
    productionCurrentPage: 0,
    productionLastPage: 0,
    show: false,
    phone: '',
    phoneErrorMessage: '',
    isPhone: null,
    sms: null,
    currentTab: 0,
    setInter: 0,
    times: 0,
    isSend: null
  },

  //微信授权登录
  onGotUserInfo: function (e) {
    //定义
    var thar = this;
    var user = e.detail.userInfo;
    wx.getUserInfo({
      success(){
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
                url: app.serverUrl + '/api/my/wechat/login',
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: res.code,
                  nickname: user.nickName,
                  avatar: user.avatarUrl,
                  gender: user.gender
                },
                success(data) {
                  if (data.data.code == 200) {
                    //把用户信息写到缓存中
                    app.setGllobalUserInfo(data.data.data);
                    thar.onLoad();
                    Toast.clear();
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
      fail(){
        Dialog.alert({
          title: '用户未授权',
          message: '如需正常使用小程序全部功能，请选择允许并在【我的】页面点击授权按钮。'
        }).then(() => {
          // on close
        });
      }
    })
     
  },
  //授权手机号
  getPhoneNumber: function(e) {
    //定义
    var thar = this;
    var user = app.getGllobalUserInfo('userInfo');
    if(!user.id){
      Toast.fail("获取本地用户失败，请退出重试");
      return false;
    }
    if (!e.detail.iv){
      Dialog.alert({
        title: '用户未授权',
        message: '如需正常使用小程序全部功能，请点击授权并允许。'
      }).then(() => {
        // on close
      });
      return false
    }
    // console.log(e.detail.iv)
    // console.log(e.detail.encryptedData)
    // return false
    wx.request({
      url: app.serverUrl + '/api/my/mobile/phoneEmpower',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        id: user.id,
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      },
      success(res){
        if (res.data.code == 200){
          //把用户信息写到缓存中
          app.setGllobalUserInfo(res.data.data);
          Toast.success('授权成功');
          thar.setData({
            userInfo: res.data.data
          });
        }else{
          Toast.fail(res.data.msg);
        }
      },
      fail(res){
        console.log(res)
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //定义
    var thar = this;
    
    //判断是否登录
    var user = app.getGllobalUserInfo();
    if (user){
      thar.setData({
        userInfo: user
      });
      //获取个人信息
      //thar.getMyInfo(user.id);
      //获取喜欢的视频
      //thar.getLikeVideoList();
      //获取作品
      //thar.getProduction();
    }
   
  },
  //获取我的信息
  getMyInfo: function(id){
    var thar = this;
    wx.request({
      url: app.serverUrl + '/mobile/user/myInfo',
      method: "POST",
      data:{
        uid: id
      },
      success(res){
        if (res.data.code == 200){
          thar.setData({
            attentionNum: res.data.data.attention_num,
            fansNum: res.data.data.fans_num
          });
          console.log(res.data.data)
        }else{
          Toast(res.data.msg);
        }
      },
      fail(res){
        Notify("请求个人信息失败");
      }
    })
  },

  //获取喜欢的视频列表
  getLikeVideoList:function(){
    //定义
    var thar = this;
    var page = thar.data.likeCurrentPage + 1;
    var lastPage = thar.data.likeLastPage;
    if (page > lastPage && lastPage != 0) {
      Toast("已经到底啦~");
      return false;
    }
    console.log(page)
    wx.request({
      url: app.serverUrl + '/mobile/video/favoriteVideoList',
      method: "POST",
      data: {
        uid: thar.data.userInfo.id,
        page: page
      },
      success(res) {
        var list = thar.data.likeVideoList;
        //赋值
        thar.setData({
          like: res.data.data.total,
          likeVideoList: list.concat(res.data.data.data),
          likeCurrentPage: res.data.data.current_page,
          likeLastPage: res.data.data.last_page
        })

      }
    })
  },
  //获取作品列表
  getProduction: function () {
    //定义
    var thar = this;
    var page = thar.data.productionCurrentPage + 1;
    var lastPage = thar.data.productionLastPage;
    if (page > lastPage && lastPage != 0) {
      Toast("已经到底啦~");
      return false;
    }
    wx.request({
      url: app.serverUrl + '/mobile/video/creatorVideoList',
      method: 'POST',
      data: {
        cid: thar.data.userInfo.id,
        page: page
      },
      success(res) {
        var list = thar.data.production;
        if (res.data.code == 200) {
          thar.setData({
            production: list.concat(res.data.data.data),
            productionNum: res.data.data.total,
            productionCurrentPage: res.data.data.current_page,
            productionLastPage: res.data.data.last_page
          });
        } else {
          Toast(res.data.msg);
        }
      },
      fail(res) {
        Notify('请求作品失败');
      }
    })
  },
  //扫码
  scan:function(e){
    wx.scanCode({
      onlyFromCamera: true,
      success(res){
        if (res.scanType == 'QR_CODE'){
          var procotol = 'http';
          var result = res.result;
          //等于0是以http开头
          if (result.indexOf(procotol) == 0){
            wx.redirectTo({
              url: '/pages/scan/scan?type=1&scan='+result
            })
          }else{
              url: '/pages/scan/scan?type=2&scan=' + result
          }
        }else{
          Notify("请扫描合规的二维码");
        }
      }
    })
  },
  //点击视频封面跳转到首页播放
  clickCover:function(e){
    var video = [];
    video[0] = e.currentTarget.dataset.video;
    app.globalData.video = video;
    wx.switchTab({
      url: '/pages/index/index',
      success:function(){
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();  
      }
    })
  },
  //切换tab
  bthTabs: function(e){
    var thar = this;
    thar.setData({
      currentTab: e.detail.index
    });
  },
  //弹出手机登录框
  showPopup() {
    this.setData({ show: true });
  },
  //关闭手机登录框
  onClose() {
    this.setData({ show: false });
  },
  //验证手机号输入框
  phoneChange: function(e){
    var thar = this;
    var phone = e.detail;
    if (!(/^1[23456789]\d{9}$/.test(phone))){
      thar.setData({
        phoneErrorMessage: '手机号格式有误',
        isPhone: null
      });
    }else{
      thar.setData({
        phoneErrorMessage: '',
        phone: e.detail,
        isPhone: 1
      });
    }
  },

  //发送验证码按钮
  btnVerificationCode: function(){
    var thar = this;
    if(!thar.data.isPhone){
      Toast('请输入手机号码');
      return false;
    }
    thar.setData({
      times: 60,
      isSend: 1
    });
    thar.startSetInter();

    wx.request({
      url: app.serverUrl + '/mobile/message/sendsms',
      method: 'POST',
      data: {
        mobile: thar.data.phone
      },
      success(res){
        if(res.data.code == 200){
          Toast.success(res.data.msg);
        }else{
          Toast(res.data.msg);
        }
      },
      fail(res){
        Notify("请求验证码失败");
      }
    })
  },
  //定时器
  startSetInter: function () {
    var that = this;

    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function () {
        var numVal = that.data.times - 1;
        that.setData({ 
          times: numVal
         });
        //console.log('setInterval==' + numVal);
        if (numVal == 0){
          //清除定时器
          clearInterval(that.data.setInter)
          that.setData({
            isSend: null
          });
        }
      }
      , 1000);
  },
  //验证码输入框
  btnSms: function(e){
    var thar = this;
    thar.setData({
      sms: e.detail
    });
  },
  //手机号登录按钮
  phoneLogin: function(){
    var thar = this;
    if(!thar.data.isPhone){
      Toast("手机号不能为空");
      return false;
    }
    if (!thar.data.sms) {
      Toast("验证码不能为空");
      return false;
    }
    //加载提示
    Toast.loading({
      mask: true,
      message: '正在登录...'
    });
    wx.request({
      url: app.serverUrl + '/mobile/user/doLogin',
      method: "POST",
      data: {
        mobile: thar.data.phone,
        code: thar.data.sms,
        client: 3
      },
      success(res){
        if(res.data.code == 200){
          thar.onClose();
          //把用户信息写到缓存中
          app.setGllobalUserInfo(res.data.data);
          thar.onLoad();
          Toast.clear();
        }else{
          Toast(res.data.msg);
        }
      },
      fail(res){
        Notify('请求登录失败')
      }
    })
    Toast.clear();
  },
  //设置按钮
  btnSettings: function(){
    wx.navigateTo({
      url: '/pages/settings/settings',
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
    var thar = this;
    //加载用户数据
    var user = app.getGllobalUserInfo('userInfo');  
    if (!thar.data.userInfo && user) {
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var thar = this;
    if(thar.data.currentTab == 1){
      thar.getProduction();
    }else{
      thar.getLikeVideoList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})