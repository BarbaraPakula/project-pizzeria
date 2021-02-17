import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    // console.log('new Booking', thisBooking);
  }

  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    // generowanie kodu HTML za pomocą szablonu templates.
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    // dodanie do tego obiektu właściwości wrapper i przypisanie do niej referencji do kontenera (jest dostępna w argumencie metody),
    // zmiana zawartości wrappera (innerHTML) na kod HTML wygenerowany z szablonu.
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
  }
  initWidgets() {
    const thisBooking = this;
    //  utworzenie nowych instancji
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('click', function () {

    });
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('click', function () {

    });
  }
}
export default Booking;