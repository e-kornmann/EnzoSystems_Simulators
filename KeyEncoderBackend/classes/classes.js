class KeyData {
  constructor (roomAccess = [], additionalAccess = [], startDateTime = '', endDateTime = '') {
    this.roomAccess = roomAccess;
    this.additionalAccess = additionalAccess;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
  }

  // get roomAccess () { return this.roomAccess; }
  // set roomAccess (access) { this.roomAccess = access; }
  addRoomAccess (roomAccess) {
    for (const access of roomAccess) {
      if (typeof access === 'string' && access.length && !this.roomAccess.includes(access)) {
        this.roomAccess.push(access);
      }
    }
  }

  // get additionalAccess () { return this.additionalAccess; }
  // set additionalAccess (access) { this.additionalAccess = access; }
  addAdditinalAccess (additionalAccess) {
    for (const access of additionalAccess) {
      if (typeof access === 'string' && access.length && !this.additionalAccess.includes(access)) {
        this.additionalAccess.push(access);
      }
    }
  }

  // get startDateTime () { return this.startDateTime; }
  // set startDateTime (dateTime) { this.startDateTime = dateTime; }
  // get endDateTime () { return this.endDateTime; }
  // set endDateTime (dateTime) { this.endDateTime = dateTime; }
}

class SessionData {
  // constructor () {};

  constructor (command = '', creationMode = '', status = '', keyId = '', keyData = new KeyData()) {
    this.command = command;
    this.creationMode = creationMode;
    this.status = status;
    this.keyId = keyId;
    this.keyData = keyData;
  }

  // get id () { return this.id; }
  // set id (id) { this.id = id; }
  // get command () { return this.command; }
  // set command (command) { this.command = command; }
  // get creationMode () { return this.creationMode; }
  // set creationMode (creationMode) { this.creationMode = creationMode; }
  // get timeout () { return this.timeout; }
  // set timeout (timeout) { this.timeout = timeout; }
  // get status () { return this.status; }
  // set status (status) { this.status = status; }
  // get keyId () { return this.keyId; }
  // set keyId (keyId) { this.keyId = keyId; }
  // get keyData () { return this.keyData; }
  // set keyData (keyData) { this.keyData = keyData; }
}

module.exports = {
  KeyData,
  SessionData
};
