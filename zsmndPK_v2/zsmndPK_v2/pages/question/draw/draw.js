// pages/question/draw/draw.js
var app = getApp();
var order;//当前题目序号
var dateStart;//开始时间
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pen: 3, //画笔粗细默认值
    color: '#cc0033', //画笔颜色默认值
    drawing: '', // 画画的图片
    getImagePrefixHost: app.util.getImagePrefixHost(),
  },

  // 提交
  submit:function(){
    wx.canvasToTempFilePath({
      x: 20,
      y: 20,
      width: 750,
      height: 500,
      destWidth: 750,
      destHeight: 500,
      fileType: 'png',
      canvasId: 'myCanvas',
      success: function (res) {
        console.log('----画板图片:' + res.tempFilePath);
        // 保存图片成功之后，上传图片
        var dateEnd = new Date();    //结束时间
        var ptime = (dateEnd.getTime() - dateStart.getTime())/1000  //时间差的毫秒数
        let data = { eid: app.globalData.eid, topictype: 2, tid: app.globalData.random[order - 1], sort: order, ptime: ptime }
        console.log(data);
        app.util.getUploadFile('/Upclasstwo/commitArtAnswer', res.tempFilePath, 'drawing', data).then((res) => {
          console.log('---commitArtAnswer:' + JSON.stringify(res));//正确返回结果
          let arr = app.globalData.gradeArray;
          if (res.state === 1) {//正确
            arr[order - 1].answer = 1
          } else {//错误
            arr[order - 1].answer = 2
          }
          app.globalData.gradeArray = arr;//更新答题成绩结果
          app.util.getTopic(app.globalData.havephone,order + 1);//下一道题
        }).catch((errMsg) => {
          console.log(errMsg);//错误提示信息
        });

      }
    })
  },

  // 画画
  startX: 0, //保存X坐标轴变量
  startY: 0, //保存Y坐标轴变量
  isClear: false, //是否启用橡皮擦标记
  //手指触摸动作开始
  touchStart: function (e) {
    //得到触摸点的坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    this.context = wx.createContext()

    if (this.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
      this.context.setStrokeStyle('#FFFFFF') //设置线条样式 此处设置为画布的背景颜色  橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果
      this.context.setLineCap('round') //设置线条端点的样式
      this.context.setLineJoin('round') //设置两线相交处的样式
      this.context.setLineWidth(20) //设置线条宽度
      this.context.save(); //保存当前坐标轴的缩放、旋转、平移信息
      this.context.beginPath() //开始一个路径 
      this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true); //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形 
      this.context.fill(); //对当前路径进行填充
      this.context.restore(); //恢复之前保存过的坐标轴的缩放、旋转、平移信息
    } else {
      this.context.setStrokeStyle(this.data.color) //画笔绘画的颜色
      this.context.setLineWidth(this.data.pen) //画笔的大小
      this.context.setLineCap('round') // 让线条圆润 
      this.context.beginPath()

    }
  },
  //手指触摸后移动
  touchMove: function (e) {
    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y

    if (this.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画

      this.context.save(); //保存当前坐标轴的缩放、旋转、平移信息
      this.context.moveTo(this.startX, this.startY); //把路径移动到画布中的指定点，但不创建线条
      this.context.lineTo(startX1, startY1); //添加一个新点，然后在画布中创建从该点到最后指定点的线条
      this.context.stroke(); //对当前路径进行描边
      this.context.restore() //恢复之前保存过的坐标轴的缩放、旋转、平移信息

      this.startX = startX1;
      this.startY = startY1;

    } else {
      this.context.moveTo(this.startX, this.startY)
      this.context.lineTo(startX1, startY1)
      this.context.stroke()

      this.startX = startX1;
      this.startY = startY1;

    }
    //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
    wx.drawCanvas({
      canvasId: 'myCanvas',
      reserve: true,
      actions: this.context.getActions() // 获取绘图动作数组
    })
  },
  //手指触摸动作结束
  touchEnd: function () {

  },
  //启动橡皮擦方法
  clearCanvas: function () {
    if (this.isClear) {
      this.isClear = false;
    } else {
      this.isClear = true;
    }
  },
  penSelect: function (e) { //更改画笔大小的方法
    this.setData({
      pen: parseInt(e.currentTarget.dataset.param)
    });
    this.isClear = false;
  },
  colorSelect: function (e) { //更改画笔颜色的方法
    this.setData({
      color: e.currentTarget.dataset.param
    });
    this.isClear = false;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(decodeURIComponent(options.data));
    order = parseInt(options.order);//当前题目序号
    this.setData({
      typeData: app.globalData.gradeArray,//成绩
      artTopicName: data.topic.art_topic_name,
      order: order,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     dateStart = new Date();  //开始时间
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