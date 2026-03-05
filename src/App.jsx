import { useState } from "react"
import Header from "./components/Header/Header"
import HeroSection from "./components/HeroSection/HeroSection"
import PlanetCarousel from "./components/PlanetCarousel/PlanetCarousel"
import Modal from "./components/Modal/Modal"
import { planets, moon } from "./data/planets"

const EARTH_INDEX = planets.findIndex(p => p.id === 'earth')

function App() {
  const [currentIndex, setCurrentIndex] = useState(EARTH_INDEX)
  const [isMoon, setIsMoon] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const currentPlanet = isMoon ? moon : planets[currentIndex]

  const prevPlanet = isMoon
    ? null
    : currentIndex > 0 ? planets[currentIndex - 1] : null

  const nextPlanet = (!isMoon && currentIndex < planets.length - 1)
    ? planets[currentIndex + 1]
    : null

  const onPrev = isMoon
    ? () => setIsMoon(false)
    : () => setCurrentIndex(i => i - 1)

  const onNext = () => setCurrentIndex(i => i + 1)

  const goToMoon = () => setIsMoon(true)

  return (
    <div>
      <Header />

      <main>
        <HeroSection
          planet={currentPlanet}
          onOpenModal={() => setIsOpen(true)}
          onGoToMoon={goToMoon}
          onGoToEarth={() => setIsMoon(false)}
        />
        <PlanetCarousel
          prevPlanet={prevPlanet}
          nextPlanet={nextPlanet}
          onPrev={onPrev}
          onNext={onNext}
        />
      </main>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}

export default App
