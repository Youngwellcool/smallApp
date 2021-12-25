/***
 * 获取当前地理位置经纬度数据，传入腾讯api进行解析，返回对应的省市区地址
 * @param fn 回调函数，用于处理回调的数据，支持两个参数，1.格式化的省市区数据  2.腾讯地图的原始数据
 * @return object result        腾讯地图这边返回的所有的原始解析数据
 * @return string province      所属省
 * @return string city          所属城市
 * @return string district      所属区域
 * @return string street        所属街道
 * @return string street_number 所属街道编号
 * @return string nation        所属国籍
 */
function getLocation(fn){
    wx.getLocation({
      success:function(res){
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        var data={
　　　　　　location:latitude+","+longitude,
　　　　　　key:"ULNBZ-DOWHF-HW5J5-J6J2I-UDC6H-JDFJS",
　　　　　　get_poi:0    
        }
        wx.request({
          url:"https://apis.map.qq.com/ws/geocoder/v1/?",
          data:data,
          success:function(res){
            var result = res.data.result
            var location = {
              nation:result.address_component.nation,
	            province:result.address_component.province,
	            city:result.address_component.city,
	            district:result.address_component.district,
	            street:result.address_component.street,
	            street_number:result.address_component.street_number
            }
            fn(location,result)
          }
        })
      }
    })
}

module.exports = getLocation