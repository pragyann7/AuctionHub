import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from '../utils/ScrollToTop';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import Home from '../components/Home';
import AddProduct from '../components/AddProduct';
import UserProfile from '../components/UserProfile';
import { ContactUs } from '../components/ContactUs';
import Browse from '../components/Browse';
import DeleteProduct from '../components/DeleteProduct';
import EditProfile from '../components/EditProfile';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Layout from '../Utils/Layout.jsx';
import ProductDetail from '../components/ProductDetail.jsx';
import './App.css';

function App() {
    return (
        <Layout>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/delete" element={<ProtectedRoute> <DeleteProduct /> </ProtectedRoute>} />
                <Route path="/userprofile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/editprofile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="/addproduct" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                <Route path="/contact" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />
                <Route path="/Browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
                <Route path="/productdetail" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                <Route path="/products/:id" element={<ProductDetail />} />
            </Routes>
        </Layout>
    );
}

export default App;
