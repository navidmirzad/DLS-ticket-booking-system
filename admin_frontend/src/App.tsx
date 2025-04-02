import { useState } from 'react'

function App() {
  const [title] = useState('Admin frontend');
  console.log(title);

  return (
    <>
     <h2>
      {title}
     </h2>
    </>
  )
}

export default App
