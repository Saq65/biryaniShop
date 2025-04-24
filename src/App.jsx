import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './clients/components/Home'
import BillingPage from './clients/pages/BIllingPage'
import MeatHotelBilling from './clients/pages/HotelBilling'
import Todo from './clients/pages/Todo'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Todo/>
        {/* <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/biryani' element={<BillingPage/>} />
            <Route path='/hotel' element={<MeatHotelBilling/>} />
          </Routes>
        </BrowserRouter> */}
      </div>
    </>
  )
}

export default App
