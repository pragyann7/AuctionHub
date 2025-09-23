import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from "../Utils/ScrollToTop.jsx"
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
import Notfound from '../404/notFound.jsx';
import FAQ from '../components/FAQ.jsx';
import './App.css';
import BecomeSellerForm from '../components/BecomeSeller.jsx';
import VerifyEmailOTP from '../components/VerifyEmailOTP.jsx';
import PasswordReset from '../components/PasswordReset.jsx';

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
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/become-seller" element={<BecomeSellerForm />} />
                <Route path="/user/:id" element={<UserProfile />} />
                <Route path="/verify-email" element={<VerifyEmailOTP />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/NotFound" element={<Notfound />} />
                <Route path="/FAQ" element={<FAQ />} />
            </Routes>
        </Layout>
    );
}

export default App;
