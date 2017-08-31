var Wechat = require("./wechat")
var util = require("./util")
var sha1 = require("sha1");
var getRawBody = require("raw-body");

var a = null,b = null,c = null,con='';
module.exports = function (opts) {
    var wechat = new Wechat(opts); // 管理和微信的接口，和票据存储和检查
    return function *(next) {
        var that = this;
        var token = opts.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;
        var str = [token,timestamp,nonce].sort().join('');
        var sha = sha1(str);
        if (this.method === 'GET') {
            if(a ==null||b==null){
                a = sha;
                b = signature;
                c = echostr;
                console.log(a)
                if(a === b){
                    //console.log(that)
                    this.body = c + '';
                } else {
                    this.body = 'wrong';
                }
            }
        }else if (this.method = "POST"){
            if(a ==null||b==null){
                a = sha;
                b = signature;
                c = echostr;
                console.log(a)
                if(a !== b) {
                    this.body = 'wrong';
                    return false;
                }
            }
            var data = yield getRawBody(this.req,{
                length:this.length,  // 设置post返回值的属性
                limit:'1mb',
                encoding:this.charset
            });
            var content = yield util.parseXMLAsync(data);
            console.log(content);
            var message = yield util.formatMessage1(con['xml']);
            console.log(message);
            if(message.MsgType === "event"){
                if(message.Event === "subscribe"){
                    var now = new Date().getTime();
                    that.status = 200;
                    that.type = "application/xml";
                    that.body = '<xml>'+
                        '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
                        '<FromUserName><!['+message.ToUsername+']]></FromUserName>'+
                        '<CreateTime>'+now+'</CreateTime>'+
                        '<MsgType><![CDATA[text]]></MsgType>'+
                        '<Content><![CDATA[你好,同学]]></Content>'+
                        '</xml>'
                }
            }
        }
    }
}

























