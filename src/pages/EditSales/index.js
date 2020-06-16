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
    client: { nomeCliente: '' },
    total: new Big('0'),
  });

  const [values, setValues] = useState({
    totalProducts: new Big('0.00'),
    totalPaid: new Big('0.00'),
    discount: new Big('0.00'),
  });

  const [totalToReceive, setTotalToReceive] = useState(new Big(0));

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
    const newTotal = values.totalProducts.minus(values.discount);

    setSale({ ...sale, total: newTotal });
    setTotalToReceive(newTotal.sub(values.totalPaid));
    // eslint-disable-next-line
  }, [values]);

  useEffect(() => {
    const stateSale = location.state;
    setValues({
      totalProducts: new Big(stateSale.valorBruto),
      totalPaid: new Big(stateSale.valorPago),
      discount: new Big(stateSale.desconto),
    });

    stateSale.paymentMethod = getPaymentMethod(stateSale.situation);
    const discount = stateSale.desconto
      ? new Big(stateSale.desconto)
      : new Big('0.00');
    stateSale.hasDiscount = discount.gt(new Big('0.00'));
    stateSale.client = {};
    Object.keys(stateSale).forEach(key => {
      if (key === 'idCliente') stateSale.client.idCliente = stateSale[key];
      if (key === 'enderecoCliente')
        stateSale.client.enderecoCliente = stateSale[key];
      if (key === 'complementoCliente')
        stateSale.client.complementoCliente = stateSale[key];
      if (key === 'bairroCliente')
        stateSale.client.bairroCliente = stateSale[key];
      if (key === 'cidadeCliente')
        stateSale.client.cidadeCliente = stateSale[key];
      if (key === 'nomeCliente') stateSale.client.nomeCliente = stateSale[key];
      if (key === 'telefone') stateSale.client.telefone = stateSale[key];
    });
    setSale({
      id: stateSale.id,
      idVenda: stateSale.idVenda,
      dataVenda: stateSale.dataVenda,
      paymentMethod: stateSale.paymentMethod,
      products: stateSale.products.map(p => {
        return { ...p, preco: new Big(p.preco) };
      }),
      client: stateSale.client,
      total: new Big(stateSale.valorLiquido),
      hasDiscount: stateSale.hasDiscount,
    });
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
    const newTotal = preco.mul(quantidade).plus(values.totalProducts);
    if (sale.paymentMethod === 'paid') {
      setValues({
        ...values,
        totalPaid: newTotal.sub(values.discount),
        totalProducts: newTotal,
      });
      return;
    }
    setValues({ ...values, totalProducts: newTotal });
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
      values.totalPaid.eq(new Big('0.00'))
    ) {
      errorMsg(growl, 'Informe o valor pago');
      return false;
    }

    if (sale.total.lt(new Big(0))) {
      errorMsg(growl, 'Desconto maior que o valor dos produtos');
      return false;
    }

    if (totalToReceive.lt(new Big(0))) {
      errorMsg(growl, 'Valor pago é maior que o valor da venda');
      return false;
    }

    return true;
  }

  function editSale() {
    if (validateSale()) {
      SaleController.update({ ...sale, ...values }).then(
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
        totalPaid: values.totalProducts.sub(values.discount),
      });
    } else {
      setValues({
        ...values,
        totalPaid: new Big(0),
      });
    }

    setSale({ ...sale, paymentMethod: event.target.value });
  }

  function changeTotalPaid(event) {
    if (
      event.target.value.length === 0 ||
      Number.isNaN(Number(event.target.value))
    ) {
      setValues({ ...values, totalPaid: new Big('0') });
    } else {
      setValues({ ...values, totalPaid: new Big(event.target.value) });
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
                value={sale.client.nomeCliente}
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
                onChange={changeTotalPaid}
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
                <td>{`R$${values.totalProducts.toFixed(2)}`}</td>
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
                <td>{`R$${values.totalPaid.toFixed(2)}`}</td>
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
                <td>{`R$${totalToReceive.toFixed(2)}`}</td>
              </tr>
            </tbody>
          </table>
        </Values>
      </div>
    </>
  );
}
