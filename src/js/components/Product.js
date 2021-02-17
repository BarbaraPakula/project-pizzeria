import { select, templates, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
class Product {

  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }
  renderInMenu() {
    const thisProduct = this;
    // generate HTML based on tamplate
    const generatedHTML = templates.menuProduct(thisProduct.data);
    // console.log(generatedHTML);
    //create element using utils.createElementFromHTML
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    //find menue container
    const menuContainer = document.querySelector(select.containerOf.menu);
    //add element to menu
    menuContainer.appendChild(thisProduct.element);
  }
  getElements() {
    const thisProduct = this;
    // thisProduct.dom = {};

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    // console.log(thisProduct.imageWrapper);
  }
  initAccordion() {
    const thisProduct = this;
    /* find the clickable trigger (the element that should react to clicking) */
    // const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    /* START: add event listener to clickable trigger on event click */
    thisProduct.accordionTrigger.addEventListener('click', function (event) {
      /* prevent default action for event */
      event.preventDefault();
      /* find active product (product that has active class) */
      const activeProduct = document.querySelector('.product.active');
      /* if there is active product and it's not thisProduct.element, remove class active from it */
      if (activeProduct !== null && activeProduct !== thisProduct.element) {
        activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
      }
      /* toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });

  }
  initOrderForm() {
    const thisProduct = this;
    // console.log(thisProduct);
    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder() {
    const thisProduct = this;
    // covert form to object structure e.g. {sauce:['tomato'], toppings: ['olives', 'redPeppers']}}
    const formData = utils.serializeFormToObject(thisProduct.form);
    // set price to default price
    let price = thisProduct.data.price;
    // for every category (param)...
    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      // for every option in this category
      for (let optionId in param.options) {
        const option = param.options[optionId];  // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if (optionSelected) {
          // check if the option is not default
          if (!option.hasOwnProperty('default')) {
            price += option.price;
          }
        }
        else {
          // check if the option is default
          if (option.hasOwnProperty('default')) {
            price -= option.price;
          }
        }
        const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        // console.log(optionImage);
        if (optionImage) {
          if (optionSelected) {
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          }
          else if (!optionSelected) {
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    thisProduct.priceSingle = thisProduct.data.price;
    price *= thisProduct.amountWidget.value;
    thisProduct.priceMultiply = price;
    thisProduct.priceElem.innerHTML = price;
  }
  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }
  addToCart() {
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    thisProduct.price = this.priceMultiply;
    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
  prepareCartProduct() {
    const thisProduct = this;
    const productSummary = {
      id: thisProduct.Id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: this.priceMultiply,
      params: thisProduct.prepareCartProductParams(),
    };
    return productSummary;
  }
  prepareCartProductParams() {
    const thisProduct = this;
    // covert form to object structure e.g. {sauce:['tomato'], toppings: ['olives', 'redPeppers']}}
    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = {};
    // for every category
    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];
      // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
      params[paramId] = {
        name: param.label,
        options: {}
      };
      // for every option in this category
      for (let optionId in param.options) {
        const option = param.options[optionId];  // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if (optionSelected) {
          // option is checked
          params[paramId].options[optionId] = option.label;
        }
      }
    }
    return params;
  }

}

export default Product;