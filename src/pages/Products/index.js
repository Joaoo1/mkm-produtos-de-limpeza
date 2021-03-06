import React, { useState, useEffect, useRef } from 'react';
import Big from 'big.js';
import { Growl } from 'primereact/growl';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import {
  FiMoreVertical,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiPrinter,
} from 'react-icons/fi';

import LoadingIndicator from '../../components/LoadingIndicator';
import ListHeader from '../../components/ListHeader';
import ConfirmModal from '../../components/ConfirmModal';
import ProductController from '../../controllers/ProductController';
import ProductsSoldController from '../../controllers/ProductsSoldController';
import StockHistoryController from '../../controllers/StockHistoryController';
import Product from '../../models/Product';
import { successMsg, errorMsg } from '../../helpers/Growl';
import { savePDF, REPORT_PRODUCTS } from '../../helpers/SavePDF';

// Styled Components
import {
  ProductModal,
  ModalButtonsContainer,
  ReportProductsModal,
} from '../../styles/modal';
import {
  PrimaryButton,
  SecondaryButton,
  FloatingButton,
} from '../../styles/button';
import { CheckboxContainer, StockHistoryModal } from './styles';
import {
  List as ProductList,
  DropdownContent,
  DropdownList,
  DropdownItem,
} from '../../styles/table';

const ptbr = {
  firstDayOfWeek: 1,
  dayNames: [
    'domingo',
    'segunda',
    'terça',
    'quarta',
    'quinta',
    'sexta',
    'sábado',
  ],
  dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ],
  monthNamesShort: [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ],
  today: 'Hoje',
  clear: 'Limpar',
  dateFormat: 'dd/mm/yy',
  weekHeader: 'Sm',
};

export default function Products() {
  const growl = useRef(null);

  ProductModal.setAppElement('#root');
  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState({
    addEditModal: false,
    deleteModal: false,
    stockHistoryModal: false,
    reportProductsModal: false,
  });
  const [stockHistories, setStockHistories] = useState([]);
  const [product, setProduct] = useState({});
  const [productList, setProductList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [reportProductsDateRange, setReportProductsDateRange] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isLoadingModal, setLoadingModal] = useState(false);

  async function fetchProducts() {
    try {
      setLoading(true);
      const products = await ProductController.index();
      setProductList(products);
      setFilteredList(products);
    } catch (err) {
      errorMsg(growl, 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function filterList(value) {
    setFilteredList(
      productList.filter(prod =>
        prod.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  function setPrice() {
    if (product.price === 0 || Number.isNaN(Number(product.price))) {
      setProduct({ ...product, price: new Big('0.00') });
    } else {
      setProduct({ ...product, price: new Big(Number(product.price)) });
    }
  }

  // Modal functions
  function closeModal() {
    setModalOpen({ ...modalOpen, addEditModal: false });
  }

  function openAddModal() {
    setProduct(new Product({}));
    setModalTitle('Cadastrar novo Produto');
    setModalOpen({ ...modalOpen, addEditModal: true });
  }

  function openEditModal(p) {
    setModalTitle('Editar Produto');
    setProduct(p);
    setModalOpen({ ...modalOpen, addEditModal: true });
  }

  function toggleDeleteModal(p, index) {
    setProduct(new Product({}));
    if (p) {
      setProduct({ ...p, index });
      setModalOpen({ ...modalOpen, deleteModal: true });
    } else {
      setModalOpen({ ...modalOpen, deleteModal: false });
    }
  }

  function toggleReportProductsModal() {
    setModalOpen({
      ...modalOpen,
      reportProductsModal: !modalOpen.reportProductsModal,
    });
  }

  async function toggleStockHistoryModal(p) {
    if (p) {
      try {
        setModalOpen({ ...modalOpen, stockHistoryModal: true });
        setLoadingModal(true);
        setProduct(p);
        const stockHist = await StockHistoryController.index(p.id);
        setStockHistories(stockHist);
      } catch (err) {
        setModalOpen({ ...modalOpen, stockHistoryModal: false });
        errorMsg(growl, 'Erro ao carregar histórico');
      } finally {
        setLoadingModal(false);
      }
    } else {
      setModalOpen({ ...modalOpen, stockHistoryModal: false });
    }
  }

  /**
   * CRUD Functions
   */

  // Validating name and price fields and if product already exists
  function validateForm() {
    if (product.newName.length === 0) {
      errorMsg(growl, `Digite um nome para o produto`);
      return false;
    }

    if (Number.isNaN(Number(product.price)) || Number(product.price) <= 0) {
      errorMsg(growl, `Informe um preço válido e maior que zero`);
      return false;
    }

    /**
     * Removes the current product from the list, so if it is an update,
     * do not accuse that the product already exists
     *
     * Case it's a create action, name will always be a empty string,
     * so the filter method will not filter any object.
     * */
    const listWithoutThisProduct = productList.filter(
      value => value.name !== product.name
    );

    const productAlreadyExists = listWithoutThisProduct.find(obj => {
      if (obj.name.toLowerCase() === product.newName.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (productAlreadyExists) {
      errorMsg(growl, `Produto já cadastrado no sistema!`);
      return false;
    }

    return true;
  }

  // Function used to both create and edit
  async function handleSave(isUpdate) {
    if (!validateForm()) {
      return;
    }
    try {
      setLoadingModal(true);
      if (isUpdate) {
        await ProductController.update(product);
        successMsg(growl, `${product.newName} atualizado com sucesso`);
        const newList = [...productList];
        const newFilteredList = [...filteredList];

        const idxFiltered = filteredList.findIndex(
          element => element.id === product.id
        );

        const idx = productList.findIndex(element => element.id === product.id);

        const newProduct = { ...product, name: product.newName };
        newList[idx] = newProduct;
        newFilteredList[idxFiltered] = newProduct;

        setProductList(newList);
        setFilteredList(newFilteredList);
      } else {
        await ProductController.create(product);
        const newList = [...productList];
        newList.push({
          ...product,
          name: product.newName,
          id: 'thisisaworkaround',
        });
        newList.sort((a, b) => a.name.localeCompare(b.name));
        setFilteredList(newList);
        setProductList(newList);
        successMsg(growl, `${product.newName} adicionado com sucesso`);
      }
    } catch (err) {
      errorMsg(growl, 'Ocorreu um erro');
    } finally {
      setLoadingModal(false);
      closeModal();
      setProduct(new Product({}));
    }
  }

  async function handleDelete(p) {
    try {
      setLoading(true);
      await ProductController.delete(p.id);
      const newList = [...productList];
      const newFilteredList = [...filteredList];

      const idxFiltered = filteredList.findIndex(
        element => element.id === p.id
      );

      const idx = productList.findIndex(element => element.id === p.id);

      newList.splice(idx, 1);
      newFilteredList.splice(idxFiltered, 1);
      setProductList(newList);
      setFilteredList(newFilteredList);
      successMsg(growl, `${product.name} excluido com sucesso`);
    } catch (err) {
      errorMsg(growl, `Ocorreu um erro ao excluir produto`);
    } finally {
      setLoading(false);
      setModalOpen({ ...modalOpen, deleteModal: false });
      setProduct(new Product({}));
    }
  }

  async function generateReport() {
    if (!reportProductsDateRange.startDate) {
      errorMsg(growl, 'Informe a data de inicio do relatório');
      return;
    }

    if (!reportProductsDateRange.finalDate) {
      errorMsg(growl, 'Informe a data final do relatório');
      return;
    }

    if (
      reportProductsDateRange.startDate.getTime() >
      reportProductsDateRange.finalDate.getTime()
    ) {
      errorMsg(growl, 'A data final não pode ser antes da data inicial!');
      return;
    }

    savePDF(
      REPORT_PRODUCTS,
      await ProductsSoldController.index(reportProductsDateRange)
    );
  }

  function handleStockHistoryItem(stockHistory) {
    if (stockHistory.stockChange && stockHistory.stockAdded) {
      return (
        <tr id={stockHistory.id}>
          <td>
            <FiChevronUp size={28} color="green" />
          </td>
          <td>Estoque adicionado</td>
          <td>{stockHistory.date}</td>
          <td>{stockHistory.seller}</td>
          <td>+{stockHistory.quantity}</td>
        </tr>
      );
    }
    if (stockHistory.stockChange) {
      return (
        <tr id={stockHistory.id}>
          <td>
            <FiChevronDown size={28} color="red" />
          </td>
          <td>Estoque removido</td>
          <td>{stockHistory.date}</td>
          <td>{stockHistory.seller}</td>
          <td>+{stockHistory.quantity}</td>
        </tr>
      );
    }
    if (!stockHistory.stockChange) {
      return (
        <tr id={stockHistory.id}>
          <td>
            <FiChevronDown size={28} color="red" />
          </td>
          <td>{`Cliente ${stockHistory.client}`}</td>
          {/* <td>{`Venda ${stockHistory.saleId}`}</td> */}
          <td colSpan="2">{stockHistory.date}</td>
          <td>{`-${stockHistory.quantity}`}</td>
        </tr>
      );
    }

    return (
      <tr>
        <td>
          <h2>Ocorreu um erro com este item</h2>
        </td>
      </tr>
    );
  }

  return (
    <>
      {isLoading && <LoadingIndicator />}

      <Growl ref={growl} />

      <FloatingButton>
        <FiPrinter
          size={30}
          color="white"
          onClick={toggleReportProductsModal}
        />
      </FloatingButton>

      <ListHeader
        btnText="Cadastrar Produto"
        btnFunction={openAddModal}
        filterList={filterList}
        placeHolder="Digite aqui o nome do produto"
      />
      <ProductList>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th colSpan="2">Qtd em estoque</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((p, idx) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{`R$${p.price.toFixed(2)}`}</td>

              {p.manageStock ? <td>{p.currentStock}</td> : <td>0</td>}

              <td className="more-icon">
                <DropdownList>
                  <FiMoreVertical size={24} />
                  <DropdownContent>
                    <DropdownItem
                      type="button"
                      onClick={() => openEditModal(p)}
                    >
                      Editar produto
                    </DropdownItem>

                    <DropdownItem
                      type="button"
                      onClick={() => toggleDeleteModal(p, idx)}
                    >
                      Excluir produto
                    </DropdownItem>

                    <DropdownItem
                      type="button"
                      onClick={() => toggleStockHistoryModal(p)}
                    >
                      Visualizar histórico do estoque de {p.name}
                    </DropdownItem>
                  </DropdownContent>
                </DropdownList>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductList>

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={modalOpen.deleteModal}
        title="Excluir produto"
        msg={`Deseja realmente excluir o produto ${product.name}?`}
        handleClose={() => toggleDeleteModal()}
        handleConfirm={() => handleDelete(product)}
      />

      {/* Add/Edit modal */}
      <ProductModal
        isOpen={modalOpen.addEditModal}
        onRequestClose={closeModal}
        closeTimeoutMS={450}
        overlayClassName="modal-overlay"
      >
        {isLoadingModal ? (
          <LoadingIndicator absolute={false} />
        ) : (
          <>
            <h2>{modalTitle}</h2>
            <hr />
            <p>Nome</p>
            <input
              id="product-name"
              value={product.newName}
              onChange={e =>
                setProduct({ ...product, newName: e.target.value })
              }
            />
            <p>Preço</p>
            <input
              type="number"
              value={product.price}
              onChange={e => setProduct({ ...product, price: e.target.value })}
              onBlur={setPrice}
            />
            <CheckboxContainer>
              <Checkbox
                checked={product.manageStock}
                onChange={() =>
                  setProduct({
                    ...product,
                    manageStock: !product.manageStock,
                  })
                }
              />
              Gerenciar estoque
            </CheckboxContainer>
            <p>Estoque</p>
            <input
              type="number"
              value={product.currentStock}
              onChange={e => {
                setProduct({ ...product, currentStock: e.target.value });
              }}
              disabled={!product.manageStock}
            />
            <ModalButtonsContainer>
              <SecondaryButton onClick={() => closeModal()}>
                Fechar
              </SecondaryButton>
              <PrimaryButton onClick={() => handleSave(product.id)}>
                Salvar
              </PrimaryButton>
            </ModalButtonsContainer>
          </>
        )}
      </ProductModal>

      {/* StockHistory modal */}
      <StockHistoryModal
        isOpen={modalOpen.stockHistoryModal}
        onRequestClose={() => toggleStockHistoryModal()}
        closeTimeoutMS={0}
        overlayClassName="modal-overlay"
      >
        {isLoadingModal ? (
          <LoadingIndicator absolute={false} />
        ) : (
          <>
            <div className="header">
              <p>Histórico de estoque de {product.name}</p>
              <FiX
                size={24}
                color="#837B7B"
                onClick={() => toggleStockHistoryModal()}
              />
            </div>
            <hr />
            <table>
              <tbody>
                {stockHistories.map(doc => handleStockHistoryItem(doc))}
              </tbody>
            </table>
          </>
        )}
      </StockHistoryModal>

      {/* Reports of products sold modal */}
      <ReportProductsModal
        isOpen={modalOpen.reportProductsModal}
        onRequestClose={toggleReportProductsModal}
        closeTimeoutMS={450}
        overlayClassName="modal-overlay"
      >
        <h2>Relatório de produtos vendidos</h2>
        <hr />
        <div className="p-grid p-dir-col">
          <p>Informe o período</p>
          <Calendar
            key="initial"
            locale={ptbr}
            appendTo={document.body}
            dateFormat="dd/mm/yy"
            value={reportProductsDateRange.startDate}
            onChange={e =>
              setReportProductsDateRange({
                ...reportProductsDateRange,
                startDate: e.target.value,
              })
            }
            placeholder="Data inicial"
          />
          <Calendar
            key="final"
            locale={ptbr}
            appendTo={document.body}
            dateFormat="dd/mm/yy"
            value={reportProductsDateRange.finalDate}
            onChange={e =>
              setReportProductsDateRange({
                ...reportProductsDateRange,
                finalDate: e.target.value,
              })
            }
            placeholder="Data Final"
          />
        </div>

        <ModalButtonsContainer>
          <SecondaryButton onClick={() => toggleReportProductsModal()}>
            Fechar
          </SecondaryButton>
          <PrimaryButton onClick={() => generateReport()}>
            Gerar relatório
          </PrimaryButton>
        </ModalButtonsContainer>
      </ReportProductsModal>
    </>
  );
}
