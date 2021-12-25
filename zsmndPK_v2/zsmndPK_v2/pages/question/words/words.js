// pages/question/words/words.js
var app = getApp();
var timer;//计时器
var order;//当前题目序号
var clickFlag = false;//是否选择答案按钮
Page({

  /**
   * 页面的初始数据
   */
  data: {
    letter: ['A', 'B', 'C', 'D'],
    countDownNum: '15',//倒计时初始值
    getImagePrefixHost: app.util.getImagePrefixHost(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(decodeURIComponent(options.data));
    order = parseInt(options.order);//当前题目序号
    this.setData({
      typeData: app.globalData.gradeArray,//成绩
      artTopicType: data.topic.art_topic_type,//题目类型
      artTopicName: data.topic.art_topic_name, 
      artTopicImg: data.topic.art_topic_type == 1 ? '' :data.topic.art_topic_img,
      artTopicContent: data.topic.art_topic_type== 2 ? '' : data.topic.art_topic_content,
      artAnswerContent: data.answers,
      order: order,
      answer: 0,//0代表默认未作答 1.答对 2打错
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

  //选择事件
  chooseAnswer: function (e) {
    console.log('---选中值：' + e.currentTarget.dataset.id)
    if (clickFlag== false){
      clearInterval(timer);//关闭定时器
      clickFlag = true;
      let data = { eid: app.globalData.eid, topictype: 2, tid: app.globalData.random[order - 1], sort: order, anid: e.currentTarget.dataset.id }
      app.util.getPort('/Upclasstwo/commitArtAnswer', data).then((res) => {
        console.log('---commitArtAnswer:' + JSON.stringify(res));//正确返回结果
        let arr = app.globalData.gradeArray;
        if (res.state === 1) {//正确
          arr[order - 1].answer = 1
        } else {//错误
          arr[order - 1].answer = 2
        }
        this.setData({
          answer: res.state,//答案是否正确
          artAnswerId: e.currentTarget.dataset.id,//选中的值
          correctAnswer: res.data,//正确答案值
        });
        app.globalData.gradeArray = arr;//更新答题成绩结果
        app.util.getTopic(app.globalData.havephone, order + 1);//下一道题
      }).catch((errMsg) => {
        console.log(errMsg);//错误提示信息
      });
  }

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
      if (countDownNum == 1 && clickFlag== false) {
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
    clearInterval(timer);//关闭定时器
    console.log('words页面卸载');
    if (!clickFlag) {
      //app.util.openAlert('您点击了返回');
      clickFlag=false;
      wx.reLaunch({
        url: '/pages/oneFixation/oneFixation',
      })
    } 
  },

})