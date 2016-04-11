define([
    "zepto",
    "fastclick",
    // 基础库 不依赖其他模块
    "js/common/env",
    "js/common/utils",
    "js/common/api",
    "js/common/flag",
    "js/common/constant",
    "js/common/native",
    "js/common/talkingdata",
    "js/common/ui",
    // 业务库，组装业务功能
    "js/common/account",
    "js/common/init",
    "js/common/debug"
], function(
    $,
    FastClick,
    EnvJson,
    Utils,
    Api,
    Flag,
    Constant,
    Native,
    TD,
    UI,
    Account,
    init,
    debug
) {
    $$.EventListener = {
    }

    // 判断是否已经登录
    var C = {
    	FastClick: FastClick,
        // 环境变量
        Env: EnvJson.ssEnv,
        // API
        Api: Api,
        // API
        Flag: Flag,
        // 常量
        Constant: Constant,
        // 工具类
        Utils: Utils,
        // Native接口
        Native: Native,
        // Talking埋点
        TD: TD,
        // UI控件
        UI: UI,
        // 帐户
        Account: Account,
        debug:debug,
        // 校验
        Validator: {
            // 验证手机号
            mobileNo: function (mobileNo) {
                // 判断非空
                if (!mobileNo) {
                    return {result: false, error: "手机号码不能为空"};
                }
                // 判断是否符合规则
                else if (!Utils.RegexMap.MobileNo.test(mobileNo)) {
                    return {result: false, error: "手机号码格式错误"};
                }
                return {result: true};
            },
            /*
             验证证件号码
             01: 居民身份证
             02/03/04: 军官证/士兵证/护照
             05/06: 港澳通行证或台胞证
             07: 其他
             */
            idNo: function (idType,idNo) {
                var checkResult = {result: true};
                var formatErrorResult = {result: false, error: "证件号码格式错误"};

                if (idNo == "") {
                    checkResult = {result: false, error: "证件号码不能为空"};
                } else {
                    switch (idType) {
                        // 身份证：15或18位字符
                        case "01" :
                            if(idNo.length == 15){
                                checkResult = {result: false, error: "请输入18位身份证号"};
                            }
                            else if (!(Utils.RegexMap.idCard.test(idNo) && Utils.strDateTime(idNo.substr(6,8)))) {
                                checkResult = formatErrorResult;
                            }
                            break;
                        // 护照 2
                        // 士兵证
                        // 军官证：6-50位字符(可输中文)
                        case '02' :
                        case '03' :
                        case '04' :
                            if (!/^[\u4e00-\u9fa5a-zA-Z\d]{6,50}$/.test(idNo)) {
                                checkResult = formatErrorResult;
                            }
                            break;
                        // 港澳台回乡证或台胞证: 5-50位字符，只允许大写字母和数字，最多输入50位
                        case "05" :
                        case "06" :
                            if (!/^[A-Z\d]{5,50}$/.test(idNo)) {
                                checkResult = formatErrorResult;
                            }
                            break;
                        default :
                            // 其他：3-50位字符，最多输入50位
                            if (!/^[a-zA-Z\d]{3,50}$/.test(idNo)) {
                                checkResult = formatErrorResult;
                            }
                            break;
                    }
                }
                return checkResult;
            },
            // 验证房产证号码
            propertyNo:function(propertyNo){
                // 判断非空
                if (!propertyNo) {
                    return {result: false, error: "房产证号不能为空"};
                }
                // 判断是否符合规则
                else if (!/^[A-Za-z0-9]{9}$/.test(propertyNo)) {
                    return {result: false, error: "房产证号格式错误"};
                }
                return {result: true};
            }
        },
        // 信息公用
        InfoCommon:{
            // 代号转为名称
            codeOfName:function(code,map){
                return map[code];
    
            }
        },
        
        /**
         * 转化金额为中文大写
         * */
        formatMoneyData:function(n){
            if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
                return "数据非法";
            var unit = "千百拾亿千百拾万千百拾元角分", str = "";
                n += "00";
            var p = n.indexOf('.');
            if (p >= 0)
                n = n.substring(0, p) + n.substr(p+1, 2);
                unit = unit.substr(unit.length - n.length);
            for (var i=0; i < n.length; i++)
                str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
            return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元");
        },
        entityReplace: function( str ){
            str = str.toString();
             return str.replace(/&#38;?/g,"&amp;").replace(/&amp;/g,"&").replace(/&#(\d+);?/g,function(a,b){return String.fromCharCode(b)}).replace(/′/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"").replace(/&acute;/gi,"'").replace(/&nbsp;/g," ").replace(/&#13;/g,"\n").replace(/(&#10;)|(&#x\w*;)/g,"").replace(/&amp;/g,"&");
        },


        myEncode: function( str ){
            str = str.toString();
            
             return str.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\'/g,"’").replace(/\"/g,"“").replace(/&#39;/g,"’").replace(/&quot;/g,"“").replace(/&acute;/g,"’").replace(/\%/g,"％").replace(/\(/g,"（").replace(/\)/g,"）");
        },

        strim: function( str ){
            str = str.toString();

            return str.replace(/^\s*|\s*$/g,'');
        }

    };
    init.apply(this);
    return C;
})
