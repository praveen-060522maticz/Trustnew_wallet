import { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { RequestModal } from './RequestModal';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { EIP155_CHAINS, getRequestedChainList } from '../utils/network';
import { BeatifyConsole, EIP155_SIGNING_METHODS, getRequestedMethods, getSupportedNetChains } from '../utils/common';
import { walletKit } from '../utils/WalletConnectUtills';
import { Chains } from './components/Chains';
import { Methods } from './components/Methods';
import { Events } from './components/Events';
import { getConnectedWalletAddress, getRequestChainType, getWalletAddress } from '../utils/HelperUtil';
import { GetCurrentIndex, UseWalletArray } from '../../Utilities/usestorage';

export default function SessionProposalModal() {
  // Get proposal data and wallet address from store
  const { modalData } = useSelector(state => state.modalreducers)
  const proposal = modalData?.proposal;
  // BeatifyConsole('modalDatamodalData---->', proposal);
  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const dispatch = useDispatch()
  const methods = proposal?.params?.optionalNamespaces?.eip155?.methods;
  const events = proposal?.params?.optionalNamespaces?.eip155?.events;

  const solChains = proposal?.params?.optionalNamespaces?.solana?.chains

  const getChainType = getRequestChainType(proposal?.params?.requiredNamespaces, proposal?.params?.optionalNamespaces);

  const requestMetadata = proposal?.params.proposer.metadata;

  let walletarray = UseWalletArray();
  let currenteindex = GetCurrentIndex();
  let data = walletarray[currenteindex]

  const getWalletAddress = getConnectedWalletAddress(getChainType,data?.[0]?.walletaddress);

  const supportedNamespaces = useMemo(() => {
    // eip155
    const eip155Chains = getChainType == "solana" ? solChains : Object.keys(getRequestedChainList(getChainType)).map(
      chain => `${getChainType}:${chain}`,
    );
    console.log('eip155Chains---->', eip155Chains);
    const eip155Methods = Object.values(getRequestedMethods(getChainType));


    return {
      [getChainType]: {
        chains: eip155Chains,
        methods: eip155Methods,
        events: ['accountsChanged', 'chainChanged'],
        accounts: eip155Chains
          .map(chain => `${chain}:${getWalletAddress}`)
          .flat(),
      },
    };
  }, []);
  console.log('supportedNamespaces---->', supportedNamespaces);
  const supportedChains = useMemo(() => {
    if (!proposal) {
      return [];
    }

    return getSupportedNetChains(
      proposal.params.requiredNamespaces,
      proposal.params.optionalNamespaces,
      getChainType
    );
  }, [proposal]);
  console.log('supportedChains---->', supportedChains);
  // Handle approve action, construct session namespace
  const onApprove = useCallback(async () => {
    console.log('propsfsfsdfosal---->', proposal);
    if (proposal) {
      setIsLoadingApprove(true);
      const namespaces = buildApprovedNamespaces({
        proposal: proposal.params,
        supportedNamespaces,
      });
      console.log('namespaces---->', namespaces);
      try {
        const session = await walletKit.approveSession({
          id: proposal.id,
          namespaces,
        });
        console.log('sessionsession---->', session);
        dispatch({
          type: "setSession",
          data: Object.values(walletKit.getActiveSessions())
        })

        Toast.show({
          type: 'success',
          text1: "Approved successfully",
        });
      } catch (e) {
        console.log((e).message, 'awdawdawdawerror');
        Toast.show({
          type: 'error',
          text1: (e).message,
        });
      }
    }
    setIsLoadingApprove(false);
    // ModalStore.close();
    dispatch({
      type: "closeModal",
    })
  }, [proposal, supportedNamespaces]);

  // Handle reject action
  const onReject = useCallback(async () => {
    if (proposal) {
      try {
        console.log('Resrrserser---->',);
        setIsLoadingReject(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await walletKit.rejectSession({
          id: proposal.id,
          reason: getSdkError('USER_REJECTED_METHODS'),
        });
        console.log('Resrrsegsrgsefseser---->',);
        dispatch({
          type: "closeModal",
        })
        Toast.show({
          type: 'success',
          text1: "Rejected successfully",
        });
      } catch (e) {
        console.log((e).message, 'error');
        return;
      }
    }
    setIsLoadingReject(false);
    // ModalStore.close();
  }, [proposal]);

  return (
    <RequestModal
      intention="wants to connect"
      metadata={requestMetadata}
      onApprove={onApprove}
      onReject={onReject}
      approveLoader={isLoadingApprove}
      rejectLoader={isLoadingReject}
      walletAddress={getWalletAddress}
    >
      <View style={[styles.divider, { backgroundColor: "#fff" }]} />
      <View style={styles.container}>
        <Chains chains={supportedChains} />
        <Methods methods={methods} />
        <Events events={events} />
      </View>
    </RequestModal>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    width: '100%',
    // marginVertical: 16,
  },
  container: {
    paddingHorizontal: 16,
    marginBottom: 8,
    rowGap: 8,
    marginTop: 10
  },
});
