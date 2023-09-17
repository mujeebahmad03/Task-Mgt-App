import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import Dashboard from './pages/Dashboard'
import SignUp from './pages/Signup';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import TaskDetails from './pages/TaskDetails';
import Header from './component/Header';
import { logoutUser } from './features/auth/authSlice'; 
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import GlobalStyles from './component/styles/GlobalStyle';
import { Toaster } from 'react-hot-toast';


const theme = {
  primary: '#38d39f',
  black1: '#646681',
  black2: '#585858',
  bg1: '#f8f8ff',
  bg2: '#ecedf6',
  bg3: '#cccdde',
  gray1: '#eee',
  gray2: '#dedfe1',
  black: 'black',
  white: 'white',
};


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Check if the user is already logged in
  const savedUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!savedUser);
  const auth = useSelector((state) => state.auth);
  
  // Function to handle user logout
  const handleLogout = () => {
   // Dispatch the logoutUser action to remove the user from Redux state
    dispatch(logoutUser());

   // Clear the user's data from localStorage
    localStorage.removeItem('loggedInUser');
   // Set isLoggedIn to false to log the user out
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleSignUp = () => {
    setIsLoggedIn(true);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        {isLoggedIn && <Header onLogout={handleLogout}/>}
        <Routes>
          <Route path="/" element={<SignUp onSignUp={handleSignUp} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} /> */}
          {isLoggedIn ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/details" element={<TaskDetails />} />
          </>
          ) : (
            // Redirect to login page when trying to access protected routes
            <>
              <Route path="/dashboard" element={<Navigate to="/login" />} />
              <Route path="/profile" element={<Navigate to="/login" />} />
              <Route path="/details" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </>
    </ThemeProvider>
  );
}

export default App
