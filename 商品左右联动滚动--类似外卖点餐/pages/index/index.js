//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    currentScrollId:'',
    cp_index:0,
    leftTop:0,
    left_item_height:0,
    leftData:[
      {
        name:'菜品1',
        id:'cp1'
      },
      {
        name: '菜品2',
        id: 'cp2'
      },
      {
        name: '菜品3',
        id: 'cp3'
      },
      {
        name: '菜品4',
        id: 'cp4'
      },

      {
        name: '菜品5',
        id: 'cp5'
      },
      {
        name: '菜品6',
        id: 'cp6'
      },
      {
        name: '菜品7',
        id: 'cp7'
      },
      {
        name: '菜品8',
        id: 'cp8'
      },
      {
        name: '菜品9',
        id: 'cp9'
      },
      {
        name: '菜品10',
        id: 'cp10'
      },
      {
        name: '菜品11',
        id: 'cp11'
      },
      {
        name: '菜品12',
        id: 'cp12'
      }
    ],
    rightData: [
      {
        name: '菜品1',
        id: 'cp1',
        img:[
          '../../image/cp.jpg',
        ]
      },
      {
        name: '菜品2',
        id: 'cp2',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
        ]
      },
      {
        name: '菜品3',
        id: 'cp3',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
        ]
      },
      {
        name: '菜品4',
        id: 'cp4',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg'
        ]
      },

      {
        name: '菜品5',
        id: 'cp5',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg'
        ]
      },
      {
        name: '菜品6',
        id: 'cp6',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg'
        ]
      },
      {
        name: '菜品7',
        id: 'cp7',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg'
        ]
      },
      {
        name: '菜品8',
        id: 'cp8',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg'
        ]
      },
      {
        name: '菜品9',
        id: 'cp9',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg'
        ]
      },
      {
        name: '菜品10',
        id: 'cp10',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg'
        ]
      },
      {
        name: '菜品11',
        id: 'cp11',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg'
        ]
      },
      {
        name: '菜品12',
        id: 'cp12',
        img: [
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg',
          '../../image/cp.jpg'
        ]
      }
    ],

    heightArr:0,
    zindex:0,
    oneShow:true
  },
  onLoad:function(){

  },
  onReady:function(){
    var that=this;
    var h=0;
    var heightArr=[];
    wx.createSelectorQuery().select('.sc_left_item').boundingClientRect(function (rect) { //select会选择第一个类目的盒子
    }).exec(function (res) {
      that.setData({ left_item_height: res[0].height })
      
    });

    wx.createSelectorQuery().selectAll('.sc_right_item').boundingClientRect(function (rect) {//selectAll会选择所要含有该类名的盒子
    }).exec(function (res) {
       res[0].forEach((item)=>{
          h+=item.height;
          heightArr.push(h);
       })
      that.setData({heightArr:heightArr})
    })
  },

  leftTap:function(e){
    var index=e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    this.setData({ cp_index: index, currentScrollId:id})

  },

  bindscroll:function(e){
    var zindex = this.data.zindex;
    var oneShow=this.data.oneShow;
    let  scrollTop = e.detail.scrollTop;
    let  scrollArr = this.data.heightArr;
      for  (let  i = 0; i < scrollArr.length; i++) {
        if  (scrollTop >= 0  && scrollTop < scrollArr[0]) {
          if (oneShow){
          console.log('==============aaa'  + scrollTop + "=="  + scrollArr[0]);
          this.setData({
            cp_index: 0,
            leftTop: 0,
            zindex:0,
            oneShow:false
          })
          return
          }
        }  else  if  (scrollTop >= (scrollArr[i - 1]) && scrollTop < scrollArr[i]) {
          if (i != zindex){
            console.log('==============bbb' + i + scrollTop + "==" + scrollArr[i]);
          this.setData({
            oneShow: true,
            zindex:i,
            cp_index: i,
            leftTop: i * this.data.left_item_height
          })
          
        } 

    }
      }
  }
})
