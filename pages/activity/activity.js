var request = require('../../utils/requestService.js'); //require请求
Page({
    goDetail: function() {
        wx.navigateTo({
            url: "../detailpack/detailpack?productId=37"
        });
    }
});