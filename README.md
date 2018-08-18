## avatar
> 头像上传插件

### 目的： 

> 帮助开发者快速开发上传头像功能点   

### 背景：  

> 现在b，g能搜到的头像上传插件并不太好用，所以想提供一个比较自由度的上传并且可以剪切的插件。   

### 例子  
- 下载代码   
`git clone git@github.com:guimeisang/avatar.git`

- 将node服务起起来   
> `npm install` 将express安装下；  
> `node server.js`      
> 打开localhost:3000 既可；（特别注意不要直接打开`index.html`，否则会报图片同源限制的错误！）

> 请看demo：   
https://guimeisang.github.io/avatar/index.html  
可以上传一张图片看下；


### 实现大致思路如下：        
1. 先有一个上传的（本地上传的功能），然后获取图片的地址。       
2. 获取图片地址之后，进行截取图片（这里推荐一个插件）[点这里](https://fengyuanchen.github.io/cropperjs/)，具体怎么用就不再赘述。      
3. 等截取图片之后，需要将截取的文件转换为二进制大文件。$('#image').cropper('getCroppedCanvas').toBlob();         
4. 调取接口，将二进制大文件上传即可。    

### 直接上代码吧： 

1. 先引入如下文件

```
cropper.js [点这里](https://github.com/fengyuanchen/cropperjs)
```
2. 具体业务代码
    2.1 将代码下载下来并且调试（该demo在项目测试过，并且使用了。放心使用）；
    2.2 js代码中有详细的注释；


