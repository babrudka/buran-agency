import "./Modal.css"
import ModalTours from "./ModalTours"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect } from "react"

const modalAnim = {
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

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.3 }
  }
}

const screenAnim = {
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

  useEffect(() => {
    setIsFormOpen(false)
  }, [isOpen, selectedTour])

  if (!planet) return null

  function getColor(value) {
    if (value <= 25) return "green";
    if (value <= 70) return "orange";
    return "red"
  }

  function getColorCircle(value) {
    if (value < 4) return "green";
    if (value < 7) return "orange";
    return "red";
  }

  const climate = planet.stats?.climate
  const temperature = planet.stats?.temperature
  const distance = planet.stats?.distance

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
            variants={modalAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
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
                  variants={screenAnim}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >

                  {planet.id === 'earth' && (
                    <motion.h1 variants={itemAnim} className="modal-location">
                      ваше текущее местоположение
                    </motion.h1>
                  )}

                  <motion.h1 variants={itemAnim} className="modal-title">
                    {planet.name}
                  </motion.h1>

                  <motion.div variants={itemAnim} className="modal-score">
                    <h1 className="modal-score-label">
                      сложность<br />экспедиций
                    </h1>

                    <div className={`modal-score-circle `}
                    style={{ borderColor: getColorCircle(planet.score) }}>
                      <h1 className="modal-score-num">{planet.score}</h1>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnim} className="modal-stat-line">
                    <h1 className="modal-stat-label">агрессивность климата</h1>
                    <div className="modal-progress">
                      <div
                        className="modal-fill"
                        style={{
                          width: climate + "%",
                          background: getColor(climate)
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnim} className="modal-stat-line">
                    <h1 className="modal-stat-label">температурный режим</h1>
                    <div className="modal-progress">
                      <div
                        className="modal-fill"
                        style={{
                          width: temperature + "%",
                          background: getColor(temperature)
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnim} className="modal-stat-line">
                    <h1 className="modal-stat-label">удалённость</h1>
                    <div className="modal-progress">
                      <div
                        className="modal-fill"
                        style={{
                          width: distance + "%",
                          background: getColor(distance)
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.section variants={itemAnim} className="modal-tours">
                    <h1 className="modal-heading">доступные туры</h1>

                    <div className="modal-cards">
                      {planet.tours?.map((tour, i) => (

                        <motion.button
                          variants={itemAnim}
                          className="modal-card"
                          style={{
                            backgroundImage: `url(${planet.tourImages?.[i]})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                          }}
                          key={i}
                          onClick={() => {
                            setSelectedTour({
                              name: tour,
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
                            setIsFormOpen(false)
                          }}
                        >
                          <h1 className="modal-name">{tour}</h1>
                        </motion.button>

                      ))}
                    </div>

                  </motion.section>

                </motion.div>
              )}

              {modalScreen === "tour" && (
                <motion.div
                  key="tour"
                  variants={screenAnim}
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