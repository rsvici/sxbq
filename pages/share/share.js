var request = require('../../utils/requestService.js'); //require请求
var shareCode = ''; //分享id 
Page({
    data: {
        isShare: true, //是否是分享 
        tel: 0, // 手机号
        isDraw: false //手机号验证
    },
    getshareCode: function() {
        var that = this;
        var getCardListUrl = "api/Vip/GetshareCode";
        var getCardListData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "AppUserId": wx.getStorageSync('VipId')
            }
        };

        request.requestGet(getCardListUrl, getCardListData)
            .then(function(response) {
                shareCode = response.data.Result
            }, function(error) {
                console.log(error);
            });
    },
    telInput: function(e) {
        var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (myreg.test(e.detail.value)) {
            this.setData({
                isDraw: true
            });
        } else {
            this.setData({
                isDraw: false
            });
        }
        this.setData({
            tel: e.detail.value
        });
    },
    freeDraw: function() {
        var that = this;
        if (this.data.tel.length < 11) {
            return;
        }
        var getCardListUrl = "api/Vip/BindshareCode";
        var getCardListData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                ShareCode: shareCode,
                MobileNo: this.data.tel
            }
        };
        console.log(getCardListData)

        request.requestGet(getCardListUrl, getCardListData)
            .then(function(response) {
                if (response.data.Result) {
                    wx.showToast({
                        title: response.data.Msg,
                        icon: 'succes',
                        duration: 1000,
                        mask: true,
                        success: function() {
                            wx.switchTab({
                                url: "../my/my"
                            });
                        }
                    })
                } else {
                    wx.showToast({
                        title: response.data.Msg,
                        icon: 'none',
                        duration: 5000,
                        mask: true,
                        success: function() {
                            wx.switchTab({
                                url: "../my/my"
                            });
                        }
                    })
                }

            }, function(error) {
                console.log(error);
            });
    },
    onLoad: function(options) {
        console.log(options)
        if (options.shareCode) {
            shareCode = options.shareCode;
            this.setData({
                isShare: false,
            });
        } else {
            this.getshareCode();
            this.setData({
                isShare: true
            });
        }
    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        var sharePath = '/pages/share/share?shareCode=' + shareCode;
        return {
            title: '啤气订阅盒子上市啦~',
            desc: '分享获得体验券', // 分享描述
            path: sharePath // 分享路径
        };
    },
});