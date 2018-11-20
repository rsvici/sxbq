var app = getApp();
var request = require('../../utils/requestService.js');
var utilsMd5 = require('../../utils/md5.js'); //require请求
var vipId = wx.getStorageSync('VipId');
var openid = wx.getStorageSync('openId');
var locakGotPackDate;
var newNorObject; //遍历数据
var newPacObject = []; //遍历数据
var isCanGoPay = false;
var PackageCode = ''; //体验卡编号
var beerqiBoxItemId = '';
var capCash = 0; //瓶盖
Page({
    data: {
        isBeerQiTiyanka: false, //是否是体验卡
        popupBol11: false, //提示弹框
        popupBol2: false, //提示弹框
        popupBol8: false, //提示弹框
        popupBol23: false, //提示弹框
        iCanGiveCard: false, //可以给你卡片
        normalGoods: {}, //普通商品列表
        packageGoods: {}, //套装
        fareMoney: 8, //运费
        fare: 8, //显示的运费 
        allMoney: 0, //总金额 
        showAllMoney: 0, //显示的总金额
        masterBol: false, //是否是会员
        masterPrice: 0, //会员价格
        masterSales: 0, //会员节省价格
        discount: 0, //折扣
        money: 0, //实际价格
        redHot: 0, //红包
        bouns: 0, //瓶盖
        isBouns: false, //是否使用瓶盖
        address: [], //地址信息
        addfirst: false, //是否显示地址信息
        hotPacket: {}, //红包列表
        isShowRedHot: false, //是否显示红包列表
        choiceRedhotNum: 110, //红包按钮状态
        couponGrpId: 0, // 红包id
        redHotId: 0, //红包id
        couponNo: 0, //红包编号
        hasMore: false, //加载
        isIphoneX: false, //适配iphoneX
        canUseRedhotPrice: 0, //可以使用的红包价格
        openAddreeSett: false, //打开用户授权

    },
    totlePrice: function() {
        var normalGoods = this.data.normalGoods;
        var packageGoods = this.data.packageGoods;
        var redHot = this.data.redHot;
        var bouns = this.data.bouns;
        var fareMoney = this.data.fareMoney;
        var fare = this.data.fare;
        var isBouns = this.data.isBouns;
        var allMoney = 0;
        var canUseRedhotPrice = 0;
        var discount = 0;
        var money = 0;
        var masterPrice;
        var masterSales;

        // if (this.data.money <= redHot) {
        //     redHot = this.data.allMoney;
        // };



        normalGoods.forEach(function(val, key) {
            allMoney += normalGoods[key].Quantity * normalGoods[key].PriceSell;

            if (normalGoods[key].ItemId == '20185') {} else {
                canUseRedhotPrice += normalGoods[key].Quantity * normalGoods[key].PriceSell;
            }

        });
        packageGoods.forEach(function(val, key) {
            allMoney += packageGoods[key].Quantity * packageGoods[key].PriceSell;

            canUseRedhotPrice += packageGoods[key].Quantity * packageGoods[key].PriceSell;
        });



        // 是否使用瓶盖
        if (!isBouns) {
            bouns = 0;
        }

        // 是否包邮
        if (allMoney >= 128 || beerqiBoxItemId == '20204' || beerqiBoxItemId == '20223' || beerqiBoxItemId == '40') {
            if (beerqiBoxItemId == '20204' || beerqiBoxItemId == '20223' || beerqiBoxItemId == '40') {
                this.setData({
                    isBeerQiTiyanka: true
                });
            }
            fareMoney = 0;
            fare = '-8';
            discount = 8 + redHot + Number(bouns); //折扣            
        } else if (newPacObject.length > 0) {
            if (newPacObject[0].itemId == 36) {
                fareMoney = 0;
                fare = '-8';
                discount = 8 + redHot + Number(bouns); //折扣  
                this.setData({
                    iCanGiveCard: true
                })
            }
        } else {
            fareMoney = 8;
            fare = '8'; //折扣
            discount = redHot + Number(bouns);
        }


        money = allMoney - (Number(bouns) + redHot) + fareMoney; // 实际价格
        if (beerqiBoxItemId == 40) {
            masterPrice = (allMoney * 1).toFixed(2);
            masterSales = 0;
        } else {
            masterPrice = (allMoney * 0.9).toFixed(2);
            masterSales = (allMoney * 0.1).toFixed(2);
        }


        if (wx.getStorageSync('isMember') == true) {
            discount = discount + Number(masterSales);
            money = allMoney - (Number(bouns) + redHot) + fareMoney - Number(masterSales);

        }
        if (money < 8) {
            money = 8;
        }

        money = money.toFixed(2);
        discount = discount.toFixed(2);

        this.setData({
            discount: discount,
            money: money,
            allMoney: allMoney,
            showAllMoney: allMoney.toFixed(2),
            fareMoney: fareMoney,
            fare: fare,
            canUseRedhotPrice: canUseRedhotPrice,
            masterPrice: masterPrice,
            masterSales: masterSales,
        });
    },
    // 获取个人瓶盖
    getPersonInfoBouns: function() {
        var that = this;
        var getUrl = 'api/vip/MySightRelationList';
        var getData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "AppUserId": vipId
            }
        };
        request.requestGet(getUrl, getData)
            .then(function(response) {
                // console.log(JSON.parse(response.data.Result));
                capCash = JSON.parse(response.data.Result)[0].CapCash;
                if (that.data.money < capCash) {
                    capCash = that.data.money;
                    // capCash = 10;
                };

                if (PackageCode) {
                    capCash = 0;
                }

                that.setData({
                    bouns: capCash
                });
            });
    },
    // 使用瓶盖
    isUsedBouns: function() {
        var isBouns = this.data.isBouns;
        if (this.data.money < capCash) {
            capCash = this.data.money - 8;
        };
        if (capCash < 0) {
            capCash = 0;
        }

        isBouns = !isBouns;
        this.setData({
            isBouns: isBouns
        });

        this.totlePrice();
    },

    // 获取地址信息
    getAddress: function() {
        var addressObj = wx.getStorageSync('address');
        if (addressObj) {
            this.setData({
                addfirst: true,
                address: addressObj
            })
        }
    },
    // 管理地址
    goAddress: function() {
        var that = this;
        if (wx.chooseAddress) {
            console.log(1);
            wx.getSetting({
                success: function(resp) {
                    var newIndex = 'scope.address';
                    if (resp.authSetting[newIndex] == false) {
                        that.setData({
                            openAddreeSett: true
                        });
                    } else {
                        wx.chooseAddress({
                            success: function(res) {
                                wx.setStorageSync('address', res);
                                that.getAddress();
                            },
                            fail: function(res) {
                                wx.getSetting({
                                    success: function(respo) {
                                        var newIndex = 'scope.address';
                                        if (respo.authSetting[newIndex] == false) {
                                            that.setData({
                                                openAddreeSett: true
                                            });
                                        }
                                    }
                                });
                            },
                            complete: function(res) {
                                // complete
                            }
                        });
                    }
                }
            });

        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    closeAddreeSett: function(e) {
        console.log(e);
        var that = this;
        var newIndex = 'scope.address';
        if (e.detail.authSetting[newIndex]) {
            that.setData({
                openAddreeSett: false
            });
        }

    },
    // 获取红包列表
    getRedHotList: function() {
        console.log(beerqiBoxItemId)
        switch (beerqiBoxItemId) {
            case '20200':
                PackageCode = 'PM';
                break;

            case '20201':
                PackageCode = 'PS';
                break;

            case '20202':
                PackageCode = 'PH';
                break;

            case '20203':
                PackageCode = 'PY';
                break;

            case '20204':
                PackageCode = 'PW';
                break;
            case '20223':
                PackageCode = 'PW';
                break;
            case '20284':
                PackageCode = 'VM';
                break;
            case '20295':
                PackageCode = 'HYK';
                break;
            case '20294':
                PackageCode = 'MYK';
                break;
            case '20293':
                PackageCode = 'LYK';
                break;
            case '41':
                PackageCode = 'OT';
                break;
            case '42':
                PackageCode = 'OT';
                break;
            case '43':
                PackageCode = 'OT';
                break;
            case '45':
                PackageCode = 'OT';
                break;
            case '36':
                PackageCode = 'PG';
                break;
            default:
                PackageCode = '';
        }

        var that = this;
        var postData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "VipId": vipId,
                "PackageCode": PackageCode
            }
        };
        postData.Args = JSON.stringify(postData.Args);
        var postUrl = 'api/Vip/GetMyCoupons';
        request.requestPost(postUrl, postData)
            .then(function(response) {
                var newHotPacketList = JSON.parse(response.data.Result);
                console.log(newHotPacketList);
                // 遍历数据
                newHotPacketList.forEach(function(val, key) {
                    newHotPacketList[key].EndDate = val.EndDate.slice(0, 10);
                    newHotPacketList[key].IsShow = true;

                    if (newHotPacketList[key].EndDate < locakGotPackDate) {
                        newHotPacketList[key].IsShow = false;
                    }
                    newHotPacketList[key].EndDate = newHotPacketList[key].EndDate.replace('-', '年');
                    newHotPacketList[key].EndDate = newHotPacketList[key].EndDate.replace('-', '月');
                    newHotPacketList[key].EndDate = newHotPacketList[key].EndDate + '日';
                });

                that.setData({
                    hotPacket: newHotPacketList
                });

            }, function(error) {
                console.log(error);
            });
    },

    // 获取本地时间
    getLocalDate: function() {
        var newGotPackDate = new Date();
        // 初始化月 日
        var newGotPackDateMonth, newGotPackDateDate;
        // 月+0
        if ((newGotPackDate.getMonth() + 1) < 10) {
            newGotPackDateMonth = '0' + (newGotPackDate.getMonth() + 1)
        } else {
            newGotPackDateMonth = newGotPackDate.getMonth() + 1
        }
        // 日+0
        if (newGotPackDate.getDate() < 10) {
            newGotPackDateDate = '0' + newGotPackDate.getDate()
        } else {
            newGotPackDateDate = newGotPackDate.getDate()
        }
        // 时间
        locakGotPackDate = newGotPackDate.getFullYear() + '-' + newGotPackDateMonth + '-' + newGotPackDateDate;
    },
    hongbaoIsFun: function() {
        var isShowRedHot = this.data.isShowRedHot;
        isShowRedHot = !isShowRedHot;
        if (beerqiBoxItemId == 36 || beerqiBoxItemId == 40) {
            isShowRedHot = false;
        }
        this.setData({
            isShowRedHot: isShowRedHot
        });
    },
    //判断是否可以使用啤气盒子卷
    isUserBeerQiBox: function() {
        console.log(beerqiBoxItemId);

        console.log(PackageCode);
    },
    // 选择红包
    choiceRedhot: function(e) {
        console.log(e)
        if (e.currentTarget.dataset.item.IsCanUser == false) {
            return;
        }
        console.log(this.data.canUseRedhotPrice);
        console.log(e.currentTarget.dataset.item.CouponPriceLimit);

        if (e.currentTarget.dataset.item.CouponPriceLimit <= this.data.canUseRedhotPrice) {
            this.setData({
                choiceRedhotNum: e.currentTarget.dataset.index,
                redHot: e.currentTarget.dataset.item.CouponValue,
                couponGrpId: e.currentTarget.dataset.item.CouponGrpId,
                redHotId: e.currentTarget.dataset.item.Id,
                couponNo: e.currentTarget.dataset.item.CouponNo
            });
            this.isUserBeerQiBox();
            this.totlePrice();
        } else if (this.data.allMoney > this.data.canUseRedhotPrice) {
            this.setData({
                popupBol2: true
            });

        } else {
            this.setData({
                popupBol8: true
            });
        }

    },
    // 去购买
    goPay: function() {
        var that = this;


        if (isCanGoPay) {
            return;
        }

        if (this.data.addfirst == false) {
            this.setData({
                popupBol11: true
            })
            return;
        }

        // console.log(newNorObject);
        // return;



        // 阻止二次加载
        if (that.data.hasMore) {
            return;
        }

        that.setData({
            hasMore: true
        });

        isCanGoPay = true;
        var newdtls = [];
        var isMemberNum = 1;
        if (wx.getStorageSync('isMember') == true) {
            isMemberNum = 0.9;
        } else {
            isMemberNum = 1;
        }
        if (beerqiBoxItemId == 40) {
            isMemberNum = 1;
        }

        newNorObject.forEach(function(data, index) {
            newdtls[index] = {
                'BarCode': newNorObject[index].ProDtl[0].BarCode,
                'PriceOriginal': newNorObject[index].ProDtl[0].SalePrice * isMemberNum,
                'PriceSell': newNorObject[index].ProDtl[0].SalePrice * isMemberNum,
                'Quantity': newNorObject[index].Quantity,
                'Amount': newNorObject[index].ProDtl[0].SalePrice * newNorObject[index].Quantity * isMemberNum,
                'DiscountMoney': 0,
                'IsGift': 0,
                'ItemNo': newNorObject[index].ProDtl[0].ItemNo,
                'GrouopBuyId': 0
            };
        });

        newPacObject.forEach(function(data, index) {
            newPacObject[index].ProDtl.forEach(function(data, key) {
                newdtls.push({
                    'BarCode': newPacObject[index].ProDtl[key].BarCode,
                    'PriceOriginal': newPacObject[index].ProDtl[key].SalePrice,
                    'PriceSell': newPacObject[index].ProDtl[key].SalePrice,
                    'Quantity': newPacObject[index].Quantity,
                    'Amount': newPacObject[index].ProDtl[key].SalePrice * newPacObject[index].Quantity,
                    'DiscountMoney': 0,
                    'IsGift': 0,
                    'ItemNo': newPacObject[index].ProDtl[key].ItemNo,
                    'GrouopBuyId': newPacObject[index].ProDtl[key].GroupBuyId
                });
            });
        });

        var redHot = this.data.redHot;
        var fare = this.data.fareMoney;
        var DiscountMoney = 8 - fare + this.data.redHot;
        var couponGrpId = this.data.couponGrpId;
        var redHotId = this.data.redHotId;
        var couponNo = this.data.couponNo;
        var address = this.data.address;
        var dingdanlist = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "PayTime": "{{$timestamp}}",
                "ExpressFee": fare,
                "BuyerCode": vipId,
                "DiscountMoney": DiscountMoney,
                "RecvConsignee": address.userName,
                "RecvTel": address.telNumber,
                "RecvAddress": address.detailInfo,
                "RecvProvince": address.provinceName,
                "RecvCity": address.cityName,
                "RecvCounty": address.countyName,
                "Dtls": newdtls,
                "PayType": 0,
                'GiftType': couponGrpId,
                'CouponNo': "",
                'CouponId': redHotId,
                'UseBonus': this.data.bouns,
                'PackageCode': PackageCode
            }
        };
        console.log(dingdanlist);
        // return;

        dingdanlist.Args = JSON.stringify(dingdanlist.Args);

        var postOrderUrl = 'api/morder/ordadd';
        console.log(newNorObject)
        request.requestPost2(postOrderUrl, dingdanlist)
            .then(function(response) {
                isCanGoPay = false;
                if (response.data.StatusCode == 200) {
                    that.clearOrderShopcar();
                    that.wxPay(response.data.Msg);
                }
            }, function(error) {
                console.log(error);
            });


    },
    // 微信支付
    wxPay: function(OrderNum) {
        var that = this;
        var wxPay = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'OrderNum': OrderNum,
                'TradeType': 'WxApp',
                'OpenId': openid
            }
        };
        wxPay.Args = JSON.stringify(wxPay.Args);
        var wxPayUrl = 'api/pay/GetPrePay';
        request.requestPost(wxPayUrl, wxPay)
            .then(function(response) {
                console.log(JSON.parse(response.data.Result));
                var WxPayData = JSON.parse(response.data.Result);
                that.paySign(WxPayData)
            }, function(error) {
                console.log(error);
            });
    },
    paySign: function(WxPayData) {
        var that = this;
        var paySignStringA = "appId=wxcb963f50666e82a8&nonceStr=" + WxPayData.NonceStr + "&package=prepay_id=" + WxPayData.PrepayId + "&signType=MD5&timeStamp=" + WxPayData.TimeStamp + "&key=xoe9328djsj382832dsjoppzqq230qw2";

        var sign = utilsMd5.hexMD5(paySignStringA).toUpperCase();
        console.log(paySignStringA, sign);
        wx.requestPayment({
            'timeStamp': WxPayData.TimeStamp,
            'nonceStr': WxPayData.NonceStr,
            'package': 'prepay_id=' + WxPayData.PrepayId,
            'signType': 'MD5',
            'paySign': sign,
            'success': function(res) {
                if (that.data.iCanGiveCard) {
                    that.setData({
                        popupBol23: true
                    })
                } else {
                    wx.switchTab({
                        url: "../my/my"
                    });
                }
            },
            'fail': function(res) {
                wx.switchTab({
                    url: "../shopcar/shopcar"
                });
            },
            'complete': function(res) {
                that.setData({
                    hasMore: false
                });
            }
        })

    },
    // 清除信息
    clearOrderShopcar: function() {
        // 删除
        newNorObject.forEach(function(data, index) {
            var delContent = {
                Timestamp: '{{$timestamp}}',
                Args: {
                    'Id': newNorObject[index].Id
                }
            };
            delContent.Args = JSON.stringify(delContent.Args);
            var postDelUrl = 'api/Porduct/DelMyCart';
            request.requestPost(postDelUrl, delContent)
                .then(function(response) {}, function(error) {});
        });

        // 删除
        newPacObject.forEach(function(data, index) {
            var delContent = {
                Timestamp: '{{$timestamp}}',
                Args: {
                    'Id': newPacObject[index].Id
                }
            };
            delContent.Args = JSON.stringify(delContent.Args);
            var postDelUrl = 'api/Porduct/DelMyCart';
            request.requestPost(postDelUrl, delContent)
                .then(function(response) {}, function(error) {});
        });

        // 清除
        wx.setStorage({
            key: "postNormal",
            data: [],
            success: function(res) {
                wx.setStorage({
                    key: "postPackage",
                    data: [],
                    success: function(res) {},
                });
            },
        });
    },

    // 关闭提示弹框
    closePopup: function() {
        this.setData({
            popupBol11: false,
            popupBol2: false,
            popupBol8: false,
        });
    },
    // 关闭提示弹框
    closePopupCard: function() {
        this.setData({
            popupBol23: false,
        });
        wx.switchTab({
            url: "../my/my"
        });
    },
    //适配IphoneX
    autoIphone: function() {
        var that = this;
        wx.getSystemInfo({      
            success: function(res) {
                // console.log(res)
                let modelmes = res.model;
                if (modelmes.search('iPhone X') != -1) {
                    that.setData({         
                        isIphoneX: true
                    });           
                }      
            }
        });
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
                app.globalData.globalFormIds = [];
                console.log(response);
            }, function(error) {});

    },
    onLoad: function(options) {
        var that = this;
        that.SaveFormId();
        that.setData({
            hasMore: false
        });
        this.getAddress();
        vipId = wx.getStorageSync('VipId');
        openid = wx.getStorageSync('openId');
        // 是否是会员
        if (wx.getStorageSync('isMember')) {
            this.setData({
                masterBol: true,
            })
        } else {
            this.setData({
                masterBol: false,
            })
        }


        // 组合商品
        wx.getStorage({
            key: 'postPackage',
            success: function(rest) {
                newPacObject = rest.data;

                wx.getStorage({
                    key: 'postNormal',
                    success: function(res) {
                        that.setData({
                            normalGoods: res.data,
                            packageGoods: rest.data
                        });
                        newNorObject = res.data;
                        if (res.data.length > 0) {
                            beerqiBoxItemId = res.data[0].itemId;
                        } else if (rest.data.length > 0) {
                            beerqiBoxItemId = rest.data[0].itemId;
                        } else {
                            beerqiBoxItemId = '';
                        }
                        that.totlePrice();
                        that.getRedHotList();
                    }
                });

            }
        });


        this.autoIphone();
        this.getPersonInfoBouns();

    }
});