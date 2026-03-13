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
            when: "beforeChildren",
            delayChildren: 0.2,
            staggerChildren: 0.08
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
            delayChildren: 0.15,
            staggerChildren: 0.07
        }
    },
    exit: { opacity: 0, y: -10 }
}

export default function ModalTours({ tour, onClose, isNested }) {
    const [showForm, setShowForm] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    })
    const [errors, setErrors] = useState({})

    if (!tour) return null

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
        setShowForm(true)
        setSubmitted(false)
        setFormData({ name: '', phone: '', email: '' })
        setErrors({})
    }

    const formContent = (
        <>
            <motion.h1 variants={itemAnim} className="title">
                Оставить заявку
            </motion.h1>

            {submitted ? (
                <motion.div 
                    variants={itemAnim}
                    className="success-message"
                >
                    <h2 className="success-title">Заявка принята</h2>
                    <p className="success-text">
                        Скоро с вами свяжется консультант агенства "Буран"
                    </p>
                </motion.div>
            ) : (
                <motion.form 
                    variants={itemAnim}
                    className="form"
                    onSubmit={send}
                >
                    <div className="form-group">
                        <label className="form-label">Имя</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={change}
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder="Введите ваше имя"
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Номер телефона</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={change}
                            className={`form-input ${errors.phone ? 'error' : ''}`}
                            placeholder="+7 (999) 999-99-99"
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Электронная почта</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={change}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="example@mail.ru"
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <motion.button 
                        type="submit"
                        className="btn submit-btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <h2 className="btn-text">
                            Подать заявку
                        </h2>
                        <div className="icon">
                            <img src="/img/icons/order-rocket.svg" alt="" />
                        </div>
                    </motion.button>
                </motion.form>
            )}
        </>
    )

    const content = (
        <>
            <motion.h1 variants={itemAnim} className="title">
                Тур: «{tour.name}»
            </motion.h1>

            <motion.section variants={itemAnim} className="info-block">

                <motion.img
                    variants={itemAnim}
                    src={tour.tourImage}
                    alt="фото тура"
                    className="tour-img"
                />

                <motion.section variants={itemAnim} className="info">

                    <motion.div variants={itemAnim}>
                        <h1 className="label">
                            планета: {tour.planetName}
                        </h1>
                    </motion.div>

                    <motion.section variants={itemAnim} className="score-info">
                        <h1>сложность</h1>

                        <div className={`score-circle `} style={{ borderColor: getColor(tour.score) }}> 
                            <h1 className="score-num">{tour.score}</h1>
                        </div>

                    </motion.section>

                



                    <motion.p variants={itemAnim} className="text">
                        {tour.desc}
                    </motion.p>
        <motion.h1 variants={itemAnim} className='hours-label'>
                        продолжительность тура:
                        <span className="hours"> 96 ч</span>
                    </motion.h1>
                    <motion.button 
                        variants={itemAnim} 
                        className="btn"
                        onClick={openForm}
                    >

                        <h2 className="btn-text">
                            оставить заявку
                        </h2>

                        <div className="icon">
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
            className="bg"
            onClick={onClose}
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
                    onClick={(e) => {
                        e.stopPropagation()
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