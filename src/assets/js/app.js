$('.select-source').slick({
  slidesToShow: 3,
  centerMode: false,
  dots: true,
  draggable: true,
  lazyLoad: 'ondemand',
	prevArrow: '<div class="slick-prev"><i class="fa fa-angle-left" aria-hidden="true"></i></div>',
	nextArrow: '<div class="slick-next"><i class="fa fa-angle-right" aria-hidden="true"></i></div>'
});


// $(".select-source").on("afterChange", function (){
//     $(".select-source .slick-active a").click();
// })