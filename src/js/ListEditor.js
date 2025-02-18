import AddChangePopup from './AddChangePopup';
import Api from './Api';
import ConfirmPopup from './ConfirmPopup';
import Tooltip from './Tooltip';

export default class ListEditor {
  constructor() {
    this.container = null;
    this.listTickets = null;
    this.form = null;
    this.titleField = null;
    this.descripField = null;
    this.addButton = null;
    this.addChangePopup = new AddChangePopup();
    this.confirmPopup = new ConfirmPopup();
    this.tooltip = new Tooltip();
    this.quantity = null;
    this.curId = null;
    this.curTooltipID = null;
    this.api = new Api();
    this.description = null;
  }

  init() {
    this.drawUI();
    this.toAppoint();
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  static get startMarkUp() {
    return `<div class="page">
           <div class="page__body">
             <div class="page__content">
               <table class="page__table table">
                 <caption class="page__title">Тикеты<span class="page__button">Добавить тикет</span></caption>
                 <thead class="table__head">
                   <tr>
                     <th>Статус</th>
                     <th>Наименование </th>
                     <th>Дата</th>
                     <th>Действия</th>
                   </tr>
                 </thead>
                 <tbody class="table__body"></tbody>
                 <tfoot class="table__footer">
                   <tr>
                     <th scope="row" colspan="2">Всего тикетов:</th>
                     <th class="quantity" colspan="1">0</th>
                   </tr>
                 </tfoot>
               </table>
             </div>
           </div>
         </div>`;
  }

  drawUI() {
    this.checkBinding();
    this.container.innerHTML = ListEditor.startMarkUp;
    this.listTickets = this.container.querySelector('.table__body');
    this.api.getAllTickets(this.redrawTickets.bind(this));
    this.addChangePopup.creat();
    this.form = document.forms.adding;
    this.titleField = this.form.title;
    this.descripField = this.form.description;
    this.addButton = this.container.querySelector('.page__button');
    this.confirmPopup.creat('Вы уверены, что хотите удалить этот тикет? Это действие необратимо.', 'Удалить', 'Отменить', 'confirmDel');
    this.quantity = this.container.querySelector('.quantity');
  }

  toAppoint() {
    this.addButton.addEventListener('click', () => {
      this.addChangePopup.showAdding();
    });
    this.form.addEventListener('submit', (event) => this.onSubmit(event));
    this.form.elements[0].addEventListener('change', () => this.onChange());
    this.listTickets.addEventListener('click', (event) => this.onActionsClick(event));
    this.addChangePopup.sample.addEventListener('click', (event) => this.onPopupClick(event));
    this.confirmPopup.getPopup('confirmDel').addEventListener('click', (event) => this.onConfirmPopupClick(event));
  }

  onChange() {
    if (this.form.elements[0].validity.valid) {
      this.tooltip.removeToolTip(this.curTooltipID);
    }
  }

  onConfirmPopupClick(event) {
    if (event.target.dataset.name === 'yes') {
      this.api.deleteTicket(this.curId, this.redrawTickets.bind(this));
      this.confirmPopup.hidePopup('confirmDel');
    }
    if (event.target.dataset.name === 'no') {
      this.confirmPopup.hidePopup('confirmDel');
    }
  }

  onPopupClick(event) {
    if (event.target.dataset.name === 'cancel') {
      event.preventDefault();
      this.hideAddChangePopup();
    }
    if (event.target.dataset.name === 'save') {
      if (this.checkValidity(event)) {
        this.api.createTicket(this.form, this.redrawTickets.bind(this));
        this.hideAddChangePopup();
      }
    }
    if (event.target.dataset.name === 'change') {
      if (this.checkValidity(event)) {
        this.api.editTicket(this.curId, this.form, this.redrawTickets.bind(this));
        this.hideAddChangePopup();
      }
    }
  }

  onActionsClick(event) {
    if (event.target.dataset.name === 'editing') {
      this.curId = event.target.closest('tr').id;
      this.addChangePopup.showUpdate();
      this.api.getTicketById(this.curId, (data) => {
        if (data) {
          this.titleField.value = data.name;
          this.descripField.value = data.description;
        }
      });
    }
    if (event.target.dataset.name === 'delete') {
      this.curId = event.target.closest('tr').id;
      this.confirmPopup.showPopup('confirmDel');
    }
    if (event.target.dataset.name === 'status') {
      this.curId = event.target.closest('tr').id;
      this.api.changeStatus(this.curId, (data) => {
        if (data.success) {
          event.target.classList.toggle('checked');
        }
      });
    }
    if (event.target.dataset.name === 'name') {
      this.curId = event.target.closest('tr').id;
      this.api.getTicketById(this.curId, (data) => {
        if (data) {
          this.description = event.target.querySelector('[data-name="description"]');
          this.description.classList.toggle('d_none');
          this.description.textContent = data.description;
        }
      });
    }
  }

  checkValidity(event) {
    event.preventDefault();
    const first = [...this.form.elements].find((e) => !e.validity.valid);
    if (first) {
      first.focus();
      this.tooltip.removeToolTip(this.curTooltipID);
      this.tooltip.creatTooltip('Заполните пожалуйста это поле', first);
      this.curTooltipID = document.body.lastElementChild.dataset.id;
      return false;
    }
    return true;
  }

  onSubmit(event) {
    this.checkValidity(event);
  }

  redrawTickets(data) {
    this.listTickets.innerHTML = '';
    data.forEach((e) => {
      this.listTickets.insertAdjacentHTML('beforeend', `<tr id="${e.id}">
      <td>
        <div data-name="status" class="td_item status"></div>
      </td>
      <td data-name="name" class="td_item">
        ${e.name}
        <div data-name="description" class="description d_none" ></div>
      </td>
      <td data-name="date"><div class="td_content">${this.cleanDate(e.created)}</div></td>
      <td>
        <div class="td_content"><span class="editing" data-name="editing"></span><span class="delete" data-name="delete"></span></div>
      </td>
    </tr>`);
      const current = document.querySelector(`[id="${e.id}"] [data-name="status"]`);
      if (e.status) {
        current.classList.add('checked');
      }
    });
    this.quantity.textContent = data.length;
  }

  cleanDate(str) {
    const temp1 = str.split(' ');
    this.date = [temp1[0].slice(0, -1), temp1[1]].join(' ');
    return this.date;
  }

  hideAddChangePopup() {
    this.tooltip.removeToolTip(this.curTooltipID);
    this.addChangePopup.hide();
    this.form.reset();
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('ListEditor is not bind to DOM');
    }
  }
}
