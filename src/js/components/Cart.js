import { select, classNames, templates, settings } from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';
class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.address = element.querySelector(select.cart.address);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
  }
  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  add(menuProduct) {
    const thisCart = this;
    // generate HTML based on tamplate
    const generatedHTML = templates.cartProduct(menuProduct);
    //create element using utils.createElementFromHTML
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    //add element
    thisCart.dom.productList.appendChild(generatedDOM);
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    console.log((thisCart.products), thisCart.products);
    thisCart.update();
  }
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
    const payload = {
      address: thisCart.dom.address['value'],
      phone: thisCart.dom.phone['value'],
      totalPrice: thisCart.totalPrice,
      subTotalPrice: thisCart.subtotalPrice,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.deliveryFee,
      products: []
    };
    console.log('payload', payload);
    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }
  update() {
    const thisCart = this;
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for (let product of thisCart.products) {
      this.totalNumber += product.amount;
      this.subtotalPrice += product.price;
    }
    if (thisCart.totalNumber !== 0) {
      thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    }
    else {
      thisCart.totalPrice = 0;
      thisCart.deliveryFee = 0;
    }
    console.log(thisCart.deliveryFee, thisCart.totalNumber, thisCart.subtotalPrice, thisCart.totalPrice);
    thisCart.dom.subTotalPrice.innerHTML = thisCart.subtotalPrice;
    // thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    for (let price of thisCart.dom.totalPrice) {
      price.innerHTML = thisCart.totalPrice;
    }
  }
  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);
    console.log('index', index);
    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();

  }
}

export default Cart;