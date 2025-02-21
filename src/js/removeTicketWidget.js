function removeTicketCancelButtonHandler(mainContainer) {
  if (!mainContainer) return;

  const widgetRemoveTicket = mainContainer.querySelector('[data-widget=removeTicket]');
  const removeTicketCancelButton = widgetRemoveTicket.querySelector('[data-id=cancel]');

  removeTicketCancelButton.addEventListener('click', () => {
    widgetRemoveTicket.remove();
  });
}

function removeTicketOkButtonHandler(mainContainer, currentTicket, serverUrl) {
  if (!mainContainer) return;

  const widgetRemoveTicket = mainContainer.querySelector('[data-widget=removeTicket]');
  const removeTicketOkButton = widgetRemoveTicket.querySelector('[data-id=ok]');

  removeTicketOkButton.addEventListener('click', () => {
    const formData = new FormData();
    formData.append('id', currentTicket.dataset.id);

    const requestRemoveTicketUrl = `${serverUrl}/?method=removeTicket`;
    const xhrRemoveTicket = new XMLHttpRequest();
    xhrRemoveTicket.open('POST', requestRemoveTicketUrl);
    document.body.style.cursor = 'wait';
    xhrRemoveTicket.addEventListener('load', () => {
      if (xhrRemoveTicket.status >= 200 && xhrRemoveTicket.status < 300) {
        try {
          setTimeout(() => {
            document.body.style.cursor = '';
            document.location.reload();
          }, 1000);
        } catch (e) {
          console.error(e);
        }
      }
    });

    widgetRemoveTicket.remove();
    xhrRemoveTicket.send(formData);
  });
}

export default function getRemoveTicketWidget(mainContainer, currentTicket, serverUrl) {
  if (mainContainer.querySelector('.modal')) return;
  const widgetRemoveTicketHtml = `
    <div data-widget="removeTicket" class="modal widget-remove">
      <h2>Удалить тикет?</h2>  
      <div class="widget-form">
        <p class="widget-remove-text">Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
        <div class="widget-form-controls">
          <button data-id="cancel" class="widget-button">Отмена</button>  
          <button data-id="ok" class="widget-button">Ок</button> 
        </div> 
      </div>
    </div>
    `;
  mainContainer.insertAdjacentHTML('beforeEnd', widgetRemoveTicketHtml);

  removeTicketCancelButtonHandler(mainContainer);
  removeTicketOkButtonHandler(mainContainer, currentTicket, serverUrl);
}
