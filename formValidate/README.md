表单验证
===

项目需求中经常遇见的就是表单验证，这里参考Laravel的验证方式，实现一个在前端进行的表单验证插件。

## TODO
* [ ] 常规的表单验证需求有:
     * minLength: 最小长度
     * maxLength: 最大长度
     * type： num数字 email邮箱 pwd密码 date日期 tel电话号码 idcard身份证
     * required： 必填
     * confirmed： 确认
     * existed: 账号已存在
* [ ] 一条记录可能需要多条验证规则，可以使用`|`进行分隔
* [ ] 最后需要对验证结果进行反馈，以及通过验证之后的回调


