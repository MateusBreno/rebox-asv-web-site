import React, { useCallback, useEffect, useState } from 'react';

import { IconLink, IconPdf, IconPix } from '@assets/icons';
import Payment from '@models/Payment';
import { apiRebox } from '@services/index';
import { formatDate, formatMoney } from '@utils/formatters';

import { status } from './constants';

import {
  Container,
  NoInfo,
  Item,
  ItemDueDate,
  ItemStatus,
  ItemAmount,
  ItemButtons,
  ItemButtonsLink,
} from './styles';

interface IParams {
  payment: Payment;
}

const PaymentItems: React.FC<IParams> = ({ payment }) => {
  const [invoiceLink, setInvoiceLink] = useState<string>('');
  const [bankSlipFile, setBankSlipFile] = useState<string>('');

  const handleLinkPayment = useCallback(async () => {
    try {
      const {
        data: {
          data: { invoiceUrl, bankSlipUrl },
        },
      } = await apiRebox.get(`/asaas/payment/${payment.gateway_id}`);
      setInvoiceLink(invoiceUrl);
      setBankSlipFile(bankSlipUrl);
    } catch (error) {}
  }, []);

  useEffect(() => {
    handleLinkPayment();
  }, []);

  return (
    <Container>
      <Item key={payment.id}>
        <ItemDueDate>
          <p>{formatDate.addMask(payment.due_date)}</p>
        </ItemDueDate>
        <ItemStatus isPending={payment.status === 'PENDING'}>
          <p>{status[payment.status.toLowerCase()]}</p>
        </ItemStatus>
        <ItemAmount>
          <p>{formatMoney.fromNumberToPrice(payment.amount)}</p>
        </ItemAmount>
        <ItemButtons>
          <ItemButtonsLink
            to={{
              pathname: invoiceLink,
            }}
            target="_blank"
          >
            <IconPix />
            <p>Pix</p>
          </ItemButtonsLink>
          <ItemButtonsLink to={{ pathname: bankSlipFile }} target="_blank">
            <IconPdf />
            <p>PDF</p>
          </ItemButtonsLink>
        </ItemButtons>
      </Item>
    </Container>
  );
};

export default PaymentItems;
