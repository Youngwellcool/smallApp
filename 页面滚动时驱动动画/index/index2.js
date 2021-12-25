Component({
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    left: wx.getSystemInfoSync().windowWidth - 17,
    menuList: [{
      title: '海底捞（xxxx）',
      distance: Math.floor(1000 * Math.random()),
    }, {
      title: '北京烤鸭（xxxx）',
      distance: Math.floor(1000 * Math.random()),
    }, {
      title: '海底捞（xxxx）',
      distance: Math.floor(1000 * Math.random()),
    },{
      title: '北京烤鸭（xxxx）',
      distance: Math.floor(1000 * Math.random()),
    }, ],
  },
  pageLifetimes: {
    show() {
      if (this._lastScrollLeft > 210 * this.data.menuList.length - wx.getSystemInfoSync().windowWidth) {
        this.setData({
          scrollLeft: 210 * this.data.menuList.length - wx.getSystemInfoSync().windowWidth,
        })
      }
    },
  },
  ready() {
    this._animate()
  },
  methods: {
    _animate() {
      this.animate('.search_input', [{
        opacity: '0',
        width: '0%',
      }, {
        opacity: '1',
        width: '100%',
      }], 1000, {
        scrollSource: '#scroller',
        timeRange: 1000,
        startScrollOffset: 120,
        endScrollOffset: 252
      })
      
      
      wx.createSelectorQuery().select('#scroller').fields({
        scrollOffset: true,
        size: true,
      }, (res) => {
        this.animate('.avatar', [{
          borderRadius: '0',
          borderColor: 'red',
          transform: 'scale(1) translateY(-20px)',
          offset: 0,
        }, {
          borderRadius: '25%',
          borderColor: 'blue',
          transform: 'scale(.65) translateY(-20px)',
          offset: .5,
        }, {
          borderRadius: '50%',
          borderColor: 'blue',
          transform: `scale(.3) translateY(-20px)`,
          offset: 1
        }], 2000, {
          scrollSource: '#scroller',
          timeRange: 2000,
          startScrollOffset: 0,
          endScrollOffset: 85,
        })

        this.animate('.nickname', [{
          transform: 'translateY(0)',
        }, {
          transform: `translateY(${-44 - this.data.statusBarHeight}px)`,
        }], 1000, {
          scrollSource: '#scroller',
          timeRange: 1000,
          startScrollOffset: 120,
          endScrollOffset: 200,
        })

       

        this.animate('.search_icon', [{
          right: '0',
          transform: 'scale(1)',
        }, {
          right: (wx.getSystemInfoSync().windowWidth * .5 - 20) + 'px',
          transform: 'scale(.6)',
        }], 1000, {
          scrollSource: '#scroller',
          timeRange: 1000,
          startScrollOffset: 140,
          endScrollOffset: 252,
        })
      }).exec()

      wx.createSelectorQuery().select("#scroller2").fields({
        scrollOffset: true,
        size: true,
      }, (res) => {
        console.log(res)
        // 绑定滚动元素
        const scrollTimeline = {
          scrollSource: '#scroller2',
          orientation: 'horizontal',
          timeRange: 1000,
          startScrollOffset: (210 * this.data.menuList.length - res.width) + 20,
          endScrollOffset: res.scrollWidth - res.width,
        }
        this.animate('#transform', [{
          offset: 0,
          width: '0px',
        }, {
          offset: 1,
          width: '30px',
        }], 1000, scrollTimeline)
      }).exec()
    },
    scroll(e) {
      if (e.detail.scrollLeft + wx.getSystemInfoSync().windowWidth + 3 >= e.detail.scrollWidth) {
        if (e.detail.deltaX < 0 && !this._active) {
          this._active = true
          this.setData({wording: '释放跳转'})
          wx.vibrateShort()
        } else if (e.detail.deltaX > 0) {
          this._active = false
          this.setData({ wording: '查看更多' })
        }
      } else {
        this._active = false
      }
      this._lastScrollLeft = e.detail.scrollLeft
      clearTimeout(this._timer)
    },
    touchend() {
      clearTimeout(this._timer)
      if (this._active) {
        wx.navigateTo({
          url: '/second/index',
        })
        this._active = false
      } else if (this._lastScrollLeft > 210 * this.data.menuList.length - wx.getSystemInfoSync().windowWidth) {
        this.setData({
          scrollLeft: 210 * this.data.menuList.length - wx.getSystemInfoSync().windowWidth,
        })
      }
    }
  },
})

