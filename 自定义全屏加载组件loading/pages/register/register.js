// miniprogram/pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {
      company_name: '', // 公司名称
      province: '', // 省
      city: '', // 市
      area: '', // 区
      address: '', // 详细地址
      certificate: '', // 营业执照
      licence: '', // 开户许可证
      agreement: '', // 客户协议
      username: '', // 法人姓名
      legal_cert_no: '', // 法人身份证号码
      idcard_img_front: '', // 身份证正面照
      idcard_img_back: '', // 身份证背面照
      bank_img_front: '', // 结算银行卡正面
      bank_img_back: '', // 结算银行卡反面
      bank_account_no: '', // 银行账号
      bank_account_name: '', // 银行开户人
      cert_no: '', // 开户人身份证号码
      bank_type: '', // 开户银行
      bank_name: '', // 开户支行
      bank_province: '', // 银行所在省
      bank_city: '', // 银行所在市
      bank_area: '', // 银行所在区
      bank_telephone_no: '', // 银行预留手机号
      phone: '', // 手机号
      verify: '', // 验证码
      password1: '', // 密码
      password2: '', // 重复密码
    },

    bank_id: '', // 开户银行 id
    // 验证码相关
    isGet: false, // 避免重复发送
    time: 120, // 倒计时

    // 银行相关
    showBank: false,
    words: [],
    list: [],
    bank: {},
    searchList: [],
    bs: null,
    anchors: {},
    idxTop: 0,
    aH: 0,
    showCur: false,
    curTxt: '',
    // 支行相关
    showBranch: false,
    branchList: [],
    branchShList: [],
    val: '',
    openTy: '', // 选择银行 / 支行
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