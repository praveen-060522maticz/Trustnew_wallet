import { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BeatifyConsole, getChainData } from '../utils/common';
import { approveEIP155Request, rejectEIP155Request } from '../utils/EIP155RequestHandlerUtil';
import { walletKit } from '../utils/WalletConnectUtills';
import { RequestModal } from './RequestModal';
import { Message } from './components/Message';
import Toast from 'react-native-toast-message';
import { getConnectedWalletAddress, getOnlyArrayOfWalletAddress, getRequestChainType, getWalletAddressFromParams } from '../utils/HelperUtil';
import { GetCurrentIndex, UseWalletArray } from '../../Utilities/usestorage';
import { Toastfn } from '../../Utilities/toast';

export default function SessionSendTransactionModal() {

  const { modalData: data } = useSelector(state => state.modalreducers)

  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const dispatch = useDispatch()
  // Get request and wallet data from store
  const requestEvent = data?.requestEvent;
  const session = data?.requestSession;
  // BeatifyConsole("data_on_send_tranacetio", data)
  const topic = requestEvent?.topic;
  const params = requestEvent?.params;
  const chainId = params?.chainId;
  // const chainType = Object.keys(session?.requiredNamespaces || {})[0]
  const getChainType = getRequestChainType(session?.requiredNamespaces, session?.optionalNamespaces);
  let walletarray = UseWalletArray();
  let currenteindex = GetCurrentIndex();
  // const getWalletAddress = getConnectedWalletAddress(getChainType, walletData?.[0]?.walletaddress);
  const getWalletaddressArr = getOnlyArrayOfWalletAddress(walletarray);
  const getWalletAddress = getWalletAddressFromParams(getWalletaddressArr, params)
  const chain = getChainData(chainId?.split(':')[1] || '');
  const request = params?.request;
  const transaction = request?.params[0];
  const method = requestEvent?.params?.request?.method;
  const isLinkMode = session?.transportType === 'link_mode';
  console.log('getWalletAddress---->', chain);
  const peerMetadata = session?.peer?.metadata
  // BeatifyConsole("walletarray",walletarray)
  // Handle approve action
  const onApprove = useCallback(async () => {
    if (requestEvent && topic) {

      // const address = requestEvent?.params?.request?.params?.address;
      // const getWalletaddressArr = getOnlyArrayOfWalletAddress(walletarray);
      // const address = getWalletAddressFromParams(getWalletaddressArr,params)
      // console.log("awugduwagd", "aiuwbdiaouwdoiw", address)
      // if (getWalletAddress?.toLowerCase() !== address?.toLowerCase()) return Toastfn(`Please change to this address : ${address} `)

      setIsLoadingApprove(true);
      try {
        const response = await approveEIP155Request(requestEvent, getChainType);
        await walletKit.respondSessionRequest({
          topic,
          response,
        });
        console.log('responseresponseresponseresponse---->', response, topic);
        // handleRedirect({
        //   peerRedirect: peerMetadata?.redirect,
        //   isLinkMode: isLinkMode,
        // });
        Toast.show({
          type: 'success',
          text1: "Approved successfully",
        });
      } catch (e) {
        console.log((e).message, 'error');
        setIsLoadingApprove(false);
        return;
      }
      setIsLoadingApprove(false);
      // ModalStore.close();
      dispatch({
        type: "closeModal",
      })
    }
  }, [requestEvent, peerMetadata, topic, isLinkMode, getWalletAddress]);

  // Handle reject action
  const onReject = useCallback(async () => {
    if (requestEvent && topic) {
      setIsLoadingReject(true);
      const response = rejectEIP155Request(requestEvent);
      console.log('responsesfsefsefse---->', response);
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
        Toast.show({
          type: 'error',
          text1: "Rejectet",
        });
        return;
      }
      setIsLoadingReject(false);
      dispatch({
        type: "closeModal",
      })
    }
  }, [requestEvent, topic]);

  return (
    <RequestModal
      intention="sign a transaction"
      metadata={peerMetadata}
      onApprove={onApprove}
      onReject={onReject}
      isLinkMode={isLinkMode}
      approveLoader={isLoadingApprove}
      rejectLoader={isLoadingReject}
      walletAddress={getWalletAddress}
      chain={chain}
    >
      <View style={styles.container}>
        {/* <Chains chains={[chain]} />
        <Methods methods={[method]} /> */}
        <Message message={JSON.stringify(transaction, null, 2)} />
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
