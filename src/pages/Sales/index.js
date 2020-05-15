import React from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import {
  List as SalesList,
  DropdownContent,
  DropdownList,
  DropdownItem,
} from '../../styles/table';

import ListHeader from '../../components/ListHeader';

export default function Sales() {
  const salesList = [
    {
      idVenda: 1324,
      situation: 'NÃO PAGO',
      dataVenda: new Date().toLocaleString('pt-BR'),
      dataPagamento: new Date().toLocaleString('pt-BR'),
      desconto: '0.00',
      valorAReceber: '20.00',
      valorLiquido: '20.00',
      valorBruto: '20.00',
      sellerUid: String,
      seller: String,
      idCliente: String,
      nomeCliente: 'João vitor',
      enderecoCliente: String,
      complementoCliente: String,
      bairroCliente: String,
      cidadeCliente: String,
      telefone: String,
      products: [
        {
          nome: 'Detergente',
          quantidade: 1,
        },
        {
          nome: 'Desifetante',
          quantidade: 2,
        },
      ],
    },
  ];
  return (
    <div>
      <ListHeader
        btnFunction={() => {}}
        btnText="Registrar venda"
        placeHolder="Digite aqui o ID da venda"
        filterEnabled
      />

      <SalesList>
        <thead>
          <tr>
            <th>ID da Venda</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Situação</th>
            <th className="products">Produtos</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {salesList &&
            Array.isArray(salesList) &&
            salesList.map(el => (
              <tr key={el.idVenda}>
                <td>{el.idVenda}</td>
                <td>
                  R$
                  {el.valorLiquido}
                </td>
                <td>{el.dataVenda}</td>
                <td>{el.nomeCliente}</td>
                <td>{el.situation}</td>
                <td className="products">
                  {el.products &&
                    el.products.map(product => (
                      <p key={product.nome}>
                        {`${product.quantidade}x ${product.nome}`}
                      </p>
                    ))}
                </td>
                <td className="more-icon">
                  <DropdownList>
                    <FiMoreVertical size={24} />
                    <DropdownContent>
                      <DropdownItem>Mudar situação para pago</DropdownItem>
                      <DropdownItem
                        onClick={
                          () => {}
                          // handleHistory({
                          //   pathname: '/sales/add',
                          //   data: {
                          //     pageTitle: 'Editar venda',
                          //     sale: el,
                          //   },
                          // })
                        }
                      >
                        Editar venda
                      </DropdownItem>
                      <DropdownItem type="button" onClick={() => {}}>
                        Excluir venda
                      </DropdownItem>
                      {/* <ConfirmModal
                        isOpen={deleteModalOpen}
                        title="Excluir venda"
                        msg={`Deseja realmente excluir a venda de ID ${sale.idVenda}?`}
                        btnClose={() => toggleDeleteModal(null)}
                        btnConfirm={() => handleDelete()}
                      /> */}
                    </DropdownContent>
                  </DropdownList>
                </td>
              </tr>
            ))}
        </tbody>
      </SalesList>
    </div>
  );
}
