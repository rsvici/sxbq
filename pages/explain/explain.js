var request = require('../../utils/requestService.js'); //require请求
var vipId = wx.getStorageSync('VipId');

var explain = [{
    nav: '啤气值规则',
    title: '当前啤气值 :',
    url: 'http://h5.beerqi.com/imgs/explain/2.jpg'
}, {
    nav: '瓶盖规则',
    title: '当前瓶盖 :',
    url: 'http://h5.beerqi.com/imgs/explain/3.jpg'
}, {
    nav: '用户等级说明',
    title: '当前等级 :',
    url: 'http://h5.beerqi.com/imgs/explain/4.jpg'
}]

Page({
    data: {
        title: '',
        nav: '',
        content: ''
    },
    // 获取个人信息
    getVipSighInfo: function(choiceIndex) {
        var that = this;
        var getUrl = 'api/vip/MySightRelationList';
        var getData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                'AppUserId': vipId
            }
        };
        request.requestGet(getUrl, getData)
            .then(function(response) {

                var res = JSON.parse(response.data.Result);
                console.log(res)
                switch (choiceIndex) {
                    case '0':
                        that.setData({
                            content: res[0].Bouns,
                        });
                        break;

                    case '1':
                        that.setData({
                            content: res[0].CapCash,
                        });
                        break;
                    case '2':
                        that.setData({
                            content: res[0].GradeName,
                        });
                        break;
                }




            }, function(error) {
                console.log(error);
            });

    },
    onLoad: function(options) {
        vipId = wx.getStorageSync('VipId');
        console.log(options)
        wx.setNavigationBarTitle({
            title: explain[options.choiceNum].nav
        });
        this.setData({
            title: explain[options.choiceNum].title,
            url: explain[options.choiceNum].url,
        });
        this.getVipSighInfo(options.choiceNum);

    }
});