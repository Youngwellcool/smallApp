/**
 * 工具类统一暴露接口
 */
const port = require('./port.js');
const modalBox = require('./modalBox.js');
const getLocation = require('./getLocation.js');
const getTopic = require('./topic.js');

module.exports = {
  //网络请求
  getPort: port.getPort,
  getUploadFile: port.getUploadFile,
  getImagePrefixHost: port.getImagePrefixHost,
  
  //处理点击事情打开多个页面优化
  buttonClicked: port.buttonClicked,
 
  //消息提示框
  openToastSuccess: modalBox.openToastSuccess,
  openToastFail: modalBox.openToastFail,
  openConfirm: modalBox.openConfirm,
  openAlert: modalBox.openAlert,
  
  //经纬度换算地理位置信息
  getLocation: getLocation,

  //根据题目序号获取题目内容
  getTopic: getTopic,

}