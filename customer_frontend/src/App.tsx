import { useState } from 'react'

function App() {
  const [title] = useState('Customer frontend')

  return (
    <>
    <h3>{title}</h3>
    </>
  )
}

export default App
