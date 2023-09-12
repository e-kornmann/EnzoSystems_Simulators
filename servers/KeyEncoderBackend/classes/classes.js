class KeyData {
  constructor (roomAccess = [], additionalAccess = [], startDateTime = '', endDateTime = '') {
    this.keyId = '';
    this.roomAccess = roomAccess;
    this.additionalAccess = additionalAccess;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
  }

  addRoomAccess (roomAccess) {
    for (const access of roomAccess) {
      if (typeof access === 'string' && access.length && !this.roomAccess.includes(access)) {
        this.roomAccess.push(access);
      }
    }
  }

  addAdditinalAccess (additionalAccess) {
    for (const access of additionalAccess) {
      if (typeof access === 'string' && access.length && !this.additionalAccess.includes(access)) {
        this.additionalAccess.push(access);
      }
    }
  }
}

class SessionData {
  constructor (command = '', status = '', keyData = new KeyData()) {
    this.command = command;
    this.status = status;
    this.keyData = keyData;
  }
}

module.exports = {
  KeyData,
  SessionData
};
