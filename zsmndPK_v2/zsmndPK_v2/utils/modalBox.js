
function openToastSuccess (tit,icon) {
  var icon = icon || "success";
  var tit = tit || "提交成功";
  wx.showToast({
      title: tit,
      icon: icon,
      duration: 3000
  });
}
function openToastFail (tit,icon) {
  var icon = icon || "none";
  var tit = tit || "提交失败";
  wx.showToast({
      title: tit,
      icon: icon,
      duration: 3000
  });
}
function openConfirm (title,url) {
    wx.showModal({
        title: title,
        confirmText: "确认", 
        cancelText: "取消",
        success: function (res) {
            console.log(res);
            if (res.confirm) {
                wx.navigateTo({
                    url: url
                })
            }
        }
    });
}
function openAlert(msg) {
    wx.showModal({
        content: msg || '您已提交认证信息，请等待审核通过',
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
                
            }
        }
    });
}
module.exports = {
  openToastSuccess:openToastSuccess,
  openToastFail:openToastFail,
  openConfirm:openConfirm,
  openAlert:openAlert
}
