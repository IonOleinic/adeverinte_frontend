import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-toastify/dist/ReactToastify.css'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'
import 'primeicons/primeicons.css'
import 'react-tooltip/dist/react-tooltip.css'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { LoadingProvider } from './context/LoadingProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <GoogleOAuthProvider clientId='859328509642-9cv8bmn7fcf7adj24up9dg8e9a6t033f.apps.googleusercontent.com'>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
