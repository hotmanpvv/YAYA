import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/pinyon-script/400.css'
import '@fontsource/caveat/500.css'
import './index.css'
import App from './App'
import { OgCard } from './OgCard'

const og = import.meta.env.DEV && new URLSearchParams(location.search).has('og')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {og ? <OgCard /> : <App />}
  </StrictMode>,
)
