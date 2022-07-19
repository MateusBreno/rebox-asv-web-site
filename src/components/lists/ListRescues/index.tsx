// ./src/components/lists/ListRescues/index.tsx
import React from 'react';

import { Paragraph, LoadingList } from '@components/index';
import Rescue from '@models/Rescue';
import { formatText } from '@utils/formatters';

import Item from './Item';

import { Container, Table, Labels, Items, NothingFound } from './styles';

interface IProps {
  rescues: Rescue[] | undefined;
  loading: boolean;
  showTotal: boolean;
  totalValue?: number;
}

const ListRescues: React.FC<IProps> = ({
  rescues,
  loading,
  showTotal,
  totalValue,
}) => {
  return (
    <Container>
      <Table>
        <Labels>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Solicitado em
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Código
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Nome do afiliado
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            CPF/CNPJ
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Valor
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Status
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Pago em
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
              {rescues?.length === 0 ? (
                <NothingFound>
                  <Paragraph nameColor="black" opacity={0.6}>
                    Nenhum resgate foi encontrado
                  </Paragraph>
                </NothingFound>
              ) : (
                <>
                  {rescues?.map(rescue => (
                    <Item key={rescue.id} rescue={rescue} />
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

export default ListRescues;
