Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {
      width: '654rpx',
      height: '600rpx',
      background: '#eee',
      views: [
        {
          type: 'rect',
          css: {
            top: '40rpx',
            left: '327rpx',
            color: 'rgba(255, 0, 0, 0.5)',
            width: '5rpx',
            height: '500rpx',
          },
        },
        {
          type: 'image',
          url: '/palette/avatar.jpg',
          css: {
            top: '40rpx',
            left: '327rpx',
            width: '100rpx',
            height: '100rpx',
          },
        },
        {
          type: 'qrcode',
          content: '/palette/avatar.jpg',
          css: {
            top: '180rpx',
            left: '327rpx',
            width: '120rpx',
            height: '120rpx',
          },
        },
        {
          type: 'text',
          text: "align: 'left' 或者不写",
          css: {
            top: '320rpx',
            left: '327rpx',
            fontSize: '30rpx',
          },
        },
        {
          type: 'text',
          text: "align: 'right'",
          css: {
            top: '370rpx',
            left: '327rpx',
            align: 'right',
            fontSize: '30rpx',
          },
        },
        {
          type: 'text',
          text: "align: 'center'",
          css: {
            top: '420rpx',
            left: '327rpx',
            align: 'center',
            fontSize: '30rpx',
          },
        },
        {
          type: 'text',
          text: "在多行的情况下，align 会影响内部 text 的对齐，比如这边设置 align: 'center'",
          css: {
            top: '480rpx',
            right: '327rpx',
            width: '400rpx',
            align: 'center',
            fontSize: '30rpx',
          },
        },
      ],
    },

    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'canvas转图片', //导航栏 中间的标题
      backAlert: 0, // 点击返回按钮是否弹出提示  1表示弹出    0表示不弹出
    },
  },

  onImgOK: function(e) {
    console.log(e)
    this.setData({
      imgUrl: e.detail.path,
    })
  },

/**
 * 下载图片
 */
  downLoad:function(e) {
    var that = this;
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.writePhotosAlbum'] == false) {
          wx.showModal({
            title: '提示',
            content: '是否授权将相册保存到相册？',
            confirmColor: '#2ca2ed',
            success: res => {
              //点击确定打开授权设置
              if (res.confirm) {

                wx.openSetting({
                  success: res => {
                    setTimeout(() => {
                      if (res.authSetting['scope.writePhotosAlbum'] == true) {
                        wx.saveImageToPhotosAlbum({
                          filePath: that.data.imgUrl,
                          success: res => {
                            wx.showToast({
                              title: '保存成功！',
                              icon: 'success',
                              mask: true
                            })
                          },
                          fail: err => {
                            wx.showToast({
                              title: '保存失败！',
                              icon: 'none',
                              mask: true
                            })
                          }
                        })

                      } else {
                        wx.showToast({
                          title: '保存失败！',
                          icon: 'none',
                          mask: true
                        })
                      }
                    }, 500)

                  }
                })

              }

            }
          })
        } else {

          wx.saveImageToPhotosAlbum({
            filePath: that.data.imgUrl,
            success: res => {
              wx.showToast({
                title: '保存成功！',
                icon: 'success',
                mask: true
              })
            }
          })

        }
      }
    })
  },

  toWeb: function(e) {
    wx.navigateTo({
      url: '../webview/webview?url=https://youshiyun.yx.yunjy.com.cn/content/detail/14220/4?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NTU3MjI4NTkyNzQsInBheWxvYWQiOiJ7XCJpZFwiOjExMDg3NTk5NSxcInVzZXJOYW1lXCI6XCJ5d3c2NjhcIixcInBob25lXCI6XCIxNTYxNjE4NDU3NVwiLFwibmFtZVwiOlwi5pyq55-lXCIsXCJkZXZpY2VDb2RlXCI6XCJ3ZWl4aW5cIn0ifQ.ITFgdGObAggBuLiNGNMuSgN-Ytrtv3s_MysZUTNUjYc&userId=110875995&deviceCode=weixin',
    })
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