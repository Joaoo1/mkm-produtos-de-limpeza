import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Big from 'big.js';

import { FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import { AutoComplete } from 'primereact/autocomplete';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Growl } from 'primereact/growl';

import { Header, Form, Values } from '../AddSales/styles';
import { PrimaryButton } from '../../styles/button';

import ProductController from '../../controllers/ProductController';
import SaleController from '../../controllers/SaleController';

import { successMsg, errorMsg } from '../../helpers/Growl';

export default function EditSales() {
  const growl = useRef(null);
  const history = useHistory();
  const location = useLocation();

  const [productsSuggestions, setProductSuggestions] = useState([]);

  // Prevent AutoComplete from clearing its values automatically
  const [product, setProduct] = useState({
    nome: '',
    quantidade: 1,
  });

  const [allProducts, setAllProducts] = useState([]);

  const [sale, setSale] = useState({
    paymentMethod: 'unpaid',
    hasDiscount: false,
    products: [],
    client: { name: '' },
    total: new Big('0'),
  });

  const [values, setValues] = useState({
    grossValue: new Big('0.00'),
    paidValue: new Big('0.00'),
    discount: new Big('0.00'),
  });

  const [valueToReceive, setValueToReceive] = useState(new Big(0));

  function getPaymentMethod(situation) {
    switch (situation) {
      case 'PAGO':
        return 'paid';
      case 'NÃO PAGO':
        return 'unpaid';
      case 'PARCIALMENTE PAGO':
        return 'partially';
      default:
        return '';
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      const products = await ProductController.index();
      setAllProducts(products);
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    const newTotal = values.grossValue.minus(values.discount);

    setSale({ ...sale, total: newTotal });
    setValueToReceive(newTotal.sub(values.paidValue));
    // eslint-disable-next-line
  }, [values]);

  useEffect(() => {
    const { state } = location;
    setValues({
      grossValue: new Big(state.grossValue),
      paidValue: new Big(state.paidValue),
      discount: new Big(state.discount),
    });

    state.paymentMethod = getPaymentMethod(state.situation);
    const discount = new Big(state.discount);
    state.hasDiscount = discount.gt(new Big('0.00'));
    setSale({
      /* id: state.id,
      saleId: state.saleId,
      saleDate: state.saleDate,
      paymentMethod: state.paymentMethod,
      client: state.client,
      hasDiscount: state.hasDiscount, */
      ...state,
      products: state.products.map(p => {
        return { ...p, preco: new Big(p.preco) };
      }),
      total: new Big(state.netValue),
    });
    // eslint-disable-next-line
  }, []);

  // Setting Autocomplete suggestions
  function suggestsProducts(event) {
    const suggestionResults = allProducts.filter(productSuggestion =>
      productSuggestion.nome.toLowerCase().startsWith(event.query.toLowerCase())
    );

    const results = suggestionResults.map(product => product.nome);
    setProductSuggestions(results);
  }

  function incrementTotal(preco, quantidade) {
    const newTotal = preco.mul(quantidade).plus(values.grossValue);
    if (sale.paymentMethod === 'paid') {
      setValues({
        ...values,
        paidValue: newTotal.sub(values.discount),
        grossValue: newTotal,
      });
      return;
    }
    setValues({ ...values, grossValue: newTotal });
  }

  function addProductToList(event) {
    // checks if enter was pressed
    if (event.keyCode === 13) {
      for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].nome.includes(event.target.value)) {
          // checking if the user entered an invalid number
          if (product.quantidade.length === 0 || product.quantidade < 1) {
            product.quantidade = 1;
          }
          incrementTotal(allProducts[i].preco, product.quantidade);
          sale.products.push({
            ...allProducts[i],
            quantidade: product.quantidade,
          });
          setProduct({ nome: '', quantidade: 1 });
          return;
        }
      }

      errorMsg(growl, 'Produto não existe');
    }
  }

  function validateSale() {
    if (sale.products.length === 0) {
      errorMsg(growl, 'Venda sem produto adicionado');
      return false;
    }

    if (
      sale.paymentMethod === 'partially' &&
      values.paidValue.eq(new Big('0.00'))
    ) {
      errorMsg(growl, 'Informe o valor pago');
      return false;
    }

    if (sale.total.lt(new Big(0))) {
      errorMsg(growl, 'Desconto maior que o valor dos produtos');
      return false;
    }

    if (valueToReceive.lt(new Big(0))) {
      errorMsg(growl, 'Valor pago é maior que o valor da venda');
      return false;
    }

    return true;
  }

  function editSale() {
    if (validateSale()) {
      SaleController.update({
        ...sale,
        ...values,
        netValue: sale.total,
      }).then(
        () => successMsg(growl, 'Venda Atualizada com sucesso'),
        error => errorMsg(growl, error.toString())
      );
    }
  }

  function handleRemoveQtt() {
    if (product.quantidade > 1) {
      setProduct({ ...product, quantidade: product.quantidade - 1 });
    }
  }

  function handleAddQtt() {
    setProduct({ ...product, quantidade: product.quantidade + 1 });
  }

  function toggleDiscount(event) {
    setSale({ ...sale, hasDiscount: event.checked });
    if (!event.checked) {
      setValues({ ...values, discount: new Big('0') });
      document.getElementById('discount').value = '';
    }
  }

  function changeDiscount(event) {
    if (
      event.target.value.length === 0 ||
      Number.isNaN(Number(event.target.value))
    ) {
      setValues({ ...values, discount: new Big('0') });
    } else {
      setValues({ ...values, discount: new Big(event.target.value) });
    }
  }

  function handleRadioCheck(event) {
    if (event.target.value === 'paid') {
      setValues({
        ...values,
        paidValue: values.grossValue.sub(values.discount),
      });
    } else {
      setValues({
        ...values,
        paidValue: new Big(0),
      });
    }

    setSale({ ...sale, paymentMethod: event.target.value });
  }

  function changePaidValue(event) {
    if (
      event.target.value.length === 0 ||
      Number.isNaN(Number(event.target.value))
    ) {
      setValues({ ...values, paidValue: new Big('0') });
    } else {
      setValues({ ...values, paidValue: new Big(event.target.value) });
    }
  }

  return (
    <>
      <Growl ref={growl} />
      <div className="p-grid">
        <Header className="p-col-12">
          <p>
            <FiArrowLeft size={40} onClick={() => history.push('/sales')} />
            Editar venda
          </p>
          <PrimaryButton onClick={editSale}>Salvar</PrimaryButton>
        </Header>

        <Form className="p-col-12 p-xl-6">
          <div>
            <h4>Produtos</h4>
            <div className="p-grid p-nogutter">
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
                  setProduct({ ...product, quantidade: e.target.value })
                }
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
                <th colSpan="3">Produtos Adicionados</th>
              </tr>
            </thead>
            <tbody>
              {sale.products.map(product => {
                return (
                  <tr key={product.id}>
                    <td>{`${product.quantidade}x`}</td>
                    <td>{product.nome}</td>
                    <td>{`R$${product.preco.toFixed(2)}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div>
            <h4>Cliente</h4>
            {/* TODO: Find out why div is getting so height */}
            <div className="p-grid p-nogutter">
              <InputText
                id="clients"
                value={sale.client.name}
                placeholder="Selecione um cliente"
                disabled
              />
            </div>
          </div>
          <div>
            <h4>Formas de pagamento</h4>
            <div className="p-grid p-align-center p-nogutter">
              <label>
                <RadioButton
                  value="unpaid"
                  name="payment"
                  onChange={handleRadioCheck}
                  checked={sale.paymentMethod === 'unpaid'}
                />
                Não Pago
              </label>
              <label>
                <RadioButton
                  value="paid"
                  name="payment"
                  onChange={handleRadioCheck}
                  checked={sale.paymentMethod === 'paid'}
                />
                Pago
              </label>
              <label>
                <RadioButton
                  value="partially"
                  name="payment"
                  onChange={handleRadioCheck}
                  checked={sale.paymentMethod === 'partially'}
                />
                Parcialmente pago
              </label>
            </div>
            {sale.paymentMethod === 'partially' ? (
              <InputText
                id="paidValue"
                placeholder="Digite o valor pago"
                onChange={changePaidValue}
              />
            ) : null}
          </div>
          <div>
            <label className="p-grid p-nogutter">
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
              value={values.discount.toFixed(2)}
              keyfilter="pnum"
              onChange={changeDiscount}
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
                <td>{`R$${values.grossValue.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td>
                  <p>Desconto:</p>
                </td>
                <td>{`R$${values.discount.toFixed(2)}`}</td>
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
                <td>{`R$${sale.total.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td>
                  <p>Valor Pago:</p>
                </td>
                <td>{`R$${values.paidValue.toFixed(2)}`}</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <hr />
                </td>
              </tr>
              <tr>
                <td>
                  <p>Valor a Receber:</p>
                </td>
                <td>{`R$${valueToReceive.toFixed(2)}`}</td>
              </tr>
            </tbody>
          </table>
        </Values>
      </div>
    </>
  );
}
