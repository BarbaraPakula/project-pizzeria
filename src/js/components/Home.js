import { select, templates } from '../settings.js';
class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    // thisHome.initLinks();
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
 
  }

}


export default Home;