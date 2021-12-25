/**
 * 所有的请求统一通过这里，然后请求后台
 */
var port_json = {
  //接口域名
  "addr": "https://ysm.onedisme.com/dayapi/public/api/v1",
  //文件视频图片等域名
  "cdnaddr": "https://ysm.onedisme.com",
};

/**
 * 获取图片前缀域名,支持传入参数进行获取对应的地址
 */
function get_image_prefix_host (image_alias =''){
    if(image_alias ==''){
        return port_json['cdnaddr'];
    }else{
        return port_json[image_alias];
    }
}

/**
 * 自定义POST请求 不带token值的请求 传入接口名，返回请求地址
 * {url}  接口名 string
 * {data} 要传的数组对象 例如: {name: '武当山道士', age: 32}
 * 
*/
function getPort(url, data){
  var promise = new Promise((resolve, reject) => {
    var postData = data;
    wx.showLoading({ title: '正在加载中...', mask: true })
    //网络请求
    wx.request({
      url: port_json['addr'] + url,
      data: postData,
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {//服务器返回数据
        resolve(res.data);
/**        if (res.data.state == 1) {//res.data 为 后台返回数据，格式为{"data":{...}, "info":"成功", "state":1}, 后台规定：如果state为1,既是正确结果。可以根据自己业务逻辑来设定判断条件
          resolve(res.data);
        }else {//返回错误提示信息,接口不同意没办法统一state状态处理
           reject(res.data.info);
         }*/
        wx.hideLoading();
      },
      fail:function(e){
        reject('网络出错');
        wx.hideLoading();
      }
    })
  });
  return promise;
}


/**
 * 自定义文件上传请求 传入接口名，返回请求地址
 * {url}  接口名 string
 * {file} 需上传的文件
 * {fileName} 文件名称
 * {data} 要传的数组对象 例如: {name: '武当山道士', age: 32},如果没有额外参数则传递false
 * 
*/
function getUploadFile(url,file,fileName,data) {
    var promise = new Promise((resolve, reject) => {
    var postData = data || {};
      wx.showLoading({ title: '正在加载中...', mask: true })
    //网络请求
    wx.uploadFile({
      url: port_json['addr'] + url,
      filePath: file,//需上传的文件
      name: fileName,//文件名
      formData: postData,//其他额外的 form data
      success: function (res) {//服务器返回数据
        console.log(res);
        resolve(JSON.parse(res.data));
        wx.hideLoading();
      },
      fail: function (e) {
        reject('网络出错');
        wx.showToast({
          title: '网络出错...',
          icon: 'none',
          mask: true
        });
        wx.hideLoading();
      }
    })
  });
  return promise;
}

/**
 * 点击事件是页面跳转防止重复点击打开多个页面
 * 首先需要在页面对应的js文件里面增加一个buttonClicked数据对象，然后在点击事件里面调用上述方法
 * 例:  https://www.jianshu.com/p/b27157ea61fb
 * data: {
 *  buttonClicked: false
 * },
 * click: function (e) {
 *  util.buttonClicked(this);
 *  var id = e.currentTarget.dataset.id;
 *  wx.navigateTo({
 *    url: '../detail/detail?id=' + id
 *  })
  },
 * 在wxml的点击控件中通过buttonClicked判断是否可以点击，可以用bindtap也可以用disabled
 * <view bindtap="{{!buttonClicked?'click':''}}" data-id="{{id}}" />
 * <button bindtap="{{!buttonClicked?'click':''}}" data-id="{{id}}" />
 * button bindtap="click" disabled="buttonClicked" data-id="{{id}}" />
 */
function buttonClicked(self) {
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 1000)
}


module.exports = {
	getPort:getPort,
  getUploadFile: getUploadFile,
  getImagePrefixHost: get_image_prefix_host,
  buttonClicked: buttonClicked,
}