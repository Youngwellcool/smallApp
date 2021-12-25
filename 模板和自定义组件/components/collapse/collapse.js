Page({

    /**
     * 页面的初始数据
     */
    data: {
        current: '',
        should: 0,
        showPick: false, // 日期选择框是否打开了
        dateArray: ['2018-12-15', '2018-12-11', '2018-11-15']
    },



    // 画图
    drawCanvas() {
        var area = 2 * Math.PI * (this.data.should/100);
        // var area = 2 * Math.PI * (this.data.avgStudyPower/100);
        // 获取屏幕的宽度
        wx.getSystemInfo({
            success: (res) => {
                console.log(res.screenWidth)
                this.setData({
                    width: res.screenWidth
                })
            }
        })
        // 小程序屏幕宽固定为750rpx 1rpx=(screenWidth)/750 px
        var width = this.data.width
        // rpx和px之间的比例关系
        var unit = width / 750
        console.log(width, unit)
        // 页面渲染完成 开始绘图
        var ctx = wx.createCanvasContext('mycanvas')

        // 绘制环形的占比部分
        ctx.setLineWidth(40 * unit)

        ctx.setStrokeStyle('#E6E6E6')
        // ctx.setStrokeStyle(grd)
        ctx.setLineCap('round')
        // 开始新的路劲绘制弧度
        ctx.beginPath()
        // 这里的单位是弧度 角度需要转化 百分比  （底 圆圈）
        ctx.arc(200 * unit, 200 * unit, 160 * unit, area, Math.PI * 2, false)
        ctx.stroke()

        if(this.data.should) {
            // 开始创建一个路径 需要调用fill或者storke才会使用路径填充 多次以最后一次为准
            // 设置绘画线宽 单位是px
            ctx.setLineWidth(60 * unit)

            // 设置渐变色
            var grd = ctx.createLinearGradient(0, 0, 200, 0)
            // grd.addColorStop(0.3, '#2874F7')
            grd.addColorStop(0, '#2874F7')
            grd.addColorStop(1, '#4BA3D2')

            // 设置边框的颜色 先绘制灰色的底层
            // ctx.setStrokeStyle('#8280FF')
            ctx.setStrokeStyle(grd)
            // 设置线条的端点样式 butt round square
            ctx.setLineCap('round')
            ctx.beginPath()
            // 绘制弧线 x,y,r,sAngle,eAngle counterclockwise(默认顺时针) (已签到)
            ctx.arc(200 * unit, 200 * unit, unit * 160, 0, area, false)
            // 画出当前路径的边框 默认颜色是黑色 路径是从 beginPath() 开始计算 fill是填充
            ctx.stroke()
        }


        // 画到canvas中
        ctx.draw()
    },

    showDatePick: function(e) {
        console.log(e)
        this.setData({
            showPick: true,
        })
    },

    hideDatePick: function(e) {
        console.log(e)
        this.setData({
            showPick: false,
        })
    },
    pickeChange: function(e) {
        console.log(e)
        this.setData({
            showPick: false,
        })
    },

    toggleShow: function (e) {
        var index = +e.currentTarget.dataset.index;
        this.setData({
            current: this.data.current === index ? '' : index,
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
        this.drawCanvas();
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