import { useSnapshot } from 'valtio';
import { useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SignClientTypes } from '@walletconnect/types';
import { RequestModal } from './RequestModal';
import { Message } from './components/Message';
import { useDispatch, useSelector } from 'react-redux';
import { getChainData } from '../utils/common';
import { getRequestChainType, getSignParamsMessage } from '../utils/HelperUtil';
import { approveEIP155Request } from '../utils/EIP155RequestHandlerUtil';
import { walletKit } from '../utils/WalletConnectUtills';
import Toast from 'react-native-toast-message';
import { Methods } from './components/Methods';
import { Chains } from './components/Chains';

export default function SessionSignTypedDataModal() {
  // Get request and wallet data from store
  const { modalData: data } = useSelector(state => state.modalreducers)
  console.log('datadatafromsigntypedData---->', data);
  const requestEvent = data?.requestEvent;
  const session = data?.requestSession;
  const isLinkMode = session?.transportType === 'link_mode';
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const dispatch = useDispatch()
  // Get required request data
  const { topic, params } = requestEvent;
  const { request, chainId } = params;
  const chain = getChainData(chainId.split(':')[1]);
  // const chainType = Object.keys(session?.requiredNamespaces || {})[0]
  const getChainType = getRequestChainType(session?.requiredNamespaces, session?.optionalNamespaces);

  const method = request?.method;
  const message = getSignParamsMessage(request?.params);

  const peerMetadata = session?.peer?.metadata;

  // Handle approve action (logic varies based on request method)
  const onApprove = useCallback(async () => {
    if (requestEvent) {
      const address = requestEvent?.params?.request?.params?.address;

      setIsLoadingApprove(true);
      const response = await approveEIP155Request(requestEvent, getChainType);
      try {
        await walletKit.respondSessionRequest({
          topic,
          response,
        });
        // handleRedirect({
        //   peerRedirect: peerMetadata?.redirect,
        //   isLinkMode: isLinkMode,
        // });
        Toast.show({
          type: 'success',
          text1: "Approved successfully",
        });
      } catch (e) {
        return;
      }
      setIsLoadingApprove(false);
      // ModalStore.close();
      dispatch({
        type: "closeModal",
      })

    }
  }, [requestEvent, peerMetadata, topic, isLinkMode]);

  // Handle reject action
  const onReject = useCallback(async () => {
    if (requestEvent) {
      setIsLoadingReject(true);
      const response = rejectEIP155Request(requestEvent);
      try {
        await walletKit.respondSessionRequest({
          topic,
          response,
        });
        Toast.show({
          type: 'error',
          text1: "Rejected successfully",
        });
      } catch (e) {
        console.log((e).message, 'error');
        return;
      }
      setIsLoadingReject(false);
      // ModalStore.close();
      dispatch({
        type: "closeModal",
      })
    }
  }, [requestEvent, topic]);

  // Ensure request and wallet are defined
  if (!requestEvent || !session) {
    return <Text>Missing request data</Text>;
  }

  return (
    <RequestModal
      intention="wants to sign a message"
      metadata={peerMetadata}
      onApprove={onApprove}
      onReject={onReject}
      isLinkMode={isLinkMode}
      approveLoader={isLoadingApprove}
      rejectLoader={isLoadingReject}>
      <View style={styles.container}>
        <Chains chains={[chain]} />
        <Methods methods={[method]} />
        <Message message={JSON.stringify(message, null, 2)} />
      </View>
    </RequestModal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
    paddingHorizontal: 16,
    rowGap: 8,
  },
});
