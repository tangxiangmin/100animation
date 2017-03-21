/**
 * Created by admin on 2017/3/21.
 */
/**
 * 一个简易的日历插件
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

    $.fn.calendar = function (param) {

        var tpl = '<div class="xm-calendar_hd"> <div class="xm-calendar_prev">上一月</div> <span class="t-year"></span> 年 <span class="t-month"></span> 月 <div class="xm-calendar_next">下一月</div> </div> <table> <thead> <tr> <th>日</th> <th>一</th> <th>二</th> <th>三</th> <th>四</th> <th>五</th> <th>六</th> </tr> </thead> <tbody></tbody> </table>';


        return this.each(function (index) {
            $(".xm-calender").append($(tpl));
        })
    }


});


function calender() {
    return false;
    var tpl = '<div class="xm-calendar_hd"> <div class="xm-calendar_prev">上一月</div> <span class="t-year"></span> 年 <span class="t-month"></span> 月 <div class="xm-calendar_next">下一月</div> </div> <table> <thead> <tr> <th>日</th> <th>一</th> <th>二</th> <th>三</th> <th>四</th> <th>五</th> <th>六</th> </tr> </thead> <tbody></tbody> </table>';

    $(".xm-calender").append($(tpl));
    var obj = getNow();
    var year = obj.year;
    var month = obj.month;
    var day = obj.day;
    var weekday = obj.weekday;

    var clickMonth = 0;
    // 初始化
    changeMonth(year, month);
    // 后退按钮
    $(".xm-calender .xm-calendar_prev").on("click", function () {
        clickMonth--;

        month--;

        if (month < 0) {
            year--;
            month = 11;
        }

        changeMonth(year, month);
    });

    // 前进按钮
    $(".xm-calender .xm-calendar_next").on("click", function () {
        clickMonth++;

        month++;
        if (month > 11) {
            year++;
            month = 0;
        }
        changeMonth(year, month);
    });
    // 添加安排
    var pickMoreDay = [];
    $(".xm-calender").on("click", 'td', function () {


    });
    // 更新日历
    function changeMonth(year, month) {
        setHead(year, month);
        createMonth(year, month);
        activeDay();
    }

    // 创建对应月份日历
    function createMonth(year, month) {
        // 每月对应天数
        var month_day = isLeapYeay(year);
        // 获取当前月份一号是星期几
        var first = new Date(Date.UTC(year, month, 1));
        var first_weekday = first.getDay();
        // 获取当前月份最后一天是星期几
        var last = new Date(Date.UTC(year, month, month_day[month]));
        var last_weekday = last.getDay();
        // 获取当前月份有多少周，即获取当前月份最后一天是第几周即可
        var week_num = Math.floor((month_day[month] - last_weekday + 12) / 7);
        var str = "";
        for (var i = 0; i < week_num; ++i) {
            str += "<tr></tr>";
        }
        $(".xm-calender tbody").empty().append(str);
        $(".xm-calender tbody tr").each(function () {
            var str = "";
            for (var i = 0; i < 7; ++i) {
                str += "<td></td>";
            }
            $(this).append(str);
        })
        // 生成当月日历
        var last_month_day = month_day[month - 1];
        if (month == 0) {
            var last_month_day = month_day[11];
        }
        var size = $(".xm-calender tbody td").size();

        // 生成上个月的剩余天数
        for (var i = first_weekday - 1; i >= 0; --i) {
            $(".xm-calender tbody td:eq(" + i + ")").attr("data-role", "last").text(last_month_day--).css({
                "color": "#f8f8f8",
                "background": "transparent"
            });
        }
        // 生成当月日历
        for (var i = first_weekday, j = 1; i < first_weekday + month_day[month]; ++i, ++j) {
            $(".xm-calender tbody td:eq(" + i + ")").text(j);
        }
        // 生成下个月的天数
        for (var i = first_weekday + month_day[month], j = 1; i < size; ++i, ++j) {
            $(".xm-calender tbody td:eq(" + i + ")").attr("data-role", "next").text(j).css({
                "color": "#f8f8f8",
                "background": "transparent"
            });
        }
    }

    function getTwo(n) {
        n = parseInt(n);
        if (n < 10) {
            return "0" + n;
        } else {
            return "" + n;
        }
    }

    // 根据年份返回对应月份天数
    function isLeapYeay(year) {
        var month_day = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            month_day[1] = 29;
        }
        return month_day;
    }

    // 获取当前时间
    function getNow() {
        var obj = {};
        var now = new Date();
        obj.year = now.getFullYear();
        obj.month = now.getMonth();
        obj.day = now.getDate();
        obj.weekday = now.getDay();
        return obj;
    }

    // 高亮显示起止日期
    function activeDay() {
        var year = $(".xm-calender .t-year").text();
        var month = getTwo($(".xm-calender .t-month").text());
        $(".xm-calender tbody td").each(function () {
            var day = $(this).text();
            var strKey = '' + year + '-' + month + '-' + getTwo(day);


        })

    }

    // 设置顶部年月信息
    function setHead(year, month) {
        $(".xm-calender .t-year").text(year);
        $(".xm-calender .t-month").text(month + 1);
    }
}