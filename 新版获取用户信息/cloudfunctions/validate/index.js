// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database();
    let unionid = wxContext.UNIONID
    try {
        let data = (await db.collection('user').where({phone: event.phone}).get()).data[0];
        console.log(data)
        if (!data.unionid) {
            return db.collection('user').where({phone: event.phone}).update({
                data: {
                    unionid,
                    avatar: event.avatar,
                    nickName: event.nickName
                }
            }).then(res => {
                console.log(res)
                console.log('unionid不存在的更新成功')
                return {
                    data: true,
                    msg: '更新个人资料成功，已将当前登录的微信绑定',
                    code: 200,
                    unionid,
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            let isSameUnionId = unionid == data.unionid;
            if(isSameUnionId) {
                db.collection('user').where({phone: event.phone}).update({
                    data: {
                        avatar: event.avatar,
                        nickName: event.nickName
                    }
                }).then(res => {
                    console.log(res)
                    console.log('unionid存在的更新成功')
                }).catch(err => {
                    console.log(err)
                })
            }

            return {
                data: isSameUnionId,
                msg: '用户已绑定了微信，data=true表示当前登录的微信与绑定的微信一致',
                code: 200,
                unionid,
            }
        }
    } catch (e) {
        console.log(e)
        return e
    }
}