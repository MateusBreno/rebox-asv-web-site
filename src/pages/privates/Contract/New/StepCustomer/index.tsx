// ./src/pages/privates/Contract/New/Step/index.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import {
  SubtitleSecondary,
  Paragraph,
  ButtonMain,
  ButtonDefault,
  InputSelect,
  InputMask,
  InputText,
  FormCustomerNew,
} from '@components/index';
import { ConfigLabel, ConfigTransition, ConfigValues } from '@config/index';
import User from '@models/User';
import { apiRebox, newContractStorageService } from '@services/index';
import { getValidationErrors } from '@utils/errors';
import {
  formatCellphone,
  formatCNPJ,
  formatCPF,
  formatDate,
  formatText,
} from '@utils/formatters';
import { hotToast, toastify } from '@utils/notifiers';

import { schemaFormValidation } from './schemaValidation';
import { IFormValidate } from './typing';

import {
  Container,
  Tabs,
  TabLabels,
  TabLabelsButton,
  TabLabelsDivisor,
  TabItems,
  TabItemsGroup,
  FormValidate,
  Resume,
  SectionsGroup,
  SectionsField,
  DividingLine,
  Buttons,
} from './styles';

interface IProps {
  myStep: number;
  currentStep: number;
  changeStep(newStep: number, willChangeHistory?: boolean): void;
}

const StepCustomer: React.FC<IProps> = ({
  myStep,
  currentStep,
  changeStep,
}) => {
  const formValidationRef = useRef<FormHandles>(null);

  const [customer, setCustomer] = useState<User | null>(null);
  const [tab, setTab] = useState<number>(1);
  const [loadingValidation, setLoadingValidation] = useState<boolean>(false);
  const [fieldTypeChosen, setFieldTypeChosen] = useState<string>(
    newContractStorageService.getCustomer().field_type ||
      ConfigValues.rebox.default.outhers.sales_new.field_type.user_cpf,
  );

  const handleValidateRegistration = useCallback(
    async (data: IFormValidate) => {
      const idHotToast = hotToast('Carregando...', 'loading');
      try {
        setLoadingValidation(prevState => !prevState);
        formValidationRef.current?.setErrors({});

        await schemaFormValidation.validate(data, {
          abortEarly: false,
        });

        const query: string =
          data.field_type !==
          ConfigValues.rebox.default.outhers.sales_new.field_type.user_email
            ? formatText.removeAllNonDigits(data.query)
            : data.query;

        const { data: responseCustomer } = await apiRebox.get(
          `/users?query=${query}`,
        );

        const [firstCustomer] = responseCustomer.data;

        newContractStorageService.updateCustomer({
          id: firstCustomer ? firstCustomer.id : '',
          ...data,
        });

        if (!firstCustomer) {
          toastify(
            `Não encontramos nenhum cliente com este ${
              ConfigTransition.rebox_sales_new_field_type[
                data.field_type.toLowerCase()
              ]
            }.`,
            'info',
          );
          setCustomer(null);
          return;
        }

        setCustomer(firstCustomer);
        // eslint-disable-next-line
      } catch (error: any) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formValidationRef.current?.setErrors(errors);

          const { field_type, query } = errors;

          if (field_type) toastify(field_type, 'error');
          if (query) toastify(query, 'error');
        } else if (error.response) {
          toastify(error.response.data.error, 'error');
        } else {
          toastify(
            'Houve um error ao tentar validar os dados deste cliente.',
            'error',
          );
        }
      } finally {
        hotToast(idHotToast, 'dismiss');
        setLoadingValidation(prevState => !prevState);
      }
    },
    [],
  );

  useEffect(() => {
    if (currentStep === myStep) {
      const customerExist = newContractStorageService.getCustomer();
      if (customerExist.query && tab === 1) {
        handleValidateRegistration({
          ...customerExist,
        });
      }
    }
    // eslint-disable-next-line
  }, [tab, currentStep]);

  useEffect(() => {
    const customerExist = newContractStorageService.getCustomer();
    if (customerExist.field_type !== fieldTypeChosen) {
      formValidationRef.current?.setData({
        query: '',
      });
    }
    setCustomer(null);
  }, [fieldTypeChosen]);

  return (
    <Container>
      <SubtitleSecondary textAlign="start" nameColor="black">
        Cliente
      </SubtitleSecondary>
      <Paragraph
        textAlign="start"
        nameColor="black"
        opacity={0.8}
        fontWeight={500}
      >
        Verifique o(a) cliente ou cadastre-o(a) agora
      </Paragraph>
      <Tabs>
        <TabLabels>
          <TabLabelsButton isActive={tab === 1} onClick={() => setTab(1)}>
            <Paragraph style={{ fontWeight: 500 }}>Validação</Paragraph>
          </TabLabelsButton>

          <TabLabelsDivisor />

          <TabLabelsButton isActive={tab === 2} onClick={() => setTab(2)}>
            <Paragraph style={{ fontWeight: 500 }}>Cadastramento</Paragraph>
          </TabLabelsButton>
        </TabLabels>
        <TabItems>
          {tab === 1 && (
            <TabItemsGroup>
              <FormValidate
                ref={formValidationRef}
                onSubmit={handleValidateRegistration}
                initialData={{
                  field_type: fieldTypeChosen,
                  query: newContractStorageService.getCustomer().query,
                }}
              >
                <SectionsGroup>
                  <SectionsField>
                    <SubtitleSecondary
                      textAlign="start"
                      nameColor="black"
                      fontSize={14}
                    >
                      Tipo de campo
                    </SubtitleSecondary>
                    <Paragraph
                      nameColor="black"
                      textAlign="start"
                      opacity={0.5}
                      fontSize={13}
                      style={{ marginBottom: '2vh' }}
                    >
                      Escolha o tipo de campo que deseja validar
                    </Paragraph>
                    <InputSelect
                      name="field_type"
                      placeholder="Selecione"
                      tabIndex={1}
                      autoFocus
                      options={ConfigLabel.rebox.validation.newSale.fieldType}
                      // selectedDefault={fieldTypeChosen}
                      onChange={event => {
                        setFieldTypeChosen(event.target.value);
                      }}
                    />
                  </SectionsField>
                  <SectionsField>
                    <SubtitleSecondary
                      textAlign="start"
                      nameColor="black"
                      fontSize={14}
                    >
                      {
                        ConfigTransition.rebox_sales_new_field_type[
                          fieldTypeChosen.toLowerCase()
                        ]
                      }
                    </SubtitleSecondary>
                    <Paragraph
                      nameColor="black"
                      textAlign="start"
                      opacity={0.5}
                      fontSize={13}
                      style={{ marginBottom: '2vh' }}
                    >
                      Digite a informação escolhida no campo anterior
                    </Paragraph>
                    {fieldTypeChosen !==
                    ConfigValues.rebox.default.outhers.sales_new.field_type
                      .user_email ? (
                      <InputMask
                        name="query"
                        placeholder={`Informe o ${
                          ConfigTransition.rebox_sales_new_field_type[
                            fieldTypeChosen.toLowerCase()
                          ]
                        }`}
                        mask={
                          fieldTypeChosen ===
                          ConfigValues.rebox.default.outhers.sales_new
                            .field_type.user_cpf
                            ? '999.999.999-99'
                            : '99.999.999/9999-99'
                        }
                        tabIndex={2}
                        autoFocus
                      />
                    ) : (
                      <InputText
                        name="query"
                        placeholder="Informe o e-mail"
                        tabIndex={2}
                        autoFocus
                      />
                    )}
                  </SectionsField>
                </SectionsGroup>

                <SectionsGroup>
                  <SectionsField>
                    <ButtonDefault
                      type="submit"
                      style={{ width: 200 }}
                      loading={loadingValidation}
                      tabIndex={3}
                    >
                      Validar
                    </ButtonDefault>
                  </SectionsField>
                </SectionsGroup>
                {customer && (
                  <>
                    <DividingLine />
                    <Resume>
                      <Paragraph
                        nameColor="black"
                        textAlign="start"
                        fontSize={16}
                        fontWeight={500}
                      >
                        {customer?.name.toUpperCase()}
                      </Paragraph>
                      <Paragraph
                        nameColor="black"
                        textAlign="start"
                        fontWeight={400}
                        opacity={0.7}
                      >
                        {customer?.cpf
                          ? `CPF: ${formatCPF.addMask(customer.cpf)}`
                          : customer?.cnpj
                          ? `CNPJ: ${formatCNPJ.addMask(customer?.cnpj)}`
                          : ''}
                      </Paragraph>
                      <Paragraph
                        nameColor="black"
                        textAlign="start"
                        fontWeight={400}
                        opacity={0.7}
                      >
                        {`E-mail: ${customer?.email}`}
                      </Paragraph>
                      <Paragraph
                        nameColor="black"
                        textAlign="start"
                        fontWeight={400}
                        opacity={0.7}
                      >
                        {customer?.cellphone
                          ? `Celular: ${formatCellphone.addMask(
                              customer?.cellphone,
                            )}`
                          : ''}
                      </Paragraph>
                      <Paragraph
                        nameColor="black"
                        textAlign="start"
                        fontWeight={400}
                        opacity={0.7}
                      >
                        {customer?.date_of_birth
                          ? `Nascimento: ${formatDate.addMask(
                              customer?.date_of_birth,
                            )}`
                          : ''}
                      </Paragraph>
                    </Resume>
                  </>
                )}
              </FormValidate>
            </TabItemsGroup>
          )}
          {tab === 2 && (
            <TabItemsGroup>
              <FormCustomerNew
                forNewSale={{
                  advanceStep: () => {
                    changeStep(currentStep + 1);
                    setTab(1);
                  },
                }}
              />
            </TabItemsGroup>
          )}
        </TabItems>
      </Tabs>
      <Buttons>
        {tab === 1 && (
          <ButtonMain
            onClick={() => changeStep(currentStep + 1)}
            style={{ marginRight: '10px', maxWidth: 200 }}
            disabled={!customer}
            isDisable={!customer}
          >
            Avançar
          </ButtonMain>
        )}
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

export default StepCustomer;
