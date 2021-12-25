// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    let unionid = wxContext.UNIONID

    let data = (await db.collection('user').where({unionid}).get()).data;
    console.log(data)
    if (!data.length) {
        return db.collection('user').add({
            data: {
                unionid,
                avatar: event.avatar,
                nickName: event.nickName
            }
        }).then(res => {
            console.log(res)
            console.log('添加成功')
            return {
                msg: '添加成功',
                code: 200,
            }
        }).catch(err => {
            console.log(err)
        })
    } else {
        return {
            msg: '该用户已存在，无需添加',
            code: 1,
        }
    }
}


