/* 组件 custom-component.js */
Component({
  externalClasses: ['my-class'],
  lifetimes: {
    ready: 'geta',
  },
  
  methods: {
    geta() {
      console.log('fdsfsda')
    },
  }
})