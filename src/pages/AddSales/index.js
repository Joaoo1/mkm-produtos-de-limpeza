import React, { useState, useEffect } from 'react';
import {
  FiArrowLeft,
  FiUserPlus,
  FiXCircle,
  FiX,
  FiPlus,
  FiMinus,
} from 'react-icons/fi';
import { AutoComplete } from 'primereact/autocomplete';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';

import { Header, Form, Values } from './styles';
import { PrimaryButton } from '../../styles/button';
import { SelectClientModal } from '../../styles/modal';

import ClientController from '../../controllers/ClientController';
import ProductController from '../../controllers/ProductController';

export default function AddSales() {
  SelectClientModal.setAppElement('#root');
  const [selectClientModalIsOpen, setSelectClientModalOpen] = useState(false);
  const [productsSuggestions, setProductSuggestions] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  const [sale, setSale] = useState({
    paymentMethod: 'unpaid',
    hasDiscount: false,
    products: [],
    client: { nome: '' },
  });

  const [values, setValues] = useState({
    totalProducts: '0.00',
    totalPaid: '0.00',
    discount: '0.00',
    total: '0.00',
  });

  // Prevent AutoComplete from clearing its values automatically
  const [product, setProduct] = useState({ nome: '', quantidade: 1 });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      const products = await ProductController.index();
      setProducts(products);
    }

    fetchProducts();
  }, []);

  // Setting Autocomplete suggestions
  function suggestsProducts(event) {
    const suggestionResults = products.filter(productSuggestion =>
      productSuggestion.nome.toLowerCase().startsWith(event.query.toLowerCase())
    );

    const results = suggestionResults.map(product => product.nome);
    setProductSuggestions(results);
  }

  function addProductToList(event) {
    if (event.keyCode === 13) {
      products.forEach((p, idx) => {
        if (p.nome.includes(event.target.value)) {
          productSales.push({
            ...products[idx],
            quantidade: product.quantidade,
          });
          setProduct({ nome: '', quantidade: 1 });
        }
      });
    }
  }

  function test() {
    console.log(product);
  }

  function handleRemoveQtt() {
    if (product.quantidade > 1) {
      setProduct({ ...product, quantidade: product.quantidade - 1 });
    }
  }

  function handleAddQtt() {
    setProduct({ ...product, quantidade: product.quantidade + 1 });
  }

  function handleDeleteProduct(index) {
    setProductSales(productSales.filter((product, idx) => idx !== index));
  }

  async function toogleSelectClientModal() {
    setSelectClientModalOpen(!selectClientModalIsOpen);
    if (clients.length === 0) {
      const clients = await ClientController.index();
      setClients(clients);
      setFilteredClients(clients);
    }
  }

  function selectClient(index) {
    setSale({ ...sale, client: filteredClients[index] });
    toogleSelectClientModal();
  }

  function filterClientList(event) {
    setFilteredClients(
      clients.filter(client =>
        client.nome.toLowerCase().includes(event.target.value)
      )
    );
  }

  function toggleDiscount(event) {
    setSale({ ...sale, hasDiscount: event.checked });
    if (!event.checked) {
      setValues({ ...values, discount: '0.00' });
    }
  }
  return (
    <>
      <SelectClientModal
        isOpen={selectClientModalIsOpen}
        onRequestClose={toogleSelectClientModal}
        closeTimeoutMS={450}
        overlayClassName="modal-overlay"
      >
        <header className="p-grid  p-justify-between">
          <h2>Selecione um cliente</h2>
          <FiX size={28} onClick={toogleSelectClientModal} />
        </header>

        <hr />

        <InputText
          placeholder="Digite o nome do cliente"
          width={200}
          onChange={filterClientList}
        />

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client, idx) => {
              return (
                <tr key={client.id} onClick={() => selectClient(idx)}>
                  <td>{client.nome}</td>
                  <td>{client.cidade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </SelectClientModal>

      <div className="p-grid ">
        <Header className="p-col-12">
          <p>
            <FiArrowLeft size={40} />
            Registrar nova venda
          </p>
          <PrimaryButton onClick={test}>Registrar</PrimaryButton>
        </Header>

        <Form className="p-col-12 p-xl-6">
          <div className="p-grid p-dir-col">
            <h4>Produtos</h4>
            {/* TODO: Find out why div is getting so height */}
            <div className="p-grid p-align-center height60px">
              <AutoComplete
                id="products"
                dropdown
                value={product.nome}
                onChange={e => setProduct({ ...product, nome: e.target.value })}
                suggestions={productsSuggestions}
                completeMethod={suggestsProducts}
                placeholder="Digite o nome do produto"
                onKeyUp={addProductToList}
              />
              <button type="button" className="quantity" onClick={handleAddQtt}>
                <FiPlus color="white" size={24} />
              </button>
              <InputText
                id="quantity"
                value={product.quantidade}
                keyfilter="int"
                onChange={e =>
                  setProduct({ ...product, quantidade: e.target.value })}
              />
              <button
                type="button"
                className="quantity"
                onClick={handleRemoveQtt}
              >
                <FiMinus color="white" size={24} />
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th colSpan="4">Produtos Adicionados</th>
              </tr>
            </thead>
            <tbody>
              {productSales.map((product, idx) => {
                return (
                  <tr key={product.nome}>
                    <td>{`${product.quantidade}x`}</td>
                    <td>{product.nome}</td>
                    <td>{`R$${product.preco}`}</td>
                    <td>
                      <FiXCircle
                        size={22}
                        color="red"
                        onClick={() => handleDeleteProduct(idx)}
                        title="Excluir produto"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="p-grid p-dir-col ">
            <h4>Cliente</h4>
            {/* TODO: Find out why div is getting so height */}
            <div className="p-grid p-align-center height60px">
              <InputText
                id="clients"
                type="text"
                value={sale.client.nome}
                placeholder="Selecione um cliente"
                disabled
              />
              <button type="button" onClick={() => toogleSelectClientModal()}>
                <FiUserPlus size="32" color="#fff" />
              </button>
            </div>
          </div>

          <div className="p-grid p-dir-col ">
            <h4>Formas de pagamento</h4>
            <div className="p-grid  p-align-center p-justify-between">
              <label>
                <RadioButton
                  value="unpaid"
                  name="payment"
                  onChange={e =>
                    setSale({ ...sale, paymentMethod: e.target.value })}
                  checked={sale.paymentMethod === 'unpaid'}
                />
                Não Pago
              </label>
              <label>
                <RadioButton
                  value="paid"
                  name="payment"
                  onChange={e =>
                    setSale({ ...sale, paymentMethod: e.target.value })}
                  checked={sale.paymentMethod === 'paid'}
                />
                Pago
              </label>
              <label>
                <RadioButton
                  value="partially"
                  name="payment"
                  onChange={e =>
                    setSale({ ...sale, paymentMethod: e.target.value })}
                  checked={sale.paymentMethod === 'partially'}
                />
                Parcialmente pago
              </label>
            </div>
          </div>

          <div className="p-grid p-dir-col ">
            <label className="p-grid ">
              <Checkbox
                inputId="cb1"
                value="discount"
                checked={sale.hasDiscount}
                onChange={toggleDiscount}
              />
              Conceder desconto
            </label>

            <InputText
              id="discount"
              disabled={!sale.hasDiscount}
              keyfilter="pnum"
              value={values.discount}
              onChange={e => setValues({ ...values, discount: e.target.value })}
            />
          </div>
        </Form>

        <Values className="p-col-12 p-xl-6">
          <table>
            <tbody>
              <tr>
                <td>
                  <p>Produtos:</p>
                </td>
                <td>{`R$${values.totalProducts}`}</td>
              </tr>
              <tr>
                <td>
                  <p>Valor Pago:</p>
                </td>
                <td>{`R$${values.totalPaid}`}</td>
              </tr>
              <tr>
                <td>
                  <p>Desconto:</p>
                </td>
                <td>{`R$${values.discount}`}</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <hr />
                </td>
              </tr>
              <tr>
                <td>
                  <p>Total:</p>
                </td>
                <td>{`R$${values.total}`}</td>
              </tr>
            </tbody>
          </table>
        </Values>
      </div>
    </>
  );
}
