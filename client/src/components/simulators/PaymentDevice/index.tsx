import PaymentTerminal from './PaymentTerminal';
import { AppContextProvider } from './utils/settingsReducer';

const PaymentTerminalSimulator = () => (
    <AppContextProvider>
    <PaymentTerminal/>
    </AppContextProvider>
);

export default PaymentTerminalSimulator;
