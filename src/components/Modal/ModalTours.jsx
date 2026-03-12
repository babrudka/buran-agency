import { AnimatePresence, motion } from "framer-motion"
import "./Modal.css"

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
            delayChildren: 0.2,
            staggerChildren: 0.1
        }
    },
    exit: { opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }
}

const itemAnim = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
}

export default function ModalTours({ tour, isOpen, onClose, isNested }) {

    if (!tour) return null

    const content = (
        <>
            <motion.h1 variants={itemAnim} className="tour-name-title">
                Тур: «{tour?.name}»
            </motion.h1>

            <motion.section variants={itemAnim} className="desc-tour-block">

                <motion.img
                    variants={itemAnim}
                    src={tour?.tourImage}
                    alt="фото тура"
                />

                <motion.section variants={itemAnim} className="section-of-title">

                    <motion.div variants={itemAnim}>
                        <h1 className="title-tour">
                            планета: {tour?.planetName}
                        </h1>
                    </motion.div>

                    <motion.section variants={itemAnim} className="score-of-tour">
                        <h1>сложность</h1>
                        <div className={`planet-score-block ${tour?.score >= 5 ? "red" : "green"}`}>
                            <h1 className="planet-score-num">{tour?.score}</h1>
                        </div>
                    </motion.section>

                    <motion.h1 variants={itemAnim}>
                        продолжительность тура: <span className="par">96 часов</span>
                    </motion.h1>

                    <motion.p variants={itemAnim} className="parag-title">
                        подробнее о туре
                    </motion.p>

                    <motion.p variants={itemAnim} className="desc-of-tour">
                        {tour?.desc}
                    </motion.p>

                    <motion.button variants={itemAnim} className="order-btn">
                        <h2 className="text-btn">оставить заявку</h2>
                        <div className="block-for-image">
                            <img src="/img/icons/order-rocket.svg" alt="" />
                        </div>
                    </motion.button>

                </motion.section>

            </motion.section>
        </>
    )

    if (isNested) {
        return content
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="overlay"
                    onClick={onClose}
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

                        <button className="modal-x" onClick={onClose}>
                            <img src="/img/icons/back_btn.svg" alt="назад" />
                            назад
                        </button>

                        {content}

                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    )
}