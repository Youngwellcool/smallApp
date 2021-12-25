import Behaviors from '../common.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    paramsA: {
      type: null
    }
  },

  behaviors: [Behaviors],

  lifetimes: {
    attached() {
      console.info('页面的attached')
      console.log(this)
      
    },
    ready() {
      console.log('ready')
      this.myCommonFun()
    },
  },

  pageLifetimes: {
    onShow() {
      console.log('pageonShow')
    },
  },

  ready() {
    console.log('外面的ready')
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad(options) {
      console.log(options)
    },
    onShow() {
      console.log('页面onShow')
    },
     /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      console.log('onReady')
    },


    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      console.log('onHide')
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
      console.log('下拉')
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('到底了')
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let {detail} = this.data;
        return {
            title: `发噶啥发大水发`,
            imageUrl: 'https://yunjy-oss.oss-cn-shenzhen.aliyuncs.com/common/resource/image/mini/intro.png',
        }
    }
  }
})
