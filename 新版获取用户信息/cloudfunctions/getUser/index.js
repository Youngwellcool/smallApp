// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    console.log('进入来了')
    let unionid = wxContext.UNIONID
    try {
        console.log('结果try')
        let data = (await db.collection('user').where({unionid}).get()).data;
        console.log(data)
        /*if(!data.length) {
            db.collection('user').add({
                data: {
                    unionid
                }
            }).then(res => {
                console.log(res)
                console.log('添加成功')
            }).catch(err => {
                console.log(err)
            })
        }*/

        return {
            event,
            openid: wxContext.OPENID,
            appid: wxContext.APPID,
            unionid: wxContext.UNIONID,
            isExist: data.length,
        }
    } catch (e) {
        console.log(e)
        return e
    }

}