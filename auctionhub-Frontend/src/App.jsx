import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from '../components/SignUp'
import SignIn from '../components/SignIn'
import Home from '../components/Home'
import AddProduct from '../components/AddProduct';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Layout from '../Layout/Layout';
import './App.css'

function App() {

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          <Route path="/addproduct" element={<AddProduct />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
