var app = getApp();
var request = require('../../utils/requestService.js'); //require请求
var choiceAnswerIndex2 = []; //初始化11题
var choiceAnswerIndex4 = [false, false, false, false, false, false, false, false, false, false]; //初始化多选题
Page({
    data: {

        questionObjs: [{
            title: 1,
            question: [{
                content: 'A.我是老司机了',
                mark: 3
            }, {
                content: 'B.入坑许久，收货不少',
                mark: 2
            }, {
                content: 'C.才刚入坑，有待学习',
                mark: 1
            }, {
                content: 'D.边缘徘徊，等待时机',
                mark: 0
            }]
        }, {
            title: 2,
            question: [{
                content: 'A.一个人独享',
                mark: 0
            }, {
                content: 'B.二人世界',
                mark: 0
            }, {
                content: 'C.朋友聚会',
                mark: 0
            }, {
                content: 'D.无所谓场合，关键看酒',
                mark: 0
            }]
        }, {
            title: 3,
            question: [{
                content: 'A.几乎天天喝，已经养成习惯',
                mark: 0
            }, {
                content: 'B.每周畅饮一回',
                mark: 0
            }, {
                content: 'C.每月小酌一次',
                mark: 0
            }, {
                content: 'D.不固定时间，随心情而定',
                mark: 0
            }]
        }, {
            title: 4,
            question: [{
                content: 'A.“千杯不倒”',
                mark: 0
            }, {
                content: 'B.大部分人都喝不过我',
                mark: 0
            }, {
                content: 'C.喝的不多还能应付',
                mark: 0
            }, {
                content: 'D.完全不擅拼酒',
                mark: 0
            }]
        }, {
            title: 5,
            question: [{
                content: 'A.对生活品质的追求',
                mark: 0
            }, {
                content: 'B.只是因为好喝身边朋友都喝，所以也去尝试',
                mark: 0
            }, {
                content: 'C.没什么看法',
                mark: 0
            }]
        }, {
            title: 6,
            question: [{
                content: 'A.苦瓜',
                mark: 3
            }, {
                content: 'B.黑巧克力',
                mark: 2
            }, {
                content: 'C.不加糖和奶的咖啡',
                mark: 1
            }, {
                content: 'D.银杏（或生杏仁）',
                mark: 0
            }]
        }, {
            title: 7,
            question: [{
                content: 'A.鲜榨柠檬汁',
                mark: 3
            }, {
                content: 'B.陈年米醋',
                mark: 2
            }, {
                content: 'C.山楂果脯',
                mark: 1
            }, {
                content: 'D.无添加原味酸奶',
                mark: 0
            }]
        }, {
            title: 8,
            question: [{
                content: 'A.完全不能接受',
                mark: 3
            }, {
                content: 'B.有微微回甘会很好',
                mark: 2
            }, {
                content: 'C.果酒的话当然是酸甜一点比较好喝',
                mark: 1
            }, {
                content: 'D.我怕苦，越甜越好',
                mark: 0
            }]
        }, {
            title: 9,
            question: [{
                content: 'A.越浓越好，酒浓才香',
                mark: 3
            }, {
                content: 'B.可接受一般的酒精味道，不要太浓',
                mark: 2
            }, {
                content: 'C.最好感受不到酒精味',
                mark: 0
            }, {
                content: 'D.无所谓，只要好喝就行',
                mark: 1
            }]
        }, {
            title: 10,
            question: [{
                content: 'A.有， 我只喝那几种风格',
                mark: 0
            }, {
                content: 'B.有，但不会刻意只选择那一两种',
                mark: 0
            }, {
                content: 'C.没有，所有风格都能够接受，只要好喝',
                mark: 0
            }]
        }, {
            title: 11,
            question: [{
                content: 'A.各种形式的IPA',
                smallcontent: '啤酒花的香味十分浓郁，口感丰富，但较白啤果酒更苦涩，风味很多，特色很明显，初入门的童鞋可能会觉得苦',
                mark: 0
            }, {
                content: 'B.波特 & 世涛',
                smallcontent: '一般黑啤基本都是世涛，世涛酒香浓郁，酒精度略高，比较苦，但是口感也会更加丰富，回味很好',
                mark: 0
            }]
        }, {
            title: 11,
            question: [{
                content: 'C.水果啤酒（LAMBICS兰比克）',
                smallcontent: '通常酒精度不高，口味酸甜，色泽鲜艳，颜值颇高',
                mark: 0
            }, {
                content: 'D.清爽拉格 & 皮尔森',
                smallcontent: '拉格是按照发酵方式分类，底部发酵的啤酒统称为拉格，拉格啤酒比较注重清爽的口感和麦芽味，常见的拉格有皮尔森，博克等',
                mark: 0
            }]
        }, {
            title: 11,
            question: [{
                content: 'E.修道院（烈性艾尔）',
                smallcontent: '修道院啤酒通常口感强烈，酒精度也高，口感十分丰富，在欧洲十分受欢迎，真正的修道院啤酒被称为特拉比斯啤酒',
                mark: 0,
            }, {
                content: 'F.小麦白啤',
                smallcontent: '口感清爽，清香怡人，酒精度一般不高，非常适合精酿入门者',
                mark: 0
            }]
        }, {
            title: 12,
            question: [{
                content: 'A.是的，请拉格离开精酿界',
                mark: 2
            }, {
                content: 'B.不一定，只要酒好不在意风格',
                mark: 1
            }, {
                content: 'C.不会，我觉得拉格很清爽',
                mark: 0
            }]
        }, {
            title: 13,
            question: [{
                content: 'A.愿意，说不定是很奇妙的口感',
                mark: 2
            }, {
                content: 'B.不愿意，听上去像“黑暗料理”',
                mark: 0
            }, {
                content: 'C.无所谓，随心情而定',
                mark: 1
            }]
        }, {
            title: 14,
            question: [{
                content: 'A.会的，希望可以了解其背后的故事',
                mark: 0
            }, {
                content: 'B.有可能，但需要看具体的风格来定',
                mark: 0
            }, {
                content: 'C.完全不会，第一口印象很重要',
                mark: 0
            }]
        }, {
            title: 15,
            question: [{
                content: 'A.只要是好酒，国产也很好',
                mark: 0
            }, {
                content: 'B.不喝国产不喝国产不喝国产',
                mark: 0
            }, {
                content: 'C.可以，都行，随便，完全佛系',
                mark: 0
            }]
        }, {
            title: 16,
            question: [{
                content: 'A.美国——新兴精酿世界的发源地，更具创意和风格多样性',
                mark: 0
            }, {
                content: 'B.比利时——传统精酿的聚集地，经典口味令人向往',
                mark: 0
            }, {
                content: 'C.德国——秉承“无添加”，最“原始”也最纯净',
                mark: 0
            }, {
                content: 'D.澳大利亚 & 新西兰——好山好水，自成一派',
                mark: 0
            }, {
                content: 'E.英国 & 爱尔兰——坚持自我的不妥协，经典永流传',
                mark: 0
            }, {
                content: 'F.中国——厚积薄发，国内也有很多高品质精酿',
                mark: 0
            }, {
                content: 'G.无所谓产地，酒好喝就行',
                mark: 0
            }]
        }, {
            title: 17,
            question: [{
                content: 'A.是的，正确的搭配才能感受啤酒真正的魅力',
                mark: 0
            }, {
                content: 'B.不会，通用一个玻璃杯喝酒就够了',
                mark: 0
            }, {
                content: 'C.无所谓，喝进嘴里的感受才是王道',
                mark: 0
            }]
        }, {
            title: 18,
            question: [{
                content: 'A.一定会，颜值即正义',
                mark: 0
            }, {
                content: 'B.可能会，遇到特别对眼的会更想品尝',
                mark: 0
            }, {
                content: 'C.不会，重要的还是酒本身',
                mark: 0
            }, {
                content: 'D.无所谓，随心情',
                mark: 0
            }]
        }, {
            title: 19,
            question: [{
                content: 'A.一定会去购买，我可是深坑老司机',
                mark: 0
            }, {
                content: 'B.可能会，主要看眼缘',
                mark: 0
            }, {
                content: 'C.一般，除非有特别喜欢的才会购买',
                mark: 0
            }, {
                content: 'D.不会，基本都华而不实',
                mark: 0
            }]
        }, {
            title: 20,
            question: [{
                content: 'A.完全不了解也无所谓搭配',
                mark: 0
            }, {
                content: 'B.不清楚但愿意去学着尝试佐餐',
                mark: 0
            }, {
                content: 'C.是的，我知道很多精酿啤酒特别适合搭配美食',
                mark: 0
            }]
        }, {
            title: 21,
            question: [{
                content: 'A.10元~20元',
                mark: 0
            }, {
                content: 'B.20元~30元',
                mark: 1
            }, {
                content: 'C.30元~40元',
                mark: 2
            }, {
                content: 'D.无所谓，只要酒好，价格都是浮云',
                mark: 3
            }]
        }, {
            title: 22,
            question: [{
                content: 'A.梦果酌椰子',
                mark: 0
            }, {
                content: 'B.岬角葡萄柚杜父鱼IPA',
                mark: 0
            }, {
                content: 'C.罗斯福10号',
                mark: 0
            }, {
                content: 'D.罗塞尔白兔',
                mark: 0
            }, {
                content: 'E.猫头鹰咖啡世涛',
                mark: 0
            }, {
                content: 'F.林德曼桃子',
                mark: 0
            }, {
                content: 'G.拳击猫搏击者超淡色艾尔',
                mark: 0
            }, {
                content: 'H.艾尔史密斯IPA',
                mark: 0
            }, {
                content: 'I.有喝过几款，但都不是我的菜',
                mark: 0
            }, {
                content: 'J.以上精酿都还没有喝过',
                mark: 0
            }]
        }, {
            title: 23,
            question: [{
                content: 'A.男生',
                mark: 0
            }, {
                content: 'B.女生',
                mark: 0
            }]
        }, {
            title: 24,
            question: [{
                content: 'A.60后',
                mark: 0
            }, {
                content: 'B.70后',
                mark: 0
            }, {
                content: 'C.80后',
                mark: 0
            }, {
                content: 'D.90后',
                mark: 0
            }]
        }, {
            title: 25,
            question: [{
                content: 'A.愿意，想结交更多爱酒的朋友',
                mark: 0
            }, {
                content: 'B.不愿意，就想静静的一个人喝酒',
                mark: 0
            }]
        }],

        questionObj: {
            title: 1,
            question: [{
                content: 'A.我是老司机了',
                mark: 3
            }, {
                content: 'B.入坑许久，收货不少',
                mark: 2
            }, {
                content: 'C.才刚入坑，有待学习',
                mark: 1
            }, {
                content: 'D.边缘徘徊，等待时机',
                mark: 0
            }]

        }, //选择第一题
        MathRandomPic: 0, //随机数
        mark: 0, //总分值
        showWeb: 0, //显示页面
        questionObjNum: 0, //第几题
        choiceAnswerIndex: -1, //普通题目
        choiceAnswerIndex1: [], //初始化11题
        choiceAnswerIndex4: [false, false, false, false, false, false, false, false, false, false], //初始化多选题
        showLastWeb: 0, //结算页面
        answerObj: [], //总答案
        couponGrpId: 1258, //券id
        popupBol7: false,
    },
    // 选择页面
    choiceWeb: function(e) {
        var newShowWeb = e.currentTarget.dataset.showwebnum;
        console.log(e.currentTarget.dataset.showwebnum)
        if (newShowWeb == 1) {
            if (wx.getStorageSync('VipId')) {

            } else {
                this.setData({
                    popupBol7: true
                });
                return;
            }
        }
        this.setData({
            showWeb: newShowWeb
        })
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
    // 下一题
    choiceQuestion: function() {
        var questionObjNum = this.data.questionObjNum;
        var questionObjcheck = this.data.questionObjs[questionObjNum];
        var choiceAnswerIndex1 = this.data.choiceAnswerIndex1;
        var ansIndex = this.data.choiceAnswerIndex;
        var mark = this.data.mark;
        var answerObj = this.data.answerObj;

        if (this.data.questionObj.title == 11) {
            if (choiceAnswerIndex1.length < 2 || (!choiceAnswerIndex1[0])) {

                return;
            }
            answerObj.push(choiceAnswerIndex1);
        } else if (this.data.questionObj.title == 22) {
            answerObj.push(choiceAnswerIndex4);
        } else {
            answerObj.push(ansIndex);
            mark += questionObjcheck.question[ansIndex].mark;
        }
        questionObjNum++;
        console.log(answerObj);
        if (questionObjNum > 26) {
            var showLastWeb = 0;
            if (mark <= 12) {
                showLastWeb = 0;
                this.setData({
                    couponGrpId: 1258
                })
            } else if (mark > 12 && mark < 19) {
                showLastWeb = 1;
                this.setData({
                    couponGrpId: 1259
                })
            } else {
                showLastWeb = 2;
                this.setData({
                    couponGrpId: 1260
                })
            }

            this.setData({
                showLastWeb: showLastWeb,
                showWeb: 2
            })

            return;
        }
        choiceAnswerIndex2 = [];
        choiceAnswerIndex4 = [false, false, false, false, false, false, false, false, false, false];
        this.setData({
            answerObj: answerObj,
            questionObjNum: questionObjNum,
            questionObj: this.data.questionObjs[questionObjNum],
            choiceAnswerIndex: -1,
            mark: mark,
            choiceAnswerIndex1: []
        })
        console.log(mark)
    },
    choiceAnswerBtn: function(e) {
        var ansIndex = e.currentTarget.dataset.index;
        if (this.data.questionObj.title == 22) {
            if (choiceAnswerIndex4[ansIndex]) {
                choiceAnswerIndex4[ansIndex] = false;
            } else {
                choiceAnswerIndex4[ansIndex] = true;
            }
            console.log(choiceAnswerIndex4)
            this.setData({
                choiceAnswerIndex4: choiceAnswerIndex4
            })
        } else {
            this.setData({
                choiceAnswerIndex: ansIndex
            })
        }

    },
    choiceAnswerBtn1: function(e) {
        var ansIndex = e.currentTarget.dataset.index;
        var ansitem = e.currentTarget.dataset.item;
        choiceAnswerIndex2[ansIndex] = ansitem;

        console.log(choiceAnswerIndex2);
        this.setData({
            choiceAnswerIndex1: choiceAnswerIndex2
        })


    },
    goMy: function() {
        var that = this;
        // 根据登录Id获取问券结果
        var getVipQuestoinUrl = 'api/Vip/GetVipQuestoinByVipId';
        var getVipQuestoinData = {
            Timestamp: '{{$timestamp}}',
            Args: {
                "LoginId": wx.getStorageSync('VipId')
            }
        };
        request.requestGet(getVipQuestoinUrl, getVipQuestoinData)
            .then(function(res) {
                that.postQuestion();
                if (res.data.Result) {
                    if (that.data.showLastWeb == 0) {
                        wx.navigateTo({
                            url: '../detailbox/detailbox?detailId=20293'
                        })
                    } else if (that.data.showLastWeb == 1) {
                        wx.navigateTo({
                            url: '../detailbox/detailbox?detailId=20294'
                        })
                    } else {
                        wx.navigateTo({
                            url: '../detailbox/detailbox?detailId=20295'
                        })
                    }
                } else {
                    that.postQuestion();
                }

            });
    },
    postQuestion: function() {
        var that = this;
        // 保存问券结果 下发券
        var postQuestionUrl = 'api/vip/SaveQuestionResult';
        var newAnswerObj = JSON.stringify(that.data.answerObj)
        var postQuestionContent = {
            Timestamp: '{{$timestamp}}',
            Args: {
                LoginId: wx.getStorageSync('VipId'),
                Score: that.data.mark,
                QuestionResult: newAnswerObj,
                CouponGrpId: that.data.couponGrpId,
            }
        }
        console.log(postQuestionContent);
        postQuestionContent.Args = JSON.stringify(postQuestionContent.Args);
        request.requestPost(postQuestionUrl, postQuestionContent)
            .then(function(response) {

                if (that.data.showLastWeb == 0) {
                    wx.navigateTo({
                        url: '../detailbox/detailbox?detailId=20293'
                    })
                } else if (that.data.showLastWeb == 1) {
                    wx.navigateTo({
                        url: '../detailbox/detailbox?detailId=20294'
                    })
                } else {
                    wx.navigateTo({
                        url: '../detailbox/detailbox?detailId=20295'
                    })
                }
            }, function(error) {
                console.log(error);
            });
    },
    //初始化
    onShow: function() {
        this.setData({ //随机数
            MathRandomPic: app.globalData.MathRandomPic
        })
    },
    onShareAppMessage: function() {
        // 用户点击右上角分享
        var sharePath = '/pages/question/question';
        return {
            title: '啤气定制问卷',
            desc: '啤气懂酒，也更懂你', // 分享描述
            path: sharePath // 分享路径
        };
    },




});