export type KeyData = {
  additionalAccess: string[],
  endDateTime: string,
  roomAccess: string[],
  startDateTime: string
}

export type KeyType = {
  keyId: string,
  data: KeyData  
};



