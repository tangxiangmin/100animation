前端图片压缩异步上传
===
这是最近遇见的一个项目需求，但并没有找到合适的解决方法。之前对于新增的文件和二进制数据接口没有很好的了解，现在尝试摸索一套解决办法。

## 相关对象接口
这里基本上都是补MDN文档上的基础知识了，只能说MDN太赞了！

### Blob对象
[Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)是一种JavaScript对象类型，其作用是存储大量二进制数据
```javascript
// 返回一个blob对象，array参数可以是
// ArrayBuffer
// ArrayBufferView
// Blob
// DOMString
// 其他类似对象的混合体

// 来自官方文档
var aFileParts = ['<a id="a"><b id="b">hey!</b></a>']; // an array consisting of a single DOMString
var oMyBlob = new Blob(aFileParts, {type : 'text/html'});
console.log(oMyBlob);
```
常用的场景比如对较大文件进行分割（使用`blob.slice()`方法）。

### FileList
[FileList](https://developer.mozilla.org/zh-CN/docs/Web/API/FileList)对象通常来自一个 input元素的files属性
```
<input type="file" id="imgFile" multiple>

imgFile.onchange = function () {
    console.log(this.files); 
    // 选择三张图片，获得结果
    // FileList {0: File, 1: File, 2: File, length: 3}
}
```
可以看见`FileList`是一个类数组对象，且每个元素都是一个File对象

### File
[File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)对象包含文件的基本信息，以及文件内容的存取方法。此外，,File对象继承了Blob接口，因此也可以使用更多blob对象相关的方法。

我们这里需要处理的图像，就是一个file对象，file对象常用的属性有`name`（文件名）,`size`（文件尺寸）,`type`（MIME类型），至于相关的方法已经转移到了FileReader对象中了。

### FileReader
HTML5允许JavaScript在用户上传文件之后在读取这些文件的内容
[FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader) 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容。可以通过`FileReader()`构造函数来创建一个filereader对象。
```javascript
// 可以使用下面的方法来读取某个文件的内容
// 这些方法的参数均为file或blob对象
fr.readAsArrayBuffer(file); // ArrayBuffer对象表示的文件内容
fr.readAsBinaryString(file); // 原始二进制表示的文件内容
fr.readAsDataURL(file); // data: URL表示的文件内容
fr.readAsText(file); // 字符串表示的文件内容
// 此外需要注意这些方法都是异步的，当读取完毕内容存放在fr的result属性中
fr.onloadend = function (e) {
    console.log(fr.result);
};

// 取消文件类容的读取
fr.abort();
// 另外还有abort, load, loadstart, progress等事件
```

### URL对象
[URL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL)对象代表一个资源标识符对象，主要实现了URLUtils 中定义的属性，但是我们这里先只关注与文件相关的方面，也就是URL构造函数的两个静态方法:
```javascript
// 返回一个字符串，它的URL表示参数中的file或者blob对象，每次调用都会创建一个新的 URL 对象（即使参数相同）
var objectURL = URL.createObjectURL(blob);

//  创建的URL的生命周期和创建它的窗口中的 document 绑定，浏览器会在文档退出的时候自动释放它们，但是为了效率可以手动释放
URL.revokeObjectURL(objectURL);
```

### FromData
[FormData]((https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects))对象主要用来组装一组用 XMLHttpRequest发送请求的键/值对，可以更加灵活地发送Ajax请求。

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

// 文件对象
formData.append("userfile", fileInputElement.files[0]);
```
需要注意的是尽管调用了append方法增添数据，但是打印fd仍然显示问一个空对象。

## 相关概念和思路
### base64编码
[Base64](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/Base64_encoding_and_decoding)是网络上最常见的用于传输8Bit字节代码的编码方式之一，可用于在HTTP环境下传递较长的标识信息，Base64编码普遍应用于需要通过被设计为处理文本数据的媒介上储存和传输二进制数据而需要编码该二进制数据的场景（比如我们这里的异步传图片）。这样是为了保证数据的完整并且不用在传输过程中修改这些数据。
在网络传输中，将二进制文件(blob)保存为Base64编码的文本，这些文本可以内嵌在XML的标签中，因此二进制信息它可以随着XML文件被拷贝、下载而不用担心信息会缺失。
```
// 对base64字符串进行解码，a表示ASCII，b表示base64
atob()
// 对blob对象进行编码
btoa()
```

### Canvas压缩图片
参考文档：
* [HTML5 CANVAS 实现图片压缩和裁切](http://www.cnblogs.com/suntrain/p/6145827.html)
* [解决canvas转base64/jpeg时透明区域变成黑色背景的方法](http://www.jb51.net/html5/503985.html)

主要的思路是使用`drawImage()`将上传图片绘制到画布上，再使用`toDataURL()`将画布另存为图片，通过指定质量达到压缩的效果。这个压缩效果还是十分明显的，



## 图片异步上传
参考文档：
* [Ajax 知识体系大梳理](https://juejin.im/post/58c883ecb123db005311861a)

通过XHR2可以传送二进制数据的特性，将压缩之后的图片传送至服务器，然后返回图片保存的路径即可