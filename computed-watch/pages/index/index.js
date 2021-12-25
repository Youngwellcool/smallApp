
const computedBehavior = require('miniprogram-computed')
import myBehavior from '../../utils/my-behavior.js'
Component({
  behaviors: [computedBehavior, myBehavior],
  data: {
    a: 1,
    b: 1,
    aa: 6,
    bb: 1,
  },
  computed: {
    sum(data) {
      console.log(data.myBehavior)
      return data.a + data.b
    },
  },
  watch: {
    'aa, bb': function(aa, bb) {
      this.setData({
        sum2: this.data.aa + this.data.bb
      })
    }
  },
  methods: {
    onLoad: function () { 
      console.log('页面onLoad了')
     },
    onShow: function () {
      console.log('页面onShow了')
    },
    onHide: function () {
      console.log('页面 onHide了')
    },
    tap() {
      this.setData({
        a: this.data.b,
        b: this.data.a + this.data.b
      })
      this.myFun();
    },

    taps() {
      this.setData({
        aa: this.data.bb,
        bb: this.data.aa + this.data.bb
      })
    },
  },
})