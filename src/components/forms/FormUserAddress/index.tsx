// ./src/components/forms/FormUserAddress/index.tsx
import React, { useRef, useState, useCallback } from 'react';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import {
  InputText,
  InputMask,
  ButtonMain,
  Paragraph,
  SubtitleSecondary,
} from '@components/index';
import { ConfigBase } from '@config/index';
import Address from '@models/Address';
import { apiViaCep, apiRebox } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { formatText } from '@utils/formatters';
import { toastify } from '@utils/notifiers';

// Importações internas
import { schema } from './schemaValidation';
import { IFormAddress } from './typing';

import {
  Container,
  FormAddress,
  Sections,
  SectionsGroup,
  SectionsItem,
  LinkSearchCep,
} from './styles';

interface IProps {
  address: Address;
  usersId?: string;
}

const FormUserAddress: React.FC<IProps> = ({
  address: addressData,
  usersId,
}) => {
  const formRef = useRef<FormHandles>(null);

  const [address, setAddress] = useState<Address>(addressData);
  const [formIsEnabled, setFormIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetAddressByZipcode = useCallback(async (cepText: string) => {
    try {
      if (cepText.length !== 8) {
        return;
      }
      const { data: responseViaCep } = await apiViaCep.get(`/${cepText}/json/`);

      if (responseViaCep.logradouro) {
        const currentData = formRef.current?.getData();

        formRef.current?.setData({
          ...currentData,
          state: responseViaCep.uf,
          city: responseViaCep.localidade,
          neighborhood: responseViaCep.bairro,
          street: responseViaCep.logradouro,
        });
      }
    } catch (error) {
      setFormIsEnabled(true);
      toastify(
        'Não foi possível buscar seu endereço pelo cep. Por favor tente novamente.',
        'error',
      );
    }
  }, []);

  const handleSubmitAddress = useCallback(
    async (data: IFormAddress) => {
      try {
        setLoading(prevState => !prevState);

        formRef.current?.setErrors({});

        await schema.validate(data, {
          abortEarly: false,
        });

        const body_adress: Address = {
          users_id:
            address && address.users_id ? address.users_id : usersId || '',
          country: 'BR',
          state: data.state,
          city: data.city,
          neighborhood: data.neighborhood,
          zip_code: data.zip_code,
          street: data.street,
          number: Number.parseInt(`${data.number}`, 10),
          complement: data.complement,
        };

        if (!address || !address.id) {
          const { data: responseCreateAddress } = await apiRebox.post(
            '/users/address',
            body_adress,
          );
          const { header, data: addressUserCreated } = responseCreateAddress;
          setAddress(addressUserCreated);
          toastify(
            header.message || 'Seu endereço foi registrado com sucesso!',
            'success',
          );
        } else {
          const { data: responseUpdateAddress } = await apiRebox.put(
            `/users/address/${address.id}`,
            body_adress,
          );
          const { header, data: addressUserUpdated } = responseUpdateAddress;
          setAddress(addressUserUpdated);
          toastify(
            header.message || 'Seu endereço foi atualizado com sucesso!',
            'success',
          );
        }
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          const {
            zip_code,
            state,
            city,
            neighborhood,
            street,
            number,
          } = errors;

          if (zip_code) toastify(zip_code, 'error');
          if (state) toastify(state, 'error');
          if (city) toastify(city, 'error');
          if (neighborhood) toastify(neighborhood, 'error');
          if (street) toastify(street, 'error');
          if (number) toastify(number, 'error');
        } else if (error.response) {
          toastify(error.response.data.error, 'error');
        }
      } finally {
        setLoading(prevState => !prevState);
      }
    },
    // eslint-disable-next-line
    [address],
  );

  return (
    <Container>
      <FormAddress
        ref={formRef}
        onSubmit={handleSubmitAddress}
        initialData={{
          zip_code: address?.zip_code || '',
          state: address?.state ? address.state.toUpperCase() : '',
          city: address?.city ? address.city.toUpperCase() : '',
          neighborhood: address?.neighborhood
            ? address.neighborhood.toUpperCase()
            : '',
          street: address?.street ? address.street.toUpperCase() : '',
          number: address?.number || '',
          complement: address?.complement
            ? formatText.capitalizedFirstLetter(address.complement)
            : '',
        }}
      >
        <Sections>
          <SectionsGroup>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                CEP
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o código postal que localiza o endereço
              </Paragraph>
              <InputMask
                name="zip_code"
                placeholder="Informe o CEP"
                mask="99999-999"
                tabIndex={1}
                autoFocus
                onChange={event => {
                  const cep = event.target.value;
                  handleGetAddressByZipcode(formatText.removeAllNonDigits(cep));
                }}
              />
              <LinkSearchCep
                to={{
                  pathname: ConfigBase.correio.baseUrls.buscaCepInter,
                }}
                key="config"
                target="_blank"
                tabIndex={2}
              >
                Não sei o cep
              </LinkSearchCep>
            </SectionsItem>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Estado
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe a UF do estado brasileiro
              </Paragraph>
              <InputText
                name="state"
                placeholder="Informe o estado"
                readOnly={!formIsEnabled}
                required
                tabIndex={3}
                onChange={event => {
                  event.target.value = event.target.value.toUpperCase();
                }}
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
                Cidade
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o nome da cidade localizada no estado
              </Paragraph>
              <InputText
                name="city"
                placeholder="Informe a cidade"
                readOnly={!formIsEnabled}
                required
                tabIndex={4}
                onChange={event => {
                  event.target.value = event.target.value.toUpperCase();
                }}
              />
            </SectionsItem>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Bairro
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o nome do bairro localizado na cidade
              </Paragraph>
              <InputText
                name="neighborhood"
                placeholder="Informe o bairro"
                readOnly={!formIsEnabled}
                required
                tabIndex={5}
                onChange={event => {
                  event.target.value = event.target.value.toUpperCase();
                }}
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
                Rua
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o nome completo da rua
              </Paragraph>
              <InputText
                name="street"
                placeholder="Informe a rua"
                readOnly={!formIsEnabled}
                required
                tabIndex={6}
                onChange={event => {
                  event.target.value = event.target.value.toUpperCase();
                }}
              />
            </SectionsItem>
            <SectionsItem>
              <SubtitleSecondary
                textAlign="start"
                nameColor="black"
                fontSize={14}
              >
                Número
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informe o número da casa localizada na rua
              </Paragraph>
              <InputText
                name="number"
                placeholder="Número"
                required
                tabIndex={7}
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
                Complemento
              </SubtitleSecondary>
              <Paragraph
                nameColor="black"
                textAlign="start"
                opacity={0.5}
                fontSize={13}
                style={{ marginBottom: '2vh' }}
              >
                Informações adicionais, como: Ponto de referência, casa 1 etc.
              </Paragraph>
              <InputText
                name="complement"
                placeholder="Complemento"
                tabIndex={8}
                onChange={event => {
                  event.target.value = formatText.capitalizedFirstLetter(
                    event.target.value,
                  );
                }}
              />
            </SectionsItem>
          </SectionsGroup>
        </Sections>

        {/*


        <FieldGroup style={{ gridTemplateColumns: '3fr 1fr' }}>

          <InputText name="number" placeholder="Número" required tabIndex={7} />
        </FieldGroup>

        <FieldGroup style={{ gridTemplateColumns: '3fr 1fr' }}>
          <InputText name="complement" placeholder="Complemento" tabIndex={8} />
        </FieldGroup> */}

        <ButtonMain
          type="submit"
          loading={loading}
          style={{ marginTop: '4vh', maxWidth: 250 }}
          tabIndex={9}
        >
          Salvar
        </ButtonMain>
      </FormAddress>
    </Container>
  );
};

export default FormUserAddress;
