import { useRef, useState, useLayoutEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import "./HeroSection.css"
import TourLines from "./TourLines"
import MoonLine from "./MoonLine"
import EarthLine from "./EarthLine"
import PlanetNameLine from "./PlanetNameLine"
import GravityCalculator from "./GravityCalculator"

export default function HeroSection({ planet, onModal, onTourClick, onGoToMoon, onGoToEarth }) {
  const ref = useRef(null)
  const [size, setSize] = useState(0)

  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(entries => {
      setSize(entries[0].contentRect.width)
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="hero">
      <div className="circle" ref={ref}>
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
          size={size}
          onTourClick={onTourClick}
        />

        <PlanetNameLine
          id={planet.id}
          name={planet.name}
          subtitle={planet.subtitle}
          showPin={planet.showPin}
          size={size}
          facts={planet.facts}
        />

        <AnimatePresence>
          {planet.hasMoon && (
            <MoonLine
              key="moon-line"
              size={size}
              onGoToMoon={onGoToMoon}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {planet.id === 'moon' && (
            <GravityCalculator
              key="gravity-calc"
              size={size}
              id={planet.id}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {planet.hasEarth && (
            <EarthLine
              key="earth-line"
              size={size}
              onGoToEarth={onGoToEarth}
            />
          )}
        </AnimatePresence>
      </div>

      <a
        href="#"
        className="details-btn"
        onClick={(e) => {
          e.preventDefault()
          onModal()
        }}
      >
        подробнее о планете
      </a>
    </div>
  )
}
