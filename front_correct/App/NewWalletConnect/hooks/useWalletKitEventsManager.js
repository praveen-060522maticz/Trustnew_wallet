import { useCallback, useEffect } from 'react';


import { BeatifyConsole, EIP155_SIGNING_METHODS, getSupportedNetChains, isEmpty, TRON_SIGNING_METHODS } from '../utils/common';
import { walletKit } from '../utils/WalletConnectUtills';
import { useDispatch, useSelector } from 'react-redux';
import { getRequestChainType } from '../utils/HelperUtil';

export default function useWalletKitEventsManager(initialized) {
  /******************************************************************************
   * 1. Open session proposal modal for confirmation / rejection
   *****************************************************************************/

  const dispatch = useDispatch();

  const onSessionProposal = useCallback(
    (proposal) => {
      BeatifyConsole("onSessionProposal", proposal)
      if (proposal) {
        // set the verify context so it can be displayed in the projectInfoCard
        console.log('proposal.params.requiredNamespaces---->', proposal.params.requiredNamespaces, proposal.params.optionalNamespaces);
        const getChainType = getRequestChainType(proposal?.params?.requiredNamespaces, proposal?.params?.optionalNamespaces)
        console.log('getChainType---->', getChainType);
        if (getChainType) {
          const chains = getSupportedNetChains(
            proposal.params.requiredNamespaces,
            proposal.params.optionalNamespaces,
            getChainType
          );
          console.log('chainschsefsainschadawdaainsadad---->', chains);

          if (chains.length !== 0) {
            dispatch({
              type: "openModal",
              data: {
                modal: "SessionProposalModal",
                modalData: { proposal }
              }
            })
          } else {
            dispatch({
              type: "openModal",
              data: {
                modal: "LoadingModal",
                modalData: { errorMessage: 'Unsupported chains' }
              }
            })
          }
        }
      }
    },
    [],
  );

  /******************************************************************************
   * 2. Open request handling modal based on method that was used
   *****************************************************************************/

  const onSessionRequest = useCallback(
    async (requestEvent) => {
      console.log('onSessionRequest', requestEvent);
      const { topic, params, verifyContext } = requestEvent;
      const { request } = params;
      const requestSession = walletKit.engine.signClient.session.get(topic);

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          return dispatch({
            type: "openModal",
            data: {
              modal: "SessionSignModal",
              modalData: {
                requestEvent,
                requestSession,
              }
            }
          });

        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
          return dispatch({
            type: "openModal",
            data: {
              modal: "SessionSignTypedDataModal",
              modalData:
              {
                requestEvent,
                requestSession,
              }
            }
          });

        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        case TRON_SIGNING_METHODS.TRON_SIGN_TRANSACTION:
          return dispatch({
            type: "openModal",
            data: {
              modal: "SessionSendTransactionModal",
              modalData:
              {
                requestEvent,
                requestSession,
              }
            }
          });
        default:
          console.log('defaulttt---->',);
      }
    },
    [],
  );



  useEffect(() => {
    if (walletKit) {
      //sign
      walletKit?.on('session_proposal', onSessionProposal);
      walletKit?.on('session_request', onSessionRequest);

      walletKit?.on("proposal_expire", (event) => {
        // proposal expired and any modal displaying it should be removed
        const { id } = event;
        console.log('eventevent---->', event, id);

      });
      walletKit?.on('session_authenticate', (e) => console.log('eeeswrwe---->', e));
      // walletKit.on('session_request', onSessionRequest);
      // auth
      // walletKit.on('session_authenticate', onSessionAuthenticate);

      walletKit?.engine?.signClient?.events?.on('session_ping', data => {
        console.log('session_ping received', data);
        // Toast.show({
        //   type: 'info',
        //   text1: 'Session ping received',
        // });
      });
      walletKit?.on('session_delete', data => {
        console.log('session_delete event received', data);
        dispatch({
          type: "setSession",
          data: Object.values(walletKit.getActiveSessions())
        })
      });
      dispatch({
        type: "setSession",
        data: Object.values(walletKit.getActiveSessions())
      })
    }
  }, [initialized, onSessionProposal, onSessionRequest]);
}