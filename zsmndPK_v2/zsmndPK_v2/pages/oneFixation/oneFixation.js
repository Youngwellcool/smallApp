var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'https://ysm.onedisme.com/dayimage/simulation/school_1.png', value: '1' },
      { name: 'https://ysm.onedisme.com/dayimage/simulation/school_2.png', value: '2' },
      { name: 'https://ysm.onedisme.com/dayimage/simulation/school_3.png', value: '3' },
      { name: 'https://ysm.onedisme.com/dayimage/simulation/school_4.png', value: '4' },
      { name: 'https://ysm.onedisme.com/dayimage/simulation/school_5.png', value: '5' },
    ]
  },

  /**
   * 选择事件
   */
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let addresscontent = app.globalData.addressComponent.province + app.globalData.addressComponent.city + app.globalData.addressComponent.district + app.globalData.addressComponent.street_number
    let data = { wx_unionid: app.globalData.userInfo.unionId, school: e.detail.value, sheng: app.globalData.addressComponent.province, addresscontent: addresscontent };
    app.util.getPort('/Upclasstwo/haveArtEvaluation', data).then((res) => {
      console.log('---login:' + JSON.stringify(res));//正确返回结果
      app.globalData.eid = res.data.eid;
      //题目序号缓存
      wx.setStorageSync('random', res.data.random);
      //测试 100录音题，129纯文字（答案图片），128纯文字（答案文字），33纯图片题，121文字图片题（答案文字），130文字图片题（答案图片），114纯音频题，131纯视频题
100, 129, 128, 33, 121, 130, 114, 131
      //wx.setStorageSync('random', "100, 129, 128, 33, 121, 130, 114, 131");


      let array = res.data.random.split(",")
      //每道题答题结果展示 100,129,128,33,121,130,114,131, 测试
      //let array = "100,129,128,33,121,130,114,131".split(",")

      //let arr = new Array();         //先声明一维
      var arr = []
      for (var i = 0; i < array.length; i++) {
       // arr[i] = new Array();    //在声明二维
        // arr[i][0] = array[i];
        // arr[i][1] = 0;
        //创建对象
        let topicAnswer = new Object();
        topicAnswer.num = array[i];
        topicAnswer.answer = 0;
        arr.push(topicAnswer);
      }

      //console.log(JSON.stringify(arr));
      //console.log(array);
      app.globalData.random = array;//题目序号
      app.globalData.gradeArray = arr;//成绩数组

      //跳转拍照题目
      wx.redirectTo({
        url: '../twoFixation/twoFixation?face=' + res.data.face,
      })
    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})