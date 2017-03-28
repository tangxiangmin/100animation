/**
 * Created by admin on 2017/3/27.
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
    /**
     *  压缩比例
     *  上传路径
     * @param param
     */
    $.fn.minifyImgUploade = function (quality, uploadUrl) {

        // 压缩图片
        function minifyImg(source, quality) {
            var w = source.width;
            var h = source.height;

            var canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;

            var ctx = canvas.getContext("2d");
            // 取出png转jpg的黑色背景
            ctx.fillRect(0, 0, w, h);

            // 将原图绘制在画布上，然后再将画布导出为图片，达到压缩的效果
            ctx.drawImage(source, 0, 0);
            return canvas.toDataURL('image/jpeg', quality);
        }

        return this.each(function () {
            $(this).on("change", function () {
                var imgURL = URL.createObjectURL(this.files[0]);

                var source = new Image();
                source.src = imgURL;
                source.onload = function () {
                    var imgData = minifyImg(this, quality);

                    // todo
                    $.post("server.php", {imgData: imgData},function (res) {
                        console.log(1);
                    },'json');

                }
            })
                
        })
    }
});