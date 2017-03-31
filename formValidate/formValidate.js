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
    // 验证要求分隔符
    var RULE_DELIMITER = " ",
        PARAM_DELIMITER = ":";

    // 判断策略
    var is = {
        re: /^\/.*\/$/,
        num: /^\d+$/,
    };

    // 正则对应的中文描述符
    var describle = {
        num: "数字",
        email: "邮箱",
    };

    // 消息提醒，便于使用第三方插件如layer等
    var log = function (msg) {
        console.log(msg);
    };

    // 内置检测规则，如果满足条件返回true
    var validateStrategies = {
        required: function(val){
            return (val !== '');
        },
        minLength: function (val, len) {
            return val.length >= len;
        },
        maxLength: function (val, len) {
            return val.length <= len;
        },
        length: function (val, len) {
            return val.length === len;
        },
        is: function (val, type) {
            var re = is.re.test(type)? eval(type) : is[type];
            return re.test(val);
        }
    };

    // 内置错误反馈机制
    var errStategies = {
        required: function (el) {
            var name = el.data("name");
            log("请将"+ name + "补写完整");
        },
        minLength: function (el, len) {
            var name = el.data("name");
            log(name + "的长度应大于等于" + len + "位");
        },
        length: function (el, len) {
            var name = el.data("name");
            log(name + "的长度应等于" + len + "位");
        },
        is: function (el, type) {
            log("请输入合法的" + describle[type]);
        }
    };

    // 验证器
    var Validator = function () {
        this.cache = [];
    };

    var pt = Validator.prototype;

    // 向验证器中添加规则
    /**
     *
     * @param 单个元素上的规则字符串，已被拆分成数组
     * @param 该元素对应的值
     * @param 该元素本身
     */
    pt.add = function (rules, value, el) {
        this.cache = [];
        for (var i = 0,rule; rule = rules[i++];) {
            this.cache.push({
                rule: rule,
                value: value,
                el: el,
            });
        }
    };

    // 执行验证
    pt.run = function () {
        this.cache.forEach(function(validate, index){
            var rule = validate.rule.split(PARAM_DELIMITER),
                value = validate.value,
                el = validate.el;

            // 拆分单条规则对应的校验方法和可能存在的参数
            var method = rule[0],
                param = rule[1];

            var msg = validateStrategies[method](value, param);
            if (!msg){
                errStategies[method](el, param);
            }
        })
    };

    // 通过参数增添自定义策略
    // 参数类似于下列结构，多个自定义规则组成的对象，每个对象包括一条rule校验规则和1一条err错误反馈
    /**
     * @param
     * {
            test: {
                rule: function (val, param) {
                    return false;
                },
                err: function (el) {
                    console.log("err");
                }
            }
        }
     */
    pt.extendStrategies = function (param) {
        for (var key in param){
            var val = param[key];
            // 第一个是验证规则
            validateStrategies[key] = val.rule;
            // 第二个是错误反馈
            errStategies[key] = val.err;
        }
    };

    // 扩展jQuery插件方法
    /**
     * @param 扩展内置策略工具
     * @param 每次检测只显示一条错误还是执行全部错误
     * @returns {*}
     */
    $.fn.formValidate = function (param, falg) {
        return this.each(function () {
            var $form = $(this),
                $items = $form.find("[data-validate]");
            var validator = new Validator();

            validator.extendStrategies(param);

            // 统一检测
            $form.on("submit",function () {
                $items.each(function () {
                    var $this = $(this);

                    var rules = $this.data("validate").split(RULE_DELIMITER),
                        value = $this.val();

                    // 提取表单验证规则
                    validator.add(rules, value, $this);
                    validator.run();
                    if (flag) {
                        // todo
                        // return false;
                    }
                });

                return false;
            })
        })
    };

    window.onerror = function (e) {
        alert(e);
    }
});