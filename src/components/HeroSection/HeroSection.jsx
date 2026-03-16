import { useRef, useState, useLayoutEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import "./HeroSection.css"
import TourLines from "./TourLines"
import MoonLine from "./MoonLine"
import EarthLine from "./EarthLine"
import PlanetNameLine from "./PlanetNameLine"
import GravityCalculator from "./GravityCalculator"

export default function HeroSection({ planet, onOpenPlanetModal, onTourClick, onGoToMoon, onGoToEarth }) {
  const circleRef = useRef(null)
  const [circleSize, setCircleSize] = useState(0)

  useLayoutEffect(() => {
    if (!circleRef.current) return
    const observer = new ResizeObserver(entries => {
      setCircleSize(entries[0].contentRect.width)
    })
    observer.observe(circleRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="hero">
      <div className="circle" ref={circleRef}>
        <AnimatePresence mode="wait">
          <motion.img
            key={planet.id}
            src={planet.image}
            alt={planet.name}
            className="planet-img"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>

        {planet.id === 'pluto' && (
          <div className="closed-banner">
            Закрыто для посещений с 2006 года
          </div>
        )}

        <TourLines
          tours={planet.tours ?? []}
          planetId={planet.id}
          circleSize={circleSize}
          onTourClick={onTourClick}
        />

        <PlanetNameLine
          id={planet.id}
          name={planet.name}
          subtitle={planet.subtitle}
          showPin={planet.showPin}
          circleSize={circleSize}
          facts={planet.facts}
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
          {planet.id === 'moon' && (
            <GravityCalculator
              key="gravity-calc"
              circleSize={circleSize}
              id={planet.id}
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
        className="details-btn"
        onClick={(event) => {
          event.preventDefault()
          onOpenPlanetModal()
        }}
      >
        подробнее о планете
      </a>
    </div>
  )
}
