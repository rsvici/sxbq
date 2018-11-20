var request = require('../../utils/requestService.js'); //require请求
var utilsMd5 = require('../../utils/md5.js'); //md5请求
var upng = require('../../utils/UPNG.js'); //md5请求
var vipId = wx.getStorageSync('VipId');
var tempFilePaths;
var tempFilePathsOne;
var ctx = wx.createCanvasContext('myCanvas');
Page({
    data: {
        goodsImg: '', //商品图片
        imgUrl: [11, 2, 3], //选择表情图片
        imageBase64: [], //图片base64
        tempFilePaths: [], //上传图片
        comtPics: '', //图片地址 1
        comScore: 1, //评分 1
        comtContent: '', //内容
        itemId: '',
        comtOrderId: 0,
        comtOrderNO: '',
        isCanvas: false
    },
    choiceScore: function(e) {
        var score = e.currentTarget.dataset.comscore;
        var imgUrl = [];
        switch (score) {
            case '1':
                imgUrl = [11, 2, 3];
                break;
            case '2':
                imgUrl = [1, 12, 3];

                break;

            case '3':
                imgUrl = [1, 2, 13];
                break;
        }
        this.setData({
            comScore: score,
            imgUrl: imgUrl,
        });

    },
    bindTextAreaBlur: function(e) {
        // console.log(e.detail.value)
        this.setData({
            comtContent: e.detail.value
        });
    },
    // 添加图片
    addImg: function() {
        var that = this;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    isCanvas: true
                });
                tempFilePaths = res.tempFilePaths;
                that.setData({
                    tempFilePaths: tempFilePaths
                });

                for (var i = 0; i < tempFilePaths.length; i++) {
                    console.log(tempFilePaths[i]);
                    tempFilePathsOne = tempFilePaths[i];
                    ctx.drawImage(tempFilePaths[i], 0, 0, 100, 100);
                    ctx.draw();
                    setTimeout(that.changeBase, 500);
                }

            }
        });


    },
    // 转base64
    changeBase: function() {
        var that = this;
        wx.canvasGetImageData({
            canvasId: 'myCanvas',
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            success: function(res) {
                console.log(res)

                // 3. png编码
                var pngData = upng.encode([res.data.buffer], res.width, res.height);
                // 4. base64编码
                var base64 = wx.arrayBufferToBase64(pngData);
                var postUrl = "api/Vip/UpLoadPic";
                var postData = {
                    Timestamp: '{{$timestamp}}',
                    Args: {
                        'FileName': tempFilePathsOne,
                        'FileContent': base64
                    }
                };
                postData.Args = JSON.stringify(postData.Args);
                request.requestPost(postUrl, postData)
                    .then(function(response) {

                        var res = JSON.parse(response.data.Result);
                        // console.log(res.FileFullUrl);
                        that.setData({
                            comtPics: res.FileFullUrl
                        })

                    }, function(error) {
                        console.log(error);
                    });
            }
        });

    },
    sendComment: function() {
        var that = this;
        if (that.data.comtContent == '') {
            return;
        }

        var postUrl = "api/Porduct/AddProdComment";
        var postData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                ComtPics: that.data.comtPics,
                ComtScore: that.data.comScore,
                ComtContent: that.data.comtContent,
                ItemId: that.data.itemId,
                ComtOrderId: 0,
                ComtOrderNO: that.data.comtOrderNO,
                VipId: wx.getStorageSync('VipId')
            }
        };
        postData.Args = JSON.stringify(postData.Args);
        request.requestPost(postUrl, postData)
            .then(function(response) {

                // console.log(response);
                // return

                if (response.data.Result) {



                    wx.switchTab({
                        url: "../my/my"
                    });
                }
            }, function(error) {
                console.log(error);
            });
    },
    onLoad: function(options) {
        vipId = wx.getStorageSync('VipId');
        ctx.drawImage('http://h5.beerqi.com/imgs/comment/t.png', 0, 0, 85, 100);
        ctx.draw();
        this.setData({
            itemId: options.itemId,
            comtOrderNO: options.itemCode,
            goodsImg: options.imgUrl
        })

    }
});