// /* Get Token for Key Encoder "Device" */
// const getToken = useCallback(() => {
//   const config = {
//     url: `${import.meta.env.VITE_BACKEND_BASE_URL}/auth`,
//     headers: {
//       authorization: `Basic ${window.btoa('device:device')}`,
//     },
//     method: 'post',
//     data: {
//       deviceId: 'KeyEncoder',
//     },
//     timeout: import.meta.env.VITE_TIMEOUT,
//   };

//   const getAuthenticationToken = async () => {
//     try {
//       const response = await axios(config);

//       if (!response?.data) {
//         throw Error('Missing response data');
//       }

//       dispatch({ type: ActionType.SET_TOKENS, payload: response.data });
//     } catch (error) {
//       console.error('Error: retrieving authentication token: ', error);
//     }
//   };

//   getAuthenticationToken();
// }, []);

// /* Process Status */
// useEffect(() => {
//   if (state.showSettings) { // in settings menu
//     dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.SETTINGS });
//   } else if (state.showAddKey.showComponent) {
//     dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.ADD_ID });
//   } else if (state.showKeys.showComponent) {
//     dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.VIEW_IDS });
//   } else if (state?.session?.metadata?.command === CommandTypes.READ_ID) { // if we have a session from backend and need to read a key
//     dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.SCANNING });
//   } else if (state?.session?.metadata?.command === CommandTypes.CREATE_ID
//       || state?.session?.metadata?.command === CommandTypes.CREATE_COPY_ID
//       || state?.session?.metadata?.command === CommandTypes.CREATE_JOINNER_ID
//       || state?.session?.metadata?.command === CommandTypes.CREATE_NEW_ID) {
//     dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.CREATE_ID });
//   } else if (state.deviceStatus === DeviceStatuses.CONNECTED) { // waiting for session
//     dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.WAITING });
//   }
// }, [state.deviceStatus, state.session, state.showAddKey, state.showKeys, state.showSettings]);

// /* Get Session */
// const getSession = useCallback(() => {
//   if (state.tokens && state.tokens.accessToken) {
//     const config = {
//       url: `${import.meta.env.VITE_BACKEND_BASE_URL}/active-session`,
//       headers: {
//         authorization: `Bearer ${state.tokens.accessToken}`,
//       },
//       method: 'get',
//     };

//     const getScanSession = async () => {
//       try {
//         const response = await axios(config);

//         if (response?.data && !response.data?.result) {
//           dispatch({ type: ActionType.SET_SESSION, payload: response.data });
//         }

//         dispatch({ type: ActionType.SET_SEND_NEXT_SESSION_REQUEST, payload: true }); // next long poll
//       } catch (error) {
//         if (axios.isCancel(error)) {
//           console.error('ERROR: retrieving scan session: request cancelled');
//         } else {
//           console.error('ERROR: retrieving scan session: ', error);
//         }
//         dispatch({ type: ActionType.SET_SEND_NEXT_SESSION_REQUEST, payload: true });
//       }
//     };

//     getScanSession();
//   } else {
//     console.error('ERROR: retrieving scan session: missing token');
//   }
// }, [state.tokens]);

// /* Repeatedly Get Session Based on Process Status */
// useEffect(() => {
//   if (state.tokens?.accessToken) {
//     // while WAITING, send a new "long" poll for a new session (1st request)
//     if (state.processStatus === ProcessStatuses.WAITING && initialSessionRequest.current) {
//       initialSessionRequest.current = false;
//       getSession();
//       // any subsequent request
//     } else if (state.processStatus === ProcessStatuses.WAITING && state.sendNextSessionRequest && !initialSessionRequest.current) {
//       dispatch({ type: ActionType.SET_SEND_NEXT_SESSION_REQUEST, payload: false });
//       getSession();
//     }
//   }
// }, [state.processStatus, state.tokens, state.sendNextSessionRequest, getSession]);
