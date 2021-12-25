//app.js
/**
 * 初始化整个app项目，获取用户身份
 */
const util = require("./utils/util.js");
App({
  onLaunch: function () {
    //全局添加 util中的方法
    this.util = util;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];

    // 查看是否授权(作废,在开始模拟考试界面做用户授权，因为不管是否授权都进入首页)
    //this.getUserInfo();

  },
  //用户授权信息
  getUserInfo: function () {
    let _that = this;
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log('---已经授权app');
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.login({
            success: res => {
              //console.log('---' + JSON.stringify(res));
              _that.util.getPort('/haveArttwoUnionid', { code: res.code }).then((res) => {
                //console.log('---login:' + JSON.stringify(res));//正确返回结果
                let session_key = res.data.session_key;
                wx.getUserInfo({
                  success: function (res) {
                    //console.log(res)
                    //解密
                    _that.getEncryptedData(session_key, res.encryptedData, res.iv);
                  }
                })
              }).catch((errMsg) => {
                console.log(errMsg);//错误提示信息
              });
            }, fail: e => {
              console.log('调用失败！' + e);
            }
          })
        } else {
          //没有授权,则跳转开始页面,点击开始按钮时在授权
          // wx.navigateTo({
          //   'url': '/pages/index/index'
          // })
        }
      }
    })
  },
 
  //解密
  getEncryptedData: function (sessionkey, encryptedData, iv) {
    let _that = this;
    let data = { sessionkey: sessionkey, encryptedData: encryptedData, iv: iv };
    _that.util.getPort('/Student/arttwoHaveWxInfo', data).then((res) => {
      //console.log('---解密:' + JSON.stringify(res.data));
      _that.globalData.userInfo = res.data;
      _that.getUserRole();
    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });
  },

  //用户登录获取token，再本地保存微信用户信息并且
  getUserRole: function () {
    let _that = this;
    //用戶授權登陸 獲取微信 token保持至全局变量，登录接口返回用户ID标识绑定了手机号码，否则未绑定
    let data = { wx_unionid: _that.globalData.userInfo.unionId, wx_name: _that.globalData.userInfo.nickName, wx_header: _that.globalData.userInfo.avatarUrl, wx_openid: _that.globalData.userInfo.openId, wx_city: _that.globalData.userInfo.city, wx_province: _that.globalData.userInfo.province, wx_country: _that.globalData.userInfo.country }
    _that.util.getPort('/Student/arttwoSetUser', data).then((res) => {
      //console.log('---getUserRole:' + JSON.stringify(res));

      _that.globalData.havephone = res.data.havephone;//是否绑定手机号码
      wx.redirectTo({//跳转开始首页
        url: '/pages/index/index',
      })

    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });
  },


  onShow: function () {
    console.log('生命周期回调—监听小程序显示');
  },

  
  onHide: function () {
    //生命周期回调—监听小程序隐藏 当用户点击左上角关闭，或者按了设备 Home 键离开微信，小程序并没有直接销毁，而是进入了后台
    console.log('生命周期回调—监听小程序隐藏');
  },


  globalData: {
    userInfo: null,
    havephone: 0,//0为未绑定手机，1为已绑定手机
    addressComponent:null,//地理位置信息
    eid:null,//记录单号
    random:null,//题目序号
    gradeArray: null,//成绩展示 [{ num: "1", answer: 1 }, { num: "1", answer: 2 }] num代表题目数量，answer等于0未做题 answer等于1：对 answer等于2 错
  }
})