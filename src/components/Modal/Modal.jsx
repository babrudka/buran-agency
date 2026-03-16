import "./Modal.css"
import ModalTours from "./ModalTours"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { buildTourData, getDifficultyColor, getProgressBarColor } from "../../data/planets"

const popupAnimation = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      when: "beforeChildren",
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
}

const fadeInAnimation = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.3 }
  }
}

const screenAnimation = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.05, delayChildren: 0.05 } 
  },
  exit: { opacity: 0, transition: { duration: 0.15 } }
}

export default function Modal({
  isOpen,
  onClose,
  planet,
  modalScreen,
  setModalScreen,
  selectedTour,
  setSelectedTour
}) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [previousIsOpen, setPreviousIsOpen] = useState(isOpen)
  const [previousSelectedTour, setPreviousSelectedTour] = useState(selectedTour)

  if (previousIsOpen !== isOpen || previousSelectedTour !== selectedTour) {
    setPreviousIsOpen(isOpen)
    setPreviousSelectedTour(selectedTour)
    setIsFormOpen(false)
  }

  if (!planet) return null

  const climatePercent = planet.stats?.climate
  const temperaturePercent = planet.stats?.temperature
  const distancePercent = planet.stats?.distance

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-bg"
          onClick={() => {
            setModalScreen("planet")
            onClose()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          <motion.div
            className="modal-popup"
            variants={popupAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              className="modal-back"
              onClick={() => {
                if (modalScreen === "tour") {
                  if (isFormOpen) {
                    setIsFormOpen(false)
                  } else {
                    setModalScreen("planet")
                  }
                } else {
                  onClose()
                }
              }}
            >
              <img src="/img/icons/back_btn.svg" alt="назад" />
              назад
            </button>

            <AnimatePresence mode="wait">

              {modalScreen === "planet" && (
                <motion.div
                  key="planet"
                  variants={screenAnimation}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >

                  {planet.id === 'earth' && (
                    <motion.h1 variants={fadeInAnimation} className="modal-location">
                      ваше текущее местоположение
                    </motion.h1>
                  )}

                  <motion.h1 variants={fadeInAnimation} className="modal-title">
                    {planet.name}
                  </motion.h1>

                  <motion.div variants={fadeInAnimation} className="modal-score">
                    <h1 className="modal-score-label">
                      сложность<br />экспедиций
                    </h1>

                    <div className={`modal-score-circle `}
                    style={{ borderColor: getDifficultyColor(planet.score) }}>
                      <h1 className="modal-score-num">{planet.score}</h1>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInAnimation} className="modal-stat-line">
                    <h1 className="modal-stat-label">агрессивность климата</h1>
                    <div className="modal-progress">
                      <div
                        className="modal-fill"
                        style={{
                          width: climatePercent + "%",
                          background: getProgressBarColor(climatePercent)
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInAnimation} className="modal-stat-line">
                    <h1 className="modal-stat-label">температурный режим</h1>
                    <div className="modal-progress">
                      <div
                        className="modal-fill"
                        style={{
                          width: temperaturePercent + "%",
                          background: getProgressBarColor(temperaturePercent)
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInAnimation} className="modal-stat-line">
                    <h1 className="modal-stat-label">удалённость</h1>
                    <div className="modal-progress">
                      <div
                        className="modal-fill"
                        style={{
                          width: distancePercent + "%",
                          background: getProgressBarColor(distancePercent)
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.section variants={fadeInAnimation} className="modal-tours">
                    <h1 className="modal-heading">доступные туры</h1>

                    <div className="modal-cards">
                      {planet.tours?.map((tourName, tourIndex) => (

                        <motion.button
                          variants={fadeInAnimation}
                          className="modal-card"
                          style={{
                            backgroundImage: `url(${planet.tourImages?.[tourIndex]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                          }}
                          key={tourIndex}
                          onClick={() => {
                            setSelectedTour(buildTourData(planet, tourName, tourIndex))
                            setModalScreen("tour")
                            setIsFormOpen(false)
                          }}
                        >
                          <h1 className="modal-name">{tourName}</h1>
                        </motion.button>

                      ))}
                    </div>

                  </motion.section>

                </motion.div>
              )}

              {modalScreen === "tour" && (
                <motion.div
                  key="tour"
                  variants={screenAnimation}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ModalTours
                    key={selectedTour?.name}
                    tour={selectedTour}
                    isNested={true}
                    isFormOpen={isFormOpen}
                    setIsFormOpen={setIsFormOpen}
                  />
                </motion.div>
              )}

            </AnimatePresence>

          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}