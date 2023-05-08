'use strict';

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

/////////////////////////////////////////////////////////////
// Modal window

const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button =>
  button.addEventListener('click', openModalWindow)
);
//строка сверху вместо строки снизу:
// for (let i = 0; i < btnsOpenModalWindow.length; i++)
//   btnsOpenModalWindow[i].addEventListener('click', openModalWindow);

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

/////////////////////////////////////////////////////////////
// Smooth Page Navigation - Плавное прокручивание

btnScrollTo.addEventListener('click', function (e) {
  const section1Coords = section1.getBoundingClientRect();
  console.log(section1Coords);
  console.log(e.target.getBoundingClientRect());
  console.log(
    'текущее прокручив-е: x, y',
    window.pageXOffset,
    window.pageYOffset
  );
  console.log(
    'ширина и высота viewport',
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  );

  // // старый способ - старые браузеры
  //   window.scrollTo({
  //     left: section1Coords.left + window.pageXOffset,
  //     top: section1Coords.top + window.pageYOffset, //top относит-но viewport
  //     behavior: 'smooth',
  //   });

  // новый способ - современные браузеры
  section1.scrollIntoView({ behavior: 'smooth' });
});

// //////////////////////////////////////////////////////////
// // Smooth Page Navigation

// медленный способ:
// document.querySelectorAll('.nav__link').forEach(function (htmlElement) {
//   htmlElement.addEventListener('click', function (e) {
//     e.preventDefault();
//     const href = this.getAttribute('href');
//     document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// быстрый способ
// Делегирование Событий
// 1. добавить eventListener к общему родителю всех элементов

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // 2. Определить target элемент
  if (e.target.classList.contains('nav__link')) {
    const href = e.target.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////////////
// Tabs

tabContainer.addEventListener('click', function (e) {
  const clickedButton = e.target.closest('.operations__tab');

  // Guard clause - пункт охраны
  if (!clickedButton) return;

  // Active tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedButton.classList.add('operations__tab--active');

  // Active content
  tabContents.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clickedButton.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////////////////////
// Add Fade Out animation to the navigation links

const navLinksHoverAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const linkOver = e.target;
    const siblingLinks = linkOver
      .closest('.nav__links')
      .querySelectorAll('.nav__link');
    const logo = linkOver.closest('.nav').querySelector('img');
    const logoText = linkOver.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(elem => {
      if (elem !== linkOver) elem.style.opacity = this;
    });
    logo.style.opacity = this;
    logoText.style.opacity = this;
  }
};

// Работа с аргументами при помощи bind() и this
nav.addEventListener('mouseover', navLinksHoverAnimation.bind(0.4));
nav.addEventListener('mouseout', navLinksHoverAnimation.bind(1));

/////////////////////////////////////////////////////////////
// Sticky Navigation

// const section1Coords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   if (this.window.scrollY > section1Coords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// Sticky Navigation -Intersection Observer API

// const observerCallback = function(entries, observer) {
//   entries.forEach(entry => {})
// }

// const observerOptions = {
//   root: null, //пересечение target-элементом всего viewport
//   treshhold: 0.1
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1)

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight);

const getStickyNav = function (entries) {
  const entry = entries[0];
  //console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////////////////////////////////
// Section Scrolling

const allSections = document.querySelectorAll('.section');

const appearanceSection = function (entries, observer) {
  const entry = entries[0];
  //console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(appearanceSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

/////////////////////////////////////////////////////////////
// Lazy Loading Images

const lazyImages = document.querySelectorAll('img[data-src]');
console.log(lazyImages);

const loadImages = function (entries, observer) {
  const entry = entries[0];
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Change image resolution from low to high
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const lazyImagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0.7,
  // rootMargin: '300px',
});

lazyImages.forEach(image => lazyImagesObserver.observe(image));

/////////////////////////////////////////////////////////////
// Create Slider

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;
const slidesNumber = slides.length;

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(1300px)';
// slider.style.overflow = 'visible';

const createDots = function () {
  slides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

createDots();

const activateCurrentDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

activateCurrentDot(0);

const moveToSlide = function (slide) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
};

moveToSlide(0);
// 1 - 0%, 2 - 100%, 3 - 200%, 4 - 300%

const nextSlide = function () {
  if (currentSlide === slidesNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  moveToSlide(currentSlide);
  // 1 - -100%, 2 - 0%, 3 - 100%, 4 - 200%
  activateCurrentDot(currentSlide);
};

const previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = slidesNumber - 1;
  } else {
    currentSlide--;
  }

  moveToSlide(currentSlide);
  // 1 - -100%, 2 - 0%, 3 - 100%, 4 - 200%
  activateCurrentDot(currentSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') previousSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide);
    activateCurrentDot(slide);
  }
});

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////
// // выбор элементов

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// console.log(document.querySelector('.header'));
// const sections = document.querySelectorAll('.section');
// console.log(sections);

// console.log(document.getElementById('section--1'));

// // html collection - delete elements from page
// const buttons = document.getElementsByTagName('button');
// console.log(buttons);

// console.log(document.getElementsByClassName('btn'));

// // в соврем JS в больш-ве случ-в исп-ся querySelector и querySelectorAll

// /////////////////////////////////////////////////////////////////
// // создание и вставка элементов
// //.insertAdjacentHTML() - быстрый способ

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies to ensure that we give you the best experience on our website.';
// message.innerHTML =
//   'We use cookies to ensure that we give you the best experience on our website. <button class="btn btn--close-cookie">Ok!</button>';

// const header = document.querySelector('.header');
// //header.prepend(message);
// header.append(message);
// //header.append(message.cloneNode(true));
// // header.before(message);
// // header.after(message);

// // удаление элементов
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// // стили
// message.style.backgroundColor = '#076785';
// message.style.width = '120%';
// console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 50 + 'px';
// console.log(message.style.height);

// document.documentElement.style.setProperty('--color-first', 'yellow');

// // атрибуты
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.getAttribute('src')); // относит-й путь к изобр-ю как в index.html
// console.log(logo.className);

// // нестандартный атрибут
// console.log(logo.developer);
// console.log(logo.getAttribute('developer'));

// // изменить значение атрибута
// logo.alt = 'Лого Прекрасного Банка';

// // новый атрибут
// logo.setAttribute('copyright', 'Masters Of Code');

// const link = document.querySelector('.nav__link--btn '); // абсолютный url
// console.log(link.href); // относительный url
// console.log(link.getAttribute('href'));

// // data atributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('a', 'b');
// logo.classList.remove('a', 'b');
// logo.classList.toggle('a');
// logo.classList.contains('c');
// // не использовать, т.к. все предыдущие классы элемента удалятся
// //logo.className = 'a';

/////////////////////////////////////////////////////////////////
// // Виды Событий и Обработчиков Событий

// // const h1 = document.querySelector('h1');
// // // new approach
// // const alertMouseEnterH1 = function (e) {
// //   alert('addEventListener: You are now at the h1 element');
// //   // удалить обработчик события, чтобы срабатывал один раз
// //   h1.removeEventListener('mouseenter', alertMouseEnterH1);
// // };
// // h1.addEventListener('mouseenter', alertMouseEnterH1);

// const h1 = document.querySelector('h1');
// // new approach
// const alertMouseEnterH1 = function (e) {
//   alert('addEventListener: You are now at the h1 element');
// };
// h1.addEventListener('mouseenter', alertMouseEnterH1);
// // удалить обработчик события через 3 сек
// setTimeout(() => h1.removeEventListener('mouseenter', alertMouseEnterH1), 3000);

// // // old approach
// // h1.onclick = function (e) {
// //   alert('onclick: you have clicked the h1 element');
// // };

// /////////////////////////////////////////////////////////////
// // Event Propagation - Распространение Событий
// // фаза всплытия
// // get a random inteher between two values, inclusive
// // фаза перехвата не исп-ся в наст время

// function getRandomIntInclusive(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
// }

// const getRandomColor = () =>
//   `rgb(${getRandomIntInclusive(0, 255)}, ${getRandomIntInclusive(
//     0,
//     255
//   )}, ${getRandomIntInclusive(0, 255)})`;

// //
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
//   e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
// });

// document.querySelector('body').addEventListener('click', function (e) {
//   this.style.backgroundColor = getRandomColor();
// });

// // ///////////////////////////////////////////////////////////////// DOM Traversing - Перемещение по DOM

// const h1 = document.querySelector('h1');

// // перемещ-е вниз (к потомкам)
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children); //только для прямых потомков
// console.log(h1.firstElementChild); //первый элемент-потомок
// h1.firstElementChild.style.color = 'yellow';
// console.log(h1.lastElementChild);

// // перемещ-е вверх (к родителям)
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// const h2 = document.querySelector('h2');
// console.log(h2);
// h2.closest('.section').style.backgroundColor = 'blue';

// // перемещ-е в стороны
// console.log(h2.previousElementSibling);
// console.log(h2.nextElementSibling);

// console.log(h1.parentElement.children);
