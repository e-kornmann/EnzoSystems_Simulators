import { useState } from 'react';
import PaymentDevice from './components/simulators/PaymentDevice';
import OtherDevice from './components/simulators/OtherDevice';
import { useModal } from './useModal';
import { DraggableModal } from './components/shared/DraggableModal';

function App() {
  const { isShown, toggle } = useModal();
  const [simulators, setSimulators] = useState({
    paymentDevice: false,
    otherDevice: false,
  });

  const showSimulatorHandler = (simulator: string) => {
    setSimulators((prevSimulators) => ({
      ...Object.keys(prevSimulators).reduce((acc, key) => {
        return {
          ...acc,
          [key]: key === simulator, // Set the selected simulator to true, others to false
        };
      }, {} as { paymentDevice: boolean; otherDevice: boolean }), // Specify the return type
    }));
    toggle();
  };
  
  return (
    <>
      <button onClick={() => showSimulatorHandler('paymentDevice')}>Open payment modal</button>
      <button onClick={() => showSimulatorHandler('otherDevice')}>Other Device</button>
   
      <DraggableModal
        isShown={isShown}
        hide={toggle}
        headerText={simulators.paymentDevice ? "Payment Device" : "Other Device"}
        modalContent={simulators.paymentDevice ? <PaymentDevice /> : <OtherDevice />}
      />
    </>
  );
}

export default App;


