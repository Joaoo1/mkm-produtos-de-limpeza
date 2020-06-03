export default class Client {
  constructor({ bairro, cidade, endereco, complemento, nome, telefone, id }) {
    this.id = id;
    this.nome = nome;
    if (bairro) this.bairro = bairro;
    if (cidade) this.cidade = cidade;
    if (endereco) this.endereco = endereco;
    if (complemento) this.complemento = complemento;
    if (telefone) this.telefone = telefone;
  }

  cleanUp() {
    this.id = '';
    this.nome = '';
    if (this.bairro) this.bairro = '';
    if (this.cidade) this.cidade = '';
    if (this.endereco) this.endereco = '';
    if (this.complemento) this.complemento = '';
    if (this.telefone) this.telefone = '';
  }
}
