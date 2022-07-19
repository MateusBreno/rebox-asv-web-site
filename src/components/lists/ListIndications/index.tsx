// ./src/components/lists/ListIndications/index.tsx
import React from 'react';

import { Paragraph, LoadingList } from '@components/index';
import Indication from '@models/Indication';
import { formatText } from '@utils/formatters';

import Item from './Item';

import { Container, Table, Labels, Items, NothingFound } from './styles';

interface IProps {
  indications: Indication[] | undefined;
  loading: boolean;
  showTotal: boolean;
  totalValue?: number;
}

const ListIndications: React.FC<IProps> = ({
  indications,
  loading,
  showTotal,
  totalValue,
}) => {
  return (
    <Container>
      <Table>
        <Labels>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Gerada em
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Nome do indicado
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            CPF/CNPJ do indicado
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            CPF/CNPJ do afiliado
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Situação
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Última comissão
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Nº de renovações
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
              {indications?.length === 0 ? (
                <NothingFound>
                  <Paragraph nameColor="black" opacity={0.6}>
                    Nenhuma indicação foi encontrada
                  </Paragraph>
                </NothingFound>
              ) : (
                <>
                  {indications?.map(indication => (
                    <Item key={indication.id} indication={indication} />
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

export default ListIndications;
