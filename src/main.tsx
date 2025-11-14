import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { EatoolApp } from './EatoolApp'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
       <EatoolApp />
  </StrictMode>,
)
