$('.select-source').slick({
  centerMode: false,
  slidesToShow: 3,
  centerMode: false,
  dots: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: true,
        centerMode: true,
        slidesToShow: 3
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: true,
        centerMode: true,
        slidesToShow: 3
      }
    }
  ],
	prevArrow: '<div class="slick-prev"><i class="fa fa-angle-left" aria-hidden="true"></i></div>',
	nextArrow: '<div class="slick-next"><i class="fa fa-angle-right" aria-hidden="true"></i></div>'
});