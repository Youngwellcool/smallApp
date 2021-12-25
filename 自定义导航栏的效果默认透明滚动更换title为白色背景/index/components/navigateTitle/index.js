var app = getApp()
Component({
  data: {
    statusBarHeight: '',
    titleBarHeight: '',
    isShowHome: false
  },
  properties: {
    //属性值可以在组件使用时指定
    isShow: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '青团社兼职'
    },
    isActive: {
      type: Boolean,
      value: false
    }
  },
  attached() {
    let pageContext = getCurrentPages()
    if (pageContext.length > 1) {
      this.setData({
        isShowHome: false
      })
    } else {
      this.setData({
        isShowHome: true
      })
    }
    this.setData({
      statusBarHeight: app.globalData.statusBarHeight,
      titleBarHeight: app.globalData.titleBarHeight
    })
    console.log(app.globalData.statusBarHeight)
    console.log(app.globalData.titleBarHeight)
  },
  methods: {}
})
