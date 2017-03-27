前端图片压缩异步上传
===
这是最近遇见的一个项目需求，但并没有找到合适的解决方法。现在尝试摸索一套解决办法。

## 从file文档中提取数据
参考文档:
* [URL对象](http://www.mamicode.com/info-detail-456059.html)

由于是在客户端进行压缩，需要使用本地上传的图片，因此需要file文档框中提取上传的文件。

## Canvas压缩图片
参考文档：
* [HTML5 CANVAS 实现图片压缩和裁切](http://www.cnblogs.com/suntrain/p/6145827.html)
* [解决canvas转base64/jpeg时透明区域变成黑色背景的方法](http://www.jb51.net/html5/503985.html)

主要的思路是使用`drawImage()`将上传图片绘制到画布上，再使用`toDataURL()`将画布另存为图片，通过指定质量达到压缩的效果。这个压缩效果还是十分明显的，

## FromData数据类型
参考文档：
* [FormData 对象的使用](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects)

FormData对象主要用来组装一组用 XMLHttpRequest发送请求的键/值对，可以更加灵活地发送Ajax请求。

可以使用`FormData`构造函数来获取一个fd对象：
```javascript
// 通过`FormData()`构造函数获取一个空对象
var fd = new FormData();
// 也可以传入一个表单元素作为构造参数
var fd = new FormData(formElm);
```

fd对象中可以包含多种类型的数据，包括：
```javascript
// 普通key-value键值对
fd.append("user", "txm");

// 文件对象，我们要做的图片异步上传，就是从这里入手
formData.append("userfile", fileInputElement.files[0]);
```
需要注意的是尽管调用了append方法增添数据，但是打印fd仍然显示问一个空对象

## 图片异步上传
参考文档：
* [Ajax 知识体系大梳理](https://juejin.im/post/58c883ecb123db005311861a)

通过XHR2可以传送二进制数据的特性，将压缩之后的图片传送至服务器，然后返回图片保存的路径即可