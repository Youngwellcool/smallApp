const app = getApp();
var interval = null //倒计时函数
import WxValidate from '../../utils/WxValidate.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    validateCode: '',
    time: '获取验证码', //倒计时 
    currentTime: 61,
  },

  //验证码倒计时
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒',
        btnBg: '#AAAAAA',//按钮颜色变灰色
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          btnBg: '',//按钮原来的颜色
          time: '重新发送',
          currentTime: 61,
          disabled: false,
          buttonClicked: false
        })
      }
    }, 1000)
  },

  // 获取用户输入的手机号
  cellphone(res) {
    var that = this;
    that.setData({
      phone: res.detail.value
    });
  },

  // 获取用户输入的验证码
  getValidateCode(res) {
    var that = this;
    that.setData({
      validateCode: res.detail.value,
      buttonClicked: true
    });
  },

/**
* 发送验证码
*/
  identifying: function () {
    var that = this
    if (that.data.phone.length === 0) {
      app.util.openToastSuccess('手机号不能为空', false);
      return;
    }
    that.getCode();//倒计时开始
    that.setData({
      disabled: true
    })
    let data = { phone: that.data.phone, sign: '真实模拟艺考大PK' }
    app.util.getPort('/Sms/sendSms', data).then((res) => {
      //console.log('---login:' + JSON.stringify(res));//正确返回结果
      if (res.state == 1) {
        app.util.openToastSuccess('验证码发送成功', false);
      } else {
        app.util.openToastFail('验证码发送失败', false);
      }
    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //(先初始化表单)
    this.initValidate();
  },

  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },

  //验证函数
  initValidate: function () {
    const rules = {
      phone: {
        required: true,
        tel: true
      },
      regcode: {
        required: true,
        minlength: 6
      }
    }
    const messages = {
      phone: {
        required: '请填写手机号',
        tel: '请填写正确的手机号'
      },
      regcode: {
        required: '请填写验证码',
        minlength: '请输入6位数'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },

  //调用验证函数查看成绩
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带的数据为：', e.detail.value)
    const params = e.detail.value
    //校验表单
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    //先绑定手机号码在获取成绩记录单
    let data = { phone: e.detail.value.phone, code: e.detail.value.regcode, wx_unionid: app.globalData.userInfo.unionId}
    app.util.getPort('/Student/arttwoHavePhone', data).then((res) => {
      //console.log('---login:' + JSON.stringify(res));//正确返回结果
      if (res.state === 1) {
        app.globalData.havephone = res.state;
        //获取成绩记录单
        wx.redirectTo({
          url: '../certificat/certificat',
        })
      } else {
        app.util.openToastFail('绑定失败', false);
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