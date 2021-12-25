/**
 * 获取题目内容封装
 * 分类有1为播音，2为声乐，3为编导选择题，5为画画，6为表演
 * 题目类型,1为文字题，2为图片，3为文字图片，4为纯音频，8为纯视频，12为语音识别题
 * 答案类型，1为文字答案，2为图片答案(只有文字题和文字图片题答案类型会出现图片)
 * {{havephone}}绑定手机号码表示 0:未绑定 1::已绑定
 * {{randomNO}} 题目序号
 */
function getTopic(havephone,order){
  var promise = new Promise((resolve, reject) => {
    var random = wx.getStorageSync('random').split(',');//随机题目序号
    if (order > random.length){//答完题目没有下一道题目则直接跳转结果页
      if (havephone === 0){
        wx.reLaunch({
          url: '../../entry/entry',
        })
      }else{
        wx.reLaunch({
          url: '../../certificat/certificat',
        })
      }
    }else{
      var postData = { tid: random[order-1] };
      setTimeout(function () {
        wx.showLoading({ title: '正在加载中...', mask: true })
        //网络请求
        wx.request({
          url: 'https://ysm.onedisme.com/dayapi/public/api/v1/Evaluation/haveArtTopic',
          data: postData,
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {//服务器返回数据
            console.log(JSON.stringify(res.data));
            wx.hideLoading();
            if (res.data.data.topic.art_topic_aid === 1 || res.data.data.topic.art_topic_aid === 2 || res.data.data.topic.art_topic_aid === 3) {//1为播音，2为声乐，3为编导选择题 答案都是选择，则根据题目类型进行判断
              if (res.data.data.topic.art_topic_type === 1 || res.data.data.topic.art_topic_type === 3) {//文字题目和文字图片题目
                if (res.data.data.answerstype === 1) {//1为文字答案
                  wx.navigateTo({
                    url: '/pages/question/words/words?order=' + order + '&data=' + encodeURIComponent(JSON.stringify(res.data.data)),
                  })
                } else if (res.data.data.answerstype === 2) {//2为图片答案
                  wx.navigateTo({
                    url: '/pages/question/picChoose/picChoose?order=' + order + '&data=' + encodeURIComponent(JSON.stringify(res.data.data)),
                  })
                }
              } else if (res.data.data.topic.art_topic_type === 2) {//图片题目
                wx.navigateTo({
                  url: '/pages/question/words/words?order=' + order + '&data=' + encodeURIComponent(JSON.stringify(res.data.data)),
                })
              } else if (res.data.data.topic.art_topic_type === 4) {//纯音频题目
                wx.navigateTo({
                  url: '/pages/question/music/music?order=' + order + '&data=' + encodeURIComponent(JSON.stringify(res.data.data)),
                })
              } else if (res.data.data.topic.art_topic_type === 8) {//纯视频
                wx.navigateTo({
                  url: '/pages/question/video/video?order=' + order + '&data=' + encodeURIComponent(JSON.stringify(res.data.data)),
                })
              } else if (res.data.data.topic.art_topic_type === 12) {//语音识别题
                wx.navigateTo({
                  url: '/pages/question/voice/voice?order=' + order + '&data=' + encodeURIComponent(JSON.stringify(res.data.data)),
                })
              }
            } else if (res.data.data.topic.art_topic_aid === 5) {//画画题
              wx.navigateTo({
                url: '/pages/question/draw/draw?order=' + order + '&data=' + encodeURIComponent(JSON.stringify(res.data.data)),
              })
            }
          },
          fail: function (e) {
            console.log(+e);
            wx.hideLoading();
          }
        })

      }, 1000);


    }

  });
  return promise;
}

module.exports = getTopic