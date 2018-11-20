var app = getApp();
var request = require('../../utils/requestService.js'); //require请求
var newStart = 3; //   加载第几个
var newLength = 4; // 加载长度
var getGooodListData; //商品列表 参数 dara
var getGooodListUrl = 'api/Porduct/ProdLst'; // 商品列表url
var keyWord = ''; // 关键字
var changeTitleNumDesc = 1; //排序正序倒序
var vipId = wx.getStorageSync('VipId');
var countryId = '';
Page({

    data: {
        cardList: [], //啤气盒子列表
        popupBol: false, //提示弹框
        popupBol1: false, //提示弹框
        popupBol10: false, //提示弹框
        activityBol: true, //是否显示活动弹框
        winHeight: "", //窗口高度
        currentTab: 2, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        changetitlenum: 1, //排序类型
        expertList: [],
        hasMore: false,
        refreshAnimation: '',
        countryListContentId: 0, //国家选择第几个
        recommendList: '',
        salesList: '',
        MathRandomPic: '', //图片随机数
        countryList: [{
            'state': '比利时',
            'pinpai': [{
                'title': '福佳',
                'brandId': '10819'
            }, {
                'title': '阿诗',
                'brandId': '10665'
            }, {
                'title': '小丑',
                'brandId': '10726'
            }, {
                'title': '科娜',
                'brandId': '10849'
            }, {
                'title': '舒弗',
                'brandId': '10861'
            }, {
                'title': '粉象',
                'brandId': '10714'
            }, {
                'title': '罗斯福',
                'brandId': '10722'
            }, {
                'title': '罗登巴赫',
                'brandId': '10720'
            }, {
                'title': '督威',
                'brandId': '10713'
            }, {
                'title': '金龙',
                'brandId': '10716'
            }, {
                'title': '金博根',
                'brandId': '10715'
            }, {
                'title': '布鲁日',
                'brandId': '10710'
            }, {
                'title': '卡斯特',
                'brandId': '10717'
            }, {
                'title': '布雷帝国',
                'brandId': '10731'
            }, {
                'title': '圣佛洋',
                'brandId': '10723'
            }, {
                'title': '快克',
                'brandId': '10732'
            }, {
                'title': '圣路易',
                'brandId': '10733'
            }, {
                'title': '圣马丁',
                'brandId': '10724'
            }, {
                'title': '林德曼',
                'brandId': '10719'
            }, {
                'title': '1830',
                'brandId': '10729'
            }, {
                'title': '乐飞',
                'brandId': '10718'
            }, {
                'title': '西麦尔',
                'brandId': '10725'
            }, {
                'title': '罗登巴赫',
                'brandId': '10720'
            }, {
                'title': '乐蔓',
                'brandId': '10859'
            }, {
                'title': '马里斯',
                'brandId': '10858'
            }, {
                'title': '布马',
                'brandId': '10711'
            }, {
                'title': '阿韦伯德',
                'brandId': '10730'
            }, {
                'title': '博纳尔',
                'brandId': '10709'
            }, {
                'title': '布什',
                'brandId': '10798'
            }, {
                'title': '智美',
                'brandId': '10727'
            }, {
                'title': '山树精',
                'brandId': '10734'
            }, {
                'title': '匪徒',
                'brandId': '10797'
            }, {
                'title': '极乐',
                'brandId': '10742'
            }, {
                'title': '卡美里特',
                'brandId': '10746'
            }, {
                'title': '奥麦尔',
                'brandId': '10804'
            }, {
                'title': '莱佛',
                'brandId': '10805'
            }, {
                'title': '时代',
                'brandId': '10820'
            }, {
                'title': '芙力草莓',
                'brandId': '11044'
            }]
        }, {
            'state': '加拿大',
            'pinpai': [{
                'title': '罗塞尔',
                'brandId': '10857'
            }]
        }, {
            'state': '美国',
            'pinpai': [{
                'title': '鹅岛',
                'brandId': '10837'
            }, {
                'title': '卡尔施特劳斯',
                'brandId': '10832'
            }, {
                'title': '北岸',
                'brandId': '10843'
            }, {
                'title': '布鲁克林',
                'brandId': '10842'
            }, {
                'title': '百威',
                'brandId': '10821'
            }, {
                'title': '美国大道',
                'brandId': '11041'
            }, {
                'title': '火石行者',
                'brandId': '11043'
            }, {
                'title': '邪恶双胞胎',
                'brandId': '11048'
            }, {
                'title': '打嗝海狸',
                'brandId': '11049'
            }, {
                'title': '罗格',
                'brandId': '10844'
            }, {
                'title': '肯塔基',
                'brandId': '11051'
            }, {
                'title': '岬角',
                'brandId': '11052'
            }, {
                'title': '灰熊共和国',
                'brandId': '11053'
            }, {
                'title': '艾尔史密斯',
                'brandId': '11054'
            }, {
                'title': '绿闪',
                'brandId': '11055'
            }, {
                'title': '左手',
                'brandId': '11056'
            }, {
                'title': '角头鲨',
                'brandId': '11060'
            }, {
                'title': '内华达',
                'brandId': '11061'
            }, {
                'title': '巨石',
                'brandId': '11068'
            }]
        }, {
            'state': '日本',
            'pinpai': [{
                'title': '常陆野',
                'brandId': '10831'
            }]
        }, {
            'state': '墨西哥',
            'pinpai': [{
                'title': '科罗娜',
                'brandId': '10823'
            }, {
                'title': '多瑟瑰',
                'brandId': '10854'
            }, {
                'title': '苏尔',
                'brandId': '11064'
            }]
        }, {
            'state': '德国',
            'pinpai': [{
                'title': '范佳乐-教士',
                'brandId': '10809'
            }, {
                'title': '艾丁格',
                'brandId': '10862'
            }]
        }, {
            'state': '印度',
            'pinpai': [{
                'title': '印度翠鸟',
                'brandId': '10815'
            }]
        }, {
            'state': '澳洲',
            'pinpai': [{
                'title': '詹伯格',
                'brandId': '10838'
            }, {
                'title': '老狐狸詹姆斯',
                'brandId': '10840'
            }, {
                'title': '图希',
                'brandId': '10839'
            }, {
                'title': '酒花精灵',
                'brandId': '10852'
            }, {
                'title': 'XXXX Gold',
                'brandId': '10841'
            }, {
                'title': '莫宁顿',
                'brandId': '10834'
            }]
        }, {
            'state': '法国',
            'pinpai': [{
                'title': '克伦堡',
                'brandId': '10864'
            }, {
                'title': '法国北佬',
                'brandId': '10817'
            }]
        }, {
            'state': '英国',
            'pinpai': [{
                'title': '替牌',
                'brandId': '10830'
            }, {
                'title': '精酿狗',
                'brandId': '10860'
            }, {
                'title': '鹿头',
                'brandId': '11047'
            }]
        }, {
            'state': '丹麦',
            'pinpai': [{
                'title': '美奇乐',
                'brandId': '10848'
            }]
        }, {
            'state': '爱尔兰',
            'pinpai': [{
                'title': '美格纳斯',
                'brandId': '10853'
            }, {
                'title': "健力士",
                'brandId': "11036"
            }]
        }, {
            'state': '意大利',
            'pinpai': [{
                'title': '奥马亚',
                'brandId': '10811'
            }, {
                'title': '威尼斯骑士',
                'brandId': '10810'
            }, {
                'title': '巴拉丁',
                'brandId': '10813'
            }]
        }, {
            'state': '中国',
            'pinpai': [{
                'title': '拳击猫',
                'brandId': '11063'
            }, {
                'title': '开巴',
                'brandId': '11038'
            }, {
                'title': '高大师',
                'brandId': '11050'
            }]
        }, {
            'state': '荷兰',
            'pinpai': [{
                'title': '喜力',
                'brandId': '11038'
            }, {
                'title': '梦果酌',
                'brandId': '11057'
            }]
        }, {
            'state': '新西兰',
            'pinpai': [{
                'title': '大蜥蜴',
                'brandId': '11058'
            }, {
                'title': '啤八怪',
                'brandId': '11059'
            }]
        }],
        countryListContent: [{
            'title': '福佳',
            'brandId': '10819'
        }, {
            'title': '阿诗',
            'brandId': '10665'
        }, {
            'title': '小丑',
            'brandId': '10726'
        }, {
            'title': '科娜',
            'brandId': '10849'
        }, {
            'title': '舒弗',
            'brandId': '10861'
        }, {
            'title': '粉象',
            'brandId': '10714'
        }, {
            'title': '罗斯福',
            'brandId': '10722'
        }, {
            'title': '罗登巴赫',
            'brandId': '10720'
        }, {
            'title': '督威',
            'brandId': '10713'
        }, {
            'title': '金龙',
            'brandId': '10716'
        }, {
            'title': '金博根',
            'brandId': '10715'
        }, {
            'title': '布鲁日',
            'brandId': '10710'
        }, {
            'title': '卡斯特',
            'brandId': '10717'
        }, {
            'title': '布雷帝国',
            'brandId': '10731'
        }, {
            'title': '圣佛洋',
            'brandId': '10723'
        }, {
            'title': '快克',
            'brandId': '10732'
        }, {
            'title': '圣路易',
            'brandId': '10733'
        }, {
            'title': '圣马丁',
            'brandId': '10724'
        }, {
            'title': '林德曼',
            'brandId': '10719'
        }, {
            'title': '1830',
            'brandId': '10729'
        }, {
            'title': '乐飞',
            'brandId': '10718'
        }, {
            'title': '西麦尔',
            'brandId': '10725'
        }, {
            'title': '罗登巴赫',
            'brandId': '10720'
        }, {
            'title': '乐蔓',
            'brandId': '10859'
        }, {
            'title': '马里斯',
            'brandId': '10858'
        }, {
            'title': '布马',
            'brandId': '10711'
        }, {
            'title': '阿韦伯德',
            'brandId': '10730'
        }, {
            'title': '博纳尔',
            'brandId': '10709'
        }, {
            'title': '布什',
            'brandId': '10798'
        }, {
            'title': '智美',
            'brandId': '10727'
        }, {
            'title': '山树精',
            'brandId': '10734'
        }, {
            'title': '匪徒',
            'brandId': '10797'
        }, {
            'title': '极乐',
            'brandId': '10742'
        }, {
            'title': '卡美里特',
            'brandId': '10746'
        }, {
            'title': '奥麦尔',
            'brandId': '10804'
        }, {
            'title': '莱佛',
            'brandId': '10805'
        }, {
            'title': '时代',
            'brandId': '10820'
        }, {
            'title': '芙力草莓',
            'brandId': '11044'
        }, {
            'title': '梦果酌',
            'brandId': '11057'
        }],
    },
    // 滚动切换标签样式
    switchTab: function(e) {
        this.setData({
            currentTab: e.detail.current
        });
    },
    // 点击标题切换当前页时改变样式
    swichNav: function(e) {
        var cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            });
        }
        if (cur == 0) {
            countryId = "";
            keyWord = '';
            this.getGoodsList();
        }
    },
    // 根据条件排序
    changeTitle: function(e) {
        var that = this;
        that.setData({
            changetitlenum: e.currentTarget.dataset.changetitlenum,
            expertList: []
        });
        countryId = '';
        if (changeTitleNumDesc == 1) {
            changeTitleNumDesc = 0;
        } else {
            changeTitleNumDesc = 1;
        }
        this.getGoodsList();
    },

    // 上拉加载
    onReachBottom: function() {
        this.getGoodsListMore();
    },

    // 获取商品列表 
    getGoodsList: function() {
        var that = this;
        if (that.data.hasMore) {
            return;
        }
        that.setData({
            expertList: []
        });
        newStart = 3;
        that.setData({
            hasMore: true
        });
        getGooodListData = {
            Ver: 51,
            AppUserId: 1,
            BrandId: 1,
            CopId: 1,
            Timestamp: '{{$timestamp}}',
            Platform: 2,
            Args: {
                "KeyWord": keyWord,
                "OrderType": that.data.changetitlenum,
                "OrderDirection": changeTitleNumDesc,
                "PageIndex": 1,
                "PageSize": 8,
                "VipId": vipId,
                'CountryId': countryId
            }
        };
        request.requestGet(getGooodListUrl, getGooodListData)
            .then(function(response) {
                var newJsonres = JSON.parse(response.data.Result)
                for (var i = 0; i < newJsonres.length; i++) {
                    newJsonres[i].masterPrice = (newJsonres[i].ProDtl[0].SalePrice * 0.9).toFixed(2)
                }
                console.log(newJsonres);

                that.setData({
                    expertList: newJsonres,
                    hasMore: false,
                });

            }, function(error) {
                console.log(error);
            });
    },

    // 加载获取商品列表
    getGoodsListMore: function() {
        var that = this;
        if (that.data.hasMore) {
            return;
        }
        that.setData({
            hasMore: true
        });
        getGooodListData = {
            Ver: 51,
            AppUserId: 1,
            BrandId: 1,
            CopId: 1,
            Timestamp: '{{$timestamp}}',
            Platform: 2,
            Args: {
                "KeyWord": keyWord,
                "OrderType": that.data.changetitlenum,
                "OrderDirection": changeTitleNumDesc,
                "PageIndex": newStart,
                "PageSize": newLength,
                "VipId": vipId,
                'CountryId': countryId
            }
        };
        var newGoodsList = this.data.expertList;
        request.requestGet(getGooodListUrl, getGooodListData)
            .then(function(response) {
                var newJsonres = JSON.parse(response.data.Result);
                for (var i = 0; i < newJsonres.length; i++) {
                    newJsonres[i].masterPrice = (newJsonres[i].ProDtl[0].SalePrice * 0.9).toFixed(2)
                }

                for (var i = 0; i < newJsonres.length; i++) {
                    newGoodsList.push(newJsonres[i]);
                }
                that.setData({
                    expertList: newGoodsList,
                    hasMore: false,
                });
                newStart += 1;
            }, function(error) {
                console.log(error);
            });
    },

    // 搜索商品
    searchGoods: function(event) {
        keyWord = event.detail.value;
        this.getGoodsList();
    },
    // 加入购物车
    goodsJoinShopcar: function(e) {
        var that = this;
        var goodsContent = e.currentTarget.dataset.item;
        console.log(goodsContent);
        if (wx.getStorageSync('VipId')) {
            if (goodsContent.ProDtl[0].Stocks <= 0) { //库存不足
                this.setData({
                    popupBol: true
                });
                return;
            }
            var postJoinShopCarData = {
                Timestamp: '{{$timestamp}}',
                Args: {
                    'Id': 0,
                    'ItemId': goodsContent.Id,
                    'Quantity': 1,
                    'PriceSell': goodsContent.ProDtl[0].SalePrice,
                    "VipId": vipId,
                    'BarCodeId': goodsContent.ProDtl[0].Id,
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
                    console.log(response);
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
        } else {
            that.setData({
                popupBol1: true
            });
        }
    },
    //  //  //
    //  //  //
    //  //  //
    // 国家 //
    //  //  //
    //  //  //
    //  //  //
    // 国家搜索商品
    listSearchGoods: function(event) {
        this.setData({
            currentTab: 0
        });
        countryId = '';
        keyWord = event.detail.value;
        this.getGoodsList();
    },

    // 选择国家 显示品牌
    choiceCountry: function(e) {
        var countryListContentIndex = e.currentTarget.dataset.index;
        this.setData({
            countryListContent: this.data.countryList[countryListContentIndex].pinpai,
            countryListContentId: e.currentTarget.dataset.index
        });
    },
    // 选择品牌 显示相应的商品
    choiceCountryShowGoods: function(event) {
        this.setData({
            currentTab: 0,
            hasMore: false
        });
        countryId = event.currentTarget.dataset.countryid;
        this.getGoodsList();
    },
    // 推荐
    getRecommnd: function() {
        var that = this;
        var getRecommndUrl = 'api/Porduct/ProdExtendLst';
        var getRecommndData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "ExtendType": 0,
                "PageIndex": 1,
                "PageSize": 99
            }
        };
        request.requestGet(getRecommndUrl, getRecommndData)
            .then(function(response) {
                that.setData({
                    recommendList: JSON.parse(response.data.Result)
                });
            }, function(error) {
                console.log(error);
            });

    },
    // 套装
    getPackage: function() {
        var that = this;
        var getPackageUrl = 'api/Porduct/ProdCombinationLst';
        var getPackageData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "ExtendType": 0,
                "PageIndex": 1,
                "PageSize": 99
            }
        };
        request.requestGet(getPackageUrl, getPackageData)
            .then(function(response) {
                that.setData({
                    packageList: JSON.parse(response.data.Result)
                });
            }, function(error) {
                console.log(error);
            });

    },
    // 秒杀
    getSalesList: function() {
        var that = this;
        var getSalesListUrl = 'api/Porduct/ProdGroupLst';
        var getSalesData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "GroupType": 2,
                "PageIndex": 1,
                "PageSize": 50
            }
        };
        request.requestGet(getSalesListUrl, getSalesData)
            .then(function(response) {
                var salesListObj = JSON.parse(response.data.Result)
                var timeoutupd;

                salesListObj.forEach(function(value, key) {
                    // qingchu
                    var salesdate = {};
                    var leftTime = 0;
                    // 秒杀
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

                        salesListObj[key].newSalesDate = salesdate;
                    }
                    // 定时
                    timeoutupd = setInterval(function() {
                        leftTime = leftTime - 1000;
                        lastdateTime(leftTime);

                        if (leftTime == 0) {
                            that.getSalesList();
                            clearInterval(timeoutupd);
                        }
                        that.setData({
                            salesList: salesListObj
                        });

                    }, 1000);
                    countTime(salesListObj[key].DateTimeNow, salesListObj[key].EndDate);
                });


            }, function(error) {
                console.log(error);
            });

    },
    // 关闭活动弹窗
    closeBQactivity: function() {
        this.setData({
            activityBol: false
        });
    },
    //去活动页面
    goActivity: function() {
        // wx.navigateTo({
        //     url: "../activity/activity"
        // });

        wx.navigateTo({
            url: "../activity/activity"
        });
    },
    // 关闭提示弹框
    closePopup: function() {
        this.setData({
            popupBol: false,
        });
    },
    // 关闭提示弹框
    closePopup1: function() {
        this.setData({
            popupBol1: false
        });
        wx.navigateTo({
            url: "../bindphone/bindphone"
        });
    },
    // 获取啤气盒子列表 
    getCardList: function() {
        var that = this;
        // that.setData({ hasMore: true });
        var getGooodListUrl = "api/Porduct/ProdPackageLst";
        var getGooodListData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "VipId": vipId
            }
        };
        request.requestGet(getGooodListUrl, getGooodListData)
            .then(function(response) {
                that.setData({
                    hasMore: false
                });
                console.log(JSON.parse(response.data.Result));
                var newcardList = [];
                var cardList = JSON.parse(response.data.Result);
                newcardList[0] = cardList[1];
                newcardList[1] = cardList[2];
                newcardList[2] = cardList[0];
                newcardList[3] = cardList[6];
                newcardList[4] = cardList[5];
                newcardList[5] = cardList[4];
                newcardList[6] = cardList[3];

                that.setData({
                    cardList: newcardList,
                });
            }, function(error) {
                console.log(error);
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
    onShow: function() {
        // 获取商品列表
        vipId = wx.getStorageSync('VipId');
        if (vipId) {} else {
            vipId = null;
        }
    },
    onLoad: function() {
        // 高度自适应
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR;
                that.setData({
                    winHeight: calc
                });
            }
        });
        // 获取商品列表
        vipId = wx.getStorageSync('VipId');
        if (vipId) {

        } else {
            vipId = null;
        }

        // 获取随机数
        this.setData({
            MathRandomPic: app.globalData.MathRandomPic
        })


        this.getCardList();
        this.getGoodsList();
        this.getRecommnd();
        this.getPackage();
        this.getSalesList();
    },

    onShareAppMessage: function() {
        // 用户点击右上角分享
        return {
            desc: 'BeerQi小程序', // 分享描述
            path: '/pages/index/index' // 分享路径
        }
    },
});