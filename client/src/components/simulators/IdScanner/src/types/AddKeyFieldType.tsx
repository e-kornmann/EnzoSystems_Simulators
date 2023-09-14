import AddKeyFieldsEnum from '../enums/AddKeyFieldsEnum';
import { PassPort } from './PassPortType';

type AddKeyFieldType = {
  name: string,
  source: keyof PassPort,
  type: AddKeyFieldsEnum,
};

export default AddKeyFieldType;
// [key: string]: { [key in Lang]: string; }[];
