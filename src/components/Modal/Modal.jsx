import "./Modal.css"
import ModalTours from "./ModalTours"
import { AnimatePresence, motion } from "framer-motion"

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
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
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
                  <h1 className="location">ваше текущее местоположение</h1>
                )}

                <h1 className="planet-name-modal">{planet.name}</h1>

                <div className="planet-score">
                  <h1 className="score-title">
                    сложность<br />экспедиций
                  </h1>

                  <div className={`planet-score-block ${planet.score >= 5 ? "red" : "green"}`}>
                    <h1 className="planet-score-num">{planet.score}</h1>
                  </div>
                </div>

                <div className="stat">
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
                </div>

                <div className="stat">
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
                </div>

                <div className="stat">
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
                </div>

                <section className="tours-block">
                  <h1 className="open-tours">доступные туры</h1>

                  <div className="block-tour-cards">
                    {planet.tours?.map((tour, i) => (

                      <button
                        className="tour-card"
                        key={i}
                        onClick={() => {
                          setSelectedTour({
                            name: tour,
                            planetName: planet.name,
                            img: planet.image,
                            tourImage: planet.tourImage,
                            score: planet.score
                          })
                          setModalScreen("tour")
                        }}
                      >
                        <h1 className="tour-name">{tour}</h1>
                      </button>

                    ))}
                  </div>

                </section>
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