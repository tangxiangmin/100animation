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

    }
});