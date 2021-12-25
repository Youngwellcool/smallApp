Component({

    /**
     * 自定义组件的属性值，由外面传入
     */
    properties: {
        msg: {
            type: String,
            value: 'hello component'
        }
    },
    /**
     * 自定义组件的内部值
     */
    data: {
        innerMsg: '我是自定义组件的内部值'
    },

    methods: {
        click(e) {
            console.log(1112222)
          console.log(e)
        },
    }


})