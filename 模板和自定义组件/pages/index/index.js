//index.js
//获取应用实例
const app = getApp()
console.log(app)
Page({
    data: {
        show: false,
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        item: {
            index: 1,
            msg: '我是msgItem1122模板',
            time: '2018-12-03'
        },
        item2: {
            index: 1,
            msg: '我是msgItem2模板',
            time: '2018-12-05'
        },

        // 组件所需的参数
        nvabarData: {
            showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
            title: '我的主页', //导航栏 中间的标题
        },
        // 此页面 页面内容距最顶部的距离
        height: app.globalData.height * 2 + 20,

    },

    click() {
        console.log('click me ')
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
      const ctx = wx.createCanvasContext('pieCanvas')
      // ctx.setStrokeStyle('transparent')
      ctx.setFillStyle('red')
      ctx.fillRect(10, 10, 150, 75)
      ctx.setLineWidth(20);
      ctx.setStrokeStyle('transparent')
      ctx.strokeRect(180, 10, 5, 75)
      ctx.setFillStyle('#666')
      ctx.fillRect(170, 10, 150, 75)

      
      ctx.draw()

        this.getResouce();
        this.getActivityList();
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

        wx.getSystemInfo({
          success: (result) => {
              console.log(result)
          },
        })
        console.log('info后面')

        console.log(wx.getSystemInfoSync())
        console.log('sync后面')

        wx.getSystemInfoAsync({
          success: (result) => {
              console.log(result)
              console.log('async异步里面')
          },
          fail: (res) => {},
          complete: (res) => {},
        })

        console.log('async异步后面')
    },
    onShow: function() {
      console.info(166)
      console.log(166)
      wx.getLogManager()
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    getResouce() {
        app.api.getResource({
            page:1,
            limit:20,
            state:1,
        }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    },

    getActivityList() {
      app.api.getActivityList({page:1,isMy:1}).then(res => {
          console.log(res)
      }).catch(err => {
          console.log(err)
      })
    },


    showPopup: function (e) {
        var that = this;
        console.log(e);
        this.setData({
            show: !that.data.show,
        })
    },
    onClose: function (e) {
        var that = this;
        console.log(e);
        this.setData({
            show: !that.data.show,
        })
    },

    onPullDownRefresh: function (e) {
        console.log('下拉刷新');
        setTimeout(function () {
            wx.stopPullDownRefresh();
            console.log('停止')
        }, 2000)
    }
})
