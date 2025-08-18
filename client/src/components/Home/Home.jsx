import React from 'react'
import styles from './Home.module.css'
import Hero from './Hero/Hero'
import ResearchInterest from './ResearchInterests/ResearchInterests'
import Publications from './Publications/Publications'
import CV from './CV/CV'
import Contact from './Contacts/Contact'
import Carousel from './Carousel/Carousel'
// import { getImageUrl } from '../../utils'

function Home() {
  return (
    <div className={styles.home1}>
      <Hero />
      <ResearchInterest />
      <Publications />
      <CV />
      <Contact />
    </div>
  )
}

export default Home