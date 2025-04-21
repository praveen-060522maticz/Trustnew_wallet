import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import RNModal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import SessionProposalModal from './SessionProposalModal';
import { LoadingModal } from './LoadingModal';
import SessionSignModal from './SessionSignModal';
import SessionSendTransactionModal from './SessionSendTransactionModal';
import SessionSignTypedDataModal from './SessionSignTypedDataModal';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { walletKit } from '../utils/WalletConnectUtills';
import { rejectEIP155Request } from '../utils/EIP155RequestHandlerUtil';
import Toast from 'react-native-toast-message';

export default function Modal() {
  const { modal, modalShow, modalData } = useSelector(state => state.modalreducers);
  const dispatch = useDispatch();
  // handle the modal being closed by click outside
  const onClose = async () => {
    try {
      if (modalShow) {
        const getData = modal === "SessionProposalModal" ? modalData?.proposal : modalData;
        console.log('sgferadasdasds---->', getData);

        const requestEvent = getData?.requestEvent;
        const topic = requestEvent?.topic;

        const response = modal == "SessionProposalModal" ? "" : rejectEIP155Request(requestEvent);
        console.log('response---->', response);
        const getResData = modal === "SessionProposalModal" ?
          {
            id: getData.id,
            reason: getSdkError('USER_REJECTED_METHODS'),
          } :
          {
            topic,
            response,
          }

        const getRejectMethod = modal === "SessionProposalModal" ? "rejectSession" : "respondSessionRequest"
        console.log('getData---->', getData, getRejectMethod, getResData);
        await walletKit[getRejectMethod](getResData);
        dispatch({ type: "closeModal" })
        Toast.show({
          type: 'error',
          text1: "Rejected successfully",
        });
      }
    } catch (e) {
      console.log('Erro on onClose---->', e);
      dispatch({ type: "closeModal" })
    }

  };

  const componentView = useMemo(() => {
    switch (modal) {
      case 'SessionProposalModal':
        return <SessionProposalModal />;
      case 'SessionSignModal':
        return <SessionSignModal />;
      case 'SessionSignTypedDataModal':
        return <SessionSignTypedDataModal />;
      case 'SessionSendTransactionModal':
        return <SessionSendTransactionModal />;
      // case 'SessionAuthenticateModal':
      //   return <SessionAuthenticateModal />;
      case 'LoadingModal':
        return <LoadingModal />;
      default:
        return <View />;
    }
  }, [modal]);

  return (
    <RNModal
      backdropOpacity={0.6}
      hideModalContentWhileAnimating
      useNativeDriver
      statusBarTranslucent
      propagateSwipe
      onBackdropPress={onClose}
      onModalHide={onClose}
      style={styles.modal}
      isVisible={modalShow}
    >
      {componentView}
    </RNModal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
});
