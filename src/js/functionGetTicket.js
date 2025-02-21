export default function getTicket(ticket, ticketsContainer) {
  const ticketHtml = `
<div data-id="${ticket.id}" class="ticket-wrapper">
  <div class="ticket-body">
    <div data-status="${ticket.status}" class="ticket-status">
    <span class="ticket-status-checkbox hidden">&#10004;</span>
    </div>
    <div class="ticket-name"><p>${ticket.name}</p></div>
    <div class="ticket-timestamp">
      <span>${ticket.created}</span>
    </div>
    <div class="ticket-edit-button">
    <span>&#9998;</span>
    </div>
    <div class="ticket-remove-button">
      <span>&#10006;</span>
    </div>
  </div>
  <div class="ticket-description hidden"><p></p></div>
</div>
 `;

  ticketsContainer.insertAdjacentHTML('beforeEnd', ticketHtml);
}
