var app = getApp();
var x, y, x1, y1, x2, y2, index, currindex, n, yy;
var arr1 = [{ content:
    11, id: 1 }, { content:
    22, id: 2 }, { content:
    33, id: 3 }, { content:
    44, id: 4 },
    { content: 55, id:
        5 }];
Page({
    data: {
        mainx: 0,
        content: [
            { content: 11, id: 1 },
            { content: 22, id: 2 },
            { content: 33, id: 3 },
            { content: 44, id: 4 },
            { content: 55, id: 5 }],
        start: { x: 0, y: 0 },

        width: '',
        height: ''
    },
    add() {
        console.log('add')
        var arr = this.data.content;
        arr.push({content: 66, id: 6})
        this.setData({
            content: arr
        })
        arr1 = arr;

    },
    movestart: function (e) {
        console.log(e)
        currindex = e.target.dataset.index;  // 当前正在移动的块 的index
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
        x1 = e.currentTarget.offsetLeft;
        y1 = e.currentTarget.offsetTop;
    },
    move: function (e) {
        yy = e.currentTarget.offsetTop;
        x2 = e.touches[0].clientX - x + x1; // 实时移动的offset x
        y2 = e.touches[0].clientY - y + y1; // 实时移动的offset y
        this.setData({
            mainx: currindex,  // 当前正在移动的块 的index
            opacity: 0.7,
            start: { x: x2, y: y2 }
        })
    },
    moveend: function () {
        if (y2 != 0) {
            var arr = [];
            for (var i = 0; i < this.data.content.length; i++) {
                arr.push(this.data.content[i]);
            }
            var nx = this.data.content.length;
            n = 1;
            for (var k = 2; k < nx; k++) {
                if (y2 > (52 * (k - 1) + k * 2 - 26)) {
                    n = k;
                }
            }
            if (y2 > (52 * (nx - 1) + nx * 2 - 26)) {
                n = nx;
            }
            console.log(arr);
            arr.splice((currindex - 1), 1);
            arr.splice((n - 1), 0, arr1[currindex - 1]);
            arr1 = [];
            for (var m =
                0; m < this.data.content.length; m++) {
                console.log(arr[m]);
                arr[m].id = m + 1;
                arr1.push(arr[m]);
            }
// console.log(arr1);
            this.setData({
                mainx: "",
                content: arr,
                opacity: 1
            })
        }
    },




    // 绘制图片到canvas上
    selectImage:function(){
        var that = this;
        const ctx = wx.createCanvasContext('myCanvas')

        wx.chooseImage({
            success: function(res){
                wx.getImageInfo({//获取图片信息
                    src: res.tempFilePaths[0],
                    success:function(res){
                        console.log('getImageInfo')
                        console.log(res)
                        ctx.drawImage(res.path, 0, 0, res.width, res.height)
                        that.setData({
                            width:res.width,
                            height:res.height
                        })
                        ctx.draw()
                    }
                })
            }
        })
    },
//保存图片
    saveImage:function(){
        const ctx = wx.createCanvasContext('myCanvas')
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: this.data.width,
            height: this.data.height,
            // destWidth: 300,
            // destHeight: 200,
            canvasId: 'myCanvas',
            success: function(res) {
                console.log(res.tempFilePath)
                wx.previewImage({
                    urls: [res.tempFilePath],
                })
            }
        })
    },
})