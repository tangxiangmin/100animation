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

        var tpl = '<div class="xm-calendar_hd"> <div class="xm-calendar_prev">上一月</div> <span class="xm-calendar_year"></span> 年 <span class="xm-calendar_month"></span> 月 <div class="xm-calendar_next">下一月</div> </div> <table> <thead> <tr> <th>日</th> <th>一</th> <th>二</th> <th>三</th> <th>四</th> <th>五</th> <th>六</th> </tr> </thead> <tbody class="xm-calendar_bd"></tbody> </table>';

        return this.each(function (index) {
            var $this = $(this);
            $this.append($(tpl));

            var $prev = $this.find(".xm-calendar_prev"),
                $next = $this.find(".xm-calendar_next"),
                $body = $this.find(".xm-calendar_bd"),
                $year = $this.find(".xm-calendar_year"),
                $month = $this.find(".xm-calendar_month");

            // 生成结构
            function createFrame(week_num) {
                // 生成行
                var rowStr = "";
                for (var i = 0; i < week_num; ++i) {
                    rowStr += "<tr></tr>";
                }
                $body.empty().append(rowStr);

                // 生成单元格
                $body.find("tr").each(function () {
                    var cellStr = "";
                    for (var i = 0; i < 7; ++i) {
                        cellStr += "<td></td>";
                    }
                    $(this).append(cellStr);
                });
            }
            // 填入日历数字
            function createDay(start, end) {
                // 这里暂时没有样式区分上个月和下个月
                var i;
                if (start > end){
                    // 上个月
                    for (i = start, j = 0; i > end; --i, j++) {
                        $body.find("td:eq(" + j + ")").text(start--)
                    }
                }else {
                    for (i = start, j = 1;i < end; ++i, ++j) {
                        $body.find("td:eq(" + i + ")").text(j);
                    }
                }
            }
            // 设置头部信息
            function setInfo(year, month) {
                $year.text(year);
                $month.text(month + 1);
            }

            var calendar = (function () {
                var today = new Date;

                return  {
                    year: today.getFullYear(),
                    month: today.getMonth(),
                    day: today.getDate(),
                    weekday: today.getDay(),
                    prev: function(){
                        if (--this.month < 0) {
                            this.year--;
                            this.month = 11;
                        }
                        this.init();
                    },
                    next: function () {
                        if (++this.month > 11) {
                            this.year++;
                            this.month = 0;
                        }
                        this.init();
                    },
                    get monthDay(){
                        // 每月对应天数
                        var year = this.year;
                        var monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                            monthDay[1] = 29;
                        }
                        return monthDay;
                    },
                    get bound() {
                        var year = this.year,
                            month = this.month,
                            monthDay = this.monthDay;

                        // 获取当前月份一号是星期几
                        var first = new Date(Date.UTC(year, month, 1));
                        var first_weekday = first.getDay();

                        // 获取当前月份最后一天是星期几
                        var last = new Date(Date.UTC(year, month, monthDay[month]));
                        var last_weekday = last.getDay();
                        // 获取当前月份有多少周，即获取当前月份最后一天是第几周即可
                        var week_num = Math.floor((monthDay[month] - last_weekday + 12) / 7);

                        return {
                            first_weekday: first_weekday,
                            last_weekday: last_weekday,
                            week_num: week_num
                        }
                    },
                    init: function () {
                        var year = this.year,
                            month = this.month,
                            monthDay = this.monthDay;

                        var boundary = this.bound;
                        var first_weekday = boundary.first_weekday,
                            last_weekday = boundary.last_weekday,
                            week_num = boundary.week_num;

                        createFrame(week_num);
                        // 生成当月日历
                        var last_monthDay = monthDay[month - 1];
                        if (month == 0) {
                            last_monthDay = monthDay[11];
                        }
                        // 生成上个月的剩余天数
                        createDay(last_monthDay, last_monthDay - first_weekday);
                        // 生成当月日历
                        createDay(first_weekday, first_weekday + monthDay[month]);
                        // 生成下个月的天数
                        createDay(first_weekday + monthDay[month], week_num*7);

                        // 设置头部信息
                        setInfo(year, month);
                    }
                };
            })();

            // 初始化
            calendar.init();

            // 事件监听
            $prev.on("click", function () {
                calendar.prev();
            });
            $next.on("click", function () {
                calendar.next();
            })
        })
    }
});