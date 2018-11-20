var request = require('../../utils/requestService.js'); //require请求
var interval;
Page({
    data: {
        telBtn: '获取验证码', //提示
        wxUserInfo: '',
        tel: '', //手机号
        code: '', //输入验证码
        currentTime: 60, // 初始事件
        rightMobileNo: 0, //获取验证码
        entmobileBol: false, //确定按钮的显示颜色
    },
    // 微信用户信息
    getWxUserInfo: function() {
        var that = this;
        wx.getUserInfo({
            success: res => {
                console.log(JSON.parse(res.rawData));
                that.setData({
                    wxUserInfo: JSON.parse(res.rawData)
                });

            }
        });
    },
    telInput: function(e) {
        this.setData({
            tel: e.detail.value
        });
    },
    codeInput: function(e) {
        this.setData({
            code: e.detail.value
        });
        if (e.detail.value.length == 6) {
            this.setData({
                entmobileBol: true
            })
        } else {
            this.setData({
                entmobileBol: false
            })
        }
    },
    // 获取验证码
    postMobileNo: function() {
        if (this.data.tel.legth < 11) {
            return;
        }


        var that = this;
        var postUrl = 'api/MembershipCard/GetVerifyCode';
        var postData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'MobileNo': this.data.tel
            }
        };

        postData.Args = JSON.stringify(postData.Args);
        request.requestPost(postUrl, postData)
            .then(function(response) {
                console.log(response.data);
                if (response.data.Msg == '成功') {
                    that.timeOutFun();
                    that.setData({
                        rightMobileNo: response.data.Result
                    });

                }

            }, function(error) {
                console.log(error);
            });
    },
    // 倒计时60s
    timeOutFun: function() {
        var that = this;
        var currentTime = that.data.currentTime;
        that.setData({
            telBtn: currentTime + '秒'
        });
        var interval = setInterval(function() {
            that.setData({
                telBtn: (currentTime - 1) +
                    '秒'
            });
            currentTime--;
            if (currentTime <= 0) {
                clearInterval(interval);
                that.setData({
                    currentTime: 60,
                    telBtn: '请重新获取'
                });
            }
        }, 1000);
    },
    bindMobile: function() {
        console.log(wx.getStorageSync('openId'))
        var code = this.data.code;
        var rightMobileNo = this.data.rightMobileNo;
        if (code == rightMobileNo && code.length == 6) {
            var that = this;
            var postUrl = 'api/Vip/WxAppBindMobie';
            var postData = {
                Timestamp: '{{$timestamp}}',
                Args: {
                    'MobileNo': this.data.tel,
                    'WxAppOpenId': wx.getStorageSync('openId')
                }
            };

            postData.Args = JSON.stringify(postData.Args);
            request.requestPost(postUrl, postData)
                .then(function(response) {
                    console.log(response);

                    if (response.data.Msg == "成功") {
                        var getUrl = 'api/vip/GetVipByWxAppId';
                        var getData = {
                            Timestamp: '{{$timestamp}}',
                            Args: {
                                "WxAppOpenId": wx.getStorageSync('openId')
                            }
                        };
                        request.requestGet(getUrl, getData)
                            .then(function(response) {
                                console.log(response)


                                if (response.data.Result) {
                                    wx.setStorageSync('VipId', response.data.Result);
                                    wx.switchTab({
                                        url: "../my/my"
                                    });
                                } else {
                                    // wx.navigateTo({
                                    //     url: '../setpwd/setpwd?tel=' + that.data.tel + '&code=' + that.data.code
                                    // })
                                    that.registerUser();
                                    // console.log(response)
                                }
                            });
                    }
                }, function(error) {
                    console.log(error);
                });
        } else {

        }


    },
    registerUser: function() {
        var that = this;
        var postUrl = 'api/MembershipCard/Resiger';
        var postData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'MobileNo': this.data.tel,
                'Name': this.data.tel,
                'password': this.data.tel,
                'HeadPic': '',
                'WxLoginId': ''
            }
        }
        postData.Args = JSON.stringify(postData.Args);
        request.requestPost(postUrl, postData)
            .then(function(response) {
                console.log(response)
                if (response.data.Msg == "成功") {
                    that.newBindMobile()
                }
            }, function(error) {
                console.log(error);
            });
    },
    newBindMobile: function() {
        var that = this;
        var postUrl = 'api/Vip/WxAppBindMobie';
        var postData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'MobileNo': this.data.tel,
                'WxAppOpenId': wx.getStorageSync('openId')
            }
        };
        postData.Args = JSON.stringify(postData.Args);
        request.requestPost(postUrl, postData)
            .then(function(response) {
                console.log(response)
                if (response.data.Msg == "成功") {
                    var getUrl = 'api/vip/GetVipByWxAppId';
                    var getData = {
                        Timestamp: '{{$timestamp}}',
                        Args: {
                            "WxAppOpenId": wx.getStorageSync('openId')
                        }
                    };
                    request.requestGet(getUrl, getData)
                        .then(function(respons) {
                            console.log(respons);
                            wx.setStorage({
                                key: "VipId",
                                data: respons.data.Result,
                                success: function(respon) {
                                    wx.switchTab({
                                        url: "../my/my"
                                    });
                                }
                            });
                        });
                }
            }, function(error) {
                console.log(error);
            });

    },
    onLoad: function() {
        // this.getWxUserInfo();
    }
});