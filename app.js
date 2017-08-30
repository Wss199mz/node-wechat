var Koa = require("koa");
var path = require('path');
var wechat = require('./wechat/g');
var util = require('./libs/util');
var wechat_file = path.join(__dirname,'/config/wechat.txt');
var config = {
    wechat:{
        appId:'wx90210886d1a1d5db',
        appSecret:'87c1cccd55cb196d990a1480f942d11e',
        token:'zijidetokenzijidetoken',
        getAccessToken:function () {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken:function (data) {
            return util.writeFileAsync(wechat_file,JSON.stringify(data))
        }
    }
};
var app = new Koa();
var a=null,b=null,c=null;
app.use(wechat(config.wechat));
app.listen(1234);
console.log("listen:1234");
