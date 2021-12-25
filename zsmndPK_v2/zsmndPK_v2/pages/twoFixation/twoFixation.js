var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleimg: '',//表演的图片
    hidphoto: true //控制人脸识别拍照按钮显示或者隐藏
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let _this = this;
    console.log(option)
    _this.setData({
      face: option.face,
    })
  },

  //拍照提交照片
  photograph(res) {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        let photoPath = res.tempFilePaths[0];
        let data = { eid: app.globalData.eid,topictype: 1,}
        app.util.getUploadFile('/Upclasstwo/commitArtAnswer', photoPath, 'peopleimg', data).then((res) => {
          //console.log('---commitArtAnswer:' + JSON.stringify(res));//正确返回结果
          if (res.state === 1) {
            that.setData({
              photoPath: photoPath,//展示图片
              distinguish: res.data,//从后台获取的人脸识别成功的数据
              wx_name: app.globalData.userInfo.nickName,//微信昵称
              hidphoto: false,//控制人脸识别拍照按钮隐藏
              gender: res.data.gender >= 50 ? '男': '女'
            })

            //前面固定题答完进入随机选择题
             setTimeout(function () {
               app.util.getTopic(app.globalData.havephone,1);
            }, 3000) //延迟时间 这里是3秒

          } else {
            that.setData({
              hidphoto: true//控制人脸识别拍照按钮显示
            })
            wx.showToast({
              title: '请上传人物图片',
            })
          }
        }).catch((errMsg) => {
          console.log(errMsg);//错误提示信息
        });
      },
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