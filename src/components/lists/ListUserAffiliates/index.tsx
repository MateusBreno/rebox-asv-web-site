// ./src/components/lists/ListUserAffiliates/index.tsx
import React from 'react';

import { Paragraph, LoadingList } from '@components/index';
import User from '@models/User';
import { formatText } from '@utils/formatters';

import Item from './Item';

import { Container, Table, Labels, Items, NothingFound } from './styles';

interface IProps {
  users: User[] | undefined;
  loading: boolean;
  showTotal: boolean;
  totalValue?: number;
}

const ListUserAffiliates: React.FC<IProps> = ({
  users,
  loading,
  showTotal,
  totalValue,
}) => {
  return (
    <Container>
      <Table>
        <Labels>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Nome
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            CPF/CNPJ
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            E-mail
          </Paragraph>
          <Paragraph nameColor="black" textAlign="start" fontSize={12}>
            Celular
          </Paragraph>
          <Paragraph nameColor="black" fontSize={12}>
            Status
          </Paragraph>
          <Paragraph nameColor="black" fontSize={12}>
            Indicações
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
              {users?.length === 0 ? (
                <NothingFound>
                  <Paragraph nameColor="black" opacity={0.6}>
                    Nenhum afiliado foi encontrado
                  </Paragraph>
                </NothingFound>
              ) : (
                <>
                  {users?.map(user => (
                    <Item key={user.id} user={user} />
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

export default ListUserAffiliates;
