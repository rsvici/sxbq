var request = require('../../utils/requestService.js'); //require请求
var utilsMd5 = require('../../utils/md5.js') //require请求
var vipId = wx.getStorageSync('VipId');
var openid = wx.getStorageSync('openId');
Page({
    data: {
        url: "",
    },
    bindGetMsg: function(e) {
        var that = this;
        if (e.detail.data[0].wxgopay.orderNum) {
            var orderNum = e.detail.data[0].wxgopay.orderNum;
        }
    },

    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '我的订单'
        });
        vipId = wx.getStorageSync('VipId');
        console.log(options);
        // this.bindGetMsg();
        var url = "https://h5.beerqi.com/0914/#/orders?vipId=" + vipId + "&orderstatus=" + options.orderstatus;

        this.setData({
            url: url
        });

    }
});