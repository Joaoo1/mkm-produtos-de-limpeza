export default class Client {
  constructor({ id, nome, endereco, complemento, bairro, cidade, telefone }) {
    this.id = id || '';
    this.name = nome || '';
    this.street = endereco || '';
    this.complement = complemento || '';
    this.neighborhood = bairro || '';
    this.city = cidade || '';
    this.phone = telefone || '';
  }

  cleanUp() {
    this.id = '';
    this.name = '';
    this.street = '';
    this.complement = '';
    this.neighborhood = '';
    this.city = '';
    this.phone = '';
  }
}
