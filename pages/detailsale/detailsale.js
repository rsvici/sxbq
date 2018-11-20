var app = getApp();
var request = require('../../utils/requestService.js'); //require请求
var WxParse = require('../../wxParse/wxParse.js');
var newComObj = require('../../utils/comobj.js'); //评论
var courtgoodsNum = 1; //商品数量
var attrVal = 1; //商品规格参数
var goodsMoney = 0; //商品单价
var goodsProdtl = ''; //商品所有规格
var vipId = wx.getStorageSync('VipId');
var detailId; //商品id
var limitGroupBuyId; //秒杀id
var limitCount; //限购数量
var stocks = 0; //库存数量
Page({

    data: {
        popupBol7: false,
        popupBol: false, //弹框提示
        popupBol10: false, //弹框提示
        goodsDetail: {}, //s商品详情
        content: '',
        pingjiaAllNum: '',
        hasMore: false, // 加载
        comment: '', //评论
        commentBol: false, //是否打开
        showPay: false, //打开规格
        goodsNum: 1, //瓶数
        isGoPayBol: false, //是否可以购买
        goodsDetailPrice: 0, //商品价格
        attrValIndex: 0, //参数第几个\
        shopcarNum: 0, //购物车数量
        saleGoodsHaveBug: false, //是否是24瓶
        masterBol: false, //是否是会员
        salesList: {
            t: '0',
            h: '00',
            m: '00',
            s: '00'
        }, //时间列表
        isIphoneX: false,
        isCanClickDtl: false, //是否可以点击规格
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
                    console.log(JSON.parse(response.data.Result));
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
                    var newResData = JSON.parse(response.data.Result);

                    console.log(newResData.PrdProdGroupDetailInfo);

                    newResData.PrdProdGroupDetailInfo.reverse();
                    if (newResData.ProDtl.length < 2) {
                        that.setData({
                            isCanClickDtl: false
                        })
                    } else {
                        that.setData({
                            isCanClickDtl: true
                        })
                    }


                    that.setData({
                        goodsDetail: newResData,
                        pingjiaAllNum: newResData.ProductCom.length,
                        comment: comment,
                        goodsDetailPrice: newResData.ProDtl[0].SalePrice * newResData.ProDtl[0].AttrVal,
                        hasMore: false,

                    });

                    // 规格
                    attrVal = newResData.ProDtl[0].AttrVal;
                    // 价格
                    goodsMoney = newResData.PrdProdGroupDetailInfo[0].GroupBuyPrice;
                    stocks = newResData.ProDtl[0].Stocks;
                    // 商品总参数
                    goodsProdtl = [newResData.ProDtl[0]];

                    // 秒杀id
                    limitGroupBuyId = newResData.PrdProdGroupDetailInfo[0].GroupBuyId;

                    // 限购数量
                    limitCount = newResData.PrdProdGroupDetailInfo[0].LimitCount;
                    // 是否可买
                    if (parseInt(newResData.Capacity) >= 500) {
                        that.setData({
                            isGoPayBol: true,
                        });
                    }

                    // 加载富文本
                    var article = newResData.ProDesc;
                    WxParse.wxParse('article', 'html', article, that, 0);

                    that.numBol();

                    // 时间
                    // 时间
                    // 时间
                    // 时间
                    var salesdate = {};
                    var leftTime = 0;
                    var timeoutupd;

                    function countTime(begin, end) {
                        //获取当前时间  
                        begin = new Date(Date.parse(begin.replace(/-/g, "/")));
                        end = end.replace(/T/g, " ");
                        end = new Date(Date.parse(end.replace(/-/g, "/")));

                        begin = begin.getTime();
                        end = end.getTime();
                        //时间差  
                        //console.log(begin)
                        //console.log(end)
                        leftTime = end - begin;

                        //定义变量 d,h,m,s保存倒计时的时间  
                        lastdateTime(leftTime);
                    }


                    function lastdateTime(dataTime) {
                        salesdate = {};
                        if (dataTime < 0) {
                            return;
                        }

                        // d = Math.floor(leftTime/1000/60/60/24); 
                        salesdate.t = Math.floor(dataTime / 1000 / 60 / 60 / 24);
                        salesdate.h = Math.floor(dataTime / 1000 / 60 / 60 % 24);
                        salesdate.m = Math.floor(dataTime / 1000 / 60 % 60);
                        salesdate.s = Math.floor(dataTime / 1000 % 60);

                        if (salesdate.h <= 9) {
                            salesdate.h = '0' + salesdate.h;
                        }
                        if (salesdate.m <= 9) {
                            salesdate.m = '0' + salesdate.m;
                        }
                        if (salesdate.s <= 9) {
                            salesdate.s = '0' + salesdate.s;
                        }
                    }
                    // 定时
                    timeoutupd = setInterval(function() {
                        leftTime = leftTime - 1000;
                        lastdateTime(leftTime);
                        if (leftTime == 0) {
                            clearInterval(timeoutupd);
                        }
                        that.setData({
                            salesList: salesdate
                        });

                    }, 1000);
                    countTime(newResData.NowTime, newResData.EndTime);

                },
                function(error) {
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
        // if (stocks == 0) {
        //     this.setData({
        //         popupBol1: true
        //     });
        //     return;
        // }
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
        // if (courtgoodsNum >= stocks) {
        //     courtgoodsNum = stocks;
        // }
        if (courtgoodsNum >= limitCount) {
            courtgoodsNum = limitCount;
        }
        this.setData({
            goodsNum: courtgoodsNum
        });
        this.numBol();
    },
    // 选择规格
    choiceTypeFun: function(e) {
        console.log(this.data.isCanClickDtl)
        if (!this.data.isCanClickDtl) {
            return;
        }
        attrVal = e.currentTarget.dataset.item.AttrVal;
        goodsMoney = this.data.goodsDetail.PrdProdGroupDetailInfo[e.currentTarget.dataset.index].GroupBuyPrice;
        // stocks = e.currentTarget.dataset.item.Stocks;
        goodsProdtl = [e.currentTarget.dataset.item];
        limitGroupBuyId = this.data.goodsDetail.PrdProdGroupDetailInfo[e.currentTarget.dataset.index].GroupBuyId;
        limitCount = this.data.goodsDetail.PrdProdGroupDetailInfo[e.currentTarget.dataset.index].LimitCount;

        goodsProdtl[0].SalePrice = this.data.goodsDetail.PrdProdGroupDetailInfo[e.currentTarget.dataset.index].GroupBuyPrice;
        if (courtgoodsNum >= limitCount) {
            courtgoodsNum = limitCount;
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
                goodsDetailPrice: goodsMoney * courtgoodsNum
            });
        } else {
            this.setData({
                isGoPayBol: false,
                goodsDetailPrice: goodsMoney * courtgoodsNum
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
                'IsLimitGroupBuy': true,
                'LimitGroupBuyId': limitGroupBuyId
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
                });
                setTimeout(function() {
                    that.setData({
                        popupBol10: false
                    });
                }, 1000);



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
            popupBol: false
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
                var modelmes = res.model;
                if (modelmes.search('iPhone X') != -1) {
                    that.setData({         
                        isIphoneX: true
                    });           
                }      
            }
        });
    },
    onLoad: function(options) {
        // this.getGoodsDetail(options.detailId);
        detailId = options.detailId;
        // console.log(options.detailId);
        vipId = wx.getStorageSync('VipId');
        courtgoodsNum = 1;
        if (options.detailId == 20185 || options.detailId == 20197) {
            this.setData({
                saleGoodsHaveBug: true
            });
        }
        if (wx.getStorageSync('isMember')) {
            this.setData({
                masterBol: true,
            })
        } else {
            this.setData({
                masterBol: false,
            })
        }
        this.autoIphone();
        this.getGoodsDetail(options.detailId);
        this.getShopCart();
        this.setData({

        });
    },
 onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      desc: 'BeerQi小程序', // 分享描述
      path: '/pages/detailsale/detailsale?detailId=' + detailId // 分享路径
    }
  },
});