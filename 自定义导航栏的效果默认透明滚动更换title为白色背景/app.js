App({
  onLaunch: function() {
    console.log(wx.getMenuButtonBoundingClientRect())
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        let totalTopHeight = wx.getMenuButtonBoundingClientRect().bottom + wx.getMenuButtonBoundingClientRect().top
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight * 2
      },
      fail: () => {
        this.globalData.statusBarHeight = 20
        this.globalData.titleBarHeight = 44
      }
    })
  },
  globalData: {}
})