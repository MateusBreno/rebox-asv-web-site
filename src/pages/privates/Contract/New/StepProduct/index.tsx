// ./src/pages/privates/Contract/New/StepProduct/index.tsx
import React, { useCallback, useEffect, useState } from 'react';

import { IoCubeOutline } from 'react-icons/io5';

import {
  ButtonDefault,
  ButtonMain,
  CardSimpleIndicatorSelectable,
  Paragraph,
  SubtitleSecondary,
} from '@components/index';
import { ConfigStyles } from '@config/index';
import Product from '@models/Product';
import { newContractStorageService, apiRebox } from '@services/index';
import { formatText } from '@utils/formatters';
import { toastify } from '@utils/notifiers';

import { Container, Group, Buttons } from './styles';

interface IProps {
  myStep: number;
  currentStep: number;
  changeStep(newStep: number, willChangeHistory?: boolean): void;
}

const StepProduct: React.FC<IProps> = ({ myStep, currentStep, changeStep }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    newContractStorageService.getProduct().id,
  );

  const getProducts = useCallback(async () => {
    try {
      const { data: response } = await apiRebox.get(`/products`);
      setProducts(response.data);
    } catch (error) {
      toastify(
        `Houve um error ao buscar lista de opções de produtos.`,
        'error',
      );
    }
  }, []);

  const handleSaveProduct = useCallback((productId?: string) => {
    const value = productId || '';
    newContractStorageService.updateProduct({
      id: value,
      field_type: 'PRODUCT_ID',
      query: value,
    });
    setSelectedProductId(value);
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      <SubtitleSecondary textAlign="start" nameColor="black">
        Produto
      </SubtitleSecondary>
      <Paragraph
        textAlign="start"
        nameColor="black"
        opacity={0.8}
        fontWeight={500}
      >
        Escolha um de nossos produtos para prosseguir
      </Paragraph>
      <Group>
        {products.map(item => (
          <CardSimpleIndicatorSelectable
            key={item.id}
            icon={{
              element: IoCubeOutline,
              size: 20,
              opacity: 1,
              colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
              colorActive: ConfigStyles.rebox.colors.white.main,
            }}
            label={{
              text: formatText.capitalizedFirstLetter(item.name),
              colorDefault: ConfigStyles.rebox.colors.black.opacity.average,
              colorActive: ConfigStyles.rebox.colors.white.main,
            }}
            onClick={() => handleSaveProduct(item?.id)}
            isSelected={selectedProductId === item?.id}
            positionContent="center"
          />
        ))}
      </Group>
      <Buttons>
        <ButtonMain
          onClick={() => changeStep(currentStep + 1)}
          style={{ marginRight: '10px', maxWidth: 200 }}
          disabled={!selectedProductId}
          isDisable={!selectedProductId}
        >
          Avançar
        </ButtonMain>
        <ButtonDefault
          onClick={() => changeStep(currentStep - 1)}
          style={{ maxWidth: 200 }}
          disabled={currentStep <= 1}
          isDisable={currentStep <= 1}
        >
          Voltar
        </ButtonDefault>
      </Buttons>
    </Container>
  );
};

export default StepProduct;
