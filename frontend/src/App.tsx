import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Blog from './Pages/Blog'
import Auth from './Pages/Auth'

function App() {
  

  return (
    <>
      

      <BrowserRouter>
        <Routes>
          <Route path='auth' element={<Auth/>} />
          <Route path='/blog/:id'  element={<Blog/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
