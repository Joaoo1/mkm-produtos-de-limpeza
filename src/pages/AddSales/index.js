import React, { useState } from 'react';
import { FiArrowLeft, FiUserPlus, FiXCircle, FiX } from 'react-icons/fi';
import { AutoComplete } from 'primereact/autocomplete';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';

import { Header, Form, Values } from './styles';
import { PrimaryButton } from '../../styles/button';
import { SelectClientModal } from '../../styles/modal';

export default function AddSales() {
  SelectClientModal.setAppElement('#root');
  const [selectClientModalIsOpen, setSelectClientModalOpen] = useState(false);
  const [productsSuggestions, setProductSuggestions] = useState([]);

  const [sale, setSale] = useState({
    paymentMethod: 'unpaid',
    hasDiscount: false,
    products: [],
    client: {},
  });

  const [values, setValues] = useState({
    totalProducts: '0.00',
    totalPaid: '0.00',
    discount: '0.00',
    total: '0.00',
  });

  // FIXME: Prevent AutoComplete from clearing its values automatically
  const [product, setProduct] = useState('');

  // TODO: Get products name from db for AutoComplete suggestions
  const products = ['Amaciante', 'Desinfetante', 'Sabão liquído'];

  // Setting Autocomplete suggestions
  function suggestsProducts(event) {
    const suggestionResults = products.filter(productSuggestion =>
      productSuggestion.toLowerCase().startsWith(event.query.toLowerCase())
    );

    setProductSuggestions(suggestionResults);
  }

  function addProductToList(event) {
    if (event.keyCode === 13) {
      console.log(event.target.value);
    }
  }

  function test() {
    console.log(sale, values);
  }

  function handleCloseSelectClientModal() {
    setSelectClientModalOpen(false);
  }

  return (
    <>
      <SelectClientModal
        isOpen={selectClientModalIsOpen}
        onRequestClose={handleCloseSelectClientModal}
        closeTimeoutMS={450}
        overlayClassName="modal-overlay"
      >
        <header className="p-grid p-nogutter p-justify-between">
          <h2>Selecione um cliente</h2>
          <FiX size={28} onClick={handleCloseSelectClientModal} />
        </header>

        <hr />

        <InputText placeholder="Digite o nome do cliente" width={200} />

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pedro Augusto</td>
              <td>Joaçaba</td>
            </tr>
            <tr>
              <td>Pedro Augusto</td>
              <td>Joaçaba</td>
            </tr>
            <tr>
              <td>Pedro Augusto</td>
              <td>Joaçaba</td>
            </tr>
          </tbody>
        </table>
      </SelectClientModal>
      <div className="p-grid p-nogutter">
        <Header className="p-col-12">
          <p>
            <FiArrowLeft size={40} />
            Registrar nova venda
          </p>
          <PrimaryButton onClick={test}>Registrar</PrimaryButton>
        </Header>
        <Form className="p-col-12 p-xl-6">
          <div>
            <h4>Produtos</h4>
            <AutoComplete
              id="products"
              dropdown
              value={product}
              onChange={e => setProduct(e.target.value)}
              suggestions={productsSuggestions}
              completeMethod={suggestsProducts}
              placeholder="Digite o nome do produto"
              onKeyUp={addProductToList}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th colSpan="4">Produtos Adicionados</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1x</td>
                <td>Desinfetante</td>
                <td>R$20.00</td>
                <td>
                  <FiXCircle
                    size={22}
                    color="red"
                    // onClick={() => handleDeleteProduct(product.nome)}
                    onClick={() => {}}
                  />
                </td>
              </tr>
              <tr>
                <td>1x</td>
                <td>Desinfetante</td>
                <td>R$20.00</td>
                <td>
                  <FiXCircle
                    size={22}
                    color="red"
                    // onClick={() => handleDeleteProduct(product.nome)}
                    onClick={() => {}}
                  />
                </td>
              </tr>
              <tr>
                <td>1x</td>
                <td>Desinfetante</td>
                <td>R$20.00</td>
                <td>
                  <FiXCircle
                    size={22}
                    color="red"
                    // onClick={() => handleDeleteProduct(product.nome)}
                    onClick={() => {}}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <h4>Cliente</h4>
            <div className="p-grid p-nogutter p-align-center">
              <InputText
                id="clients"
                type="text"
                placeholder="Selecione um cliente"
                disabled
              />
              <button
                type="button"
                onClick={() => setSelectClientModalOpen(true)}
              >
                <FiUserPlus size="32" color="#fff" />
              </button>
            </div>
          </div>

          <div>
            <h4>Formas de pagamento</h4>
            <div className="p-grid p-nogutter p-align-center p-justify-between">
              <label>
                <RadioButton
                  value="unpaid"
                  name="payment"
                  onChange={e =>
                    setSale({ ...sale, paymentMethod: e.target.value })
                  }
                  checked={sale.paymentMethod === 'unpaid'}
                />
                Não Pago
              </label>
              <label>
                <RadioButton
                  value="paid"
                  name="payment"
                  onChange={e =>
                    setSale({ ...sale, paymentMethod: e.target.value })
                  }
                  checked={sale.paymentMethod === 'paid'}
                />
                Pago
              </label>
              <label>
                <RadioButton
                  value="partially"
                  name="payment"
                  onChange={e =>
                    setSale({ ...sale, paymentMethod: e.target.value })
                  }
                  checked={sale.paymentMethod === 'partially'}
                />
                Parcialmente pago
              </label>
            </div>
          </div>

          <div>
            <label className="p-grid p-nogutter">
              <Checkbox
                inputId="cb1"
                value="discount"
                checked={sale.hasDiscount}
                onChange={e => setSale({ ...sale, hasDiscount: e.checked })}
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
