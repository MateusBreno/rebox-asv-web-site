// ./src/components/lists/ListSalesContracts/index.tsx
import React from 'react';

import { Paragraph, LoadingList } from '@components/index';
import Contract from '@models/Contract';
import { formatText } from '@utils/formatters';

import Item from './Item';

import { Container, Table, Labels, Items, NothingFound } from './styles';

interface IProps {
  contracts: Contract[] | undefined;
  loading: boolean;
  showTotal: boolean;
  totalValue?: number;
}

const ListSalesContracts: React.FC<IProps> = ({
  contracts,
  loading,
  showTotal,
  totalValue,
}) => {
  return (
    <Container>
      <Table>
        <Labels>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Data de adesão
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Produto
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Veículo
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Nome do cliente
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            CPF/CNPJ
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Adimplência
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Carência
          </Paragraph>
          <Paragraph
            nameColor="black"
            textAlign="start"
            fontSize={12}
          ></Paragraph>
        </Labels>
        <Items>
          {loading ? (
            <LoadingList loading={loading} />
          ) : (
            <>
              {contracts?.length === 0 ? (
                <NothingFound>
                  <Paragraph nameColor="black" opacity={0.6}>
                    Nenhum contrato foi encontrado
                  </Paragraph>
                </NothingFound>
              ) : (
                <>
                  {contracts?.map(contract => (
                    <Item key={contract.id} contract={contract} />
                  ))}
                </>
              )}
            </>
          )}
        </Items>
        {!loading && showTotal && (
          <Paragraph
            nameColor="black"
            textAlign="end"
            opacity={0.6}
            fontSize={12}
            style={{ margin: '1.5vh 0 0.5vh', fontWeight: 500 }}
          >
            {totalValue === 1
              ? '1 encontrado'
              : `${formatText.numberSeparatedByThousand(
                  totalValue || 0,
                )} encontrados`}
          </Paragraph>
        )}
      </Table>
    </Container>
  );
};

export default ListSalesContracts;
