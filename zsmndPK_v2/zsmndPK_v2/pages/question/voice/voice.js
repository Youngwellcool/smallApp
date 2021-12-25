// pages/question/voice/voice.js
var app = getApp();
var timer;//计时器
const recorderManager = wx.getRecorderManager(); //获取全局唯一的录音管理器
var order;//当前题目序号
var clickFlag = false;//是否选择答案按钮
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDownNum: '15',//倒计时初始值
    isTheSame: false, // 是否仍旧是当前的题目
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('--' + JSON.parse(decodeURIComponent(options.data)));
    let data = JSON.parse(decodeURIComponent(options.data));
    order = parseInt(options.order);//当前题目序号
    this.setData({
      typeData: app.globalData.gradeArray,//成绩
      artTopicName: data.topic.art_topic_name,
      artTopicContent: data.topic.art_topic_content,
      order: order,
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
    //什么时候触发倒计时，就在什么地方调用这个函数
    this.countDown();
  },

  //手指触摸动作开始
  voice_Touchstart: function (e) {
    let _this = this;
    if (_this.data.isTheSame) { //防止重复按
      return;
    }
    //e.timeStamp; //按压的开始时间
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope  保存到录音功能
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          console.log("1-没有授权《录音功能》权限");
          // 接口调用询问  
          wx.authorize({
            scope: 'scope.record',
            success() {
              console.log("2-授权《录音功能》权限成功");
              _this.start(); //调用开始录音方法
            },
            fail() {
              // 用户拒绝了授权  
              console.log("2-授权《录音功能》权限失败");
              // 打开设置页面  
              wx.openSetting({
                success: function (res) {
                  console.log("openSetting: success" + res);
                  if (!res.authSetting['scope.record']) {
                    //未设置录音授权
                    console.log("未设置录音授权");
                    app.util.openToastFail('未设置录音授权,无法答题',true);
                  }
                },
                fail: function (data) {
                  console.log("openSetting: fail");
                }
              });
            }
          })
        } else {
          console.log("1-已经授权《录音功能》权限");
          _this.start(); //调用开始录音方法
        }
      }

    })
  },

  //手指触摸动作结束
  voice_Touchend: function (e) {
    let _this = this;
    //_this.endTime = e.timeStamp; //按压的结束时间
    _this.stop() //调用停止录音方法
  },

  /**
 * 录音
 */
  // 开始录音的时候
  start: function () {
    const options = {
      duration: 10000, //指定录音的时长，单位 ms
      sampleRate: 16000, //采样率
      numberOfChannels: 1, //录音通道数
      encodeBitRate: 96000, //编码码率
      format: 'mp3', //音频格式，有效值 aac/mp3
      frameSize: 50, //指定帧大小，单位 KB
      audioSource: 'auto'
    }
    this.setData({
      isTheSame: true //防止重复提交
    });
    //开始录音
    wx.showLoading({ title: '正在录音'})
    recorderManager.start(options);
    recorderManager.onStart(() => { });
    //错误回调
    recorderManager.onError((res) => {
      console.log('----' + JSON.stringify(res));
      app.util.openToastFail('录音失败!', true);
      this.setData({
        isTheSame: false
      });
      clickFlag = true;
      // 台式机没办法录音，便于台式电脑的调试直接跳转下一道题目
      // clearInterval(this.data.timer);//关闭定时器
      // let arr = app.globalData.gradeArray;
      // arr[order - 1].answer = 2
      // app.globalData.gradeArray = arr;//更新答题成绩结果
      // app.util.getTopic(app.globalData.havephone,order + 1);//下一道题
    })
  },

  //停止录音
  stop: function () {
    let _this = this;
    recorderManager.stop();
    // 停止录音时保存录音文件路径
    recorderManager.onStop((res) => {
      console.log('停止录音', res.tempFilePath)
      clearInterval(timer);//关闭定时器
      _this.setData({
        countDownNum: _this.data.countDownNum
      })
      wx.hideLoading();
      let data = { eid: app.globalData.eid, topictype: 2, tid: app.globalData.random[order-1], sort: order}
      console.log(data);
      app.util.getUploadFile('/Upclasstwo/commitArtAnswer', res.tempFilePath, 'voice', data).then((res) => {
        console.log('---commitArtAnswer:' + JSON.stringify(res));//正确返回结果
        let arr= app.globalData.gradeArray;
         if (res.state === 1) {//正确
           arr[order - 1].answer =1
         } else {//错误
           arr[order - 1].answer =2
         }
        clickFlag = true;
        app.globalData.gradeArray = arr;//更新答题成绩结果
        app.util.getTopic(app.globalData.havephone,order+1);//下一道题
      }).catch((errMsg) => {
        _this.setData({
          isTheSame: false
        });
        app.util.openToastFail('录音失败，请重试!', true);
        console.log(errMsg);//错误提示信息
      });
    })
  },

  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    clickFlag = false;//初始化是否选择值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    timer = setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
      //每隔一秒countDownNum就减一，实现同步
      countDownNum--;
      //然后把countDownNum存进data，好让用户知道时间在倒计着
      that.setData({
        countDownNum: countDownNum
      })
      //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
      if (countDownNum == 1) {
        //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
        //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
        //关闭定时器之后，可作其他处理codes go here
        clickFlag = true;
        let arr = app.globalData.gradeArray;
        arr[order - 1].answer = 2
        app.globalData.gradeArray = arr;//更新答题成绩结果
        app.util.getTopic(app.globalData.havephone, order + 1);//下一道题
      }
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(timer);//关闭定时器
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('voice页面卸载' + timer);
    clearInterval(timer);//关闭定时器
    if (!clickFlag) {
      //app.util.openAlert('您点击了返回');
      clickFlag = false;
      wx.reLaunch({
        url: '/pages/oneFixation/oneFixation',
      })
    } 
  },

})