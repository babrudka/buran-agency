import "./Modal.css"
import ModalTours from "./ModalTours"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { buildTourData, getScoreColor, getStatColor } from "../../data/planets"

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

const scienceListAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08
    }
  }
}

const scienceItemAnimation = {
  hidden: () => ({
    opacity: 0,
    y: 12
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut"
    }
  }
}

export default function Modal({
  isOpen,
  onClose,
  onGoToShop,
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
  const scientificDetails = [
    { key: "area", label: "Площадь", value: planet.details?.area },
    { key: "atmosphere", label: "Состав атмосферы", value: planet.details?.atmosphere },
    { key: "composition", label: "Состав планеты", value: planet.details?.composition },
    { key: "gravity", label: "Гравитация", value: planet.details?.gravity },
    { key: "temperatureRange", label: "Температурный режим", value: planet.details?.temperatureRange },
    { key: "features", label: "Особенности", value: planet.details?.features }
  ].filter(detail => detail.value)

  function renderScienceValue(detail) {
    if (Array.isArray(detail.value)) {
      return (
        <ul className="modal-science-chem-list">
          {detail.value.map((item, itemIndex) => (
            <li
              key={`${detail.key}-${itemIndex}`}
              className={`modal-science-chem-item ${item?.tone ? `is-${item.tone}` : ""}`}
            >
              {typeof item === "string" ? item : item.text}
            </li>
          ))}
        </ul>
      )
    }

    return <p className="modal-science-value">{detail.value}</p>
  }

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
            className={`modal-popup${modalScreen === "tour" ? " modal-popup--tour" : ""}`}
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
              <img src="/img/icons/Arrow-btn.svg" alt="Назад" />
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

                  {planet.id !== 'pluto' ? (
                    <>
                      <motion.div variants={fadeInAnimation} className="modal-score">
                        <h1 className="modal-score-label">
                          сложность<br />экспедиций
                        </h1>

                        <div className={`modal-score-circle `}
                          style={{ borderColor: getScoreColor(planet.score) }}>
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
                              background: getStatColor(climatePercent)
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
                              background: getStatColor(temperaturePercent)
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
                              background: getStatColor(distancePercent)
                            }}
                          />
                        </div>
                      </motion.div>

                      <motion.section variants={fadeInAnimation} className="modal-tours">
                        {scientificDetails.length > 0 && (
                          <motion.section variants={fadeInAnimation} className="modal-science">

                            <motion.div
                              className="modal-science-list"
                              variants={scienceListAnimation}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true, amount: 0.25 }}
                            >
                              {scientificDetails.map((detail, index) => (
                                <motion.article
                                  key={detail.key}
                                  className="modal-science-item"
                                  variants={scienceItemAnimation}
                                  custom={index}
                                  whileHover={{ y: -2 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <h2 className="modal-science-label">{detail.label}</h2>
                                  {renderScienceValue(detail)}
                                </motion.article>
                              ))}
                            </motion.div>
                          </motion.section>
                        )}

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
                    </>
                  ) : (
                    <>
                    
                      <motion.div variants={fadeInAnimation} className="modal-score modal-score-pluto">
                        
                        <h1 className="client-message">
                          уважаемые клиенты!
                        </h1>
                        <p className="modal-text pluto-text-desc">
                          К сожалению, на данный момент мы не можем предложить вам экспедиции на Плутон, так как он более не является полноправной планетой и не соответствует нашим критериям. Мы рекомендуем вам исследовать наши уникальные туры на другие планеты, которые обеспечат вам незабываемые впечатления и возможность открыть для себя что-то новое и удивительное в нашей Солнечной системе. Просим отнестись к нам с пониманием и надеемся, что вы найдете идеальное направление для своего следующего космического приключения среди наших тщательно подобранных туров.
                        </p>
                      </motion.div>
                      {scientificDetails.length > 0 && (
                          <motion.section variants={fadeInAnimation} className="modal-science">

                            <motion.div
                              className="modal-science-list"
                              variants={scienceListAnimation}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true, amount: 0.25 }}
                            >
                              {scientificDetails.map((detail, index) => (
                                <motion.article
                                  key={detail.key}
                                  className="modal-science-item"
                                  variants={scienceItemAnimation}
                                  custom={index}
                                  whileHover={{ y: -2 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <h2 className="modal-science-label">{detail.label}</h2>
                                  {renderScienceValue(detail)}
                                </motion.article>
                              ))}
                            </motion.div>
                            <p className="modal-text pluto-text-desc">К сожалению, Плутон перестал являться планетой, потому что он не смог "навести порядок" на своей орбите — вокруг него вращается множество других ледяных тел в поясе Койпера, и его гравитации недостаточно, чтобы поглотить или отбросить их. С 2006 года Плутон принято считать "карликовой планетой".</p>
                          </motion.section>
                        )}
                    </>
                  )}

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
                    onGoToShop={onGoToShop}
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