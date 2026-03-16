import { AnimatePresence, motion } from "framer-motion"
import "./PlanetCarousel.css"

const spring = { duration: 0.25 }

export default function PlanetCarousel({ prev, next, onPrev, onNext }) {
  return (
    <section className="side-planet">

      {prev && (
        <motion.img
          key={prev.id + '-left'}
          src={prev.image}
          alt={prev.name}
          className="planet-l"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={spring}
        />
      )}

      <AnimatePresence mode="wait">
        {prev && (
          <motion.div
            key={prev.id + '-carousel-left'}
            className="carousel carousel-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="arrow-area">{prev.name}</h1>
            <button className="arrow" onClick={onPrev}>
              <img src="/img/icons/Arrow-btn.svg" alt="Назад" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {next && (
          <motion.div
            key={next.id + '-carousel-right'}
            className="carousel carousel-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="arrow-area">{next.name}</h1>
            <button className="arrow" onClick={onNext}>
              <img src="/img/icons/Arrow-btn-right.svg" alt="Вперёд" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {next && (
        <motion.img
          key={next.id + '-right'}
          src={next.image}
          alt={next.name}
          className="planet-r"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={spring}
        />
      )}

    </section>
  )
}