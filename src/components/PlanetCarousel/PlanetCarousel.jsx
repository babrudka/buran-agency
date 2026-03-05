import { AnimatePresence, motion } from "framer-motion"
import "./PlanetCarousel.css"

const springTransition = { duration: 0.25 }

export default function PlanetCarousel({ prevPlanet, nextPlanet, onPrev, onNext }) {
  return (
    <section className="swipe-planet">

      {prevPlanet && (
        <motion.img
          key={prevPlanet.id + '-left'}
          src={prevPlanet.image}
          alt={prevPlanet.name}
          className="planet-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={springTransition}
        />
      )}

      <AnimatePresence mode="wait">
        {prevPlanet && (
          <motion.div
            key={prevPlanet.id + '-swipe-left'}
            className="swipe swipe-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="onBtn">{prevPlanet.name}</h1>
            <button className="btn-arrow" onClick={onPrev}>
              <img src="/img/icons/Arrow-btn.svg" alt="Назад" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {nextPlanet && (
          <motion.div
            key={nextPlanet.id + '-swipe-right'}
            className="swipe swipe-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="onBtn">{nextPlanet.name}</h1>
            <button className="btn-arrow" onClick={onNext}>
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
          className="planet-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={springTransition}
        />
      )}

    </section>
  )
}
