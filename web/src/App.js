import React from 'react'
import './App.css'
import './sdForward.css'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Stage from './components/Stage'

function App() {
  return (
    <div className='container'>
      <Header />
      <div className='content'>
        <Sidebar />
        <Stage />
      </div>
    </div>
  )
}

export default App
