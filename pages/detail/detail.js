var app = getApp();
var request = require('../../utils/requestService.js'); //require请求
var newComObj = require('../../utils/comobj.js'); //评论
var WxParse = require('../../wxParse/wxParse.js');
var courtgoodsNum = 1; //商品数量
var attrVal = 1; //商品规格参数
var goodsMoney = 0; //商品单价
var goodsProdtl = ''; //商品所有规格
var vipId = wx.getStorageSync('VipId');
var detailId; //商品id
var stocks = 0; //库存数量
Page({

    data: {
        goodsDetail: {}, //商品详情
        content: '',
        pingjiaAllNum: '',
        hasMore: false, // 加载
        comment: '', //评论
        commentBol: false, //是否打开
        showPay: false, //打开规格
        goodsNum: 1, //瓶数
        isGoPayBol: false, //是否可以购买
        attrValIndex: 0, //参数第几个\
        shopcarNum: 0, //购物车数量
        popupBol: false, //提示弹框
        popupBol1: false,
        popupBol10: false,
        popupBol7: false,
        popupBol21: false,
        isIphoneX: false,
        goodsDetailPrice: 0, //商品价格
        masterBol: false, //是否是会员
        onSalePrice: 0, //折扣价格
        masterPrice: 0, //会员价格
    },
    // 获取商品列表
    getGoodsDetail: function(ProductId) {
        var that = this;
        /*  if (that.data.hasMore) {
             return;
         } */
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

                var newJsonres = JSON.parse(response.data.Result);
                newJsonres.masterPrice = (newJsonres.ProDtl[0].SalePrice * 0.9).toFixed(2);

                console.log(newJsonres);
                that.setData({
                    goodsDetail: newJsonres,
                    comment: comment,
                    goodsDetailPrice: JSON.parse(response.data.Result).ProDtl[0].SalePrice * JSON.parse(response.data.Result).ProDtl[0].AttrVal,
                    hasMore: false,
                    onSalePrice: (JSON.parse(response.data.Result).ProDtl[0].SalePrice * JSON.parse(response.data.Result).ProDtl[0].AttrVal * 0.1).toFixed(2),
                    masterPrice: (JSON.parse(response.data.Result).ProDtl[0].SalePrice * JSON.parse(response.data.Result).ProDtl[0].AttrVal * 0.9).toFixed(2)
                });

                // 规格
                attrVal = JSON.parse(response.data.Result).ProDtl[0].AttrVal;
                // 价格
                goodsMoney = JSON.parse(response.data.Result).ProDtl[0].SalePrice;
                stocks = JSON.parse(response.data.Result).ProDtl[0].Stocks;
                // 商品总参数
                goodsProdtl = [JSON.parse(response.data.Result).ProDtl[0]];

                // 是否可买
                if (parseInt(JSON.parse(response.data.Result).Capacity) >= 500) {
                    that.setData({
                        isGoPayBol: true,
                    });
                }

                // 加载富文本
                var article = JSON.parse(response.data.Result).ProDesc;
                WxParse.wxParse('article', 'html', article, that, 0);

                that.numBol();
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
    // 打开选择规格
    openChoiceType: function() {

        var that = this;
        if (stocks == 0) {
            this.setData({
                popupBol1: true
            });
            return;
        }
        if (vipId) {
            that.setData({
                showPay: true
            });
        } else {
            that.setData({
                popupBol7: true
            });
        }
    },
    // 关闭选择规格
    closeChoiceType: function() {
        var that = this;
        that.setData({
            showPay: false
        });
    },
    // 减小瓶数
    numDel: function() {
        courtgoodsNum--;
        if (courtgoodsNum <= 1) {
            courtgoodsNum = 1;
        }
        this.setData({
            goodsNum: courtgoodsNum
        });
        this.numBol();
    },
    // 增加瓶数
    numAdd: function() {
        courtgoodsNum++;
        if (courtgoodsNum > stocks) {
            courtgoodsNum = stocks;
            this.setData({
                popupBol21: true
            });
            console.log(1)
        }
        this.setData({
            goodsNum: courtgoodsNum
        });
        this.numBol();
    },
    // 选择规格
    choiceTypeFun: function(e) {
        stocks = e.currentTarget.dataset.item.Stocks;
        if (stocks == 0) {
            this.setData({
                popupBol1: true
            });
            return;
        }
        attrVal = e.currentTarget.dataset.item.AttrVal;
        goodsMoney = e.currentTarget.dataset.item.SalePrice;

        goodsProdtl[0] = e.currentTarget.dataset.item;
        if (courtgoodsNum >= stocks) {
            courtgoodsNum = stocks;
        }
        this.setData({
            goodsNum: courtgoodsNum,
            attrValIndex: e.currentTarget.dataset.index
        });
        this.numBol();
    },

    // 计算价格
    numBol: function() {
        if (courtgoodsNum % 6 == 0 || attrVal > 5 || parseInt(this.data.goodsDetail.Capacity) >= 550) {
            this.setData({
                isGoPayBol: true,
                goodsDetailPrice: goodsMoney * courtgoodsNum,
                onSalePrice: (goodsMoney * courtgoodsNum * 0.1).toFixed(2),
                masterPrice: (goodsMoney * courtgoodsNum * 0.9).toFixed(2),
            });
        } else {
            this.setData({
                isGoPayBol: false,
                goodsDetailPrice: goodsMoney * courtgoodsNum,
                onSalePrice: (goodsMoney * courtgoodsNum * 0.1).toFixed(2),
                masterPrice: (goodsMoney * courtgoodsNum * 0.9).toFixed(2),
            });
        }

    },
    // 加入购物车
    joinShopCar: function() {
        var that = this;
        if (goodsProdtl[0].Stocks <= courtgoodsNum) {
            return;
        }
        var postJoinShopCarData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'Id': 0,
                'ItemId': detailId,
                'Quantity': courtgoodsNum,
                'PriceSell': goodsProdtl[0].SalePrice,
                "VipId": vipId,
                'BarCodeId': goodsProdtl[0].Id,
                'GroupBuyId': 0,
                'IsGroupBuy': 'false',
                'IsLimitGroupBuy': false,
                'LimitGroupBuyId': 0
            }
        };
        postJoinShopCarData.Args = JSON.stringify(postJoinShopCarData.Args);
        var postJoinShopCarUrl = 'api/Porduct/AddMyCart';
        request.requestPost(postJoinShopCarUrl, postJoinShopCarData)
            .then(function(response) {
                // console.log(response);
                that.getShopCart();
                that.setData({
                    popupBol10: true
                })
                setTimeout(function() {
                    that.setData({
                        popupBol10: false
                    })
                }, 1000)


            }, function(error) {
                console.log(error);
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
        if (!this.data.isGoPayBol) {
            this.setData({
                popupBol: true
            });
            return;
        }
        var that = this;
        var goodsDetail = this.data.goodsDetail;
        var newPackageOrder = [{
            'itemId': detailId,
            'Quantity': courtgoodsNum,
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
            popupBol21: false,
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
        console.log(app.globalData.globalFormIds)
    },
    onLoad: function(options) {
        // this.getGoodsDetail(options.detailId);
        vipId = wx.getStorageSync('VipId');
        detailId = options.detailId;
        courtgoodsNum = 1;
        if (wx.getStorageSync('isMember')) {
            this.setData({
                masterBol: true,
            })
        } else {
            this.setData({
                masterBol: false,
            })
        }
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