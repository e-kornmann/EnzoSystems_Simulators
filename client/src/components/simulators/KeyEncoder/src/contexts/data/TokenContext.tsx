import { createContext } from 'react';
import TokenType from '../../types/TokenType';

const TokenContext = createContext<TokenType | null>(null); // nullable, defaults to null, filled when we get a token

export default TokenContext;
