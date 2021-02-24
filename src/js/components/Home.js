import { select, templates, classNames } from '../settings.js';
class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);

    thisHome.initLinks();
  }

  render(element) {
    const thisHome = this;
    const generatedHTML = templates.home();

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.bookTable = document.querySelector('.book-table');
    thisHome.dom.orderOnline = document.querySelector('.order-online');
    thisHome.dom.pages = document.querySelector(select.containerOf.pages).children;
    thisHome.dom.navLinks = document.querySelectorAll(select.nav.links);
    console.log('thisHome.dom.pages', thisHome.dom.pages);
    console.log('thisHome.dom.navLinks', thisHome.dom.navLinks);
  }

  initLinks() {
    const thisHome = this;

    thisHome.dom.orderOnline.addEventListener('click', function (event) {
      event.preventDefault();
      thisHome.dom.pages[0].classList.remove(classNames.pages.active);
      thisHome.dom.navLinks[0].classList.remove(classNames.nav.active);
      thisHome.dom.pages[1].classList.add(classNames.pages.active);
      thisHome.dom.navLinks[1].classList.add(classNames.nav.active);
    });

    thisHome.dom.bookTable.addEventListener('click', function (event) {
      event.preventDefault();
      thisHome.dom.pages[0].classList.remove(classNames.pages.active);
      thisHome.dom.navLinks[0].classList.remove(classNames.nav.active);
      thisHome.dom.pages[2].classList.add(classNames.pages.active);
      thisHome.dom.navLinks[2].classList.add(classNames.nav.active);
    });
  }
}


export default Home;