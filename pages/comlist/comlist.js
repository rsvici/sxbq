var request = require('../../utils/requestService.js'); //require请求
var newComObj = require('../../utils/comobj.js'); //评论
Page({
    data: {
        comment: '', //评论
        hasMore: false,
        ProductName: '', //商品名
    },
    // 获取商品列表
    getGoodsDetail: function(ProductId) {
        var that = this;
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

                console.log(JSON.parse(response.data.Result));
                that.setData({
                    comment: JSON.parse(response.data.Result).ProductCom,
                    hasMore: false,
                    ProductName: JSON.parse(response.data.Result).ProductName
                });
                that.onReachBottom();
            }, function(error) {
                console.log(error);
            });
    },
    onReachBottom: function() {
        var that = this;
        that.setData({
            hasMore: true
        });
        var ComObj = {}; //初始化评论列表
        var comment = this.data.comment;
        var ProductName = this.data.ProductName;
        for (var i = 0; i <= 8; i++) { //每次显示八条数据
            //名称随机
            var nameRadom = Math.round(Math.random() * 124);

            //评论随机
            var codeRadom = Math.round(Math.random() * 125);

            //图片对象
            var newPicList = '';

            //评论是否有图片
            var imgRadomBol = Math.round(Math.random() * 1000);
            var imgRadom = Math.round(Math.random() * 7) + 1;

            if (imgRadomBol < 20) {
                for (var j = 0; j <= 8; j++) {
                    var keyWord = newComObj.commentList.imgs[j].keyWord;
                    //判断是否有特殊图片
                    if (ProductName.indexOf(keyWord) == '-1') {

                    } else {
                        // 一共多少图片
                        var imgSpecialRadomSize = newComObj.commentList.imgs[j].picList;

                        //文件夹名称
                        var imgSpecialPicName = newComObj.commentList.imgs[j].picName;

                        //随机图片数字
                        var imgSpecialRadom = Math.round(Math.random() * imgSpecialRadomSize) + 1;

                        //随机图片
                        newPicList = [{
                            PictureUrl: 'https://h5.beerqi.com/imgs/comment/' + imgSpecialPicName + '/' + imgSpecialRadom + '.jpg'
                        }];

                    }
                }
            } else if (imgRadomBol > 990) {
                newPicList = [{
                    PictureUrl: 'https://h5.beerqi.com/imgs/comment/all/' + imgRadom + '.jpg'
                }];
            } else if (imgRadomBol < 160) {
                for (var z = 0; z <= 8; z++) {
                    //判断是否有特殊图片
                    if (ProductName.indexOf('盒子') == '-1') {

                    } else {
                        // 一共多少图片
                        // var imgSpecialRadomSize1 = newComObj.commentList.imgs[z].picList;

                        //文件夹名称
                        // var imgSpecialPicName1 = newComObj.commentList.imgs[z].picName;

                        //随机图片数字
                        var imgSpecialRadom1 = Math.round(Math.random() * 136) + 1;

                        //随机图片
                        newPicList = [{
                            PictureUrl: 'https://h5.beerqi.com/imgs/comment/box/' + imgSpecialRadom1 + '.jpg'
                        }];

                    }
                }
            } else {
                newPicList = '';
            }

            comment.push({
                UserName: newComObj.commentList.name[nameRadom],
                ComtComment: newComObj.commentList.code[codeRadom],
                PicLists: newPicList
            });
        }

        this.setData({
            comment: comment,
            hasMore: false
        });

    },
    onLoad: function(options) {
        this.getGoodsDetail(options.detailId);
    }
});