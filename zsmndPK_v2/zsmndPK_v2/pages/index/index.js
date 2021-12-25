//获取应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          console.log("1-没有授权《地理位置》权限");
          // 接口调用询问  
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log("2-授权《地理位置》权限成功");
              //获取地理位置信息
              that.getLocation();
            },
            fail() {// 用户拒绝了授权  
              console.log("2-授权《地理位置》权限失败");
              // 打开设置页面  
              wx.openSetting({
                success: function (res) {
                  console.log("openSetting: success" + res);
                  if (!res.authSetting['scope.userLocation']) {
                    app.util.openToastFail('未设置地理位置授权',false);
                  }else{
                    that.getLocation();
                  }
                },
                fail: function (data) {
                  console.log("openSetting: fail");
                }
              });
            }
          })
        } else {
          console.log("1-已经授权《地理位置》权限");
          that.getLocation();
        }
      }

    })
  },

  //获取地理位置信息
  getLocation : function(){
    app.util.getLocation(function (format, res) {
      console.log('地理位置解析:' + JSON.stringify(format));
      app.globalData.addressComponent = format;
    });
  },

  onGotUserInfo: function (e) {
    if (e.detail.userInfo) {//用户同意授权
      console.log(e.detail.userInfo)
      this.getUserInfo();
    } else {//用户拒绝授权
      app.util.openAlert('您点击了拒绝授权，将无法进入模拟考试');
    }
  },

  //全国艺考排名榜
  ranking: function (res) {
    let that = this;
     wx.navigateTo({
       url: '../rankingList/rankingList',
     })
    //测试画板 wx.navigateTo({
    //   url: '../test/test',
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },


  //用户授权信息
  getUserInfo: function () {
    let _that = this;
    wx.login({
      success: res => {
        //调用 app.js里的 post()方法
        app.util.getPort('/haveArttwoUnionid', { code: res.code }).then((res) => {
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
      },
    })
  },

  //解密
  getEncryptedData: function (sessionkey, encryptedData, iv) {
    let _that = this;
    let data = { sessionkey: sessionkey, encryptedData: encryptedData, iv: iv };
    app.util.getPort('/Student/arttwoHaveWxInfo', data).then((res) => {
      console.log('---解密:' + JSON.stringify(res));
      app.globalData.userInfo = res.data;
      _that.getUserRole();
    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });
  },

  //保存微信用户信息
  getUserRole: function () {
    let _that = this;
    //用戶授權登陸 獲取微信登录接口返回用户ID标识绑定了手机号码，否则未绑定
    let data = { wx_unionid: app.globalData.userInfo.unionId, wx_name: app.globalData.userInfo.nickName, wx_header: app.globalData.userInfo.avatarUrl, wx_openid: app.globalData.userInfo.openId, wx_city: app.globalData.userInfo.city, wx_province: app.globalData.userInfo.province, wx_country: app.globalData.userInfo.country }
    app.util.getPort('/Student/arttwoSetUser', data).then((res) => {
      console.log('---getUserRole:' + JSON.stringify(res));
      app.globalData.havephone = res.data.havephone;//是否绑定手机号码
      
      if (!app.globalData.addressComponent) {
        app.util.openAlert('您点击了拒绝授权地理位置，将无法进入模拟考试');
        return false;
      }else{
        //TODO 测试
        wx.redirectTo({//跳转开始做题页面
          url: '/pages/oneFixation/oneFixation',
        })
      }
    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });

  }

})