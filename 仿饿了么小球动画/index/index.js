const app = getApp()

Page({
  data: {
    hide_good_box: true,
    count:1
  },
  onLoad: function () {
    console.log(1)
    this.busPos = {};
    this.busPos['x'] = app.globalData.ww * 0.8;
    this.busPos['y'] = app.globalData.hh * 0.1;
  },
  touchOnGoods: function (e) {
    // 如果good_box正在运动
    if (!this.data.hide_good_box) return;
    this.finger = {};
    var topPoint = {};
    this.finger['x'] = e.touches["0"].clientX;
    this.finger['y'] = e.touches["0"].clientY;
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2 + this.finger['x'];
    console.log(this.finger) //触摸点坐标
    console.log(topPoint)  // 最高点坐标
    console.log(this.busPos)  // 终点坐标
    this.linePos = app.bezier([this.finger, topPoint, this.busPos], 30);
    this.startAnimation();
  },
  startAnimation: function () {
    var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'];
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    this.timer = setInterval(function () {
      index++;
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      if (index >= 28) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true,
          hideCount: false,
          count: that.data.count += 1
        })
      }
    }, 33);
  },

})
