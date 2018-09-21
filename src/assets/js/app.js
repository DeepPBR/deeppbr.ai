$('.select-source').slick({
  slidesToShow: 3,
  centerMode: false,
  dots: true,
  lazyLoad: 'ondemand',
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: true,
        slidesToShow: 1,
        dots: false
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: true,
        slidesToShow: 1,
        dots: false
      }
    }
  ],
	prevArrow: '<div class="slick-prev"><i class="fa fa-angle-left" aria-hidden="true"></i></div>',
	nextArrow: '<div class="slick-next"><i class="fa fa-angle-right" aria-hidden="true"></i></div>'
});


// $(".select-source").on("afterChange", function (){
//     $(".select-source .slick-active a").click();
// })