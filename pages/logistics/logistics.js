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
        console.log(e);
    },

    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '物流信息'
        });
        console.log(options);
        this.bindGetMsg();
        var url = "https://h5.beerqi.com/#/wxlogistics?vipId=" + vipId + "&imgUrl=" + options.imgUrl + "&code=" + options.code;

        this.setData({
            url: url
        });

    }
});