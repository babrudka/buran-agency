import "./Modal.css"
import ModalTours from "./ModalTours"
import { AnimatePresence, motion } from "framer-motion"

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
          className="bg"
          onClick={() => {
            setModalScreen("planet")
            onClose()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          <motion.div
            className="popup"
            variants={modalAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="back"
              onClick={() => {
                if (modalScreen === "tour") {
                  setModalScreen("planet")
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
                    <motion.h1 variants={itemAnim} className="location">
                      ваше текущее местоположение
                    </motion.h1>
                  )}

                  <motion.h1 variants={itemAnim} className="title">
                    {planet.name}
                  </motion.h1>

                  <motion.div variants={itemAnim} className="score">
                    <h1 className="score-label">
                      сложность<br />экспедиций
                    </h1>

                    <div className={`score-circle `}
                    style={{ borderColor: getColorCircle(planet.score) }}>
                      <h1 className="score-num">{planet.score}</h1>
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnim} className="stat-line">
                    <h1 className="stat-label">агрессивность климата</h1>
                    <div className="progress">
                      <div
                        className="fill"
                        style={{
                          width: climate + "%",
                          background: getColor(climate)
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnim} className="stat-line">
                    <h1 className="stat-label">температурный режим</h1>
                    <div className="progress">
                      <div
                        className="fill"
                        style={{
                          width: temperature + "%",
                          background: getColor(temperature)
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemAnim} className="stat-line">
                    <h1 className="stat-label">удалённость</h1>
                    <div className="progress">
                      <div
                        className="fill"
                        style={{
                          width: distance + "%",
                          background: getColor(distance)
                        }}
                      />
                    </div>
                  </motion.div>

                  <motion.section variants={itemAnim} className="tours">
                    <h1 className="heading">доступные туры</h1>

                    <div className="cards">
                      {planet.tours?.map((tour, i) => (

                        <motion.button
                          variants={itemAnim}
                          className="card"
                          style={{
                            backgroundImage: `url(${planet.tourImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                          }}
                          key={i}
                          onClick={() => {
                            setSelectedTour({
                              name: tour,
                              planetName: planet.name,
                              tourImage: planet.tourImage,
                              score: planet.score,
                              desc: planet.tourDescs?.length > 1
                                ? planet.tourDescs[i]
                                : planet.tourDescs?.[0]
                            })
                            setModalScreen("tour")
                          }}
                        >
                          <h1 className="name">{tour}</h1>
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