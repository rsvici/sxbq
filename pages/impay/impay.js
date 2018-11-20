var request = require('../../utils/requestService.js');
var utilsMd5 = require('../../utils/md5.js'); //require请求
var vipId = wx.getStorageSync('VipId');
var openid = wx.getStorageSync('openId');
Page({
    data: {
        normalGoods: {}, //普通商品列表
        allMoney: 0, //总金额 
        hasMore: false, //加载
        isIphoneX: false, //适配iphoneX
    },
    // 价格
    totlePrice: function(normalGoods) {
        var allMoney = normalGoods[0].Quantity * normalGoods[0].PriceSell;
        this.setData({
            allMoney: allMoney,
        });
    },
    // 加入会员
    joinMember: function() {
        wx.navigateTo({
            url: '../member/member',
            success: function(res) {

            }
        });
    },
    // 去购买
    goPay: function() {
        // this.getUserInfo(wx.getStorageSync('VipId'));
        if (wx.getStorageSync('isMember')) {
            return;
        }


        var that = this;
        // 组织二次加载
        if (that.data.hasMore) {
            return;
        }
        that.setData({
            hasMore: true
        });

        var newNorObject = this.data.normalGoods;

        var newdtls = {
            'BarCode': newNorObject[0].ProDtl[0].BarCode,
            'PriceOriginal': newNorObject[0].ProDtl[0].SalePrice,
            'PriceSell': newNorObject[0].ProDtl[0].SalePrice,
            'Quantity': newNorObject[0].Quantity,
            'Amount': newNorObject[0].ProDtl[0].SalePrice * newNorObject[0].Quantity,
            'DiscountMoney': 0,
            'IsGift': 0,
            'ItemNo': newNorObject[0].ProDtl[0].ItemNo,
            'GrouopBuyId': 0
        };


        var dingdanlist = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "PayTime": "{{$timestamp}}",
                "ExpressFee": 0,
                "BuyerCode": vipId,
                "DiscountMoney": 0,
                "RecvConsignee": '',
                "RecvTel": '',
                "RecvAddress": '',
                "RecvProvince": '',
                "RecvCity": '',
                "RecvCounty": '',
                "Dtls": newdtls,
                "PayType": 0,
                'GiftType': '',
                'CouponNo': "",
                'CouponId': '',
                'UseBonus': 0,
                'PackageCode': 'VM'
            }
        };
        console.log(dingdanlist);
        // return;

        dingdanlist.Args = JSON.stringify(dingdanlist.Args);

        var postOrderUrl = 'api/morder/ordadd';

        request.requestPost2(postOrderUrl, dingdanlist)
            .then(function(response) {
                if (response.data.StatusCode == 200) {
                    that.wxPay(response.data.Msg);
                }
            }, function(error) {
                console.log(error);
            });


    },
    // 微信支付
    wxPay: function(OrderNum) {
        var that = this;
        var wxPay = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'OrderNum': OrderNum,
                'TradeType': 'WxApp',
                'OpenId': openid
            }
        };
        wxPay.Args = JSON.stringify(wxPay.Args);
        var wxPayUrl = 'api/pay/GetPrePay';
        request.requestPost(wxPayUrl, wxPay)
            .then(function(response) {
                console.log(JSON.parse(response.data.Result));
                var WxPayData = JSON.parse(response.data.Result);
                that.paySign(WxPayData)
            }, function(error) {
                console.log(error);
            });
    },
    paySign: function(WxPayData) {
        var that = this;
        var paySignStringA = "appId=wxcb963f50666e82a8&nonceStr=" + WxPayData.NonceStr + "&package=prepay_id=" + WxPayData.PrepayId + "&signType=MD5&timeStamp=" + WxPayData.TimeStamp + "&key=xoe9328djsj382832dsjoppzqq230qw2";

        var sign = utilsMd5.hexMD5(paySignStringA).toUpperCase();
        console.log(paySignStringA, sign);
        wx.requestPayment({
            'timeStamp': WxPayData.TimeStamp,
            'nonceStr': WxPayData.NonceStr,
            'package': 'prepay_id=' + WxPayData.PrepayId,
            'signType': 'MD5',
            'paySign': sign,
            'success': function(response) {
                that.getUserInfo(wx.getStorageSync('VipId'));

            },
            'fail': function(res) {
                wx.switchTab({
                    url: "../my/my"
                });
            },
            'complete': function(res) {
                that.setData({
                    hasMore: false
                });
            }
        })

    },
    //适配IphoneX
    autoIphone: function() {
        var that = this;
        wx.getSystemInfo({      
            success: function(res) {
                // console.log(res)
                let modelmes = res.model;
                if (modelmes.search('iPhone X') != -1) {
                    that.setData({         
                        isIphoneX: true
                    });           
                }      
            }
        });
    },
    getUserInfo: function(loginId) {
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
                    wx.switchTab({
                        url: "../my/my"
                    });
                },
                function(error) {
                    console.log(error);
                });
    },
    onShow: function(options) {
        var that = this;
        that.setData({
            hasMore: false
        });
        vipId = wx.getStorageSync('VipId');
        openid = wx.getStorageSync('openId');
        // 组合商品
        wx.getStorage({
            key: 'postNormal',
            success: function(res) {
                that.setData({
                    normalGoods: res.data,
                });

                that.totlePrice(res.data);
            }
        });

        this.autoIphone();
    }
});