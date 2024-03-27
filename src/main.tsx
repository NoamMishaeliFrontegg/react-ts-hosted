import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './index.css';
import { FronteggProvider } from '@frontegg/react';



//QueryParams implementation
// const tenantResolver = () => {
//   const urlQueryParams = new URLSearchParams(window.location.search);
//   const organization = urlQueryParams.get('organization');
//   return {
//     tenant: organization
//   }
// }

//Sub domain implementation
const tenantResolver = () => {
  const organization = window.location.host.replace('.ngrok-free.app', '')
  return {
    tenant: organization
  }
}

const contextOptions = {
  baseUrl: 'https://app-5kbz9q5ujm4z.frontegg.com',
  clientId: '764e295e-7139-4a54-b871-b937eb8927d5',
  // tenantResolver,
};

const authOptions = {
  keepSessionAlive: true // Uncomment this in order to maintain the session alive
 };

ReactDOM.createRoot(document.getElementById('root')!).render(
     <FronteggProvider 
     customLoader={false}
     contextOptions={contextOptions} 
     hostedLoginBox={true}
     entitlementsOptions={{ enabled: true }}
     authOptions={authOptions}>
         <App />
     </FronteggProvider>
    );