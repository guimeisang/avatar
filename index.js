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
    var originalImageURL = 'img/user_unSet_image.png';
    var uploadedImageURL;


    // init
    $image.attr('src',originalImageURL).cropper(options);


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

    // save and upload cropped Img
    $save.on('click',function(){
        console.log($('#image').cropper('getCroppedCanvas'));
        $('#image').cropper('getCroppedCanvas').toBlob(function (blob) {
            var formData = new FormData();

            formData.append('photoFile', blob);

            $.ajax(API_URL+'', {
                method: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    alert('头像上传成功！');
                },
                error: function () {
                    alert('头像上传失败！');
                }
            });
        });
    })

    // Inport Image
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
                    alert('请选择图片再上传！')
                }
            }
        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }
});