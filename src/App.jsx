import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "./components/Header/Header"
import HeroSection from "./components/HeroSection/HeroSection"
import PlanetCarousel from "./components/PlanetCarousel/PlanetCarousel"
import Modal from "./components/Modal/Modal"
import ComingSoon from "./components/ComingSoon/ComingSoon"
import Shop from "./components/Shop/Shop"
import AboutUs from "./components/AboutUs/AboutUs"
import ToursCatalog from "./components/ToursCatalog/ToursCatalog"
import { planets, moon } from "./data/planets"

const START = planets.findIndex(p => p.id === 'earth')

function App() {
  const [index, setIndex] = useState(START)
  const [onMoon, setOnMoon] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState('home')
  const [modalScreen, setModalScreen] = useState("planet")
  const [selectedTour, setSelectedTour] = useState(null)



  const planet = onMoon ? moon : planets[index]

  const prev = onMoon
    ? null
    : index > 0 ? planets[index - 1] : null

  const next = onMoon
    ? null
    : index < planets.length - 1 ? planets[index + 1] : null

  const onPrev = onMoon
    ? () => setOnMoon(false)
    : () => setIndex(i => i - 1)

  const onNext = () => setIndex(i => i + 1)

  const goMoon = () => setOnMoon(true)

  return (
    <div>
      <Header currentView={page === 'home' ? 'planets' : page} onNavigate={(v) => setPage(v === 'planets' ? 'home' : v)} />

      <AnimatePresence mode='wait'>
        {page === 'home' ? (
          <motion.main
            key='planets'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <HeroSection
              planet={planet}
              onModal={() => {
                if (planet.id !== "pluto") {
                  setModalOpen(true)
                }
              }}
              onTourClick={(tourName, i) => {
                if (planet.id === "pluto") return
                setSelectedTour({
                  name: tourName,
                  planetName: planet.name,
                  tourImage: planet.tourImages?.[i],
                  score: planet.score,
                  desc: planet.tourDescs?.length > 1
                    ? planet.tourDescs[i]
                    : planet.tourDescs?.[0],
                  travelTime: planet.travelTime,
                  stayTime: planet.stayTime,
                  totalDuration: planet.totalDuration
                })
                setModalScreen("tour")
                setModalOpen(true)
              }}
              onGoToMoon={goMoon}
              onGoToEarth={() => setOnMoon(false)}
            />
            <PlanetCarousel
              prev={prev}
              next={next}
              onPrev={onPrev}
              onNext={onNext}
            />
          </motion.main>
        ) : page === 'tours' ? (
          <motion.div
            key='tours'
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
          >
            <ToursCatalog />
          </motion.div>
        ) : page === 'about' ? (
          <motion.div
            key='about'
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
          >
            <AboutUs />
          </motion.div>
        ) : page === 'shop' ? (
          <motion.div
            key='shop'
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
          >
            <Shop />
          </motion.div>
        ) : (
          <motion.div
            key='other'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ComingSoon />
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planet={planet}
        modalScreen={modalScreen}
        setModalScreen={setModalScreen}
        selectedTour={selectedTour}
        setSelectedTour={setSelectedTour}
      />
    </div>
  )
}

export default App