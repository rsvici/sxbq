var request = require('../../utils/requestService.js'); //require请求
Page({
    data: {
        goodsDetail: [],
        goodsProdtl: [],
        popupBol22: false,
        popupBol7:false,
    },
    // 获取商品详情
    getGoodsDetail: function(ProductId) {
        var that = this;
        that.setData({
            hasMore: true
        });
        var getUrl = 'api/Porduct/Get';
        var getData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "ProductId": ProductId
            }
        };
        request.requestGet(getUrl, getData)
            .then(function(response) {
                console.log(response.data.Result)
                    // 商品总参数

                that.setData({
                    goodsDetail: JSON.parse(response.data.Result),
                    goodsProdtl: [JSON.parse(response.data.Result).ProDtl[0]]
                });
            }, function(error) {
                console.log(error);
            });
    },
    joinMember: function() {
        if (wx.getStorageSync('isMember')) {
            this.setData({
                popupBol22: true
            })
            return;
        }

        if(wx.getStorageSync('VipId')){

        }else{
            this.setData({
                popupBol7: true
            })
            return;
        }

        var goodsDetail = this.data.goodsDetail;
        var goodsProdtl = this.data.goodsProdtl;
        var newPackageOrder = [{
            'itemId': '20284',
            'Quantity': 1,
            'PriceSell': goodsProdtl[0].SalePrice,
            'ProductName': goodsDetail.ProductName,
            'Url': goodsDetail.PictureUrl,
            'ProDtl': goodsProdtl
        }];
        wx.setStorage({
            key: "postPackage",
            data: [],
            success: function(res) {
                wx.setStorage({
                    key: "postNormal",
                    data: newPackageOrder,
                    success: function(res) {
                        wx.navigateTo({
                            url: '../impay/impay',
                            success: function(res) {
                                // success
                            }
                        });
                    },
                });
            },
        });
    },
    // 关闭提示弹框
    closePopup: function() {
        this.setData({
            popupBol22: false
        });
    },
    // 关闭提示弹框
    closePopup1: function() {
         this.setData({
            popupBol7: false
        });
        wx.navigateTo({
            url: "../bindphone/bindphone"
        });
    },
    onLoad: function() {
        // this.userInfo();
        this.getGoodsDetail(20284);
    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        var sharePath = '/pages/share/share?shareCode=' + this.data.ShareCode;
        return {
            title: '啤气订阅盒子上市啦~',
            desc: '分享获得体验券', // 分享描述
            path: sharePath // 分享路径
        };
    },
});