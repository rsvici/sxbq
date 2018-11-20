//app.js
var request = require('./utils/requestService.js');
App({
    onLaunch: function() {
        // // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    //发起网络请求
                    console.log(res.code);
                    wx.request({
                        url: 'https://api.beerqi.com/api/pay/GetWxAppCode',
                        data: {
                            Timestamp: '{{$timestamp}}',
                            Args: {
                                'appid': 'wxcb963f50666e82a8',
                                'secret': 'c55483555ce1b9e47c8703547cef639c',
                                'js_code': res.code,
                                'grant_type': 'authorization_code'
                            }
                        },
                        success: function(res) {
                            var newRes = JSON.parse(res.data.Result)
                            var thisRes = JSON.parse(newRes.Result)
                            wx.setStorageSync('openId', thisRes.openid);

                            var getUrl = 'api/vip/GetVipByWxAppId';
                            var getData = {
                                Timestamp: '{{$timestamp}}',
                                Args: {
                                    "WxAppOpenId": thisRes.openid
                                }
                            };
                            request.requestGet(getUrl, getData)
                                .then(function(response) {
                                    console.log(response);
                                    if (response.data.Result) {
                                        wx.setStorageSync('VipId', response.data.Result);
                                        // wx.setStorageSync('VipId', 5568);
                                        userInfo(response.data.Result)
                                    } else {
                                        wx.removeStorageSync('VipId');
                                        // wx.navigateTo({
                                        //     url: '/pages/bindphone/bindphone'
                                        // });
                                    }
                                });

                        }
                    });

                }
            }
        });
        //获取会员会员卡信息
        function userInfo(loginId) {
            var getCardListUrl = "api/vip/ImInfo";
            var getCardListData = {
                Timestamp: '{{$timestamp}}',
                Args: {
                    "LoginId": loginId
                }
            };
            request.requestGet(getCardListUrl, getCardListData)
                .then(function(response) {
                        var getUserInfo = JSON.parse(response.data.Result);
                        console.log(getUserInfo);
                        if (getUserInfo.IsVip == true && getUserInfo.Status == 1) {
                            wx.setStorageSync('isMember', true);
                        } else {
                            wx.setStorageSync('isMember', false)
                        }


                    },
                    function(error) {
                        console.log(error);
                    });
        };
    },
    globalData: {
        userInfo: null,
        MathRandomPic: (Math.floor(Math.random() * 100000) % 100000),
        globalFormIds: []
    }
})