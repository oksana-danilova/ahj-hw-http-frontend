export default function changeTicketStatus(
  mainContainer,
  currentTicket,
  ticketStatus,
  ticketStatusCheckbox,
  serverUrl,
) {
  if (mainContainer.querySelector('.modal')) return;

  ticketStatusCheckbox.classList.toggle('hidden');
  let { status } = ticketStatus.dataset;
  const isHidden = ticketStatusCheckbox.classList.contains('hidden');
  if (isHidden) status = false;
  if (!isHidden) status = true;

  const formData = new FormData();
  formData.append('id', currentTicket.dataset.id);
  formData.append('status', status);

  const requestChangeTicketStatusUrl = `${serverUrl}/?method=changeTicketStatus`;
  const xhrChangeTicketStatus = new XMLHttpRequest();
  xhrChangeTicketStatus.open('POST', requestChangeTicketStatusUrl);
  document.body.style.cursor = 'wait';

  xhrChangeTicketStatus.addEventListener('load', () => {
    if (xhrChangeTicketStatus.status >= 200 && xhrChangeTicketStatus.status < 300) {
      try {
        setTimeout(() => {
          document.body.style.cursor = '';
        }, 500);
      } catch (e) {
        console.error(e);
      }
    }
  });

  xhrChangeTicketStatus.send(formData);
}
