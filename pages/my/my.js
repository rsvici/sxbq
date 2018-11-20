var request = require('../../utils/requestService.js'); //require请求
var vipId = wx.getStorageSync('VipId');
var openId = wx.getStorageSync('openId');
Page({
    data: {
        address: {}, // 地址
        vipInfo: [{
            Bouns: 0, //瓶盖
            MyFocusCount: 0, //关注
            FocusMeCount: 0, //粉丝
            CapCash: 0, //啤气值
            LeftUpGradeBouns: 500, //距离升级
            GradeName: "啤酒粉", //称呼
            LeftUpGradeName: "啤酒达人", //下个称呼
            NickName: '***', //姓名
            isShowVipId: false, //是否显示手机号登陆
            wxUserInfo: {}, //微信用户信息
            vipid: wx.getStorageSync('VipId'),
            hasBeerBox: false, //是否有盒子商品
            isMember: false, //是否是 会员
            masterTime: '', //会员到期时间
            popupBol22: false,
        }],
    },
    // 获取个人信息
    getVipSighInfo: function() {
        var vipId = wx.getStorageSync('VipId');
        var that = this;
        var getUrl = 'api/vip/MySightRelationList';
        var getData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'AppUserId': wx.getStorageSync('VipId')
            }
        };
        request.requestGet(getUrl, getData)
            .then(function(response) {

                var res = JSON.parse(response.data.Result);

                var reg = new RegExp("(\\d{3})(\\d{4})(\\d{4})");
                res[0].NickName = (res[0].NickName).replace(reg, "$1****$3");
                console.log(res);
                that.setData({
                    vipInfo: res
                });
            }, function(error) {
                console.log(error);
            });

    },
    // 获取地址
    address: function() {
        var that = this;
        if (wx.chooseAddress) {
            wx.chooseAddress({
                success: function(res) {
                    wx.setStorageSync('address', res)
                },
                fail: function(res) {
                    // fail
                },
                complete: function(res) {
                    // complete
                }
            })
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            });
        }
    },
    // 微信用户信息
    getWxUserInfo: function() {
        var that = this;
        wx.getUserInfo({
            success: res => {
                console.log(res)
                console.log(JSON.parse(res.rawData));
                that.setData({
                    wxUserInfo: JSON.parse(res.rawData)
                })

            }
        });
    }, // 获取啤气盒子订单列表 
    getBeerqiBoxOrderList: function() {
        var that = this;
        var getBeerqiBoxOrderListUrl = "api/Porduct/MyPackageLst";
        var getBeerqiBoxOrderListData = {
            Timestamp: '{{$timestamp}}',
            Args: { "VipId": wx.getStorageSync('VipId') }
        };

        request.requestGet(getBeerqiBoxOrderListUrl, getBeerqiBoxOrderListData)
            .then(function(response) {
                var beerBoxListRes = JSON.parse(response.data.Result);
                // var hasBeerBox = false;
                for (var i = 0; i < beerBoxListRes.length; i++) {
                    if (beerBoxListRes[i].IsPayed) {
                        // hasBeerBox = true;
                        that.setData({
                            hasBeerBox: true
                        });
                    }
                }


            }, function(error) {

            });
    },
    WxLogin: function() {
        var that = this;
        var getUrl = 'api/vip/GetVipByWxAppId';
        var getData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "WxAppOpenId": openId
            }
        };
        request.requestGet(getUrl, getData)
            .then(function(response) {
                console.log(response.data.Result);
                if (response.data.Result) {
                    wx.setStorageSync('VipId', JSON.parse(response.data.Result));
                    that.setData({
                        vipid: JSON.parse(response.data.Result)
                    })

                    that.getVipSighInfo();

                } else {
                    // wx.navigateTo({
                    //   url: '/pages/bindphone/bindphone'
                    // })
                }
            });
    },
    getUserInfo: function(loginId) {
        var that = this;
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

                    if (getUserInfo.IsVip == true && getUserInfo.Status == 1) {
                        wx.setStorageSync('isMember', true);
                        var masterTime = JSON.parse(response.data.Result).ValidVipDateTime;
                        masterTime = masterTime.substring(0, masterTime.length - 9);
                        that.setData({
                            masterTime: masterTime
                        });
                    } else {
                        wx.setStorageSync('isMember', false)
                    }


                },
                function(error) {
                    console.log(error);
                });
    },
    open_Popup: function() {
        this.setData({
            popupBol22: true
        })
    },
    close_popup: function() {
        this.setData({
            popupBol22: false
        })
    },
    onShow: function() {
        openId = wx.getStorageSync('openId');
        vipId = wx.getStorageSync('VipId');
        this.getUserInfo(vipId)
        var that = this;
        // 普通商品
        if (vipId) {
            that.setData({
                isShowVipId: false,
                vipid: wx.getStorageSync('VipId')
            });
            this.getBeerqiBoxOrderList();
        } else {
            that.setData({
                isShowVipId: true
            });
        }

        if (wx.getStorageSync('isMember')) {
            that.setData({
                isMember: true,
            });
        } else {
            that.setData({
                isMember: false,
            });
        }

        this.WxLogin();



    }





});