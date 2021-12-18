const header = document.querySelector('.header');
const navToggle = document.querySelector('.main-nav__toggle');

header.classList.remove('header--nojs');

navToggle.addEventListener('click', function () {
  if (header.classList.contains('main-nav--closed')) {
    header.classList.remove('main-nav--closed');
    header.classList.add('main-nav--opened');
  } else {
    header.classList.add('main-nav--closed');
    header.classList.remove('main-nav--opened');
  }
});
