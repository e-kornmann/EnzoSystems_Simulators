import PaymentTerminal from './PaymentTerminal'
import { AppContextProvider } from './utils/settingsReducer'

const PaymentTerminalSimulator = () => {
  return (
    <AppContextProvider>
    <PaymentTerminal/>
    </AppContextProvider>
  )
}

export default PaymentTerminalSimulator