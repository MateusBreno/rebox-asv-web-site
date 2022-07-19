// ./src/components/forms/FormCustomerEdit/index.tsx
import React from 'react';

import { Paragraph } from '@components/index';

// import User from '@models/User';

import {
  Container,
  Table,
  //  Items,
  Labels,
} from './styles';

// interface IProps {
//   customer: User;
// }

const FormCustomerBank: React.FC = () => {
  return (
    <>
      <Container>
        <Table>
          <Labels>
            <Paragraph nameColor="black" textAlign="start" fontSize={12}>
              Banco
            </Paragraph>
            <Paragraph nameColor="black" textAlign="start" fontSize={12}>
              Agência
            </Paragraph>
            <Paragraph nameColor="black" textAlign="start" fontSize={12}>
              Conta-dig
            </Paragraph>
            {/* <Paragraph nameColor="black" textAlign="start" fontSize={12}>
          </Paragraph>
          <Paragraph
            nameColor="black"
            textAlign="start"
            fontSize={12}
          ></Paragraph> */}
          </Labels>
          {/* <Items>

        </Items> */}
        </Table>
      </Container>
    </>
  );
};

export default FormCustomerBank;
