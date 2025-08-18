import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { authAPI } from '../../../context/authAPI';
import { useAuth } from '../../../context/authContext';
import styles from './Hero.module.css';
import { gsap } from 'gsap';

const Hero = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonGroupRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchSuperadminProfile = async () => {
      try {
        const response = await authAPI.getPublicSuperadmin();
        const userData = response.data.user || response.data;
        
        // Add timestamp to image URL to prevent caching
        const profileImage = userData.profileImage 
          ? `${userData.profileImage}?${new Date().getTime()}`
          : null;
        
        setProfileData({
          ...userData,
          profileImage
        });
        setLoaded(true);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchSuperadminProfile();
  }, [user]); // Add user as dependency to refresh when profile updates
  
  // useEffect(() => {
  //   const fetchSuperadminProfile = async () => {
  //     try {
  //       const response = await authAPI.getPublicSuperadmin();
  //       setProfileData(response.data.user || response.data);
  //       setLoaded(true);
  //     } catch (error) {
  //       console.error('Error fetching profile:', error);
  //     }
  //   };

  //   fetchSuperadminProfile();
  // }, [user]); // Add user as dependency to refresh when profile updates

  useEffect(() => {
    if (loaded) {
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );
      gsap.fromTo(subtitleRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.4 }
      );
      gsap.fromTo(descriptionRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.6 }
      );
      gsap.fromTo(buttonGroupRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.8 }
      );
      gsap.fromTo(imageRef.current, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "elastic.out(1, 0.5)", 
          delay: 0.6 
        }
      );
    }
  }, [loaded]);

  if (!profileData) {
    return (
      <section className={`${styles.hero} ${darkMode ? styles.dark : ''}`} ref={heroRef}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading profile...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.hero} ${darkMode ? styles.dark : ''}`} ref={heroRef}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title} ref={titleRef}>
            {`Mr. ${profileData.name}` || 'Mr. Utkarsh Gupta'}
          </h1>
          <p className={styles.subtitle} ref={subtitleRef}>
            {profileData.professionalTitle || 'Associate Consultant & Data Analytics Professional'}
          </p>
          <div className={styles.buttonGroup} ref={buttonGroupRef}>
            <a href="#contact" className={styles.primaryButton}>Get in Touch</a>
            <a href="#cv" className={styles.secondaryButton}>View CV</a>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper} ref={imageRef}>
            <img 
              src={`https://utkarsh-x6xa.onrender.com/uploads/Utkarsh-profile.jpg`} 
              alt="Profile Avatar"
              className={styles.myAvatar}
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
