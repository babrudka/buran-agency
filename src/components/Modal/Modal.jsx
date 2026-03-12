import "./Modal.css"
import ModalTours from "./ModalTours"
import { AnimatePresence, motion } from "framer-motion"

const modalAnim = {
  hidden: { opacity: 0, scale: 0.9, x: "-50%", y: "-50%" },
  visible: {
    opacity: 1,
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: {
      duration: 0.05,
      when: "beforeChildren",
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  },
  exit: { opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }
}

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
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
    if (value <= 25) return "green"
    if (value <= 50) return "yellow"
    if (value <= 75) return "orange"
    return "red"
  }

  const climate = planet.stats?.climate
  const temperature = planet.stats?.temperature
  const distance = planet.stats?.distance

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          onClick={() => {
            setModalScreen("planet")
            onClose()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          <motion.div
            className="modal"
            variants={modalAnim}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-x"
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

            {modalScreen === "planet" && (
              <>

                {planet.id === 'earth' && (
                  <motion.h1 variants={itemAnim} className="location">
                    ваше текущее местоположение
                  </motion.h1>
                )}

                <motion.h1 variants={itemAnim} className="planet-name-modal">
                  {planet.name}
                </motion.h1>

                <motion.div variants={itemAnim} className="planet-score">
                  <h1 className="score-title">
                    сложность<br />экспедиций
                  </h1>

                  <div className={`planet-score-block ${planet.score >= 5 ? "red" : "green"}`}>
                    <h1 className="planet-score-num">{planet.score}</h1>
                  </div>
                </motion.div>

                <motion.div variants={itemAnim} className="stat">
                  <h1 className="stat-name">агрессивность климата</h1>
                  <div className="bar">
                    <div
                      className="fill"
                      style={{
                        width: climate + "%",
                        background: getColor(climate)
                      }}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemAnim} className="stat">
                  <h1 className="stat-name">температурный режим</h1>
                  <div className="bar">
                    <div
                      className="fill"
                      style={{
                        width: temperature + "%",
                        background: getColor(temperature)
                      }}
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemAnim} className="stat">
                  <h1 className="stat-name">удалённость</h1>
                  <div className="bar">
                    <div
                      className="fill"
                      style={{
                        width: distance + "%",
                        background: getColor(distance)
                      }}
                    />
                  </div>
                </motion.div>

                <motion.section variants={itemAnim} className="tours-block">
                  <h1 className="open-tours">доступные туры</h1>

                  <div className="block-tour-cards">
                    {planet.tours?.map((tour, i) => (

                      <motion.button
                        variants={itemAnim}
                        className="tour-card"
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
                        <h1 className="tour-name">{tour}</h1>
                      </motion.button>

                    ))}
                  </div>

                </motion.section>

              </>
            )}

            {modalScreen === "tour" && (
              <ModalTours
                tour={selectedTour}
                isNested={true}
              />
            )}

          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}