// common.js
function request(opt) {
  // set token
  var token = wx.getStorageSync("token");
  wx.showNavigationBarLoading();
  wx.request({
    method: opt.method || 'GET',
    header: {
      token: token || '',
      key: key
    },
    url: serverUrl + opt.url,
    data: opt.data,
    success: function (res) {
      if (res.data.code == 200) {
        opt.success(res.data.result, res.data);
      } else {
        console.error(res);
        wx.showModal({
          title: '微信异常',
          content: res.statusCode,
          showCancel: false
        })
      }
    },
    fail: function () {
      wx.showToast({
        icon: 'none',
        title: '远程连接失败',
      })
    },
    complete: function () {
      wx.hideNavigationBarLoading();
      wx.hideLoading()
    }
  })
}

module.exports = {
  serverPath: serverPath,
  request: request
}