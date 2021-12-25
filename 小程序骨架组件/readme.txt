# skeletons
应用案例详情见 D/工作/优师云online2.0 --- 首页


#### 介绍
小程序骨架屏实现方案, 比较建议长列表使用骨架屏。


#### 快速上手

//index.json
//引入骨架屏组件
```
{
  "usingComponents": {
    "skeletons": "/component/skeletons/index"
  }
}
```
//在对应的 wxml文件内添加
在需要设置骨架的矩形元素上添加class=skeletons-rect，在需要设置骨架的圆形的元素上添加skeletons-circle
```
<skeletons isNodes="{{isNodes}}" isComplete="{{isComplete}}" />
```
//JS中操作：
```
  initData() {
    let postData = {
        townId: wx.getStorageSync('townId') || 87
    }
    // 初始化请求第一个接口
    app.postAjax('https://url.com', postData).then((res) => {
      if (res.success) {
        this.setData({
          bodyData: res.data,  //页面展示数据的大对象
          isNodes: true //抓取节点绘制骨架屏
        }, () => {
          this.setData({
            isComplete: true  //节点绘制完成，隐藏骨架屏
          })
        })
      } else {
        util.toast(res.msg || '团团开小差啦，请稍后重试')
      }
    }, () => {
      util.toast('团团开小差啦，请稍后重试')
    })
  },
```

#### 属性

![属性](https://images.gitee.com/uploads/images/2019/0928/110655_4ef6d5a1_744578.png "屏幕截图.png")

