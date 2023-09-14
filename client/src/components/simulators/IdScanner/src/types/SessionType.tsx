import { PassPort } from './PassPortType';

type SessionType = {
  metadata: {
    command: string,
    sessionId: string,
    status: string,
    IdData: PassPort,
  }
};

export default SessionType;
