import React, { useState, useEffect, useRef } from 'react';
import { Growl } from 'primereact/growl';
import { Checkbox } from 'primereact/checkbox';
import {
  FiMoreVertical,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

// Styled Components
import { ProductModal, ModalButtonsContainer } from '../../styles/modal';
import { PrimaryButton, SecondaryButton } from '../../styles/button';
import { CheckboxContainer, StockHistoryModal } from './styles';
import {
  List as ProductList,
  DropdownContent,
  DropdownList,
  DropdownItem,
} from '../../styles/table';

// Components import
import ListHeader from '../../components/ListHeader';
import ConfirmModal from '../../components/ConfirmModal';

// Database Controller imports
import ProductController from '../../controllers/ProductController';
import StockHistoryController from '../../controllers/StockHistoryController';

export default function Products() {
  const growl = useRef(null);

  ProductModal.setAppElement('#root');
  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState({
    addEditModal: false,
    deleteModal: false,
    stockHistoryModal: false,
  });
  const [stockHistories, setStockHistories] = useState([]);
  const [product, setProduct] = useState({});
  const [productList, setProductList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  async function fetchProducts() {
    const products = await ProductController.index();
    setProductList(products);
    setFilteredList(products);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function cleanUpProductObject() {
    setProduct({
      name: '',
      newName: '',
      price: '',
      manageStock: false,
      currentStock: 0,
    });
  }

  function filterList(event) {
    setFilteredList(
      productList.filter(prod =>
        prod.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  }

  // Modal functions
  function closeModal() {
    setModalOpen({ ...modalOpen, addEditModal: false });
  }

  function openAddModal() {
    cleanUpProductObject();
    setModalTitle('Cadastrar novo Produto');
    setModalOpen({ ...modalOpen, addEditModal: true });
  }

  function openEditModal(p) {
    setModalTitle('Editar Produto');
    setProduct(p);
    setModalOpen({ ...modalOpen, addEditModal: true });
  }

  function toggleDeleteModal(p, index) {
    cleanUpProductObject();
    if (p) {
      setProduct({ ...p, index });
      setModalOpen({ ...modalOpen, deleteModal: true });
    } else {
      setModalOpen({ ...modalOpen, deleteModal: false });
    }
  }

  async function toggleStockHistoryModal(p) {
    if (p) {
      setProduct(p);
      const stockHist = await StockHistoryController.index(p.id);
      setStockHistories(stockHist);
      setModalOpen({ ...modalOpen, stockHistoryModal: true });
    } else {
      setModalOpen({ ...modalOpen, stockHistoryModal: false });
    }
  }

  /**
   * CRUD Functions
   */

  // Validating name and price fields and if product already exists
  function validateForm() {
    if (product.newName.length === 0 || Number(product.price) === 0) {
      growl.current.show({
        severity: 'error',
        summary: `Preencha os campos corretamente!`,
      });

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
      growl.current.show({
        severity: 'error',
        summary: `Produto já cadastrado no sistema!`,
      });

      return false;
    }

    return true;
  }

  // Function used to both create and edit
  function handleSave(isUpdate) {
    if (!validateForm()) {
      return;
    }

    if (isUpdate) {
      ProductController.update(product).then(
        () => {
          fetchProducts();
          growl.current.show({
            severity: 'success',
            summary: `${product.newName} atualizado com sucesso`,
          });
        },
        () =>
          growl.current.show({
            severity: 'error',
            summary: `Ocorreu um erro ao atualizar produto`,
          })
      );
      closeModal();
      cleanUpProductObject();
    } else {
      ProductController.create(product).then(
        () => {
          fetchProducts();
          growl.current.show({
            severity: 'success',
            summary: `${product.newName} adicionado com sucesso`,
          });
        },
        () =>
          growl.current.show({
            severity: 'error',
            summary: `Ocorreu um erro ao adicionar produto`,
          })
      );
      closeModal();
      cleanUpProductObject();
    }
  }

  function handleDelete(p) {
    ProductController.delete(p.id).then(
      () => {
        fetchProducts();
        growl.current.show({
          severity: 'success',
          summary: `${product.name} excluido com sucesso`,
        });
      },
      () =>
        growl.current.show({
          severity: 'error',
          summary: `Ocorreu um erro ao excluir produto`,
        })
    );
    setModalOpen({ ...modalOpen, deleteModal: false });
    cleanUpProductObject();
  }

  function handleStockHistoryItem(stockHistory) {
    if (stockHistory.stockChange && stockHistory.stockAdded) {
      return (
        <tr id={stockHistory.id}>
          <td>
            <FiChevronUp size={28} color="green" />
          </td>
          <td>Estoque adicionado</td>
          <td>{stockHistory.date.toDate().toLocaleString()}</td>
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
          <td>{stockHistory.date.toDate().toLocaleString()}</td>
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
          <td>{`Venda ${stockHistory.saleId}`}</td>
          <td>{stockHistory.date.toDate().toLocaleString()}</td>
          <td>{`Cliente ${stockHistory.client}`}</td>
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
    <div>
      <Growl ref={growl} />

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
              <td>{`R$${p.price}`}</td>

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
        <h2>{modalTitle}</h2>
        <hr />
        <p>Nome</p>
        <input
          id="product-name"
          value={product.newName}
          onChange={e => setProduct({ ...product, newName: e.target.value })}
        />
        <p>Preço</p>
        <input
          type="number"
          value={product.price}
          onChange={e => setProduct({ ...product, price: e.target.value })}
        />

        <CheckboxContainer>
          <Checkbox
            checked={product.manageStock}
            onChange={() =>
              setProduct({
                ...product,
                manageStock: !product.manageStock,
              })}
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
          <SecondaryButton onClick={() => closeModal()}>Fechar</SecondaryButton>

          <PrimaryButton onClick={() => handleSave(product.id)}>
            Salvar
          </PrimaryButton>
        </ModalButtonsContainer>
      </ProductModal>

      {/* StockHistory modal */}
      <StockHistoryModal
        isOpen={modalOpen.stockHistoryModal}
        onRequestClose={() => toggleStockHistoryModal()}
        closeTimeoutMS={0}
        overlayClassName="modal-overlay"
      >
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
      </StockHistoryModal>
    </div>
  );
}
