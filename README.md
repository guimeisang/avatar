# avatar
头像上传插件

目的： 帮助开发者快速开发上传头像功能点   

背景： 现在b，g能搜到的头像上传插件并不太好用，所以想提供一个比较自由度的上传并且可以剪切的插件。   

实现大致思路如下：      
1. 先有一个上传的（本地上传的功能），然后获取图片的地址。       
2. 获取图片地址之后，进行截取图片（这里推荐一个插件）[点这里](https://fengyuanchen.github.io/cropperjs/)，具体怎么用就不再赘述。      
3. 等截取图片之后，需要将截取的文件转换为二进制大文件。$('#image').cropper('getCroppedCanvas').toBlob();         
4. 调取接口，将二进制大文件上传即可。    

直接上代码吧： 

1. 先引入如下文件

```
cropper.js [点这里](https://github.com/fengyuanchen/cropperjs)
```
2. 具体业务代码

```
 $(function () {
        var URL = window.URL || window.webkitURL;
        var $image = $('#image');
        var $rotate = $('#userImg_rotate');
        var $reUpload = $('#userImg_reUpload');
        var $zoomOut = $('#userImg_zoomOut');
        var $zoomIn = $('#userImg_zoomIn');
        var $save = $('#userImg_save');
        var croppable = false;
        var $previews = $('.userImg_preview');
        var options = {
            aspectRatio: 1,
            viewMode: 1,
            built: function () {
                croppable = true;
            },
            build: function (e) {
                var $clone = $(this).clone();

                $clone.css({
                    display: 'block',
                    width: '100%',
                    minWidth: 0,
                    minHeight: 0,
                    maxWidth: 'none',
                    maxHeight: 'none'
                });

                $previews.css({
                    width: '100%',
                    overflow: 'hidden'
                }).html($clone);
            },
            crop: function (e) {
                var imageData = $(this).cropper('getImageData');
                var previewAspectRatio = e.width / e.height;

                $previews.each(function () {
                    var $preview = $(this);
                    var previewWidth = $preview.width();
                    var previewHeight = previewWidth / previewAspectRatio;
                    var imageScaledRatio = e.width / previewWidth;

                    $preview.height(previewHeight).find('img').css({
                        width: imageData.naturalWidth / imageScaledRatio,
                        height: imageData.naturalHeight / imageScaledRatio,
                        marginLeft: -e.x / imageScaledRatio,
                        marginTop: -e.y / imageScaledRatio
                    });
                });
            }
        };
        var originalImageURL = $scope.userInfo_imgUrl;
        var uploadedImageURL;

        $scope.initCropper = function(){
            // init
            $image.attr('src',$scope.userInfo_imgUrl).cropper(options);
        };

        // rotate
        $rotate.on('click', function(){
            $image.cropper('rotate', 90);
        });

        // zoomOut
        $zoomOut.on('click',function(){
            $image.cropper('zoom', -0.1);
        });

        // zoomIn
        $zoomIn.on('click',function(){
            $image.cropper('zoom', 0.1);
        });

        // Move
        /*$move.on('click',function(){
            $image.cropper('setDragMode');
        });*/

        // reUpload
        $reUpload.on('click',function(){
            $image.cropper('destroy').attr('src', $scope.userInfo_imgUrl).cropper(options);
            if (uploadedImageURL) {
                URL.revokeObjectURL(uploadedImageURL);
                uploadedImageURL = '';
            }
        });

        // Keyboard
        $(document.body).on('keydown', function (e) {

            if (!$image.data('cropper') || this.scrollTop > 300) {
                return;
            }

            switch (e.which) {
                case 37:
                    e.preventDefault();
                    $image.cropper('move', -1, 0);
                    break;

                case 38:
                    e.preventDefault();
                    $image.cropper('move', 0, -1);
                    break;

                case 39:
                    e.preventDefault();
                    $image.cropper('move', 1, 0);
                    break;

                case 40:
                    e.preventDefault();
                    $image.cropper('move', 0, 1);
                    break;
            }

        });

        // 剪切和确定上传图片
        $save.on('click',function(){
            common.Loading.show();
            $('#image').cropper('getCroppedCanvas').toBlob(function (blob) {
                var formData = new FormData();

                formData.append('photoFile', blob);
                
                // 这里写入后端给你的上传接口
                $.ajax(API_URL+'', {
                    method: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        try{
                            $scope.$apply(function(){
                                $scope.isShowUnCompleteInfoBox = false;
                                $scope.isShowCompleteInfoBox = false;
                                $scope.userInfo_imgUrl = res.data;
                            })
                        }catch(err){
                            console.log(err)
                        }
                    },
                    error: function () {
                        
                    }
                });
            });
        })

        // 上传图片，这里传本地的图片并且获取一个本地图片的路径
        var $inputImage = $('#inputImage');
        if (URL) {
            $inputImage.change(function () {
                var files = this.files;
                var file;

                if (!$image.data('cropper')) {
                    return;
                }

                if (files && files.length) {
                    file = files[0];

                    if (/^image\/\w+$/.test(file.type)) {
                        if (uploadedImageURL) {
                            URL.revokeObjectURL(uploadedImageURL);
                        }

                        uploadedImageURL = URL.createObjectURL(file);
                        $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
                        $inputImage.val('');
                    } else {

                    }
                }
            });
        } else {
            $inputImage.prop('disabled', true).parent().addClass('disabled');
        }
    });
```
