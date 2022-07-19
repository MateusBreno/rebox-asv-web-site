// ./src/components/modals/ModalChargeRestore/index.tsx
import React, { useCallback, useState } from 'react';

import { IoClose } from 'react-icons/io5';

import {
  SubtitleSecondary,
  Paragraph,
  ButtonMain,
  ButtonDefault,
} from '@components/index';
import { apiRebox } from '@services/index';
import { toastify } from '@utils/notifiers';

import { Container, ModalCancel, Buttons } from './styles';

interface IProps {
  charge_id: string;
  isOpen: boolean;
  change(): void;
}

const ModalChargeRestore: React.FC<IProps> = ({
  charge_id,
  isOpen,
  change,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleRestoreCharge = useCallback(async () => {
    try {
      setLoading(prevState => !prevState);
      const {
        data: { header },
      } = await apiRebox.post(`/payments/${charge_id}/restore`);
      change();
      toastify(header.message, 'success');
    } catch (error: any) {
      toastify(
        error.response.data.error ||
          'Sinto muito, houve um problema ao tentar restaurar a cobrança.',
        'error',
      );
    } finally {
      setLoading(prevState => !prevState);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <ModalCancel
        isOpen={isOpen}
        onRequestClose={change}
        contentLabel="Password"
      >
        <SubtitleSecondary>Tem certeza que deseja restaurar?</SubtitleSecondary>
        <Paragraph nameColor="black" opacity={0.5} style={{ marginTop: '2vh' }}>
          Esta cobrança poderá ser paga pelo cliente.
        </Paragraph>
        <ButtonDefault
          iconLeft={IoClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            maxWidth: 50,
            padding: 0,
          }}
          onClick={change}
        />
        <Buttons>
          <ButtonMain
            loading={loading}
            onClick={handleRestoreCharge}
            style={{ marginRight: '1vw' }}
          >
            Sim, restaurar
          </ButtonMain>
          <ButtonDefault onClick={change}>Não, voltar</ButtonDefault>
        </Buttons>
      </ModalCancel>
    </Container>
  );
};

export default ModalChargeRestore;
