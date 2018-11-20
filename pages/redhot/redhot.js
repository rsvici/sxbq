var request = require('../../utils/requestService.js'); //require请求
var vipId = wx.getStorageSync('VipId');
var locakGotPackDate; //本地时间
Page({
    data: {
        hotPacket: [],
        isHotPacketBol: false
    },
    // 获取红包
    getRedHotList: function() {
        var that = this;
        var postData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "VipId": wx.getStorageSync('VipId'),
            }
        };
        postData.Args = JSON.stringify(postData.Args);
        var postUrl = 'api/Vip/GetMyCoupons';
        request.requestPost(postUrl, postData)
            .then(function(response) {
                var newHotPacketList = JSON.parse(response.data.Result);
                console.log(newHotPacketList);
                if (newHotPacketList.length == 0) {
                    that.setData({
                        isHotPacketBol: true
                    });
                } else {
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
                }



            }, function(error) {
                console.log(error);
            });
    },
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
            newGotPackDateDate = newGotPackDate.getDate();
        }
        // 时间
        locakGotPackDate = newGotPackDate.getFullYear() + '-' + newGotPackDateMonth + '-' + newGotPackDateDate;
    },
    onShow: function() {
        vipId = wx.getStorageSync('VipId');
        this.getLocalDate();
        this.getRedHotList();
    }


})