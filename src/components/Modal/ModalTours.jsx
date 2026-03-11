import { AnimatePresence, motion } from "framer-motion"
import "./Modal.css"

export default function ModalTours({ tour, isOpen, onClose, isNested }) {
    const content = (
        <>
            <h1 className="tour-name-title">Тур: «{tour?.name}»</h1>
            <section className="desc-tour-block">
                <img src={tour?.tourImage} alt="фото тура" />
                <section className="section-of-title">
                    <div>
                        <h1 className="title-tour">планета: <span className="underbar">{tour?.planetName}</span></h1>
                    </div>
                    <section className="score-of-tour">
                        <h1>сложность</h1>
                        <div className={`planet-score-block ${tour.score >= 5 ? "red" : "green"}`}>
                            <h1 className="planet-score-num">{tour.score}</h1>
                        </div>
                    </section>
                    <h1>продолжительность тура: <span className="par">96 часов</span></h1>
                    <p className="parag-title">подробнее о туре</p>
                    <p className="desc-of-tour">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta amet dolores rerum officia quisquam rem quia fugit aliquam beatae, ipsum libero, dignissimos suscipit ab inventore! Maxime quis deleniti repudiandae asperiores! Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, esse facilis odio in nostrum omnis impedit natus voluptatibus </p>
                    <button className="order-btn">
                        <h2 className="text-btn">оставить заявку</h2>
                        <div className="block-for-image"><img src="/img/icons/order-rocket.svg" alt="" /></div>
                    </button>
                </section>
            </section>
        </>
    )

    if (isNested) {
        if (!tour) return null
        return content
    }

    return (
        <AnimatePresence>
            {isOpen && tour && (
                <motion.div
                    className="overlay"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
                        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
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