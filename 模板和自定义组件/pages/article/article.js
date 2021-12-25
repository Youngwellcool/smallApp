
var x, y, x1, y1, x2, y2, index, currindex, n, yy;
var _articleList = [
            {img: '', content: '11'},
            {img: '', content: '22'},
        ]

Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverImg: '',
        title: '',
        articleList : [
            {img: '', content: '11'},
            {img: '', content: '22'},
        ],
        mainx: -1,
        start: { x: 0, y: 0 },

        cw:'',
        ch: ''


    },

    /**
     * 上传封面
     */
    chooseCoverImg: function () {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
                // tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    coverImg: res.tempFilePaths
                })
            }
        })
    },

    /**
     * 上传图片
     * @param e
     */
    /*chooseImg:function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
                console.log(res)
                // tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    ['articleList['+index+'].img']: res.tempFilePaths
                })

                const ctx = wx.createCanvasContext('attendCanvasId');
                ctx.drawImage(res.tempFilePaths[0], 0, 0, 375, 555);
                ctx.draw();
                wx.canvasToTempFilePath({
                    canvasId: 'attendCanvasId',
                    success:function (res) {
                        console.log(res)
                        that.setData({
                            res: res
                        })
                    }
                })
            }
        })
    },*/

    chooseImg:function (e) {
        let that = this;
        // console.log(e);
        // let index = e.currentTarget.dataset.number;
        let uploadFile = ''; //最后处理完，图片上传的图片地址
        wx.chooseImage({
            success(res) {
                console.log(res)
                const tempFilePaths = res.tempFilePaths;

                //获得原始图片大小
                wx.getImageInfo({
                    src: res.tempFilePaths[0],
                    success(res) {
                        // console.log('获得原始图片大小',res.width)
                        //console.log(res.height)
                        var originWidth, originHeight;
                        originHeight = res.height;
                        originWidth = res.width;
                        console.log(originWidth);
                        //压缩比例
                        // 最大尺寸限制
                        var maxWidth = 1200,
                            maxHeight = 600;
                        // 目标尺寸
                        var targetWidth = originWidth,
                            targetHeight = originHeight;
                        //等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
                        if (originWidth > maxWidth || originHeight > maxHeight) {
                            if (originWidth / originHeight > maxWidth / maxHeight) {
                                // 要求宽度*(原生图片比例)=新图片尺寸
                                targetWidth = maxWidth;
                                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                            } else {
                                targetHeight = maxHeight;
                                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                            }
                        }

                        //更新canvas大小
                        that.setData({
                            cw: targetWidth,
                            ch: targetHeight
                        });
                        //尝试压缩文件，创建 canvas
                        var ctx = wx.createCanvasContext('attendCanvasId');
                        ctx.clearRect(0, 0, targetWidth, targetHeight);
                        ctx.drawImage(tempFilePaths[0], 0, 0, targetWidth, targetHeight);
                        ctx.draw(false,function(){
                            //获得新图片输出
                            wx.canvasToTempFilePath({
                                canvasId: 'attendCanvasId',
                                success: (res) => {
                                    //写入图片数组
                                    /*var uploadpic = "uploadPic[" + index + "]";
                                    //
                                    that.setData({
                                        [uploadpic]: res.tempFilePath
                                    });*/
                                    uploadFile = res.tempFilePath;
                                    console.log(uploadFile)
                                    //保存到相册
                                    // wx.saveImageToPhotosAlbum({
                                    //   filePath: res.tempFilePath,
                                    //   success: (res) => {
                                    //     console.log(res)
                                    //   },
                                    //   fail: (err) => {
                                    //     console.error(err)
                                    //   }
                                    // })


                                    /*wx.uploadFile({
                                        url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
                                        filePath: uploadFile,
                                        name: 'file',
                                        formData: {
                                            'user': 'test'
                                        },
                                        success(res) {
                                            const data = res.data
                                            //do something
                                        }
                                    })*/
                                },
                                fail: (err) => {
                                    console.error(err)
                                }
                            }, this)
                        });





                    }
                })




            }
        })

    },

    save:function () {
        console.log('bapc')
        var that = this;
        wx.saveImageToPhotosAlbum({
            filePath: that.data.res.tempFilePath,
            success (res) {
                wx.showToast({
                    title: '保存图片成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail:function (err) {
                console.log(err)
            }
        })
    },


    /**
     * 删除图片
     * @param e
     */
    delImg:function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            ['articleList['+index+'].img']: ''
        })
    },

    /**
     * 删除一条图文
     */
    delItem:function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        wx.showModal({
            title: '提示',
            content: '确定要删除该条内容？',
            success (res) {
                if (res.confirm) {
                    var arr = that.data.articleList;
                    arr.splice(index, 1);
                    that.setData({
                        articleList: arr
                    })
                } else if (res.cancel) {

                }
            }
        })
    },

    edit:function (e) {
      var target = e.currentTarget.dataset;
      var type = target.type;  // 1为编辑标题，2为编辑文本内容
      var index = target.index;
        wx.navigateTo({
          url: '../edit/edit?type=' + type + '&index=' + index,
        })
    },


    add(e) {
        var target = e.currentTarget.dataset;
        console.log(target)
        var index = target.index;
        var arr = this.data.articleList;
        arr.splice(index, 0, {img: '', content: ''})
        this.setData({
            articleList: arr
        })
        _articleList = arr;

    },
    movestart: function (e) {
        console.log(e)
        currindex = e.currentTarget.dataset.index;  // 当前正在移动的块 的index
        console.log(currindex)
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
            for (var i = 0; i < this.data.articleList.length; i++) {
                arr.push(this.data.articleList[i]);
            }
            var nx = this.data.articleList.length;
            n = 1;
            for (var k = 2; k < nx; k++) {
                if (y2 > (126 * (k - 1) + k * 2 - 63)) {
                    n = k;
                }
            }
            if (y2 > (126 * (nx - 1) + nx * 2 - 63)) {
                n = nx;
            }
            console.log(arr);
            arr.splice(currindex, 1);
            arr.splice(n, 0, _articleList[currindex]);
            _articleList = [];
            for (var m = 0; m < this.data.articleList.length; m++) {
                console.log(arr[m]);
                // arr[m].id = m + 1;
                _articleList.push(arr[m]);
            }
// console.log(arr1);
            this.setData({
                mainx: "",
                articleList: arr,
                opacity: 1
            })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})