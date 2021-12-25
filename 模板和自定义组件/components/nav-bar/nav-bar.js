const app = getApp()
Component({
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    }
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    // 任务栏的高度   方便对齐
    this.setData({
      height: app.globalData.height || 20 // 任务栏高度来自app.js中取statusBarHeight的值，有些机型不兼容，拿不到statusBarHeight，这里给个默认值20
    })
  },
  // 监听父组件生命周期
  pageLifetimes: {
    show() {
      var pageNum = getCurrentPages().length;
      console.log(pageNum)
     
      this.setData({
        showBack: getCurrentPages().length > 1,  // 是否显示 返回 按钮
      })
      
    }
  },
  methods: {
    // 返回上一页面
    _navback() {
      console.log(this.data)
      if(this.data.navbarData.backAlert) {
        wx.showModal({
          title: '提示',
          content: '确定要退出该页面吗？',
          success: function(res) {
            if(res.confirm) {
              wx.navigateBack()
            }
          }
        })
      }else {
        wx.navigateBack()
      }
      
    },
    //返回到首页
    _backhome() {
      if (this.data.navbarData.backAlert) {
        wx.showModal({
          title: '提示',
          content: '确定要退出该页面吗？',
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
          }
        })
      } else {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }

      
    }
  }

}) 