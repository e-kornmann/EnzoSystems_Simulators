import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AppContextProvider } from './components/simulators/PaymentDevice/utils/settingsReducer.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <AppContextProvider>
        <App />
      </AppContextProvider>
    // </React.StrictMode>,
  )
  