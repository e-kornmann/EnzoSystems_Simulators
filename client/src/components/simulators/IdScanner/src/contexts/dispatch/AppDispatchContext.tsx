import { createContext, Dispatch } from 'react';
import AppDispatchActions from '../../types/reducerActions/AppDispatchActions';

const AppDispatchContext = createContext<Dispatch<AppDispatchActions>>(() => null);

export default AppDispatchContext;
