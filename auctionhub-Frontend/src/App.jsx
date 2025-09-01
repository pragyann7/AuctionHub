import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from '../components/SignUp'
import SignIn from '../components/SignIn'
import Home from '../components/Home'
import HomeGuest from '../components/HomeGuest';
import './App.css'

function App() {

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<HomeGuest />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  )
}

export default App
