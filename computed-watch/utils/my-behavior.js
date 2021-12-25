/**
 * 定义一个behavior，相当于vue中的mixins
 */

module.exports = Behavior({
  data: {
    myBehavior: 'mixins',
    name: 'Youngwell'
  },
  created() {
    console.log('behavior created')
  },
  attached() {
    console.log('behavior attached')
    console.log(this.data.aa)  // 可以访问引用其heavior的父页面的data
    this.tap()  // 可以访问引用其heavior的父页面的方法
  }, 
  ready() {
    console.log('behavior ready')
  },
  methods: {
    myFun() {
      console.log(this.data.name)
    },
  }
})