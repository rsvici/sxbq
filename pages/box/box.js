var request = require('../../utils/requestService.js'); //require请求
Page({
    data: {
        expertList: [], //啤气盒子列表
        hasBeerBox: false, //是否具有啤气盒子商品
        isshow: false,
        sendTimeBox: [],
        sendTime: false,
        ShareCode: '',
        beerqiSendGoodsShow: false,
        popupBol15: false,
        openC5ChildWeb: false,
        expertListItem: [],
    },
    openNoBeerQiList: function() {
        this.setData({
            popupBol15: true
        });
    },
    closePopup: function() {
        this.setData({
            popupBol15: false
        });
    },
    // 获取啤气盒子订单列表 
    getBeerqiBoxOrderList: function() {
        var that = this;
        var getOrderListUrl = "api/Porduct/MyPackageLst";
        var getOrderListData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "VipId": wx.getStorageSync('VipId')
            }
        };

        // 下周一时间
        var today = new Date();
        var oneday = 1000 * 60 * 60 * 24;
        var nextMonday = today.getDay();
        if (nextMonday == 0) {
            nextMonday = 7;
        }

        var endTime = new Date(today - oneday * (-8 + nextMonday));
        // console.log(endTime, nextMonday);

        request.requestGet(getOrderListUrl, getOrderListData)
            .then(function(response) {
                that.setData({
                    isshow: true
                });
                var beerBoxListRes = JSON.parse(response.data.Result);
                for (var i = 0; i < beerBoxListRes.length; i++) {
                    beerBoxListRes[i].isitemShow = false;
                    if (beerBoxListRes[i].IsPayed && (beerBoxListRes[i].OrderStatus != 0)) {
                        that.setData({
                            hasBeerBox: true
                        });
                    }

                    // 获取订单前两位标识
                    var newCode = beerBoxListRes[i].Code.slice(0, 2);

                    // 显示瓶盖个数
                    beerBoxListRes[i].Num = [];

                    // 开始时间
                    var beginTime1 = Date.parse(beerBoxListRes[i].PayTime.replace(/T/g, " ").replace(/-/g, "/"));
                    var newBeginTime = new Date(beginTime1);

                    if (newBeginTime.getDay() == 0) {
                        newBeginTime = new Date(beginTime1 + (1000 * 60 * 60 * 24 * 7));
                    }


                    var beginTime = newBeginTime.getTime();

                    //经历的时间
                    var leftTime = endTime - beginTime;
                    var useTimeNum = Math.floor(leftTime / (1000 * 60 * 60 * 24) / 7);





                    var beerBoxListResLenth = 0;
                    switch (newCode) {
                        case 'PM':
                            beerBoxListRes[i].sign = 'c2';
                            beerBoxListResLenth = 4;
                            break;
                        case 'PS':
                            beerBoxListRes[i].sign = 'c3';
                            beerBoxListResLenth = 12;
                            break;
                        case 'PY':
                            beerBoxListRes[i].sign = 'c5';
                            beerBoxListResLenth = 52;
                            break;
                        case 'PH':
                            beerBoxListRes[i].sign = 'c4';
                            beerBoxListResLenth = 24;
                            break;
                        case 'PW':
                            beerBoxListRes[i].sign = 'c1';
                            beerBoxListResLenth = 1;
                            break;
                    }
                    // 已发货
                    if (useTimeNum > beerBoxListResLenth) {
                        useTimeNum = beerBoxListResLenth;
                    }

                    var sendTime; //经历的时间
                    // 未发货时间
                    var sunDayPayNextMonday = newBeginTime.getDay();
                    if (sunDayPayNextMonday == 0) {
                        sunDayPayNextMonday = 7;
                        // useTimeNum = useTimeNum - 1;
                    }

                    for (var x = 0; x < useTimeNum; x++) {
                        sendTime = new Date(newBeginTime - oneday * (-1 - (7 * (x + 1)) + sunDayPayNextMonday));
                        // console.log(sendTime);
                        beerBoxListRes[i].Num[x] = {
                            isCheck: 'check',
                            num: x,
                            year: sendTime.getFullYear(),
                            mouth: sendTime.getMonth() + 1,
                            day: sendTime.getDate(),
                        };
                    }
                    // 未发货
                    for (var j = useTimeNum; j < beerBoxListResLenth; j++) {
                        sendTime = new Date(newBeginTime - oneday * (-1 - (7 * (j + 1)) + sunDayPayNextMonday));
                        // console.log(sendTime);
                        beerBoxListRes[i].Num[j] = {
                            isCheck: 'uncheck',
                            num: j,
                            year: sendTime.getFullYear(),
                            mouth: sendTime.getMonth() + 1,
                            day: sendTime.getDate(),
                        };
                    }
                }

                console.log(beerBoxListRes);
                that.setData({
                    expertList: beerBoxListRes
                });
            }, function(error) {
                console.log(error);
            });
    },
    openChildBox: function(e) { //打开盒子商品列表
        var index = e.currentTarget.dataset.index;
        var expertList = this.data.expertList;
        for (let i = 0; i < expertList.length; i++) {
            expertList[i].isitemShow = false;
        }
        expertList[index].isitemShow = true;
        this.setData({
            openC5ChildWeb: false
        });
        if (expertList[index].sign == 'c1') {
            this.openSendBoxc1(e.currentTarget.dataset.index);

        } else if (expertList[index].sign == 'c5') {
            this.setData({
                expertListItem: [expertList[index]],
                openC5ChildWeb: true
            });
        }

        this.setData({
            expertList: expertList
        });
    },
    openSendBoxc1: function(index) { //打开详细单商品
        var expertList = this.data.expertList;

        var litItem = expertList[index].Num[0];
        console.log(litItem)
        if (litItem.isCheck == "uncheck") {
            this.setData({
                beerqiSendGoodsShow: true
            });
        } else {
            this.setData({
                beerqiSendGoodsShow: false
            });
        }
        expertList[index].isitemShow = false;
        for (var x = 0; x < expertList.length; x++) {
            expertList[x].sendTime = false;

        }
        expertList[index].sendTime = true;

        this.setData({
            expertList: expertList,
            sendTimeBox: litItem,
        });
    },
    openSendBox: function(e) { //打开详细单商品
        var litItem = e.currentTarget.dataset.lititem;
        var index = e.currentTarget.dataset.index;
        var expertList = this.data.expertList;
        if (litItem.isCheck == "uncheck") {
            this.setData({
                beerqiSendGoodsShow: true
            })
        } else {
            this.setData({
                beerqiSendGoodsShow: false
            })
        }

        expertList[index].isitemShow = false;
        for (var x = 0; x < expertList.length; x++) {
            expertList[x].sendTime = false;

        }
        expertList[index].sendTime = true;


        this.setData({
            expertList: expertList,
            sendTimeBox: litItem,
        });
    },
    openSendBoxYear: function(e) { //打开年卡详细单商品
        var litItem = e.currentTarget.dataset.lititem;
        var expertList = this.data.expertList;
        var expertListItem = this.data.expertListItem;
        if (litItem.isCheck == "uncheck") {
            this.setData({
                beerqiSendGoodsShow: true
            })
        } else {
            this.setData({
                beerqiSendGoodsShow: false
            })
        }

        expertListItem[0].isitemShow = false;
        for (var x = 0; x < expertList.length; x++) {
            expertList[x].sendTime = false;

        }
        expertListItem[0].sendTime = true;


        this.setData({
            expertListItem: expertListItem,
            expertList: expertList,
            sendTimeBox: litItem,
        });
    },
    openSendtest: function() { //关闭发货时间
        var expertList = this.data.expertList;
        var expertListItem = this.data.expertListItem;
        if (expertListItem) {
            expertListItem = '';
        }
        for (let i = 0; i < expertList.length; i++) {
            expertList[i].sendTime = false;
        }
        this.setData({
            expertList: expertList,
            expertListItem: expertListItem,
        });
    },
    getShareCode: function() { //获取分享码
        var that = this;
        var getCardListUrl = "api/Vip/GetShareCode";
        var getCardListData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "AppUserId": wx.getStorageSync('VipId')
            }
        };

        request.requestGet(getCardListUrl, getCardListData)
            .then(function(response) {
                that.setData({
                    ShareCode: response.data.Result
                });
                console.log(response.data.Result);
            }, function(error) {
                console.log(error);
            });
    },
    onLoad: function() {
        this.getBeerqiBoxOrderList();
        this.getShareCode();

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