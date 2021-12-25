// pages/test/test.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgUrl: app.util.getImagePrefixHost() + '/dayimage/simulation/bg_1.jpg', //背景图片
    qrcodeUrl: app.util.getImagePrefixHost() + '/dayimage/simulation/qr_code.jpg', //二维码图片
    admission: app.util.getImagePrefixHost() + '/dayimage/simulation/admission.png', //录取通知
    previewHidden: false, //canvas绘制图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = { eid: 3966 }
    app.util.getPort('/Upclasstwo/haveArtResult', data).then((res) => {
      console.log('---haveArtResult:' + JSON.stringify(res));//正确返回结果
      if (res.state === 1) {
        let schoolName = this.schooltype(res.data.school);
        this.setData({
          faceimg: app.util.getImagePrefixHost() + '/' + res.data.faceimg,
          name: res.data.name,
          sex: res.data.sex,
          province: app.globalData.addressComponent.province,
          schoolName: schoolName,
        })
        this.canvaImg();//页面加载时绘画好界面
      } else {
        app.util.openToastFail('获取失败', false);
      }
    }).catch((errMsg) => {
      console.log(errMsg);//错误提示信息
    });
  },

  //保存分享图
  shareSave() {
    let _this = this;
    wx.showToast({ icon: 'loading', duration: 2000 });
    wx.getSetting({
      success(res) {
        console.log('执行到第一步', res)
        if (!res.authSetting['scope.writePhotosAlbum']) { //没有保存相册权限
          console.log('执行到第一步', res)
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log("2-授权《保存相册功能》权限成功", + +res);
              _this.setData({
                previewHidden: false
              }),
                // 用户已经同意小程序相册功能，后续调用 wx.saveImageToPhotosAlbum 接口不会弹窗询问
                _this.startSaveImage()
            },
            fail() {
              // 用户拒绝了授权  
              console.log("2-授权《保存相册功能》权限失败");
              // 打开设置页面  
              wx.openSetting({
                success: function (res) {
                  console.log("openSetting: success" + res);
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    //未设置录音授权
                    console.log("未设置保存相册");
                    wx.showToast({
                      title: '未设置保存相册授权',
                      icon: 'none'
                    })
                  }
                },
                fail: function (data) {
                  console.log("openSetting: fail");
                }
              });
            }

          })
        } else { //有保存相册权限
          console.log('1-已经授权《保存相册功能》权限')
          _this.startSaveImage()
        }
      }
    })
  },

  //保存图片至本地
  startSaveImage: function () {
    let that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 363,
      height: 650,
      destWidth: 363,
      destHeight: 650,
      canvasId: 'shareImg',
      success: function (res) {
        console.log(res)
        let tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        /* 这里 就可以显示之前写的 预览区域了 把生成的图片url给image的src */
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            console.log(res)
            wx.showModal({
              content: '图片已成功保存到相册',
              // showCancel: false,
              confirmColor: '#72B9C3',
              success: function (res) {
                if (res.confirm) {
                  setTimeout(function () {
                    that.setData({
                      previewHidden: false
                    })
                  }, 2000)
                }
              }
            })
          },
          fail(result) {
            wx.showToast({ title: '保存失败', })
          }
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  //绘图
  canvaImg() {
    let that = this;
    //保存长图功能中的canvas绘制图片
    // 绘制背景图片
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.bgUrl,
        success: function (res) {
          resolve(res);
        }
      })
    });

    // 绘制用户头像图片
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.faceimg,
        success: function (res) {
          resolve(res);
        }
      })
    });
    // 绘制录取通知图片
    let promise3 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.admission,
        success: function (res) {
          console.log(res.path)
          resolve(res);
        }
      })
    });

    // 绘制二维码图片
    let promise4 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: that.data.qrcodeUrl,
        success: function (res) {
          console.log(res.path)
          resolve(res);
        }
      })
    });

    Promise.all(
      [promise1, promise2, promise3, promise4]).then(res => {
        const ctx = wx.createCanvasContext('shareImg')
        //主要就是计算好各个图文的位置
        ctx.drawImage(res[0].path, 5, 0, 363, 489) //背景图
        ctx.drawImage(res[1].path, 68, 139, 79, 110) //用户头像图
        ctx.drawImage(res[2].path, 76, 257, 215, 65) //录取通知
        ctx.drawImage(res[3].path, 137, 330, 96, 96) //二维码图
        
        ctx.setTextAlign('left')
        ctx.setFillStyle('#333333'); //设置文本的颜色
        ctx.setFontSize(20)
        ctx.fillText('专业考试合格证书', 114, 65)
        ctx.setFontSize(15)
        ctx.fillText(that.data.schoolName + '2018年艺术类本科专业', 62, 100)
        ctx.setFontSize(13)
        ctx.fillText('姓名：' + that.data.name, 166, 169)
        ctx.setFontSize(13)
        ctx.fillText('性别：' + that.data.sex, 166, 196)
        ctx.setFontSize(13)
        ctx.fillText(that.data.province, 166, 221) //获取用户的省份
        ctx.stroke()
        ctx.draw(false, function (res) {
          console.log("绘制完成之后回调")
        })
      })
  },


  schooltype(n) {
    let schoolName = "";
    switch (n) {
      case 1: schoolName = "中国传媒"; break;
      case 2: schoolName = "上海戏剧"; break;
      case 3: schoolName = "北京电影"; break;
      case 4: schoolName = "浙江传媒"; break;
      default: schoolName = "中央戏剧";
    }
    return schoolName;
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