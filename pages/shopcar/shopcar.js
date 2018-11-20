// pages/search/search.js
var vipId = wx.getStorageSync('VipId');
var request = require('../../utils/requestService.js');
var SalesOnlyOne = false; //秒杀商品只有一件
var postOrder; //下单商品
Page({
    data: {
        carts: [], // 购物车内商品数据
        //  hasList: tue,          // 列表是否有数据
        totalPrice: 0, // 总价，初始为0
        selectAll: false, // 全选状态，默认不全选
        selectNum: 0, //选中的件数
        isCanGoPay: false,
        startX: 0, //开始坐标
        startY: 0,
        popupBol: false, //提示弹框
        popupBol5: false, //提示弹框
        popupBol9: false,
        popupBol21: false,
        masterBol: false, //是否是会员
        masterPrice: 0, //会员价格
        masterSales: 0, //会员节省价格
    },
    //计算总价格
    totlePrice: function() {
        let carts = this.data.carts;
        let total = 0;
        let Quantity = 0;
        var shopcarGoodsNum = 0;
        for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据    
            if (carts[i].selected) { // 判断选中才会计算价格
                total += carts[i].Quantity * carts[i].PriceSell;
                Quantity += carts[i].Quantity;
            }

            if (carts[i].selected) {
                if (carts[i].IsGroupBuy == false) {
                    if (parseInt(carts[i].ProDtl[0].Capacity) < 550 || carts[i].ProDtl[0].Capacity == null) {
                        shopcarGoodsNum = Number(shopcarGoodsNum) + carts[i].Quantity * carts[i].ProDtl[0].AttrVal;
                    }
                }
            }
        }
        if (shopcarGoodsNum % 6 == 0) {
            this.setData({
                isCanGoPay: true
            })
        } else {
            this.setData({
                isCanGoPay: false
            })
        }
        var masterPrice = (total * 0.9).toFixed(2);
        var masterSales = (total * 0.1).toFixed(2);
        this.setData({
            selectNum: Quantity,
            totalPrice: total.toFixed(2),
            masterPrice: masterPrice,
            masterSales: masterSales,
        });

        console.log(carts)

    },

    //选中反选
    selected: function(e) {
        const index = e.currentTarget.dataset.num;
        let carts = this.data.carts;
        let count = 0;

        // 过期商品
        if ((carts[index].IsVaildLimit == false) && carts[index].IsLimitGroupBuy) {
            this.setData({
                popupBol9: true
            });
            return;
        }



        if (carts[index].IsLimitGroupBuy && carts[index].selected) { //取消选择秒杀商品
            SalesOnlyOne = false;
        } else if (carts[index].IsLimitGroupBuy && SalesOnlyOne) { //第二次选择秒杀商品
            this.setData({
                popupBol5: true
            });
            return;
        } else if (carts[index].IsLimitGroupBuy) { //首次选择秒杀商品
            SalesOnlyOne = true;
        }
        carts[index].selected = !carts[index].selected; //赋值选中状态
        this.setData({
            carts: carts,
            selectAll: false
        });
        this.totlePrice();
    },
    //全选
    selectedAll: function() {
        let selectAll = this.data.selectAll; // 是否全选状态
        selectAll = !selectAll;
        let carts = this.data.carts;
        SalesOnlyOne = false;
        let selectedAllNum = 0;
        var that = this;


        for (let i = 0; i < carts.length; i++) {
            carts[i].selected = selectAll; // 改变所有商品状态
            if (carts[i].IsLimitGroupBuy) {
                if (selectedAllNum == 0) {
                    if (carts[i].IsVaildLimit == false) {
                        carts[i].selected = false;
                    } else {
                        carts[i].selected = selectAll;
                        selectedAllNum++;
                    }

                } else if (selectedAllNum == 1) {
                    if (selectAll) {
                        SalesOnlyOne = true;
                        that.setData({
                            popupBol5: true
                        });
                    }
                    carts[i].selected = false;

                } else {
                    carts[i].selected = false;
                }
            }
        }
        this.setData({
            selectAll: selectAll,
            carts: carts
        });
        this.totlePrice(); // 获取总价
    },
    //增加
    addNum: function(e) {
        const index = e.currentTarget.dataset.num;
        let carts = this.data.carts;
        let Quantity = carts[index].Quantity;
        Quantity = Quantity + 1;


        if (carts[index].IsLimitGroupBuy) {
            if (Quantity > carts[index].ProDtl[0].LimitCount) {
                return;
            }
        }
        if (Quantity > carts[index].ProDtl[0].Stocks) {
            this.setData({
                popupBol21: true
            })
            return;
        }

        carts[index].Quantity = Quantity;
        if (carts[index].ProDtl[0].BarCode == "HOE053") {
            carts[index].Quantity = 1;
            this.setData({
                popupBol21: true
            })
            return;
        }
        this.setData({
            carts: carts
        });
        this.totlePrice();
        this.updShopCart(index, 1);
    },
    //减少
    subNum: function(e) {
        const index = e.currentTarget.dataset.num;
        let carts = this.data.carts;
        let Quantity = carts[index].Quantity;
        if (Quantity <= 1) {
            return false;
        }
        Quantity = Quantity - 1;
        carts[index].Quantity = Quantity;
        this.setData({
            carts: carts
        });
        this.totlePrice();
        this.updShopCart(index, -1);
    },

    // 修改数量
    updShopCart: function(n, updShopCartNum) {
        let carts = this.data.carts;
        let Quantity = carts[n].Quantity;
        console.log(carts);
        let updShopCartContent;
        if (carts[n].IsGroupBuy) {
            updShopCartContent = {
                Timestamp: '{{$timestamp}}',
                Args: {
                    'Id': carts[n].Id,
                    'ItemId': carts[n].ItemId,
                    'Quantity': updShopCartNum,
                    "PriceSell": carts[n].PriceSell,
                    "VipId": vipId,
                    'BarCodeId': carts[n].BarId
                }
            };
        } else {
            updShopCartContent = {
                Timestamp: '{{$timestamp}}',
                Args: {
                    'Id': carts[n].Id,
                    'ItemId': carts[n].ItemId,
                    'Quantity': updShopCartNum,
                    "PriceSell": carts[n].PriceSell,
                    "VipId": parseInt(vipId),
                    'BarCodeId': carts[n].BarId,
                    'GroupBuyId': 0,
                    'IsGroupBuy': 'false'
                }
            };
        }
        console.log(updShopCartContent);

        updShopCartContent.Args = JSON.stringify(updShopCartContent.Args);
        var updShopCartUrl = 'api/Porduct/AddMyCart';

        request.requestPost(updShopCartUrl, updShopCartContent)
            .then(function(response) {
                console.log(response);
            }, function(error) {
                console.log(error);
            });

    },


    // 获取购物车列表
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
                console.log(newRes);
                newRes.forEach(function(value, key) {
                    newRes[key].selected = false;
                    if (newRes[key].ProDtl[0].BarCode == "HOE053" || newRes[key].ProDtl[0].GroupBuyId == 36) {
                        newRes[key].Quantity = 1;
                    }
                    if (newRes[key].Quantity <= 0) {
                        newRes[key].Quantity = 1
                    }

                    if (newRes[key].IsGroupBuy == false) {
                        newRes[key].PriceSell = newRes[key].ProDtl[0].SalePrice;
                    }
                    if (newRes[key].IsLimitGroupBuy) {
                        if (newRes[key].Quantity >= newRes[key].ProDtl[0].LimitCount) {
                            newRes[key].Quantity = newRes[key].ProDtl[0].LimitCount;
                        }

                    }
                    if (newRes[key].Quantity >= newRes[key].ProDtl[0].Stocks) {
                        newRes[key].Quantity = newRes[key].ProDtl[0].Stocks;
                    }
                });

                that.setData({
                    carts: newRes
                })
            }, function(error) {
                console.log(error);
            });
    },
    countPrice: function() {
        let carts = this.data.carts;
        let isCanGoPay = this.data.isCanGoPay;
        var postOrder = [];
        postOrder.packageall = [];
        postOrder.normalall = [];
        carts.forEach(function(value, key) {
            if (carts[key].selected) {
                if (carts[key].IsGroupBuy == false) {
                    postOrder.normalall.push(carts[key]);
                } else {
                    postOrder.packageall.push(carts[key]);
                }
            }

        });
        if (isCanGoPay == true && (postOrder.packageall.length == 0 && postOrder.normalall.length == 0)) {
            this.setData({
                popupBol: true
            });
            return;
        } else if (isCanGoPay == false) {
            this.setData({
                popupBol: true
            });
            return;
        }


        console.log(postOrder.normalall);
        wx.setStorage({
            key: "postNormal",
            data: postOrder.normalall,
            success: function(res) {
                wx.setStorage({
                    key: "postPackage",
                    data: postOrder.packageall,
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
    //手指触摸动作开始 记录起点X坐标
    touchstart: function(e) {
        //开始触摸时 重置所有删除
        this.data.carts.forEach(function(v, i) {
            if (v.isTouchMove) //只操作为true的
                v.isTouchMove = false;
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            carts: this.data.carts
        })
    },
    //滑动事件处理
    touchmove: function(e) {
        var that = this,
            index = e.currentTarget.dataset.index, //当前索引
            startX = that.data.startX, //开始X坐标
            startY = that.data.startY, //开始Y坐标
            touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
            //获取滑动角度
            angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
        that.data.carts.forEach(function(v, i) {
                v.isTouchMove = false;
                //滑动超过30度角 return
                if (Math.abs(angle) > 30) return;
                if (i == index) {
                    if (touchMoveX > startX) //右滑
                        v.isTouchMove = false;
                    else //左滑
                        v.isTouchMove = true;
                }
            })
            //更新数据
        that.setData({
            carts: that.data.carts
        });
    },
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function(start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
            //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    //删除事件
    del: function(e) {
        var that = this;
        var delcarts = that.data.carts;
        var delIndex = e.currentTarget.dataset.index;
        var delShopCarData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'Id': delcarts[delIndex].Id
            }
        };
        delShopCarData.Args = JSON.stringify(delShopCarData.Args);
        var delShopCarUrl = 'api/Porduct/DelMyCart';
        request.requestPost(delShopCarUrl, delShopCarData)
            .then(function(response) {
                delcarts.splice(e.currentTarget.dataset.index, 1);
                that.setData({
                    carts: delcarts
                })
            }, function(error) {
                console.log(error);
            });
    },
    // 关闭提示弹框
    closePopup: function() {
        this.setData({
            popupBol: false,
            popupBol9: false,
            popupBol5: false,
            popupBol21: false,
        });
    },
    // 加载
    /**
     * 生命周期函数--监听页面显示
     */

    onShow: function() {
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
        SalesOnlyOne = false;
        this.totlePrice();
        this.getShopCart();
        this.setData({
            totalPrice: 0,
            selectAll: false
        });
    }

})