import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SignUp from '../components/SignUp'
import SignIn from '../components/SignIn'
import Home from '../components/Home'
import UserProfile from '../components/UserProfile'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import './App.css'

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/userprofile" element={<UserProfile/>}/>
            </Routes>
        </>
    )
}

export default App
