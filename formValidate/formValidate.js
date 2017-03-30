/**
 * 一个表单验证插件
 */

!(function (factory) {
    if (typeof define === "function" && (define.amd || define.cmd) && !jQuery) {
        define([ "jquery" ],factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        factory(jQuery);
    }
})(function ($) {
    $.fn.formValidate = function (param) {
        // 验证要求分隔符
        var VALIDATE_DELIMITER = " ";
        var PARAM_DELIMITER = ":";
        // 判断策略
        var is = {
            re: /^\/.*\/$/,
            num: /^\d?$/,
        };

        var strategies = {
            required: function(val, errMsg){
                if (val === ''){
                    return errMsg;
                }
            },
            minLength: function (val, len, errMsg) {
                if (val.length < len){
                    return errMsg;
                }
            },
            maxLength: function (val, len, errMsg) {
                if (val.length > len){
                    return errMsg;
                }
            },
            is: function (val, type, errMsg) {
                var re = is.re.test(type)? eval(type) : is[type];

                if (!re.test(val)) {
                    return errMsg;
                }
            }
        };
        return this.each(function () {
            var validateArr = [];
            $(this).find("[data-validate]").each(function () {
                var $this = $(this);
                var validateStyle = $this.data("validate").split(VALIDATE_DELIMITER),
                    value = $this.val();

                validateStyle.forEach(function(validate, index){

                    var validateArr = validate.split(PARAM_DELIMITER);
                    var method = validateArr[0],
                        param = validateArr[1];

                    var msg = strategies[method](value, param, "wrong");
                    console.log(msg);
                })

            })
        })
    }
});