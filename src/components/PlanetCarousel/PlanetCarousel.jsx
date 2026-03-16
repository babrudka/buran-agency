import { AnimatePresence, motion } from "framer-motion"
import "./PlanetCarousel.css"

const fadeTransition = { duration: 0.25 }

export default function PlanetCarousel({ previousPlanet, nextPlanet, onGoToPrevious, onGoToNext }) {
  return (
    <section className="side-planet">

      {previousPlanet && (
        <motion.img
          key={previousPlanet.id + '-left'}
          src={previousPlanet.image}
          alt={previousPlanet.name}
          className="planet-l"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={fadeTransition}
        />
      )}

      <AnimatePresence mode="wait">
        {previousPlanet && (
          <motion.div
            key={previousPlanet.id + '-carousel-left'}
            className="carousel carousel-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="arrow-area">{previousPlanet.name}</h1>
            <button className="arrow" onClick={onGoToPrevious}>
              <img src="/img/icons/Arrow-btn.svg" alt="Назад" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {nextPlanet && (
          <motion.div
            key={nextPlanet.id + '-carousel-right'}
            className="carousel carousel-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="arrow-area">{nextPlanet.name}</h1>
            <button className="arrow" onClick={onGoToNext}>
              <img src="/img/icons/Arrow-btn-right.svg" alt="Вперёд" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {nextPlanet && (
        <motion.img
          key={nextPlanet.id + '-right'}
          src={nextPlanet.image}
          alt={nextPlanet.name}
          className="planet-r"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={fadeTransition}
        />
      )}

    </section>
  )
}