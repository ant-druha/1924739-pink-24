const header = document.querySelector('.header');
const navToggle = header.querySelector('.main-nav__toggle');

header.classList.remove('header--nojs');

navToggle.addEventListener('click', function () {
  header.classList.toggle('main-nav--closed')
  header.classList.toggle('main-nav--opened')
});

document.querySelectorAll('.modal-container').forEach(dialogContainer => {
  const dialogBtn = dialogContainer.querySelector('.form__button');
  dialogBtn.addEventListener('click', (() => {
    dialogContainer.classList.add('modal-container--close');
  }))
})
