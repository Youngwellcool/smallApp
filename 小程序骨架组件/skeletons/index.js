Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selector: {
      type: String,
      value: 'skeletons'
    },
    background: {
      type: String,
      value: '#FFF'
    },
    skt_animation: {
      type: String,
      value: 'shine'
    },
    isNodes: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        if (newVal) {
          this.rectList = this.getSelector(`.${this.selector}-rect`);
          this.circleList = this.getSelector(`.${this.selector}-circle`);
          // 捕获节点后关闭加载动效
          this.setData({
            isLoading: false
          }, () => {
            ['rectList', 'circleList'].forEach((name) => {
              this.drawNodes(name, this[name]);
            })
          })
        }
      }
    },
    isComplete: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        if (newVal) {
          setTimeout(() => {
            console.log('隐藏关闭组件');
            this.setData({
              visible: false
            }, () => {
              setTimeout(() => {
                this.setData({
                  visible: false
                })
              }, 1000)
            })
          }, 1000)
        }
      }
    }
  },
  data: {
    visible: true, //组件展示
    rectList: [],
    circleList: [],
    isLoading: true,
    systemInfo: {
      height: 0,
      width: 0,
      top: 0,
      left: 0
    }
  },
  attached() {
    this.setData({
      'systemInfo.width': wx.getSystemInfoSync().windowWidth,
      'systemInfo.height': wx.getSystemInfoSync().windowHeight
    })
    this.selector = this.data.selector
  },
  ready() {
    this.getSelector(`.${this.selector}`).boundingClientRect().exec((res) => {
      if (res[0][0]) {
        const {
          top,
          left
        } = res[0][0];
        const systemInfo = Object.assign(this.data.systemInfo, {
          top,
          left
        })
        this.setData({
          systemInfo
        })
      }
    })
  },
  methods: {
    getSelector: (name) => wx.createSelectorQuery().selectAll(name),
    drawNodes(name, selector) {
      selector.boundingClientRect().exec((res) => {
        this.setData({
          [name]: res[0].filter(todo => todo.top <= this.data.systemInfo.height)
        })
      })
    }
  }
})
