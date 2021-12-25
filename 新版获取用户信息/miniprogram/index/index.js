Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUseGetUserProfile: false,
        isExist: false,
    },
    onLoad() {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }

        this.getUser()
    },

    getUser() {
        wx.cloud.callFunction({
            name: 'getUser',
            data: {desc:'用户信息'},
            success: (res) => {
                console.log(res)
                let ret = res.result;
                this.setData({
                    isExist: ret.isExist
                })
            }
        })
    },

    addUser(avatar, nickName) {
        wx.cloud.callFunction({
            name: 'addUser',
            data: {
                avatar,
                nickName,
            },
            success: (res) => {
                console.log(res)
            }
        })
    },

    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log(res)
                let userInfo = res.userInfo;
                this.setData({
                    userInfo,
                    hasUserInfo: true
                })
                this.addUser(userInfo.avatarUrl, userInfo.nickName)
            }
        })
    },
    getUserInfo(e) {
        // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
        console.log(e)
        let userInfo = e.detail.userInfo;
        this.setData({
            userInfo,
            hasUserInfo: true
        })
        this.addUser(userInfo.avatarUrl, userInfo.nickName)
    },


    validate(avatar, nickName) {
        wx.cloud.callFunction({
            name: 'validate',
            data: {
                phone: '15616184575',
                avatar,
                nickName,
            },
            success: (res) => {
                console.log(res)
                if(res.result.data) { // 微信验证通过
                    this.setData({
                        not: false,
                        has: true
                    })
                    // 跳转到人脸识别
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '../face/face',
                            success: res => {
                                this.setData({
                                    has: false
                                })
                            }
                        })
                    }, 1000)

                }else {
                    this.setData({
                        not: true,
                        has: true
                    })
                }
            }
        })
    },


    start(e) {
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log(res)
                let userInfo = res.userInfo;
                this.setData({
                    userInfo,
                    hasUserInfo: true
                })
                this.validate(userInfo.avatarUrl, userInfo.nickName)
            }
        })
    },




})
