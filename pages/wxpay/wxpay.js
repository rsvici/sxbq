var request = require('../../utils/requestService.js'); //require请求
var utilsMd5 = require('../../utils/md5.js') //require请求
Page({
    data: {
        url: ""
    },
    bindGetMsg: function(e) {
        var that = this;
        console.log(e.detail.data[0].wxgopay.orderNum);
        if (e.detail.data[0].wxgopay.orderNum) {
            that.wxPay(e.detail.data[0].wxgopay.orderNum)
        }
    },
    // 微信支付
    wxPay: function(OrderNum) {
        var that = this;
        var wxPay = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'OrderNum': OrderNum,
                'TradeType': 'WxApp',
                'OpenId': wx.getStorageSync('openId')
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
        var paySignStringA = "appId=wxcb963f50666e82a8&nonceStr=" + WxPayData.NonceStr + "&package=prepay_id=" + WxPayData.PrepayId + "&signType=MD5&timeStamp=" + WxPayData.TimeStamp + "&key=xoe9328djsj382832dsjoppzqq230qw2";

        var sign = utilsMd5.hexMD5(paySignStringA).toUpperCase();
        console.log(paySignStringA, sign);
        wx.requestPayment({
            'timeStamp': WxPayData.TimeStamp,
            'nonceStr': WxPayData.NonceStr,
            'package': 'prepay_id=' + WxPayData.PrepayId,
            'signType': 'MD5',
            'paySign': sign,
            'success': function(res) {
                wx.switchTab({
                    url: "../my/my"
                });
            },
            'fail': function(res) {
                wx.switchTab({
                    url: "../my/my"
                });
            },
            'complete': function(res) {

            }
        })

    },
    onLoad: function(options) {
        console.log(options)

        this.wxPay(options.orderNum);
    }
});