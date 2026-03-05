import { useRef, useState, useLayoutEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import "./HeroSection.css"
import TourLines from "./TourLines"
import MoonLine from "./MoonLine"
import EarthLine from "./EarthLine"
import PlanetNameLine from "./PlanetNameLine"

export default function HeroSection({ planet, onOpenModal, onGoToMoon, onGoToEarth }) {
  const planetRef = useRef(null)
  const [circleSize, setCircleSize] = useState(0)

  useLayoutEffect(() => {
    if (!planetRef.current) return
    const ro = new ResizeObserver(entries => {
      setCircleSize(entries[0].contentRect.width)
    })
    ro.observe(planetRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="front">
      <AnimatePresence mode="wait">
        <motion.p
          key={planet.id + '-zag'}
          className="zag"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          межпланетное туристическое агентство
        </motion.p>
      </AnimatePresence>

      <div className="planet" ref={planetRef}>
        <AnimatePresence mode="wait">
          <motion.img
            key={planet.id}
            src={planet.image}
            alt={planet.name}
            className="mainPlanet"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>

        <TourLines
          tours={planet.tours ?? []}
          planetId={planet.id}
          circleSize={circleSize}
        />

        <PlanetNameLine
          planetId={planet.id}
          planetName={planet.name}
          subtitle={planet.subtitle}
          showPin={planet.showPin}
          circleSize={circleSize}
        />

        <AnimatePresence>
          {planet.hasMoon && (
            <MoonLine
              key="moon-line"
              circleSize={circleSize}
              onGoToMoon={onGoToMoon}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {planet.hasEarth && (
            <EarthLine
              key="earth-line"
              circleSize={circleSize}
              onGoToEarth={onGoToEarth}
            />
          )}
        </AnimatePresence>
      </div>

      <a
        href="#"
        className="more-details"
        onClick={(e) => {
          e.preventDefault()
          onOpenModal()
        }}
      >
        подробнее о планете
      </a>
    </div>
  )
}
