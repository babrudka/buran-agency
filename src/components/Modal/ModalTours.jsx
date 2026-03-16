import { motion } from "framer-motion"
import { useState } from "react"
import "./Modal.css"

const modalAnim = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.2,
            delayChildren: 0.05,
            staggerChildren: 0.05
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9
    }
}

const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
}

const nestedAnim = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delayChildren: 0.05,
            staggerChildren: 0.07
        }
    },
    exit: { opacity: 0, y: -10 }
}

export default function ModalTours({ tour, onClose, isNested, isFormOpen, setIsFormOpen }) {
    const [localFormOpen, setLocalFormOpen] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    })
    const [errors, setErrors] = useState({})

    if (!tour) return null

    const showForm = isNested ? isFormOpen : localFormOpen

    function setFormState(state) {
        if (isNested && setIsFormOpen) {
            setIsFormOpen(state)
        } else {
            setLocalFormOpen(state)
        }
    }

    function getColor(score) {
        if (score < 3) return 'green';
        if (score < 7) return 'orange';
        return 'red';
    }

    function change(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    function check() {
        let err = {}

        if (formData.name.trim().length < 2)
            err.name = 'введите ваше имя'

        if (formData.phone.trim().length < 6)
            err.phone = 'введите ваш номер телефона'

        if (!formData.email.includes('@') || !formData.email.includes('.'))
            err.email = 'введите вашу электронную почту'

        setErrors(err)
        return Object.keys(err).length === 0
    }

    function send(e) {
        e.preventDefault()
        if (check()) setSubmitted(true)
    }

    function openForm() {
        setFormState(true)
        setSubmitted(false)
        setFormData({ name: '', phone: '', email: '' })
        setErrors({})
    }

    const formContent = (
        <>
            <motion.h1 variants={itemAnim} className="modal-title">
                Оставить заявку
            </motion.h1>

            {submitted ? (
                <motion.div 
                    variants={itemAnim}
                    className="modal-success-message"
                >
                    <h2 className="modal-success-title">Заявка принята</h2>
                    <p className="modal-success-text">
                        Скоро с вами свяжется консультант агенства "Буран"
                    </p>
                </motion.div>
            ) : (
                <motion.form 
                    variants={itemAnim}
                    className="modal-form"
                    onSubmit={send}
                >
                    <div className="modal-form-group">
                        <label className="modal-form-label">Имя</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={change}
                            className={`modal-form-input ${errors.name ? 'error' : ''}`}
                            placeholder="Введите ваше имя"
                        />
                        {errors.name && <span className="modal-error-text">{errors.name}</span>}
                    </div>

                    <div className="modal-form-group">
                        <label className="modal-form-label">Номер телефона</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={change}
                            className={`modal-form-input ${errors.phone ? 'error' : ''}`}
                            placeholder="+7 (999) 999-99-99"
                        />
                        {errors.phone && <span className="modal-error-text">{errors.phone}</span>}
                    </div>

                    <div className="modal-form-group">
                        <label className="modal-form-label">Электронная почта</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={change}
                            className={`modal-form-input ${errors.email ? 'error' : ''}`}
                            placeholder="example@mail.ru"
                        />
                        {errors.email && <span className="modal-error-text">{errors.email}</span>}
                    </div>

                    <motion.button 
                        type="submit"
                        className="modal-btn modal-submit-btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <h2 className="modal-btn-text">
                            Подать заявку
                        </h2>
                        <div className="modal-icon">
                            <img src="/img/icons/order-rocket.svg" alt="" />
                        </div>
                    </motion.button>
                </motion.form>
            )}
        </>
    )

    const content = (
        <>
            <motion.h1 variants={itemAnim} className="modal-title">
                Тур: «{tour.name}»
            </motion.h1>

            <motion.section variants={itemAnim} className="modal-info-block">

                <motion.img
                    variants={itemAnim}
                    src={Array.isArray(tour.tourImages || tour.tourImage) ? (tour.tourImages || tour.tourImage)[tour.tourIndex || 0] : (tour.tourImages || tour.tourImage)}
                    alt="фото тура"
                    className="modal-tour-img"
                />

                <motion.section variants={itemAnim} className="modal-info">

                    <motion.div variants={itemAnim}>
                        <h1 className="modal-label">
                            планета: {tour.planetName}
                        </h1>
                    </motion.div>

                    <motion.section variants={itemAnim} className="modal-score-info">
                        <h1>сложность</h1>

                        <div className={`modal-score-circle `} style={{ borderColor: getColor(tour.score) }}> 
                            <h1 className="modal-score-num">{tour.score}</h1>
                        </div>

                    </motion.section>

                    <motion.p variants={itemAnim} className="modal-text">
                        {tour.desc}
                    </motion.p>
                    
                    {tour.totalDuration && (
                        <motion.div variants={itemAnim} className='modal-duration-block'>
                            <h1 className='modal-hours-label'>
                                продолжительность:
                                <span className="modal-hours"> {tour.totalDuration} ч</span>
                            </h1>
                            <div className="modal-duration-details">
                                <span>Время в пути: {tour.travelTime} ч</span>
                                <span>Время на планете: {tour.stayTime} ч</span>
                            </div>
                        </motion.div>
                    )}
                    
                    <motion.button 
                        variants={itemAnim} 
                        className="modal-btn"
                        onClick={openForm}
                    >
                        <h2 className="modal-btn-text">
                            оставить заявку
                        </h2>
                        <div className="modal-icon">
                            <img src="/img/icons/order-rocket.svg" alt="" />
                        </div>
                    </motion.button>

                </motion.section>

            </motion.section>
        </>
    )

    if (isNested) {
        return (
            <motion.div
                key={tour.name}
                variants={nestedAnim}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
            >
                {showForm ? formContent : content}
            </motion.div>
        )
    }

    return (
        <motion.div
            className="modal-bg"
            onClick={onClose}
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
                    onClick={(e) => {
                        e.stopPropagation()
                        if (showForm) {
                            setFormState(false)
                            setSubmitted(false)
                            setFormData({ name: '', phone: '', email: '' })
                            setErrors({})
                        } else {
                            onClose()
                        }
                    }}
                >
                    <img src="/img/icons/back_btn.svg" alt="назад" />
                    назад
                </button>

                {showForm ? formContent : content}

            </motion.div>

        </motion.div>
    )
}