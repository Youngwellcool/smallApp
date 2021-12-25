module.exports = Behavior({
  attached() {
    console.log('common.js的attached')
  },
  properties: {
    myComomon: String,
    iu: {
      type: Number,
      value: 10
    },
    
    
  },
  data: {
      commonData: 59
    },
  methods: {
    myCommonFun() {
      console.log('fun')
    },
  }

})