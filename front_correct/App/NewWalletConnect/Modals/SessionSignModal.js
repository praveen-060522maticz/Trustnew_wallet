import { useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { BeatifyConsole, getChainData } from '../utils/common';
import { getConnectedWalletAddress, getRequestChainType, getSignParamsMessage } from '../utils/HelperUtil';
import { useDispatch, useSelector } from 'react-redux';
import { walletKit } from '../utils/WalletConnectUtills';
import { approveEIP155Request, rejectEIP155Request } from '../utils/EIP155RequestHandlerUtil';
import { RequestModal } from './RequestModal';
import Toast from 'react-native-toast-message';
import { Chains } from './components/Chains';
import { Methods } from './components/Methods';
import { Message } from './components/Message';
import { GetCurrentIndex, UseWalletArray } from '../../Utilities/usestorage';

export default function SessionSignModal() {
  // Get request and wallet data from store
  const { modalData: data } = useSelector(state => state.modalreducers)
  const dispatch = useDispatch()
  const requestEvent = data?.requestEvent;
  const session = data?.requestSession;
  const isLinkMode = session?.transportType === 'link_mode';

  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
console.log('datadata---->',data);
  // Get required request data
  const { topic, params } = requestEvent;
  const { request, chainId } = params;
  const chain = getChainData(chainId.split(':')[1]);
  const peerMetadata = session?.peer?.metadata;
  const method = requestEvent?.params?.request?.method;
  // const chainType = Object.keys(session?.requiredNamespaces || {})[0]
  // Get message, convert it to UTF8 string if it is valid hex
  const message = getSignParamsMessage(request.params);
  const getChainType = getRequestChainType(session?.requiredNamespaces, session?.optionalNamespaces);
  let walletarray = UseWalletArray();
  let currenteindex = GetCurrentIndex();
  let walletData = walletarray[currenteindex]
  const getWalletAddress = getConnectedWalletAddress(getChainType,walletData?.[0]?.walletaddress);
  console.log('getWalletAddress---->', getWalletAddress);
  // Handle approve action (logic varies based on request method)
  const onApprove = useCallback(async () => {
    // const address = requestEvent?.params
    // BeatifyConsole('requestEvent---->', requestEvent,getWalletAddress?.toLowerCase() , address);
    // if (getWalletAddress?.toLowerCase() !== address?.toLowerCase()) return Toast.show({
    //   type: 'error',
    //   text1: `Please change to this address : ${address} `,
    // });
    if (requestEvent) {
      console.log('innnnnn---->',);
      setIsLoadingApprove(true);
      const response = await approveEIP155Request(requestEvent, getChainType);
      console.log('responseasas---->', response);
      try {
        await walletKit.respondSessionRequest({
          topic,
          response,
        });

        dispatch({
          type: "closeModal",
        })

        // handleRedirect({
        //   peerRedirect: peerMetadata?.redirect,
        //   isLinkMode: isLinkMode,
        // });
        Toast.show({
          type: 'success',
          text1: "Approved successfully",
        });
      } catch (e) {
        console.log(e, 'error');
        return;
      }
      setIsLoadingApprove(false);
      // ModalStore.close();
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
        dispatch({
          type: "closeModal",
        })
        Toast.show({
          type: 'error',
          text1: "Rejected successfully",
        });
      } catch (e) {
        setIsLoadingReject(false);
        console.log((e).message, 'error');
        return;
      }
      setIsLoadingReject(false);
      // ModalStore.close();
    }
  }, [requestEvent, topic]);

  // Ensure request and wallet are defined
  if (!requestEvent || !session) {
    return <Text>Missing request data</Text>;
  }

  return (
    <RequestModal
      intention="wants to request a signature"
      metadata={peerMetadata}
      onApprove={onApprove}
      onReject={onReject}
      isLinkMode={isLinkMode}
      approveLoader={isLoadingApprove}
      rejectLoader={isLoadingReject}
      walletAddress={getWalletAddress}
    >
      <View style={styles.container}>
        <Chains chains={[chain]} />
        <Methods methods={[method]} />
        <Message message={message} />
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
