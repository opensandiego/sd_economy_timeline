import React from 'react'
import './App.css'
import './sdForward.css'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Stage from './components/Stage'
import YearSelector from './components/YearSelector'

function App() {
  return (
    <div className='container flex'>
      <Header />
      <div className='content flex'>
        <div className='column fixed-300'>
          <Sidebar />
        </div>
        <div className='column flex'>
          <div className='row'>
            <Stage />
          </div>
          <div className='row fixed-100'>
            <YearSelector />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
