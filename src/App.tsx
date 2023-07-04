import { useState } from 'react'
import './App.css'
import PaymentDevice from './components/simulators/PaymentDevice'
import { Button } from './components/shared/buttons'
import { PayState } from './components/simulators/PaymentDevice/types';

function App() {
  const [payState, setPayState] = useState<PayState>({
    idle: true,
    req: false,
    res: {
      terminalId: '',
      transactionId: '',
      amount: '',
    },
    pending: false,
    success: false,
    abort: false,
  });

  return (  
    <>
     <Button 
        onClick={() => setPayState({ ...payState, idle: !payState.idle })}
        style={{position: 'absolute', left: '30px', top: '30px' }}>{ payState.idle ? 'do payment request' : 'set to idle' }</Button>
     <PaymentDevice {...payState}/>
    </>
  )
}

export default App
