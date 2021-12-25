import util from '../utils/util'

// 错误码
const OKCODE = 200,
    UNLOGINCODE = -1;
let Api = util.rootDocment
export const Fetch = ({
                          url = '',
                          data = {},
  header = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Bearer ${wx.getStorageSync('token')}`},
                          method = 'POST',
                          api = Api
                      }) => {

  console.log(3333)
    return new Promise((resolve, reject) => {
      // 检查网络是否断开
      wx.getNetworkType({
        success: function (res) {
          if (res.networkType == "none") {
            wx.showModal({
              title: '优师云',
              content: '网络未连接，请检查一下网络',
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
              }
            })
            reject();
          } else {
            let commonData = {
              token: wx.getStorageSync('token'),
              userId: wx.getStorageSync('userId'),
              deviceCode: 'weixin'
            }
            wx.showNavigationBarLoading();
            wx.request({
              url: api + url,
              header: header,
              method: method,
              data: Object.assign({}, data, commonData),
              success: res => {
                // 成功时的处理
                console.log(res)
                if (res.data.code == UNLOGINCODE) {
                  console.warn('登录失效了，处理失效异常……')
                } else if (res.data.code == OKCODE) {
                  resolve(res.data.data);
                } else {
                  console.warn('接口异常，处理接口异常……')
                  wx.showToast({
                    title: res.data.message || '接口异常',
                    icon: 'none'
                  })
                  reject(res.data);
                }
              },
              fail: err => {
                reject(err);
              },
              complete: res => {
                wx.hideNavigationBarLoading()
              }
            })
          }
        },
      })
    })
}