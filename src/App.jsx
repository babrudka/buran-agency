import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./components/Header/Header"
import HeroSection from "./components/HeroSection/HeroSection"
import PlanetCarousel from "./components/PlanetCarousel/PlanetCarousel"
import Modal from "./components/Modal/Modal"
import Shop from "./components/Shop/Shop"
import AboutUs from "./components/AboutUs/AboutUs"
import ToursCatalog from "./components/ToursCatalog/ToursCatalog"
import { planets, moon, buildTourData } from "./data/planets"

const EARTH_INDEX = planets.findIndex(planet => planet.id === 'earth')

const pageStyle = { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
const pageTransition = { duration: 0.25 }

function App() {
  const [planetIndex, setPlanetIndex] = useState(EARTH_INDEX)
  const [isOnMoon, setIsOnMoon] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState('planets')
  const [modalScreen, setModalScreen] = useState("planet")
  const [selectedTour, setSelectedTour] = useState(null)

  const currentPlanet = isOnMoon ? moon : planets[planetIndex]


  const hasPrev = !isOnMoon && planetIndex > 0
  const hasNext = !isOnMoon && planetIndex < planets.length - 1

  const prevPlanet = hasPrev ? planets[planetIndex - 1] : null
  const nextPlanet = hasNext ? planets[planetIndex + 1] : null

  function goPrev() {
    if (isOnMoon) {
      setIsOnMoon(false)
    } else {
      setPlanetIndex(currentIndex => currentIndex - 1)
    }
  }

  function goNext() {
    setPlanetIndex(currentIndex => currentIndex + 1)
  }

  function openTourModal(tourName, tourIndex) {
    if (currentPlanet.id === "pluto") return

    setSelectedTour(buildTourData(currentPlanet, tourName, tourIndex))
    setModalScreen("tour")
    setIsModalOpen(true)
  }

  function openPlanetModal() {
    if (currentPlanet.id !== "pluto") {
      setIsModalOpen(true)
    }
  }


  function renderPage() {
    if (page === 'planets') {
      return (
        <motion.main
          key='planets'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={pageTransition}
        >
          <HeroSection
            planet={currentPlanet}
            onModal={openPlanetModal}
            onTourClick={openTourModal}
            onGoToMoon={() => setIsOnMoon(true)}
            onGoToEarth={() => setIsOnMoon(false)}
          />
          <PlanetCarousel
            prev={prevPlanet}
            next={nextPlanet}
            onPrev={goPrev}
            onNext={goNext}
          />
        </motion.main>
      )
    }

    if (page === 'tours') {
      return (
        <motion.div key='tours' style={pageStyle} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={pageTransition}>
          <ToursCatalog />
        </motion.div>
      )
    }

    if (page === 'about') {
      return (
        <motion.div key='about' style={pageStyle} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={pageTransition}>
          <AboutUs />
        </motion.div>
      )
    }

    if (page === 'shop') {
      return (
        <motion.div key='shop' style={pageStyle} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={pageTransition}>
          <Shop />
        </motion.div>
      )
    }

    return null
  }

  return (
    <div>
      <Header currentView={page} onNavigate={setPage} />

      <AnimatePresence mode='wait'>
        {renderPage()}
      </AnimatePresence>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planet={currentPlanet}
        modalScreen={modalScreen}
        setModalScreen={setModalScreen}
        selectedTour={selectedTour}
        setSelectedTour={setSelectedTour}
      />
    </div>
  )
}

export default App