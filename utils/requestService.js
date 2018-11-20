// 本服务用于封装请求
// 返回的是一个promisepromise
// get
var requestGet = function(newUrl, newData) {
    var promise = new Promise(function(resolve, reject) {
        wx.request({
            url: 'https://api.beerqi.com/' + newUrl,
            data: newData,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: resolve,
            fail: reject
        });
    });
    return promise;
};
//get2
var requestGet2 = function(newUrl, newData) {
    var promise = new Promise(function(resolve, reject) {
        wx.request({
            url: 'https://order.beerqi.com/' + newUrl,
            data: newData,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: resolve,
            fail: reject
        });
    });
    return promise;
};
// post
var requestPost = function(newUrl, newData) {
    var promise = new Promise(function(resolve, reject) {
        wx.request({
            url: 'https://api.beerqi.com/' + newUrl,
            data: newData,
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: resolve,
            fail: reject
        });
    });
    return promise;
};
// post2
var requestPost2 = function(newUrl, newData) {
    var promise = new Promise(function(resolve, reject) {
        wx.request({
            url: 'https://order.beerqi.com/' + newUrl,
            data: newData,
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: resolve,
            fail: reject
        });
    });
    return promise;
};

module.exports = {
    'requestGet': requestGet,
    'requestGet2': requestGet2,
    'requestPost': requestPost,
    'requestPost2': requestPost2
};