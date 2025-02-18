export default class Tooltip {
  constructor() {
    this.list = [];
  }

  static markup(message) {
    return `<div class="tooltip__content">
              <div class="tooltip__text">${message}</div>
            </div>
            <div class="tooltip__arrow"></div>`;
  }

  getId() {
    const id = Math.floor(Math.random() * 10000000);
    if (this.list.find((e) => e.dataset.id === id)) {
      return this.getId();
    }
    return id;
  }

  creatTooltip(message, targetElem) {
    const id = this.getId();
    const tooltip = document.createElement('div');
    tooltip.dataset.id = id;
    tooltip.className = 'tooltip';
    tooltip.innerHTML = Tooltip.markup(message);
    this.list.push(tooltip);
    document.body.appendChild(tooltip);
    if (targetElem) {
      const { bottom, left } = targetElem.getBoundingClientRect();
      tooltip.style.top = `${bottom + 10}px`;
      tooltip.style.left = `${left + 110}px`;
    }
  }

  removeToolTip(id) {
    const removig = this.list.findIndex((tooltip) => tooltip.dataset.id === id);
    if (removig !== -1) {
      this.list[removig].remove();
      this.list.splice(removig, 1);
    }
  }
}
