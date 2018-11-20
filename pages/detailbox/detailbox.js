var app = getApp();
var request = require('../../utils/requestService.js'); //require请求
var WxParse = require('../../wxParse/wxParse.js');
var newComObj = require('../../utils/comobj.js'); //评论
var vipId = wx.getStorageSync('VipId');
var detailId; //商品id
var stocks = 0; //库存数量
Page({

    data: {
        goodsDetail: {}, //商品详情
        content: '',
        hasMore: false, // 加载
        goodsNum: 1, //瓶数
        isGoPayBol: false, //是否可以购买
        shopcarNum: 0, //购物车数量
        popupBol: false, //提示弹框
        popupBol1: false,
        popupBol10: false,
        popupBol7: false,
        isIphoneX: false,
        boxDetailId: '', //啤气盒子id
        comment: '', //评论
        masterPrice: 0, //会员价格
        masterBol: false, //是否是会员
    },
    // 获取商品列表
    getGoodsDetail: function(ProductId) {
        var that = this;
        if (that.data.hasMore) {
            return;
        }
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
                var comment = [];
                if (JSON.parse(response.data.Result).ProductCom.length == 0) {
                    //名称随机
                    var nameRadom = Math.round(Math.random() * 124);
                    //评论随机
                    var codeRadom = Math.round(Math.random() * 125);
                    comment.push({
                        UserName: newComObj.commentList.name[nameRadom],
                        ComtComment: newComObj.commentList.code[codeRadom]
                    });
                } else {
                    comment = [JSON.parse(response.data.Result).ProductCom[0]];
                }
                that.setData({
                    goodsDetail: JSON.parse(response.data.Result),
                    hasMore: false,
                    comment: comment,
                    masterPrice: (JSON.parse(response.data.Result).ProDtl[0].SalePrice * 0.9).toFixed(2),
                    onSalePrice: (JSON.parse(response.data.Result).ProDtl[0].SalePrice * 0.1).toFixed(2)
                });
                stocks = JSON.parse(response.data.Result).ProDtl[0].Stocks;
                // 加载富文本
                var article = JSON.parse(response.data.Result).ProDesc;
                WxParse.wxParse('article', 'html', article, that, 0);
            }, function(error) {
                console.log(error);
            });
    },
    // 评论
    commentFun: function() {
        wx.navigateTo({
            url: '../comlist/comlist?detailId=' + detailId
        });
    },
    // 获取购物车
    getShopCart: function() {
        var that = this;
        var getRecommndUrl = 'api/Porduct/ProdCartList';
        var getRecommndData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "VipId": vipId,
                "PageIndex": 1,
                "PageSize": 100
            }
        };
        request.requestGet(getRecommndUrl, getRecommndData)
            .then(function(response) {
                var newRes = JSON.parse(response.data.Result);
                if (newRes) {
                    that.setData({
                        shopcarNum: newRes.length,
                    });
                }
            }, function(error) {
                console.log(error);
            });


    },
    // 去下单
    goPay: function() {
        var that = this;
        var goodsDetail = this.data.goodsDetail;
        if (wx.getStorageSync('VipId')) {

        } else {
            that.setData({
                popupBol7: true
            });
            return;
        }
        if (goodsDetail.ProDtl[0].Stocks < 1) {
            this.setData({
                popupBol1: true,
            });
            return;
        }

        var newPackageOrder = [{
            'itemId': detailId,
            'Quantity': 1,
            'PriceSell': goodsDetail.SalePrice,
            'ProductName': goodsDetail.ProductName,
            'Url': goodsDetail.PictureUrl,
            'ProDtl': goodsDetail.ProDtl,
        }];
        console.log(newPackageOrder)
        wx.setStorage({
            key: "postPackage",
            data: [],
            success: function(res) {
                wx.setStorage({
                    key: "postNormal",
                    data: newPackageOrder,
                    success: function(res) {
                        wx.navigateTo({
                            url: '../pay/pay',
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
            popupBol: false,
            popupBol1: false,
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
    //适配IphoneX
    autoIphone: function() {
        var that = this;
        wx.getSystemInfo({      
            success: function(res) {
                let modelmes = res.model;
                if (modelmes.search('iPhone X') != -1) {
                    that.setData({         
                        isIphoneX: true
                    });           
                }      
            }
        });
    },
    // 获取formid
    formSubmit: function(e) {
        console.log('form发生了submit事件，携带数据为：', e.detail.formId);

        let formIds = app.globalData.globalFormIds;

        formIds.push(e.detail.formId);
        app.globalData.globalFormIds = formIds;
        this.goPay();
        console.log(app.globalData.globalFormIds)
    },
    onLoad: function(options) {
        // this.getGoodsDetail(options.detailId);
        vipId = wx.getStorageSync('VipId');
        if (wx.getStorageSync('isMember')) {
            this.setData({
                masterBol: true,
            })
        } else {
            this.setData({
                masterBol: false,
            })
        }
        detailId = options.detailId;
        this.setData({
            boxDetailId: options.detailId
        });

        // console.log(detailId)
        this.getGoodsDetail(options.detailId);
        this.getShopCart();
        this.autoIphone();

        this.setData({

        });
    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        return {
            desc: 'BeerQi小程序', // 分享描述
            path: '/pages/detail/detail?detailId=' + detailId // 分享路径
        }
    },

});