export default class Client {
  constructor({ bairro, cidade, endereco, complemento, nome, telefone, id }) {
    this.bairro = bairro;
    this.cidade = cidade;
    this.endereco = endereco;
    this.complemento = complemento;
    this.nome = nome;
    this.telefone = telefone;
    this.id = id;
  }

  cleanUp() {
    this.bairro = '';
    this.cidade = '';
    this.endereco = '';
    this.complemento = '';
    this.nome = '';
    this.telefone = '';
    this.id = '';
  }
}
