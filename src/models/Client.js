import cloneDeep from 'lodash.clonedeep';

export default class Client {
  constructor(client) {
    let c = cloneDeep(client);
    if (!c) c = {};
    this.id = c.id ? c.id : '';
    this.nome = c.nome ? c.nome : '';
    this.bairro = c.bairro ? c.bairro : '';
    this.cidade = c.cidade ? c.cidade : '';
    this.endereco = c.endereco ? c.endereco : '';
    this.complemento = c.complemento ? c.complemento : '';
    this.telefone = c.telefone ? c.telefone : '';
  }

  cleanUp() {
    this.id = '';
    this.nome = '';
    this.bairro = '';
    this.cidade = '';
    this.endereco = '';
    this.complemento = '';
    this.telefone = '';
  }

  formatToFirestore() {
    delete this.id;
  }
}
