import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { AuthClient } from '@dfinity/auth-client';



const init = async () => {

  const authClient = await AuthClient.create();

  if(await authClient.isAuthenticated()){
    handleAuthenticated(authClient);
  } else {
    await authClient.login({
      // 7 days in nanoseconds
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        handleAuthenticated(authClient);
      },
    });  
  }

  async function handleAuthenticated(authClient){
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }

}

init();