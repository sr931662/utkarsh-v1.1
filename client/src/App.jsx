import './App.css';
import React, { useState, useEffect } from "react";
import Footer from './components/Footer/Footer';
import Contact from './components/Home/Contacts/Contact';
import CV from './components/Home/CV/CV';
import Hero from './components/Home/Hero/Hero';
import Publications from './components/Home/Publications/Publications';
import ResearchInterest from './components/Home/ResearchInterests/ResearchInterests';
import Navbar from './components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import PublicationsDetail from './components/Home/Publications/publications_detail/Publications_detail';
import Login from './components/Login/Login';
import Dashboard from './components/dashboard/dashboard';
import Admin from './components/admin/admin';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './context/protectedRoute';
import ProfileSettings from './components/dashboard/profileSettings/profileSettings';
import Carousel from './components/Home/Carousel/Carousel';
import { authAPI } from './context/authAPI';

const App = () => {
  const [setUser] = useState(null);
  const [setAuthChecked] = useState(false);
  const [carouselData, setCarouselData] = useState([]);

  // Fetch public carousel data
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await authAPI.getPublicSuperadmin();
        if (response.data?.user?.carouselItems) {
          setCarouselData(response.data.user.carouselItems);
        }
      } catch (error) {
        console.error('Failed to fetch carousel data:', error);
      }
    };

    fetchCarouselData();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('auth'));
        if (authData?.token) {
          // Verify token with backend
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${authData.token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('auth');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [setUser, setAuthChecked]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route exact path='/' element={<HomePage carouselData={carouselData} />} />
            <Route exact path='/publications/:id' element={<PublicationsDetail />} />
            <Route exact path='/login' element={<Login />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route exact path="/admin/dashboard" element={<Dashboard />} />
              <Route 
                exact 
                path="/admin/profile" 
                element={<ProfileSettings carouselData={carouselData} />} 
              />
            </Route>
            
            {/* Admin-only Routes */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route exact path="/admin" element={<Admin />} />
            </Route>
          </Routes>
          <Footer />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

const HomePage = ({ carouselData }) => {
  return (
    <div>
      <Hero />
      <ResearchInterest />
      <Publications />
      <Carousel carouselItems={carouselData} />
      <CV />
      <Contact />
    </div>
  );
}

export default App;

