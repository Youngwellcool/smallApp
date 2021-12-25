// pages/information/information.js
const app = getApp()
import {hexMD5} from "../../utils/md5.js";
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverUrl: app.serverUrl,
    userInfo: app.userInfo,
    url: ''
  },
  onGotUserInfo: function (e){
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //定义
    var thar = this;
    //判断是否登录
    var user = app.getGllobalUserInfo();
    if (user) {
      //获取当前时间戳  
      var timestamp = Date.parse(new Date());
      var key = timestamp / 1000;
      var sign = Math.floor(Math.random() * 50 + 50);
      //连接key和sign为一个字符串
      var joinStr = key.toString() + sign;
      //1.把字符串分隔成数组
      var joinArr = joinStr.split("");
      //2.翻转数组
      var joinArrReverse = joinArr.reverse();
      //3.把翻转后的数组转为字符串并md5加密
      var token = hexMD5(joinArrReverse.join(""));
      var url = app.serverUrl + '/mobile/news/list?key=' + key + '&sign=' + sign + '&token=' + token + '&userId=' + user.id;
      
      thar.setData({
        userInfo: user,
        url: url
      });
    }
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
  phoneChange: function (e) {
    var thar = this;
    var phone = e.detail;
    if (!(/^1[23456789]\d{9}$/.test(phone))) {
      thar.setData({
        phoneErrorMessage: '手机号格式有误',
        isPhone: null
      });
    } else {
      thar.setData({
        phoneErrorMessage: '',
        phone: e.detail,
        isPhone: 1
      });
    }
  },

  //发送验证码按钮
  btnVerificationCode: function () {
    var thar = this;
    if (!thar.data.isPhone) {
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
      success(res) {
        if (res.data.code == 200) {
          Toast.success(res.data.msg);
        } else {
          Toast(res.data.msg);
        }
      },
      fail(res) {
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
        if (numVal == 0) {
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
  btnSms: function (e) {
    var thar = this;
    thar.setData({
      sms: e.detail
    });
  },
  //手机号登录按钮
  phoneLogin: function () {
    var thar = this;
    if (!thar.data.isPhone) {
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
      success(res) {
        if (res.data.code == 200) {
          thar.onClose();
          //把用户信息写到缓存中
          app.setGllobalUserInfo(res.data.data);
          thar.onLoad();
          Toast.clear();
        } else {
          Toast(res.data.msg);
        }
      },
      fail(res) {
        Notify('请求登录失败')
      }
    })
    Toast.clear();
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
    //定义
    var thar = this;
    //判断是否登录
    var user = app.getGllobalUserInfo();
    if (user) {
      thar.setData({
        userInfo: user
      });
    }
    thar.onLoad();
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