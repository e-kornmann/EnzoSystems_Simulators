class IDData {
  constructor(issuerCode = '', dateOfBirth = '', dateOfExpiry = '', documentNumber = '', documentType = '', namePrimary = '', nameSecondary = '', nationality = '', sex = '', images = {}) {
    this.dateOfBirth = dateOfBirth;
    this.dateOfExpiry = dateOfExpiry;
    this.documentNumber = documentNumber;
    this.documentType = documentType;
    this.issuerCode = issuerCode;
    this.namePrimary = namePrimary;
    this.nameSecondary = nameSecondary;
    this.nationality = nationality;
    this.sex = sex;
    this.images = images;
  }
}

class SessionData {
  constructor(command = '', status = '', idData = new IDData()) {
    this.command = command;
    this.status = status;
    this.idData = idData;
  }
}

module.exports = {
  IDData,
  SessionData
};
