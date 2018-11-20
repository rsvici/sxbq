var app = getApp();
var request = require('../../utils/requestService.js'); //require请求
var WxParse = require('../../wxParse/wxParse.js');
var allcomment;
var courtgoodsNum = 1; //商品数量
var goodsMoney = 0; //商品单价
var goodsProdtl = ''; //商品所有规格
var vipId = wx.getStorageSync('VipId');;
var productId; //商品id
Page({

    data: {
        no40price: true,
        popupBol10: false, //弹框提示
        goodsDetail: {}, //s商品详情
        content: '',
        pingjiaAllNum: '',
        hasMore: false, // 加载
        showPay: false, //打开规格
        goodsNum: 1, //瓶数
        goodsDetailPrice: 0, //商品价格
        shopcarNum: 0, //购物车数量
        popupBol7: false,
        popupBol1: false,
        popupBol21: false,
        popupBol22: false,
        popupBol25: false,
        isIphoneX: false,
        onSalePrice: 0, //折扣价格
        masterPrice: 0, //会员价格
        masterBol: false, //是否是会员
        pakageIsPay: false, //是否可以够买套装
        thisGoodsJoinShopCar: true, //是否可以加入购物车
    },
    // 获取商品列表
    getGoodsDetail: function(productId) {
        var that = this;
        if (that.data.hasMore) {
            return;
        }
        that.setData({ hasMore: true });
        var getUrl = 'api/Porduct/GetProdCombination';
        var getData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "CombinationId": productId
            }
        };
        request.requestGet(getUrl, getData)
            .then(function(response) {
                console.log(JSON.parse(response.data.Result));

                var newJsonres = JSON.parse(response.data.Result);

                newJsonres.masterPrice = (newJsonres.Price * 0.9).toFixed(2);
                that.setData({
                    goodsDetail: newJsonres,
                    goodsDetailPrice: JSON.parse(response.data.Result).Price,
                    hasMore: false,
                    onSalePrice: (JSON.parse(response.data.Result).Price * JSON.parse(response.data.Result).ProDtl[0].AttrVal * 0.1).toFixed(2),
                    masterPrice: (JSON.parse(response.data.Result).Price * JSON.parse(response.data.Result).ProDtl[0].AttrVal * 0.9).toFixed(2)
                });
                if (productId == 40) {
                    newJsonres.masterPrice = (newJsonres.Price).toFixed(2);
                    that.setData({
                        no40price: false,
                        goodsDetail: newJsonres,
                        onSalePrice: 0,
                        masterPrice: (JSON.parse(response.data.Result).Price * JSON.parse(response.data.Result).ProDtl[0].AttrVal).toFixed(2)
                    });

                }
                // 价格
                goodsMoney = JSON.parse(response.data.Result).Price;
                // 商品总参数
                goodsProdtl = JSON.parse(response.data.Result).ProDtl;
                // 加载富文本
                var article = JSON.parse(response.data.Result).Details;
                WxParse.wxParse('article', 'html', article, that, 0);
            }, function(error) {
                console.log(error);
            });
    },
    // 打开选择规格
    openChoiceType: function() {
        var that = this;
        if (this.data.pakageIsPay) {
            if (vipId) {
                that.setData({
                    showPay: true
                });

            } else {
                that.setData({
                    popupBol7: true
                });
                return;
            }
        } else {
            that.setData({
                popupBol22: true
            });
        }
        if (productId == 40 && wx.getStorageSync('isMember') == false) {
            that.setData({
                popupBol25: true
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
        if (productId == 40) {
            return;
        }
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
        if (productId == 36 || productId == 40) {
            this.setData({
                popupBol21: true
            })
            return;
        }
        courtgoodsNum++;
        this.setData({
            goodsNum: courtgoodsNum
        });
        this.numBol();
    },

    // 计算价格
    numBol: function() {
        this.setData({
            goodsDetailPrice: goodsMoney * courtgoodsNum,
            onSalePrice: (goodsMoney * courtgoodsNum * 0.1).toFixed(2),
            masterPrice: (goodsMoney * courtgoodsNum * 0.9).toFixed(2),
        });

    },
    // 加入购物车
    joinShopCar: function() {
        var that = this;
        if (goodsProdtl.Stocks <= courtgoodsNum) {
            return;
        }
        var postJoinShopCarData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'Id': 0,
                'ItemId': productId,
                'Quantity': courtgoodsNum,
                "VipId": vipId,
                'BarCodeId': 0,
                'GroupBuyId': productId,
                'IsGroupBuy': true,
                'PriceSell': goodsMoney
            }
        };
        console.log(postJoinShopCarData)
            // return;
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
    // 获取是否可以下单
    isPackageGoPay: function(GroupBuyId, IsVip) {
        var that = this;
        var getRecommndUrl = 'api/morder/ValidIsBuy';
        var getRecommndData = {
            Timestamp: 20180826132123,
            Args: {
                "LoginId": wx.getStorageSync('VipId'),
                "GroupBuyId": GroupBuyId,
                'IsVip': IsVip
            }
        };
        getRecommndData.Args = JSON.stringify(getRecommndData.Args);
        request.requestPost2(getRecommndUrl, getRecommndData)
            .then(function(response) {
                // var newRes = JSON.parse(response.data.Result);
                console.log(response.data.Result);

                that.setData({
                    pakageIsPay: response.data.Result.IsBuy,
                });

            }, function(error) {
                console.log(error);
            });


    },
    // 去下单
    goPay: function() {
        var that = this;

        if (productId == 40 && wx.getStorageSync('isMember') == false) {
            that.setData({
                popupBol25: true
            });
            return;
        }
        var goodsDetail = this.data.goodsDetail;
        var newPackageOrder = [{
            'itemId': productId,
            'Quantity': courtgoodsNum,
            'PriceSell': goodsDetail.Price,
            'ProductName': goodsDetail.Name,
            'Url': goodsDetail.PictureUrl,
            'ProDtl': goodsDetail.ProDtl
        }];

        wx.setStorage({
            key: "postNormal",
            data: [],
            success: function(res) {
                wx.setStorage({
                    key: "postPackage",
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
            popupBol1: false,
            popupBol21: false,
            popupBol22: false,
            popupBol25: false,
        });
    },
    // 跳转提示弹框
    goodPopup: function() {
        wx.navigateTo({
            url: "../member/member"
        });
    },
    // 跳转提示弹框
    goodPopupOpenWeb: function() {
        if (productId == 36) {
            wx.redirectTo({
                url: "../detailpack_1/detailpack_1"
            });
        } else if (productId == 40) {
            wx.redirectTo({
                url: "../detailpack_1/detailpack_1"
            });
        }

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
    // 上传formID
    SaveFormId: function() {
        var formContent = {
            Timestamp: '{{$timestamp}}',
            Args: {
                OpenId: wx.getStorageSync('openId'),
                FormIds: app.globalData.globalFormIds
            }
        };
        var getUrl = 'api/sys/SaveFormId';
        request.requestGet(getUrl, formContent)
            .then(function(response) {

                console.log(response);
            }, function(error) {});

    },
    onLoad: function(options) {
        this.SaveFormId();
        // this.getGoodsDetail(options.productId);
        productId = options.productId;
        // productId = 40;
        vipId = wx.getStorageSync('VipId');
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
        if (productId == 36 || productId == 40) {
            this.setData({
                thisGoodsJoinShopCar: false
            })
            var IsVip = false;
            if (productId == 40) {
                IsVip = true;
            }
            this.isPackageGoPay(productId, IsVip)
        } else {
            this.setData({
                pakageIsPay: true
            })
        }
        this.getGoodsDetail(productId);
        this.getShopCart();
        this.autoIphone();

        this.setData({});
    }





});