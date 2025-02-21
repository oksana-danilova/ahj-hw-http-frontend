import getTicket from './functionGetTicket';
import getRemoveTicketWidget from './removeTicketWidget';
import getAddTicketWidget from './addTicketWidget';
import getEditTicketWidget from './editTicketWidget';
import changeTicketStatus from './functionChangeTicketStatus';
import showTicketDescription from './functionShowTicketDescription';

const serverUrl = 'http://localhost:7070';

const mainContainer = document.querySelector('.container');
const ticketsContainer = document.querySelector('.tickets-container');
const addTicketButton = document.querySelector('.add-ticket-button');

document.addEventListener('DOMContentLoaded', () => {
  const xhrLoadTickets = new XMLHttpRequest();
  xhrLoadTickets.open('GET', `${serverUrl}/?method=allTickets`);
  xhrLoadTickets.responseType = 'json';
  xhrLoadTickets.addEventListener('load', () => {
    if (xhrLoadTickets.status >= 200 && xhrLoadTickets.status < 300) {
      try {
        const responsedTickets = xhrLoadTickets.response;
        if (!responsedTickets.length) return;
        responsedTickets.forEach((ticket) => {
          getTicket(ticket, ticketsContainer);

          const currentTicket = ticketsContainer.lastElementChild;
          const ticketStatus = currentTicket.querySelector('.ticket-status');
          const ticketStatusCheckbox = ticketStatus.querySelector('.ticket-status-checkbox');
          if (ticketStatus.dataset.status === 'true') ticketStatusCheckbox.classList.remove('hidden');
          const ticketName = currentTicket.querySelector('.ticket-name');
          const ticketEdit = currentTicket.querySelector('.ticket-edit-button');
          const ticketRemove = currentTicket.querySelector('.ticket-remove-button');

          //  CHANGE TICKET STATUS
          ticketStatus.addEventListener('click', () => {
            changeTicketStatus(
              mainContainer,
              currentTicket,
              ticketStatus,
              ticketStatusCheckbox,
              serverUrl,
            );
          });

          //  SHOW DESCRIPTION
          ticketName.addEventListener('click', () => {
            showTicketDescription(
              mainContainer,
              currentTicket,
              ticketName,
              serverUrl,
            );
          });

          //  TICKET EDITING
          ticketEdit.addEventListener('click', () => {
            getEditTicketWidget(mainContainer, currentTicket, ticketEdit, serverUrl);
          });

          //  TICKET REMOVING
          ticketRemove.addEventListener('click', () => {
            getRemoveTicketWidget(mainContainer, currentTicket, serverUrl);
          });
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
  xhrLoadTickets.send();

  //  ADD TICKET BUTTON LOGIC
  addTicketButton.addEventListener('click', () => {
    getAddTicketWidget(mainContainer, serverUrl);
  });
});
