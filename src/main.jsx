import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router/Router.jsx'
import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from './Context/AuthProvider.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
 
    <QueryClientProvider client={queryClient}>
     <AuthProvider> <RouterProvider router={Router} /></AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)