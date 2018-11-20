var request = require('../../utils/requestService.js'); //require请求
var interval;
Page({
    data: {
        name: '', //用户名
        password: '', //密码
        tel: '', //手机号
        code: '', //验证码
        phonePwdBol: true, //密码是否可见
    },
    pwdInput: function(e) {
        this.setData({
            password: e.detail.value
        });
    },
    nameInput: function(e) {
        this.setData({
            name: e.detail.value
        });
    },
    registerUser: function() {
        var password = this.data.password;
        var name = this.data.name;
        if (password.length >= 6 && name.length >= 1) {
            var that = this;
            var postUrl = 'api/MembershipCard/Resiger';
            var postData = {
                Timestamp: '{{$timestamp}}',
                Args: {
                    'MobileNo': this.data.tel,
                    'Name': name,
                    'password': password,
                    'HeadPic': '',
                    'WxLoginId': ''
                }
            };
            postData.Args = JSON.stringify(postData.Args);
            request.requestPost(postUrl, postData)
                .then(function(response) {
                    console.log(response)
                    if (response.data.Msg == "成功") {
                        that.bindMobile()
                    }
                }, function(error) {
                    console.log(error);
                });

        }
    },
    bindMobile: function() {


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
    openPwd: function() { //打开密码
        this.setData({
            phonePwdBol: false
        });
        console.log(1)
    },
    closePwd: function() { //关闭密码
        this.setData({
            phonePwdBol: true
        });
    },
    onLoad: function(options) {
        this.setData({
                tel: options.tel,
                code: options.code
            })
            // this.getWxUserInfo();
    }
});