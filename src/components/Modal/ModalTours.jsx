import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getScoreColor } from "../../data/planets"
import { TourRatingBadge } from "../TourReviews/TourReviews"
import { TourReviewsPanel } from "../TourReviews/TourReviews"
import { items } from "../../data/items"
import { ShopCard } from "../Shop/Shop.jsx"
import "../Shop/Shop.css"
import "./Modal.css"
import "./ModalTours.css"

const popupAnim = {
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

const fadeAnim = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -14 }
}

const nestedAnim = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delayChildren: 0.05,
            staggerChildren: 0.06
        }
    },
    exit: { opacity: 0, y: -10 }
}

export default function ModalTours({ tour, onClose, isNested, isFormOpen, setIsFormOpen, onGoToShop }) {
    const [localFormOpen, setLocalFormOpen] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
    const [formErrors, setFormErrors] = useState({})
    const [cartItems, setCartItems] = useState([])

    if (!tour) return null

    const formOpen = isNested ? isFormOpen : localFormOpen
    const setFormOpen = isNested ? setIsFormOpen : setLocalFormOpen
    const gearList = (tour.recommendedGearIds || [])
        .map(itemId => items.find(item => item.id === itemId))
        .filter(Boolean)
        .slice(0, 3)

    useEffect(() => {
        try {
            const saved = localStorage.getItem("buran-cart")
            setCartItems(saved ? JSON.parse(saved) : [])
        } catch {
            setCartItems([])
        }
    }, [])

    function handleInputChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setFormErrors({ ...formErrors, [e.target.name]: '' })
    }

    function validateForm() {
        const err = {}
        if (formData.name.trim().length < 2) err.name = 'введите ваше имя'
        if (formData.phone.trim().length < 6) err.phone = 'введите номер телефона'
        if (!formData.email.includes('@') || !formData.email.includes('.')) err.email = 'введите электронную почту'
        setFormErrors(err)
        return Object.keys(err).length === 0
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (validateForm()) setIsSubmitted(true)
    }

    function openForm() {
        setFormOpen(true)
        setIsSubmitted(false)
        setFormData({ name: '', phone: '', email: '' })
        setFormErrors({})
    }

    function persistCart(next) {
        localStorage.setItem("buran-cart", JSON.stringify(next))
        setCartItems(next)
    }

    function addToCart(item, size) {
        const key = item.id + (size || "")
        const existing = cartItems.find(c => c.key === key)
        const next = existing
            ? cartItems.map(c => c.key === key ? { ...c, qty: c.qty + 1 } : c)
            : [...cartItems, {
                key,
                id: item.id,
                name: item.name,
                icon: item.icon,
                img: item.img,
                price: item.price,
                size: size || null,
                qty: 1
            }]
        persistCart(next)
    }

    function removeOneKey(key) {
        const found = cartItems.find(c => c.key === key)
        if (!found) return
        const next = found.qty > 1
            ? cartItems.map(c => c.key === key ? { ...c, qty: c.qty - 1 } : c)
            : cartItems.filter(c => c.key !== key)
        persistCart(next)
    }

    function removeAllKey(key) {
        persistCart(cartItems.filter(c => c.key !== key))
    }

    const difficultyColor = getScoreColor(tour.score)

    const formBlock = (
        <div className="tour-wrap">
            <motion.h1 variants={fadeAnim} className="booking-title">
                Оставить заявку
            </motion.h1>

            {isSubmitted ? (
                <motion.div variants={fadeAnim} className="booking-success">
                    <h2 className="booking-success-title">Заявка принята</h2>
                    <p className="booking-success-text">
                        Скоро с вами свяжется консультант агентства «Буран»
                    </p>
                </motion.div>
            ) : (
                <motion.form variants={fadeAnim} className="booking-form" onSubmit={handleSubmit}>
                    <div className="booking-field">
                        <label className="booking-label">Имя</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`booking-input ${formErrors.name ? 'error' : ''}`}
                            placeholder="Введите ваше имя"
                        />
                        {formErrors.name && <span className="booking-error">{formErrors.name}</span>}
                    </div>
                    <div className="booking-field">
                        <label className="booking-label">Телефон</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`booking-input ${formErrors.phone ? 'error' : ''}`}
                            placeholder="+7 (999) 999-99-99"
                        />
                        {formErrors.phone && <span className="booking-error">{formErrors.phone}</span>}
                    </div>
                    <div className="booking-field">
                        <label className="booking-label">Почта</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`booking-input ${formErrors.email ? 'error' : ''}`}
                            placeholder="example@mail.ru"
                        />
                        {formErrors.email && <span className="booking-error">{formErrors.email}</span>}
                    </div>
                    <motion.button
                        type="submit"
                        className="modal-btn modal-submit-btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <h2 className="modal-btn-text">Подать заявку</h2>
                        <div className="modal-icon">
                            <img src="/img/icons/order-rocket.svg" alt="" />
                        </div>
                    </motion.button>
                </motion.form>
            )}
        </div>
    )

    const mainBlock = (
        <div className="tour-wrap">

            <motion.div variants={fadeAnim} className="tour-banner">
                {tour.tourImage && (
                    <img className="tour-banner-image" src={tour.tourImage} alt="" />
                )}
                <div className="tour-banner-overlay">
                    <h1 className="tour-title">«{tour.name}»</h1>
                </div>
            </motion.div>

            <motion.div variants={fadeAnim} className="tour-info-row">
                <div className="tour-planet">
                    <span className="tour-planet-label">Планета</span>
                    <span className="tour-planet-name">{tour.planetName}</span>
                </div>

                <div className="tour-right">
                    {tour.tourReviews?.rating != null && (
                        <TourRatingBadge rating={tour.tourReviews.rating} />
                    )}

                </div>
            </motion.div>

            <div className="tour-divider" />

            <motion.p variants={fadeAnim} className="tour-description">
                {tour.desc}
            </motion.p>

            {tour.totalDurationStr && (
                <motion.div variants={fadeAnim} className="tour-timing">
                    <div className="tour-timing-item">
                        <span className="tour-timing-value">{tour.travelTimeStr}</span>
                        <span className="tour-timing-label">в пути</span>
                    </div>
                    <div className="tour-timing-item">
                        <span className="tour-timing-value">{tour.stayTimeStr}</span>
                        <span className="tour-timing-label">на планете</span>
                    </div>
                    <div className="tour-timing-item">
                        <span className="tour-timing-value">{tour.totalDurationStr}</span>
                        <span className="tour-timing-label">всего</span>
                    </div>
                </motion.div>
            )}

            {tour.tourReviews?.reviews?.length > 0 && (
                <motion.div variants={fadeAnim} className="tour-reviews-wrap">
                    <h3 className="tour-section-title">отзывы</h3>
                    <TourReviewsPanel data={tour.tourReviews} compact />
                </motion.div>
            )}

            {gearList.length > 0 && (
                <motion.section variants={fadeAnim} className="tour-gear-wrap">
                    <h3 className="tour-section-title">рекомендуемая экипировка</h3>
                    <div className="tour-gear-list">
                        {gearList.map((g, gearIndex) => (
                            <ShopCard
                                key={g.id}
                                item={g}
                                index={gearIndex}
                                cart={cartItems}
                                onAdd={addToCart}
                                onRemoveOne={removeOneKey}
                                onRemoveAll={removeAllKey}
                            />
                        ))}
                    </div>
                    {typeof onGoToShop === "function" && (
                        <button type="button" className="tour-catalog-btn" onClick={onGoToShop}>
                            перейти в каталог экипировки
                        </button>
                    )}
                </motion.section>
            )}

            <motion.button
                variants={fadeAnim}
                className="modal-btn"
                onClick={openForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <h2 className="modal-btn-text">оставить заявку</h2>
                <div className="modal-icon">
                    <img src="/img/icons/order-rocket.svg" alt="" />
                </div>
            </motion.button>
        </div>
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
                {formOpen ? formBlock : mainBlock}
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
                className="modal-popup modal-popup--tour"
                variants={popupAnim}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="modal-back"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (formOpen) {
                            setFormOpen(false)
                            setIsSubmitted(false)
                            setFormData({ name: '', phone: '', email: '' })
                            setFormErrors({})
                        } else {
                            onClose()
                        }
                    }}
                >
                    <img src="/img/icons/Arrow-btn.svg" alt="Назад" />
                </button>
                {formOpen ? formBlock : mainBlock}
            </motion.div>
        </motion.div>
    )
}
