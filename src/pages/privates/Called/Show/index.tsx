// ./src/pages/privates/Called/Show/index.tsx
import React, { useCallback, useState, useEffect } from 'react';

// import downloadjs from 'downloadjs';
import fs from 'fs';
import {
  FiChevronsLeft,
  FiEdit,
  FiEye,
  FiPlay,
  FiSlash,
  FiDownload,
} from 'react-icons/fi';
import { IoArrowBack, IoReload } from 'react-icons/io5';
import { useHistory, useParams } from 'react-router-dom';

import {
  HeaderNavigationPrivate,
  MenuSideBarPrivate,
  SubtitleSecondary,
  ButtonDefault,
  FormCalledEdit,
  LoadingForm,
  ModalCalledCancele,
  ModalCalledAdvance,
  ModalCalledGoBack,
  LinkMain,
} from '@components/index';
import { ConfigValues, ConfigBase } from '@config/index';
import Called from '@models/Called';
import { apiRebox } from '@services/index';
import { hotToast, toastify } from '@utils/notifiers';

import CalledDetails from './CalledDetails';
import { IUrlParams } from './typing';

import {
  Container,
  ContainerGroup,
  Content,
  Options,
  OptionsGroup,
  ViewMode,
} from './styles';

const CalledShow: React.FC = () => {
  const { goBack } = useHistory();
  const { id: calledId } = useParams<IUrlParams>();

  const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [called, setCalled] = useState<Called>();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [isOpenModalCancel, setIsOpenModalCancel] = useState<boolean>(false);
  const [isOpenModalAdvance, setIsOpenModalAdvance] = useState<boolean>(false);
  const [isOpenModalGoBack, setIsOpenModalGoBack] = useState<boolean>(false);
  const [disabledOptions, setDisabledOptions] = useState<boolean>(false);
  const [disabledGoBack, setDisabledGoBack] = useState<boolean>(false);

  const changeModalCancel = useCallback(() => {
    setIsOpenModalCancel(prevState => !prevState);
  }, []);

  const changeModalAdvance = useCallback(() => {
    setIsOpenModalAdvance(prevState => !prevState);
  }, []);

  const changeModalGoBack = useCallback(() => {
    setIsOpenModalGoBack(prevState => !prevState);
  }, []);

  const changeMode = useCallback(() => {
    setMode(previousMode => (previousMode === 'view' ? 'edit' : 'view'));
  }, []);

  const changeDisableOptions = useCallback(() => {
    const { canceled, deleted, done, open } = ConfigValues.rebox.called.status;
    let state = false;
    if (
      called?.status === canceled ||
      called?.status === deleted ||
      called?.status === done
    ) {
      state = true;
    }
    setDisabledOptions(state);
    setDisabledGoBack(called?.status === open);
  }, [called]);

  const getCalled = useCallback(async () => {
    try {
      setLoading(prevState => !prevState);
      const { data: responseCalled } = await apiRebox.get(
        `/called/${calledId}`,
      );
      setCalled(responseCalled.data);
    } catch (error) {
      toastify(
        'Ops, não conseguimos buscar os dados deste acionamento.',
        'error',
      );
    } finally {
      setLoading(prevState => !prevState);
    }
  }, [calledId]);

  const handleGoBack = () => {
    goBack();
  };

  useEffect(() => {
    getCalled();
  }, [refresh]);

  useEffect(() => {
    changeDisableOptions();
  }, [called]);

  return (
    <Container>
      <HeaderNavigationPrivate />
      <ContainerGroup>
        <MenuSideBarPrivate />
        <Content>
          <SubtitleSecondary textAlign="start">Acionamento</SubtitleSecondary>
          <Options>
            <OptionsGroup>
              <ButtonDefault iconLeft={IoArrowBack} onClick={handleGoBack} />
            </OptionsGroup>
            <OptionsGroup>
              <ButtonDefault
                className="btn-update"
                loading={loading}
                iconLeft={IoReload}
                onClick={() => setRefresh(prevState => !prevState)}
              />
              <ButtonDefault
                iconLeft={FiChevronsLeft}
                onClick={changeModalGoBack}
                disabled={disabledOptions || disabledGoBack}
                isDisable={disabledOptions || disabledGoBack}
              />
              <ButtonDefault
                iconLeft={FiPlay}
                onClick={changeModalAdvance}
                disabled={disabledOptions}
                isDisable={disabledOptions}
              />
              <ButtonDefault
                iconLeft={FiSlash}
                onClick={changeModalCancel}
                disabled={disabledOptions}
                isDisable={disabledOptions}
              />
              <ButtonDefault
                iconLeft={mode === 'view' ? FiEdit : FiEye}
                onClick={changeMode}
              />
              <LinkMain
                route={{
                  pathname: `${ConfigBase.rebox.baseUrls.carAssistance}/called/${calledId}/report/pdf`,
                }}
                target="_blank"
              >
                <ButtonDefault iconLeft={FiDownload} />
              </LinkMain>
            </OptionsGroup>
          </Options>
          {loading || !called ? (
            <LoadingForm />
          ) : (
            <ViewMode>
              {mode === 'view' ? (
                <CalledDetails called={called} />
              ) : (
                <FormCalledEdit
                  called={called}
                  refresh={() => setRefresh(prevState => !prevState)}
                />
              )}
            </ViewMode>
          )}
        </Content>
      </ContainerGroup>
      <ModalCalledCancele
        calledId={calledId}
        isOpen={isOpenModalCancel}
        change={changeModalCancel}
        refresh={() => setRefresh(prevState => !prevState)}
      />
      {!loading && called && (
        <>
          <ModalCalledAdvance
            called={called}
            isOpen={isOpenModalAdvance}
            change={changeModalAdvance}
            refresh={() => setRefresh(prevState => !prevState)}
          />
          <ModalCalledGoBack
            called={called}
            isOpen={isOpenModalGoBack}
            change={changeModalGoBack}
            refresh={() => setRefresh(prevState => !prevState)}
          />
        </>
      )}
    </Container>
  );
};

export default CalledShow;
