import { motion } from "framer-motion"
import { useState } from "react"
import { getScoreColor } from "../../data/planets"
import "./Modal.css"

const popupAnimation = {
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

const fadeInAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
}

const nestedAnimation = {
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
    const setShowForm = isNested ? setIsFormOpen : setLocalFormOpen


    function handleInputChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value })
        setErrors({ ...errors, [event.target.name]: '' })
    }

    function validateForm() {
        const newErrors = {}

        if (formData.name.trim().length < 2)
            newErrors.name = 'введите ваше имя'

        if (formData.phone.trim().length < 6)
            newErrors.phone = 'введите ваш номер телефона'

        if (!formData.email.includes('@') || !formData.email.includes('.'))
            newErrors.email = 'введите вашу электронную почту'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (validateForm()) setSubmitted(true)
    }

    function openForm() {
        setShowForm(true)
        setSubmitted(false)
        setFormData({ name: '', phone: '', email: '' })
        setErrors({})
    }

    const formContent = (
        <>
            <motion.h1 variants={fadeInAnimation} className="modal-title">
                Оставить заявку
            </motion.h1>

            {submitted ? (
                <motion.div 
                    variants={fadeInAnimation}
                    className="modal-success-message"
                >
                    <h2 className="modal-success-title">Заявка принята</h2>
                    <p className="modal-success-text">
                        Скоро с вами свяжется консультант агенства "Буран"
                    </p>
                </motion.div>
            ) : (
                <motion.form 
                    variants={fadeInAnimation}
                    className="modal-form"
                    onSubmit={handleSubmit}
                >
                    <div className="modal-form-group">
                        <label className="modal-form-label">Имя</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
            <motion.h1 variants={fadeInAnimation} className="modal-title">
                Тур: «{tour.name}»
            </motion.h1>

            <motion.section variants={fadeInAnimation} className="modal-info-block">

                <motion.img
                    variants={fadeInAnimation}
                    src={tour.tourImage}
                    alt="фото тура"
                    className="modal-tour-img"
                />

                <motion.section variants={fadeInAnimation} className="modal-info">

                    <motion.div variants={fadeInAnimation}>
                        <h1 className="modal-label">
                            планета: {tour.planetName}
                        </h1>
                    </motion.div>

                    <motion.section variants={fadeInAnimation} className="modal-score-info">
                        <h1>сложность</h1>

                        <div className={`modal-score-circle `} style={{ borderColor: getScoreColor(tour.score) }}> 
                            <h1 className="modal-score-num">{tour.score}</h1>
                        </div>

                    </motion.section>

                    <motion.p variants={fadeInAnimation} className="modal-text">
                        {tour.desc}
                    </motion.p>
                    
                    {tour.totalDuration && (
                        <motion.div variants={fadeInAnimation} className='modal-duration-block'>
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
                        variants={fadeInAnimation} 
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
                variants={nestedAnimation}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(event) => event.stopPropagation()}
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
                variants={popupAnimation}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(event) => event.stopPropagation()}
            >

                <button
                    className="modal-back"
                    onClick={(event) => {
                        event.stopPropagation()
                        if (showForm) {
                            setShowForm(false)
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