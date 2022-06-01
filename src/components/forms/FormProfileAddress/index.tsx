// ./src/components/forms/FormProfileAddress/index.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { InputText, InputMask, ButtonMain, Paragraph } from '@components/index';
import { ConfigBase } from '@config/index';
import Address from '@models/Address';
import User from '@models/User';
import {
  sessionStorageService,
  apiViaCep,
  apiRebox,
  addressStorageService,
} from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { formatText } from '@utils/formatters';
import { toastify } from '@utils/notifiers';

// Importações internas
import { schema } from './schemaValidation';
import { IFormAddress } from './typing';

import {
  Container,
  Content,
  FormAddress,
  FieldGroup,
  LinkSearchCep,
} from './styles';

const FormUserAddress: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [user, setUser] = useState<User | null>(
    sessionStorageService.getUser(),
  );
  const [address, setAddress] = useState<Address | null>(
    addressStorageService.get(),
  );
  const [formIsEnabled, setFormIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getAddressByUserId = async () => {
    const { data: responseAddress } = await apiRebox.get(
      `/users/address?users_id=${user?.id}`,
    );
    const [firstAddress] = responseAddress.data;
    formRef.current?.setData({
      zip_code: firstAddress.zip_code,
    });
    setAddress(firstAddress);
    addressStorageService.update(firstAddress);
  };

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

  const handleSubmitAddress = useCallback(async (data: IFormAddress) => {
    try {
      setLoading(prevState => !prevState);

      formRef.current?.setErrors({});

      await schema.validate(data, {
        abortEarly: false,
      });
      const body_adress: Address = {
        users_id: user?.id || '',
        country: 'BR',
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        zip_code: data.zip_code,
        street: data.street,
        number: Number.parseInt(`${data.number}`, 10),
        complement: data.complement,
      };

      const value = addressStorageService.get();

      if (!value) {
        const { data: responseCreateAddress } = await apiRebox.post(
          '/users/address',
          body_adress,
        );
        addressStorageService.update(responseCreateAddress.data);
      } else {
        const { data: responseUpdateAddress } = await apiRebox.put(
          `/users/address/${value.id}`,
          body_adress,
        );
        addressStorageService.update(responseUpdateAddress.data);
      }

      toastify('Seu endereço foi atualizado com sucesso!', 'success');
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        const { zip_code, state, city, neighborhood, street, number } = errors;

        if (zip_code) toastify(zip_code, 'error');
        if (state) toastify(state, 'error');
        if (city) toastify(city, 'error');
        if (neighborhood) toastify(neighborhood, 'error');
        if (street) toastify(street, 'error');
        if (number) toastify(number, 'error');
      } else if (error.response) {
        toastify(error.response.data.error, 'error');
      }
      console.error(
        'Error ao tentar atualizar o endereço do usuário logado,',
        error,
      );
    } finally {
      setLoading(prevState => !prevState);
    }
  }, []);

  useEffect(() => {
    getAddressByUserId();
  }, [user]);

  return (
    <Container>
      <Content>
        <Paragraph nameColor="black" textAlign="start" opacity={0.5}>
          Informe o seu endereço residencial
        </Paragraph>
        <FormAddress
          ref={formRef}
          onSubmit={handleSubmitAddress}
          initialData={{
            zip_code: address?.zip_code || '',
            state: address?.state || '',
            city: address?.city || '',
            neighborhood: address?.neighborhood || '',
            street: address?.street || '',
            number: address?.number || '',
            complement: address?.complement || '',
          }}
        >
          <FieldGroup>
            <InputMask
              name="zip_code"
              placeholder="CEP"
              mask="99999-999"
              required
              autoFocus
              tabIndex={1}
              onChange={event => {
                const cep = event.target.value;
                handleGetAddressByZipcode(formatText.removeAllNonDigits(cep));
              }}
            />
            <LinkSearchCep
              className="link"
              to={{
                pathname: ConfigBase.correio.baseUrls.buscaCepInter,
              }}
              key="config"
              target="_blank"
              tabIndex={2}
            >
              Não sei o cep
            </LinkSearchCep>
          </FieldGroup>

          <FieldGroup>
            <InputText
              name="state"
              placeholder="Estado"
              readOnly={!formIsEnabled}
              required
              tabIndex={3}
            />
            <InputText
              name="city"
              placeholder="Cidade"
              readOnly={!formIsEnabled}
              required
              tabIndex={4}
            />
          </FieldGroup>

          <FieldGroup>
            <InputText
              name="neighborhood"
              placeholder="Bairro"
              readOnly={!formIsEnabled}
              required
              tabIndex={5}
            />
          </FieldGroup>

          <FieldGroup style={{ gridTemplateColumns: '3fr 1fr' }}>
            <InputText
              name="street"
              placeholder="Rua"
              readOnly={!formIsEnabled}
              required
              tabIndex={6}
            />
            <InputText
              name="number"
              placeholder="Número"
              required
              tabIndex={7}
            />
          </FieldGroup>

          <FieldGroup style={{ gridTemplateColumns: '3fr 1fr' }}>
            <InputText
              name="complement"
              placeholder="Complemento"
              tabIndex={8}
            />
          </FieldGroup>

          <ButtonMain tabIndex={9} loading={loading} style={{ maxWidth: 250 }}>
            Salvar
          </ButtonMain>
        </FormAddress>
      </Content>
    </Container>
  );
};

export default FormUserAddress;
