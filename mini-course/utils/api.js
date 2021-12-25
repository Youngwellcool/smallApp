const ajax = require('ajax.js');

//获取视频列表
function getVideoList(opt){
  ajax.request({
    url: '/mobile/video/videoList',
    data: opt.data || {
      page: 1,
      uid: 1,
      type: 2
    },
    success: opt.success
  })
}