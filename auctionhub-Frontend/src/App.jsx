import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from '../components/SignUp'
import SignIn from '../components/SignIn'
import Home from '../components/Home'
import AddProduct from '../components/AddProduct';
import UserProfile from '../components/UserProfile';
import {ContactUs} from '../components/ContactUs'
import Browse from '../components/Browse';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Layout from '../Layout/Layout';
import './App.css'

function App() {

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/userprofile" element={<ProtectedRoute> <UserProfile /> </ProtectedRoute>} />
                <Route path="/addproduct" element={<ProtectedRoute> <AddProduct /> </ProtectedRoute>} />
                <Route path="/contact" element={<ProtectedRoute> <ContactUs /> </ProtectedRoute>} />
                <Route path="/Browse" element={<ProtectedRoute> <Browse /> </ProtectedRoute>} />
            </Routes>
        </Layout>
    )
}

export default App
