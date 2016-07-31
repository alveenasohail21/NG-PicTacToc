/**
 * @ngdoc controller
 * @name app.welcome.controller:Welcome
 * @description Welcome controller which typically is useless and you are going to delete it
 */

(function(){

    'use strict';

    angular.module('app.dashboard')
        .controller('webappStep2Ctrl', webappStep2Ctrl);

    /* @ngInject */
    function webappStep2Ctrl(r_photos, photosFactory, cropperFactory, alertFactory){
        var vm = this;

        /* Variables */
        vm.myPhotos = r_photos['photos'];
        vm.myPhotosTotalCount = r_photos.totalCount;
        vm.myPhotosPagination = {
            from: 0,
            size: 12,
            dimension: '100x100'
        };
        var totalItems = $('#carousel .item').length;
        var thumbs = 9;
        var currentThumbs = 0;
        var to = 0;
        var thumbActive = 5;
        vm.activeSidemenuItem = '';

        // zoom slider
        var zoomSlider;

        /* Function Assignment */
        //vm.changeThumb = changeThumb;
        vm.toggleSidemenu = toggleSidemenu;
        vm.closeSidemenu = closeSidemenu;
        vm.toggleExpandView = toggleExpandView;
        vm.toggleDropdownVisibility = toggleDropdownVisibility;
        vm.getSelectPhoto=getSelectPhoto;
        vm.sendEditedImage=sendEditedImage;

        //Toolbar methods
        vm.flipHorizontal=flipHorizontal;
        vm.flipVertical=flipVertical;
        vm.rotateClockwise=rotateClockwise;
        vm.rotateAntiClockwise=rotateAntiClockwise;
        vm.reset=reset;

        //Expand view methods
        vm.deletePhoto=deletePhoto;
        vm.copyPhoto=copyPhoto;

        /* Initializer */
        function init(){
            // Load more my photos
            loadMoreMyPhotos();

            // Tooltip
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
            });

            // Sidebar
            //$(".action-icons-2 .action-icon, .ptt-sidebar-2-close").click(function(e) {
            //  e.preventDefault();
            //  $("#ptt-wrapper-2").toggleClass("toggled");
            //});

            // Slider With JQuery
            zoomSlider = $("#ex4").slider({
                reversed : true
            });
            zoomSlider.on('slide', function(data) {
                cropperFactory.zoom(data.value);
            });

            /* Action Icon 3 DropMenu */
            $('.action-icons-3 .ptt-dropmenu').on('show.bs.dropdown', function () {
                $('#dLabel2').css('border-radius', '50px 50px 30px 30px');
            });

            $('.action-icons-3 .ptt-dropmenu').on('hidden.bs.dropdown', function () {
                $('#dLabel2').css('border-radius', '50px');
            });

            $(document).ready(function(){
                // Pre cache sticker images test
                preCacheHeros();
                // update image studio .element css
                updateImageEditorSize(null, true);
            });

            // Carousel
            //function toggleThumbActive (i) {
            //  $('#carousel-thumbs .item').removeClass('active');
            //  $('#carousel-thumbs .item:nth-child(' + i +')').addClass('active');
            //}
            //$('#carousel').on('slide.bs.carousel', function(e) {
            //  //var active = $(e.target).find('.carousel-inner > .item.active');
            //  //var from = active.index();
            //  var from = $('#carousel .item.active').index()+1;
            //  var next = $(e.relatedTarget);
            //  to = next.index();
            //  var nextThumbs = Math.ceil(to/thumbs) - 1;
            //  if (nextThumbs != currentThumbs) {
            //    $('#carousel-thumbs').carousel(nextThumbs);
            //    currentThumbs = nextThumbs;
            //  }
            //  thumbActive = +to-(currentThumbs*thumbs);
            //  //console.log(from + ' => ' + to + ' / ' + currentThumbs);
            //});
            //$('#carousel').on('slid.bs.carousel', function(e) {
            //  toggleThumbActive(thumbActive);
            //});
            //$('#carousel-thumbs').on('slid.bs.carousel', function(e) {
            //  toggleThumbActive(thumbActive);
            //});

            // Refresh Svgs
            //setTimeout(function(){
            //  var svgs = $('.custom-svg-icon object');
            //  for(var i=0; i<svgs.length; i++){
            //    var actualWidth = $(svgs[i]).css('width');
            //    $(svgs[i]).css({
            //      'width': 0
            //    });
            //    $(svgs[i]).css({
            //      'width': actualWidth
            //    })
            //  }
            //}, 3000);

            // Draggable & Resizable for demo
            //$('.draggableHelper').draggable();


        }

        // Light Slider


        /* Functions */
        //function changeThumb(position){
        //  console.log(position);
        //  console.log("Thumnail",thumbActive);
        //  $('#carousel-thumbs').carousel(position);
        //  var activeThumbIndex = $('#carousel-thumbs .item.active').index();
        //  if(position=='next'){activeThumbIndex++;}
        //  else {activeThumbIndex--;}
        //  if(activeThumbIndex>=thumbs){
        //    activeThumbIndex = 0;
        //  }
        //  else if(activeThumbIndex<0){
        //    activeThumbIndex = thumbs-1;
        //  }
        //  console.log(activeThumbIndex);
        //  $('#carousel').carousel(activeThumbIndex);
        //  //toggleThumbActive(thumbActive);
        //}

        function toggleSidemenu(template){
            // if opening
            if(!$("#ptt-wrapper-2").hasClass("toggled")){
                console.log("opening");
                //width: 43.6%;
                //margin-left: -21.5%;
                vm.sideMenuTemplate = 'src/dashboard/sidemenu/'+template+'.html';
                //$('div#image-studio div.element').css({
                //  'width': '43.6%',
                //  'margin-left': '-21.5%'
                //});
                //$('div#image-studio').css({
                //  'padding': '3.6% 0'
                //});
                vm.activeSidemenuItem = template;
                $("#ptt-wrapper-2").toggleClass("toggled");
            }
            // else if closing
            else{
                if(vm.activeSidemenuItem != template) {
                    vm.activeSidemenuItem = template;
                    vm.sideMenuTemplate = 'src/dashboard/sidemenu/'+template+'.html';
                }
                else{
                    console.log("closing");
                    vm.activeSidemenuItem = '';
                    //width: 34%;
                    //margin-left: -19.5%;
                    //$('div#image-studio div.element').css({
                    //  'width': '34%',
                    //  'margin-left': '-19.5%'
                    //});
                    //$('div#image-studio').css({
                    //  'padding': '2.65% 0'
                    //});
                    $("#ptt-wrapper-2").toggleClass("toggled");
                }
            }
        }

        function closeSidemenu(){
            if($("#ptt-wrapper-2").hasClass("toggled")){
                $("#ptt-wrapper-2").removeClass("toggled");
                //$('div#image-studio div.element').css({
                //  'width': '34%',
                //  'margin-left': '-19.5%'
                //});
                $('div#image-studio').css({
                    'padding': '2.65% 0'
                });
            }
        }

        function preCacheHeros(){

            var stickerArray = ['images/sidemenu/stickers/2.png', 'images/sidemenu/stickers/3.png', 'images/sidemenu/stickers/5.png',
                'images/sidemenu/stickers/4.png', 'images/sidemenu/stickers/1.png', 'images/sidemenu/stickers/6.png'];
            $.each(stickerArray, function(){
                console.log(this);
                var img = new Image();
                img.src = this;
            });
        }

        function toggleExpandView(){

            if($('.step2b').hasClass('top-80px')){
                $('.step2-main').removeClass('opacity-0');
                $('.step2b').removeClass('top-80px');
            }
            else{
                $('.step2-main').addClass('opacity-0');
                $('.step2b').addClass('top-80px');
            }
        }

        function toggleDropdownVisibility(dropDownSelector){
            //$(dropDownSelector).toggleClass('opacity-1');
        }

        // resize event
        $(window).resize(updateImageEditorSize);

        function updateImageEditorSize(event, runningFirstTime){
            console.log("resizing :)");
            var imageStudio = {
                height: $("#image-studio").height(),
                width: $("#image-studio").width()
            };
            var element = {
                original:{
                    height: 459,
                    width: 459
                },
                current:{
                    height: $("#image-studio .element").height(),
                    width: $("#image-studio .element").width()
                }
            };
            var updateValue = 0;
            var firstTimeDifference = 17;
            console.log("#image-studio height: ", imageStudio.height);
            console.log("#image-studio width: ", imageStudio.width);
            console.log("#image-studio .element current height: ", element.current.height);
            console.log("#image-studio .element current width: ", element.current.width);

            // Formula for aspect ratio equality calculation
            // (original height / original width) = (new height / new width)

            // if image studio height is small
            if(imageStudio.height < imageStudio.width){
                // new width = (new height)/(original height / original width)
                updateValue = (imageStudio.height)/(element.original.height/element.original.width);
                //if(runningFirstTime != undefined){
                //  console.log("running first time: ",runningFirstTime);
                //  updateValue = Number(updateValue + firstTimeDifference);
                //}
                console.log("height is small");
            }
            // else if image studio width is small
            else if(imageStudio.width < imageStudio.height){
                // new height = (original height / original width) x (new width)
                updateValue = (element.original.height/element.original.width) * (imageStudio.width);
                console.log("width is small");
            }

            // update css
            console.log("change height and width to: ", updateValue);
            $("#image-studio .element").width(updateValue);
            $("#image-studio .element").height(updateValue);
            $("#image-studio .element").css({
                'margin-left': '-' + Number((updateValue/2)+33) + 'px',
                'left': '50%'
            });

        }

        // load new photos
        function loadMoreMyPhotos(){
            if((vm.myPhotosTotalCount > vm.myPhotos.length)) {
                vm.myPhotosPagination.from += 12;
                photosFactory.getPhotos(vm.myPhotosPagination)
                    .then(function (resp) {
                        console.log("new photos length: ", resp.photos.length);
                        resp['photos'].forEach(function (elem, index) {
                            vm.myPhotos.push(elem);
                        });
                        if (vm.myPhotosTotalCount > vm.myPhotos.length) {
                            // call it self
                            loadMoreMyPhotos();
                        }
                        else {
                            console.log("all photos are loaded");
                            //vm.slider.showUploadImage = true;
                            //step2Slider = $("#step1-lightSlider").lightSlider(uploadSliderConfig);
                            //step2Slider.goToSlide(vm.slider.indexOfLastPhotoInCurrentFrame-vm.slider.photosInCurrentFrame);
                        }
                    })
            }
        }
        function getSelectPhoto(id){
            vm.imageId=id;
            photosFactory.getSelectedPhoto(id).then(function(resp){
                vm.selectedPhoto = resp.base64;
                setTimeout(function(){
                    cropperFactory.initiateCrop('#selected-image');
                }, 500);
            });
        };

        //Toolbar methods
        function flipHorizontal(){
            cropperFactory.flipHorizontal();
        }
        function flipVertical(){
            cropperFactory.flipVertical();
        }
        function rotateClockwise(){
            cropperFactory.rotateClockwise();
        }
        function rotateAntiClockwise(){
            cropperFactory.rotateAntiClockwise();
        }
        function reset(){
            cropperFactory.reset();
        }

        //send edited image to the server
        function sendEditedImage(){
            var details=cropperFactory.getImageDetails();
            photosFactory.sendEditedImage(vm.imageId, details).then(function(resp){
                console.log(resp);
            });
        }

        //Expand view methods definition
        function deletePhoto(id, index){
            photosFactory.deletePhoto(id).then(function(response){
                if(response.success){
                    vm.myPhotos.splice(index, 1);
                    alertFactory.success("Success!", "Photo deleted.");
                }
            });
        };
        function copyPhoto(id, index){
            photosFactory.copyPhoto(id, index).then(function(response){
                if(response.success){
//                    vm.myPhotos.splice(index, 1);
                    alertFactory.success("Success!", "Photo deleted.");
                }
            });
        };

//splice(index,0,element)
        /* Initializer Call */
        init();
    }
}());
