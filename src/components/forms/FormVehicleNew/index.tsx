// ./src/components/forms/FormVehicleNew/index.tsx
// eslint-disable-next-line
import React, { useRef, useState, useCallback, useEffect } from 'react';
// eslint-disable-next-line
import { FormHandles } from '@unform/core';
// eslint-disable-next-line
import * as Yup from 'yup';
// eslint-disable-next-line
import {
  SubtitleSecondary,
  Paragraph,
  InputSelect,
  InputText,
  InputMask,
  ButtonMain,
} from '@components/index';

// Importações internas
import { ConfigLabel, ConfigValues } from '@config/index';
import { apiRebox, newContractStorageService } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { toastify } from '@utils/notifiers';

import { schemaVehicle } from './schemaValidation';
import { ISelect, IFormVehicle } from './typing';

import {
  Container,
  FormVehicle,
  Sections,
  SectionsGroup,
  SectionsItem,
} from './styles';

interface IProps {
  forNewSale?: {
    advanceStep(): void;
  };
  userId: string;
}

const FormVehicleNew: React.FC<IProps> = ({ userId, forNewSale }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [classifications, setClassifications] = useState<ISelect[]>([]);
  const [brands, setBrands] = useState<ISelect[]>([]);
  const [models, setModels] = useState<ISelect[]>([]);

  const getClassifications = useCallback(async () => {
    try {
      const { data: responseCarClassifications } = await apiRebox.get(`/cars`);
      setClassifications(responseCarClassifications.data);
    } catch (error) {
      toastify(
        'Ops, não conseguimos buscar as classificações de veículos existentes.',
        'error',
      );
    }
  }, []);

  const getBrands = useCallback(async (value: string) => {
    try {
      const { data: responseCarBrands } = await apiRebox.get(
        `/cars?classification=${value}`,
      );
      setBrands(responseCarBrands.data);
    } catch (error) {
      toastify(
        'Ops, não conseguimos buscar as marcas de veículos existentes.',
        'error',
      );
    }
  }, []);

  const getModels = useCallback(async (value: string) => {
    try {
      const { data: responseCarModels } = await apiRebox.get(
        `/cars?brand=${value}`,
      );
      setModels(responseCarModels.data);
    } catch (error) {
      toastify(
        'Ops, não conseguimos buscar as modelos de veículos existentes.',
        'error',
      );
    }
  }, []);

  const handleRegisterVehicle = async (data: IFormVehicle) => {
    try {
      setLoading(prevState => !prevState);

      formRef.current?.setErrors({});

      await schemaVehicle.validate(data, {
        abortEarly: false,
      });

      const { data: responseVehicleCreated } = await apiRebox.post(
        `/users/vehicles`,
        {
          ...data,
          users_id: userId,
          armored: false,
        },
      );

      const { header, data: vehicleCreated } = responseVehicleCreated;

      toastify(header.message, 'success');

      // Caso o cliente esteja sendo criado no momento da venda
      if (forNewSale) {
        newContractStorageService.updateVehicle({
          id: vehicleCreated.id,
          field_type: 'VEHICLE_LICENSE_PLATE',
          query: data.license_plate,
        });
        forNewSale.advanceStep();
      }
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        const {
          classification,
          brand,
          model,
          license_plate,
          year,
          color,
        } = errors;

        if (classification) toastify(classification, 'error');
        if (brand) toastify(brand, 'error');
        if (model) toastify(model, 'error');
        if (license_plate) toastify(license_plate, 'error');
        if (year) toastify(year, 'error');
        if (color) toastify(color, 'error');
      } else if (error.response) toastify(error.response.data.error, 'error');
    } finally {
      setLoading(prevState => !prevState);
    }
  };

  useEffect(() => {
    getClassifications();
  });

  return (
    <Container>
      <FormVehicle ref={formRef} onSubmit={handleRegisterVehicle}>
        <Sections>
          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Classificação
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define o porte do veículo do cliente
              </Paragraph>
              <InputSelect
                name="classification"
                options={classifications}
                onChange={event => {
                  getBrands(event.target.value);
                }}
                placeholder="Selecione o porte"
                tabIndex={1}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Marca
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Empresa responsável pela fabricação do veículo
              </Paragraph>
              <InputSelect
                name="brand"
                options={brands}
                onChange={event => {
                  getModels(event.target.value);
                }}
                placeholder="Selecione a marca"
                tabIndex={2}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Modelo
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define a linha de fabricação do veículo
              </Paragraph>
              <InputSelect
                name="model"
                options={models}
                placeholder="Selecione o modelo"
                tabIndex={3}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Placa
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Registro identificador do veículo no país
              </Paragraph>
              <InputMask
                name="license_plate"
                mask="aaa-9*99"
                placeholder="Digite a placa"
                style={{ textTransform: 'uppercase' }}
                tabIndex={4}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Cor
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define a cor do veículo do cliente
              </Paragraph>
              <InputSelect
                name="color"
                options={ConfigLabel.rebox.others.vehicle.color}
                placeholder="Selecione a cor"
                tabIndex={5}
              />
            </SectionsItem>

            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Ano
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o ano do modelo ou de fabricação do carro
              </Paragraph>
              <InputText
                name="year"
                type="number"
                placeholder="Digite o ano"
                min={0}
                tabIndex={6}
              />
            </SectionsItem>
          </SectionsGroup>

          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Status
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Define a situação do veículo
              </Paragraph>
              <InputSelect
                name="status"
                options={ConfigLabel.rebox.others.vehicle.status}
                selectedDefault={ConfigValues.rebox.vehicle.status.active}
                placeholder="Selecione a situação"
                tabIndex={7}
              />
            </SectionsItem>
          </SectionsGroup>

          <ButtonMain
            type="submit"
            loading={loading}
            style={{ marginTop: '4vh', maxWidth: 250 }}
            tabIndex={8}
          >
            Cadastrar
          </ButtonMain>
        </Sections>
      </FormVehicle>
    </Container>
  );
};

export default FormVehicleNew;
