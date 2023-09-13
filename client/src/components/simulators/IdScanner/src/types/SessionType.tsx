import KeyType from './KeyType';

type SessionType = {
  metadata: {
    command: string,
    sessionId: string,
    status: string,
    keyData: KeyType
  }
}

export default SessionType;
