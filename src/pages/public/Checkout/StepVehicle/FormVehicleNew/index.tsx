// ./src/components/forms/FormVehicleNew/index.tsx
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

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
import Vehicle from '@models/Vehicle';
import { apiRebox, newContractStorageService } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { hotToast, toastify } from '@utils/notifiers';

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
}

const FormVehicleNew: React.FC<IProps> = ({ forNewSale }) => {
  const formRef = useRef<FormHandles>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<Vehicle>();
  const [brands, setBrands] = useState<ISelect[]>([]);
  const [models, setModels] = useState<ISelect[]>([]);

  const classification = useMemo(() => {
    const { moto_tricycle } = ConfigValues.rebox.product.classification;
    const productStorage = newContractStorageService.getProduct();

    if (productStorage.query === moto_tricycle) {
      return 'MOTO';
    }

    return productStorage.query;
  }, []);

  const getVehicleById = useCallback(async (id: string) => {
    try {
      const { data: responseVehicle } = await apiRebox.get(
        `/users/vehicles/${id}`,
      );
      const vehicleFound: Vehicle = responseVehicle.data;
      setVehicle(vehicleFound);
      getModels(vehicleFound.brand.toUpperCase());
      formRef.current?.setData({ license_plate: vehicleFound.license_plate });
    } catch (error) {
      toastify(
        'Ops! Houve um erro ao tentar buscar os dados do veículo.',
        'error',
      );
    }
  }, []);
  // const getClassifications = useCallback(async () => {
  //   try {
  //     const { data: responseCarClassifications } = await apiRebox.get(`/cars`);
  //     setClassifications(responseCarClassifications.data);
  //   } catch (error) {
  //     toastify(
  //       'Ops, não conseguimos buscar as classificações de veículos existentes.',
  //       'error',
  //     );
  //   }
  // }, []);

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

  const handleRegisterVehicle = useCallback(
    async (data: IFormVehicle) => {
      const idHotToast = hotToast(`Aguarde...`, 'loading');
      try {
        setLoading(prevState => !prevState);

        formRef.current?.setErrors({});

        await schemaVehicle.validate(data, {
          abortEarly: false,
        });

        const vehicleBody = {
          users_id: newContractStorageService.getCustomer().id,
          classification,
          brand: data.brand,
          model: data.model,
          license_plate: data.license_plate,
          year: data.year,
          color: data.color,
          status: ConfigValues.rebox.vehicle.status.active,
          armored: false,
        };

        const vehicleSaved = newContractStorageService.getVehicle();

        let responseVehicle = null;

        if (vehicleSaved.id) {
          responseVehicle = await apiRebox.put(
            `/users/vehicles/${vehicleSaved.id}`,
            vehicleBody,
          );
        } else {
          responseVehicle = await apiRebox.post(`/users/vehicles`, vehicleBody);
        }

        const { header, data: vehicleCreated } = responseVehicle.data;

        // toastify(header.message, 'success');

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

          const { brand, model, license_plate, year, color } = errors;

          if (brand) toastify(brand, 'error');
          if (model) toastify(model, 'error');
          if (license_plate) toastify(license_plate, 'error');
          if (year) toastify(year, 'error');
          if (color) toastify(color, 'error');
        } else if (error.response) toastify(error.response.data.error, 'error');
      } finally {
        setLoading(prevState => !prevState);
        hotToast(idHotToast, 'dismiss');
      }
    },
    [classification],
  );

  useEffect(() => {
    getBrands(classification);
    const vehicleId = newContractStorageService.getVehicle().id;
    if (vehicleId) {
      getVehicleById(vehicleId);
    }
  }, []);

  return (
    <Container>
      <FormVehicle
        ref={formRef}
        onSubmit={handleRegisterVehicle}
        initialData={{
          year: vehicle?.year,
        }}
      >
        <Sections>
          <SectionsGroup>
            {/* <SectionsItem>
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
            </SectionsItem> */}

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
                selectedDefault={
                  vehicle?.brand ? vehicle?.brand.toUpperCase() : ''
                }
                onChange={event => {
                  getModels(event.target.value);
                }}
                placeholder="Selecione a marca"
                tabIndex={2}
              />
            </SectionsItem>

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
                selectedDefault={
                  vehicle?.model ? vehicle?.model.toUpperCase() : ''
                }
                placeholder="Selecione o modelo"
                tabIndex={3}
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
                Defina a cor do seu veículo
              </Paragraph>
              <InputSelect
                name="color"
                options={ConfigLabel.rebox.others.vehicle.color}
                selectedDefault={
                  vehicle?.color ? vehicle?.color.toUpperCase() : ''
                }
                placeholder="Selecione a cor"
                tabIndex={5}
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
                Ano
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o ano do modelo ou de fabricação
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

          {/* <SectionsGroup>
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
          </SectionsGroup> */}

          <ButtonMain
            type="submit"
            loading={loading}
            style={{ marginTop: '4vh', maxWidth: 250 }}
            tabIndex={8}
          >
            {forNewSale ? 'Continuar' : 'Cadastrar'}
          </ButtonMain>
        </Sections>
      </FormVehicle>
    </Container>
  );
};

export default FormVehicleNew;
