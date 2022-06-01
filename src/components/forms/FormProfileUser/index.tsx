// ./src/components/forms/FormProfileUser/index.tsx
import React, { ChangeEvent, useRef, useState, useCallback } from 'react';

import { FormHandles } from '@unform/core';
import { IoCamera } from 'react-icons/io5';
import * as Yup from 'yup';

import { InputText, InputMask, ButtonMain, Paragraph } from '@components/index';
import User from '@models/User';
import { apiRebox, sessionStorageService } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import { formatDate } from '@utils/formatters';
import { toastify } from '@utils/notifiers';

// Importações internas
import { schema } from './schemaValidation';
import { IFormUser } from './typing';

import {
  Container,
  Avatar,
  AvatarProfile,
  AvatarProfileGroup,
  AvatarProfileImage,
  AvatarProfileLabel,
  AvatarProfileAttachment,
  AvatarInputAttachment,
  FormUser,
  FieldGroup,
} from './styles';

const FormProfileUser: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [user, setUser] = useState<User | null>(
    sessionStorageService.getUser(),
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      // Ver a imagem que foi selecionada
      if (e.target.files) {
        const userData = new FormData();

        // O name do campo input, e pegar o valor da imagem selecionada.
        userData.append('attachment_profile', e.target.files[0]);

        try {
          const { data: responseAvatar } = await apiRebox.post(
            `/users/${user?.id}/upload/avatar`,
            userData,
          );

          sessionStorageService.update({
            sessions_id: sessionStorageService.getId() || '',
            token: sessionStorageService.getToken() || '',
            user: responseAvatar.data,
          });

          toastify(responseAvatar.header.message, 'success');
        } catch (error: any) {
          toastify(error.response.data.error, 'error');
        }
      }
    },
    [],
  );

  const handleSumitUser = useCallback(async (data: IFormUser) => {
    try {
      setLoading(prevState => !prevState);

      formRef.current?.setErrors({});

      await schema.validate(data, {
        abortEarly: false,
      });
      const { data: responseUserUpdated } = await apiRebox.put(
        `/users/${user?.id}`,
        {
          name: data.name,
          cpf: data.cpf,
          cnpj: '',
          date_of_birth: data.date_of_birth
            ? formatDate.removeMask(data.date_of_birth)
            : '',
          email: data.email,
          role: user?.role,
          cellphone: data.cellphone,
          is_partner: user?.is_partner,
          status: user?.status,
          company_size: user?.company_size,
          accept_terms_of_use: user?.accept_terms_of_use,
          image_url: user?.image_url,
          access_level: user?.access_level,
        },
      );

      sessionStorageService.update({
        sessions_id: sessionStorageService.getId() || '',
        token: sessionStorageService.getToken() || '',
        user: responseUserUpdated.data,
      });

      toastify('Seus dados foram atualizados com sucesso!', 'success');
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);

        const { name, cpf, date_of_birth, email, cellphone } = errors;

        if (name) toastify(name, 'error');
        if (cpf) toastify(cpf, 'error');
        if (date_of_birth) toastify(date_of_birth, 'error');
        if (email) toastify(email, 'error');
        if (cellphone) toastify(cellphone, 'error');
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

  return (
    <Container>
      <Avatar>
        <AvatarProfile>
          {user?.image_url ? (
            <AvatarProfileGroup>
              <AvatarProfileImage src={user?.image_url} />
              <AvatarProfileLabel htmlFor="avatar">
                <IoCamera size={24} />
                <AvatarInputAttachment
                  type="file"
                  name="attachment_profile"
                  id="avatar"
                  onChange={handleAvatarChange}
                />
              </AvatarProfileLabel>
            </AvatarProfileGroup>
          ) : (
            <AvatarProfileAttachment htmlFor="avatar">
              <IoCamera size={30} opacity={0.3} />
              <Paragraph nameColor="black" fontSize={10} opacity={0.7}>
                Clique aqui para alterar
              </Paragraph>
              <AvatarInputAttachment
                type="file"
                name="attachment_profile"
                id="avatar"
                onChange={handleAvatarChange}
              />
            </AvatarProfileAttachment>
          )}
        </AvatarProfile>
      </Avatar>
      <FormUser
        ref={formRef}
        onSubmit={handleSumitUser}
        initialData={{
          name: user?.name,
          cpf: user?.cpf,
          email: user?.email,
          date_of_birth: formatDate.addMask(user?.date_of_birth || ''),
          cellphone: user?.cellphone,
        }}
      >
        <FieldGroup>
          <InputText
            name="name"
            placeholder="Nome completo"
            required
            tabIndex={1}
          />
          <InputMask
            name="cpf"
            placeholder="CPF"
            mask="999.999.999-99"
            required
            tabIndex={2}
          />
        </FieldGroup>

        <FieldGroup>
          <InputText
            type="email"
            name="email"
            placeholder="E-mail"
            required
            tabIndex={3}
          />
          <InputMask
            name="date_of_birth"
            placeholder="Data de nascimento"
            mask="99/99/9999"
            required
            tabIndex={4}
          />
        </FieldGroup>

        <FieldGroup>
          <InputMask
            name="cellphone"
            placeholder="Celular"
            mask="55 (99) 99999-9999"
            required
            tabIndex={5}
          />
        </FieldGroup>

        <ButtonMain loading={loading} style={{ maxWidth: 250 }}>
          Salvar
        </ButtonMain>
      </FormUser>
    </Container>
  );
};

export default FormProfileUser;
