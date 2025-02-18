export default class Api {
  constructor() {
    this.options = null;
    // this.baseURL = 'https://ahj-7-1-http-backend-sergius.amvera.io/';
    this.baseURL = 'https://ahj-7-1.sergem.xyz/';
  }

  createTicket(form, callback) {
    const params = new FormData();
    Array.from(form.elements)
      .filter((e) => e.name === 'title' || e.name === 'description')
      .forEach((e) => {
        if (e.name === 'title') {
          params.append('name', `${e.value}`);
        }
        if (e.name === 'description') {
          params.append('description', `${e.value}`);
        }
      });
    this.options = {
      method: 'POST',
      query: 'method=createTicket',
      data: params,
    };
    return this.createRequest(this.options, callback);
  }

  getAllTickets(callback) {
    this.options = {
      method: 'GET',
      query: 'method=allTickets',
      data: null,
    };
    return this.createRequest(this.options, callback);
  }

  changeStatus(id, callback) {
    this.options = {
      method: 'GET',
      query: `method=changeStatus&id=${id}`,
      data: null,
    };
    return this.createRequest(this.options, callback);
  }

  getTicketById(id, callback) {
    this.options = {
      method: 'GET',
      query: `method=ticketById&id=${id}`,
      data: null,
    };
    return this.createRequest(this.options, callback);
  }

  editTicket(id, form, callback) {
    const params = new FormData();
    Array.from(form.elements)
      .filter((e) => e.name === 'title' || e.name === 'description')
      .forEach((e) => {
        if (e.name === 'title') {
          params.append('name', `${e.value}`);
        }
        if (e.name === 'description') {
          params.append('description', `${e.value}`);
        }
      });
    params.append('id', id);
    this.options = {
      method: 'POST',
      query: 'method=editTicket',
      data: params,
    };
    this.createRequest(this.options, callback);
  }

  deleteTicket(id, callback) {
    this.options = {
      method: 'GET',
      query: `method=deleteTicket&id=${id}`,
      data: null,
    };
    return this.createRequest(this.options, callback);
  }

  createRequest(options, callback) {
    const xhr = new XMLHttpRequest();
    const url = `${this.baseURL}?${options.query}`;
    xhr.open(options.method, url);
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          callback(data);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
    });
    xhr.send(options.data);
  }
}
