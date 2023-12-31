import AddKeyFieldsEnum from '../enums/AddKeyFieldsEnum';
import { KeyType, KeyData }from './KeyType';



type AddKeyFieldType = {
  name: string,
  source: keyof KeyData | keyof KeyType,
  type: AddKeyFieldsEnum,
};


export default AddKeyFieldType;
// [key: string]: { [key in Lang]: string; }[];
