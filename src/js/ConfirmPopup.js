export default class ConfirmPopup {
  constructor(container = document.body) {
    this.container = container;
    this.list = [];
  }

  static markUP(text, textBtn1, textBtn2) {
    return `<div class="popup__body">
      <div class="popup__content">
      <h3 class="popup__title">Удалить тикет</h3>
        <div class="popup__title">${text}</div>
        <div class="popup__buttons">
          <button data-name="yes" class="button">${textBtn1}</button>
          <button data-name="no" class="button">${textBtn2}</button>
        </div>
      </div>
    </div>`;
  }

  getPopup(id) {
    const item = this.list.find((e) => e.dataset.id === id);
    if (item) {
      return item;
    }
    return null;
  }

  showPopup(id) {
    this.getPopup(id).classList.add('open');
  }

  hidePopup(id) {
    this.getPopup(id).classList.remove('open');
  }

  creat(text, textBtn1, textBtn2, dataID) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.setAttribute('id', 'confirm');
    popup.dataset.id = dataID;
    popup.innerHTML = ConfirmPopup.markUP(text, textBtn1, textBtn2);
    this.list.push(popup);
    this.container.appendChild(popup);
  }

  delete(id) {
    const removing = this.list.findIndex((popup) => popup.dataset.id === id);
    this.list[removing].remove();
    this.list.splice(removing, 1);
  }
}
