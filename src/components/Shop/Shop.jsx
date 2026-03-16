import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { items, categories } from '../../data/items'
import Footer from '../Footer/Footer'
import './Shop.css'
import '../Modal/Modal.css'

function showPrice(num) {
    return num.toLocaleString('ru-RU') + ' ₽'
}

function loadCart() {
    try {
        const saved = localStorage.getItem('buran-cart')
        if (saved) return JSON.parse(saved)
    } catch (e) {
    }
    return []
}

function saveCart(cart) {
    localStorage.setItem('buran-cart', JSON.stringify(cart))
}

export default function Shop() {
    const [cat, setCat] = useState('все')
    const [cart, setCart] = useState(loadCart)
    const [cartOpen, setCartOpen] = useState(false)
    const [addedId, setAddedId] = useState(null)
    const [orderOpen, setOrderOpen] = useState(false)
    const [orderSubmitted, setOrderSubmitted] = useState(false)
    const [orderData, setOrderData] = useState({ name: '', phone: '', email: '' })
    const [orderErrors, setOrderErrors] = useState({})

    useEffect(() => {
        saveCart(cart)
    }, [cart])

    const shown = cat === 'все'
        ? items
        : items.filter(item => item.category === cat)

    function addToCart(item, size) {
        const key = item.id + (size || '')
        setCart(prev => {
            const exists = prev.find(c => c.key === key)
            if (exists) {
                return prev.map(c =>
                    c.key === key ? { ...c, qty: c.qty + 1 } : c
                )
            }
            return [...prev, {
                key,
                id: item.id,
                name: item.name,
                icon: item.icon,
                img: item.img,
                price: item.price,
                size: size || null,
                qty: 1
            }]
        })

        setAddedId(key)
        setTimeout(() => setAddedId(null), 800)
    }

    function removeOne(key) {
        setCart(prev => {
            const item = prev.find(c => c.key === key)
            if (item && item.qty > 1) {
                return prev.map(c =>
                    c.key === key ? { ...c, qty: c.qty - 1 } : c
                )
            }
            return prev.filter(c => c.key !== key)
        })
    }

    function removeAll(key) {
        setCart(prev => prev.filter(c => c.key !== key))
    }

    function clearCart() {
        setCart([])
    }

    const totalItems = cart.reduce((s, c) => s + c.qty, 0)
    const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0)

    function openOrder() {
        setOrderOpen(true)
        setOrderSubmitted(false)
        setOrderData({ name: '', phone: '', email: '' })
        setOrderErrors({})
    }

    function changeOrder(e) {
        setOrderData({ ...orderData, [e.target.name]: e.target.value })
        setOrderErrors({ ...orderErrors, [e.target.name]: '' })
    }

    function checkOrder() {
        let err = {}
        if (orderData.name.trim().length < 2) err.name = 'введите ваше имя'
        if (orderData.phone.trim().length < 6) err.phone = 'введите ваш номер телефона'
        if (!orderData.email.includes('@') || !orderData.email.includes('.')) err.email = 'введите вашу электронную почту'
        setOrderErrors(err)
        return Object.keys(err).length === 0
    }

    function sendOrder(e) {
        e.preventDefault()
        if (checkOrder()) {
            setOrderSubmitted(true)
            clearCart()
        }
    }

    return (
        <div className='shop'>

            <button className='cart-btn' onClick={() => setCartOpen(!cartOpen)}>
                <img className='cart-btn-icon' src='/img/icons/cart.svg' alt='' />
                Корзина
                {totalItems > 0 && (
                    <span className='cart-badge'>{totalItems}</span>
                )}
            </button>

            <div className='shop-header'>
                <h1 className='shop-title'>Магазин экипировки</h1>
                <p className='shop-subtitle'>
                    Всё для вашего космического путешествия
                </p>
            </div>

            <div className='shop-cats'>
                {categories.map(c => (
                    <button
                        key={c.id}
                        className={`shop-cat ${cat === c.id ? 'shop-cat--on' : ''}`}
                        onClick={() => setCat(c.id)}
                    >
                        <img className='shop-cat-icon' src={c.icon} alt='' />
                        {c.name}
                    </button>
                ))}
            </div>

            <div className='shop-grid'>
                {shown.map((item, i) => (
                    <ShopCard
                        key={item.id}
                        item={item}
                        index={i}
                        onAdd={addToCart}
                        addedId={addedId}
                        cart={cart}
                        onRemoveOne={removeOne}
                        onRemoveAll={removeAll}
                    />
                ))}
            </div>

            <Footer />

            <AnimatePresence>
                {cartOpen && (
                    <>
                        <motion.div
                            className='cart-overlay'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCartOpen(false)}
                        />
                        <motion.div
                            className='cart-panel'
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <div className='cart-top'>
                                <h2 className='cart-title'>
                                    <img className='cart-title-icon' src='/img/icons/cart.svg' alt='' />
                                    Корзина
                                </h2>
                                <button className='cart-close' onClick={() => setCartOpen(false)}>✕</button>
                            </div>

                            {cart.length === 0 ? (
                                <div className='cart-empty'>
                                    <img className='cart-empty-icon' src='/img/icons/first-rocket.svg' alt='' />
                                    <p>Корзина пуста</p>
                                    <p className='cart-empty-hint'>Здесь будут выбранные товары из каталога экипировки</p>
                                </div>
                            ) : (
                                <>
                                    <div className='cart-list'>
                                        {cart.map(c => (
                                            <div className='cart-item' key={c.key}>
                                                {c.img
                                                    ? <img className='cart-item-img' src={c.img} alt={c.name} />
                                                    : <img className='cart-item-icon' src={c.icon} alt={c.name} />
                                                }
                                                <div className='cart-item-info'>
                                                    <div className='cart-item-name'>
                                                        {c.name}
                                                        {c.size && <span className='cart-item-size'> ({c.size})</span>}
                                                    </div>
                                                    <div className='cart-item-price'>{showPrice(c.price)}</div>
                                                </div>
                                                <div className='cart-item-controls'>
                                                    <button className='qty-btn' onClick={() => removeOne(c.key)}>−</button>
                                                    <span className='qty-num'>{c.qty}</span>
                                                    <button className='qty-btn' onClick={() => addToCart(items.find(it => it.id === c.id), c.size)}>+</button>
                                                    <button className='del-btn' onClick={() => removeAll(c.key)}>✕</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='cart-bottom'>
                                        <div className='cart-total'>
                                            <span>Итого:</span>
                                            <span className='cart-total-price'>{showPrice(totalPrice)}</span>
                                        </div>
                                        <button className='cart-order-btn' onClick={openOrder}>

                                            Оформить заказ
                                        </button>
                                        <button className='cart-clear-btn' onClick={clearCart}>
                                            Очистить корзину
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {orderOpen && (
                    <motion.div
                        className='modal-bg'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOrderOpen(false)}
                    >
                        <motion.div
                            className='modal-popup'
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className='modal-back'
                                onClick={() => setOrderOpen(false)}
                            >
                                <img src='/img/icons/back_btn.svg' alt='назад' />
                                назад
                            </button>

                            <motion.h1
                                className='modal-title'
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Оформить заказ
                            </motion.h1>

                            {orderSubmitted ? (
                                <motion.div
                                    className='modal-success-message'
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <h2 className='modal-success-title'>Заказ принят</h2>
                                    <p className='modal-success-text'>
                                        Скоро с вами свяжется курьер агенства "Буран"
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    className='modal-form'
                                    onSubmit={sendOrder}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className='modal-form-group'>
                                        <label className='modal-form-label'>Имя</label>
                                        <input
                                            type='text'
                                            name='name'
                                            value={orderData.name}
                                            onChange={changeOrder}
                                            className={`modal-form-input ${orderErrors.name ? 'error' : ''}`}
                                            placeholder='Введите ваше имя'
                                        />
                                        {orderErrors.name && <span className='modal-error-text'>{orderErrors.name}</span>}
                                    </div>

                                    <div className='modal-form-group'>
                                        <label className='modal-form-label'>Номер телефона</label>
                                        <input
                                            type='tel'
                                            name='phone'
                                            value={orderData.phone}
                                            onChange={changeOrder}
                                            className={`modal-form-input ${orderErrors.phone ? 'error' : ''}`}
                                            placeholder='+7 (999) 999-99-99'
                                        />
                                        {orderErrors.phone && <span className='modal-error-text'>{orderErrors.phone}</span>}
                                    </div>

                                    <div className='modal-form-group'>
                                        <label className='modal-form-label'>Электронная почта</label>
                                        <input
                                            type='email'
                                            name='email'
                                            value={orderData.email}
                                            onChange={changeOrder}
                                            className={`modal-form-input ${orderErrors.email ? 'error' : ''}`}
                                            placeholder='example@mail.ru'
                                        />
                                        {orderErrors.email && <span className='modal-error-text'>{orderErrors.email}</span>}
                                    </div>

                                    <motion.button
                                        type='submit'
                                        className='modal-btn modal-submit-btn'
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <h2 className='modal-btn-text'>
                                            Сделать заказ
                                        </h2>
                                        <div className='modal-icon'>
                                            <img src='/img/icons/order-rocket.svg' alt='' />
                                        </div>
                                    </motion.button>
                                </motion.form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function ShopCard({ item, index, onAdd, addedId, cart, onRemoveOne, onRemoveAll }) {
    const [pickedSize, setPickedSize] = useState(
        item.sizes ? item.sizes[Math.floor(item.sizes.length / 2)] : null
    )

    const key = item.id + (pickedSize || '')
    const justAdded = addedId === key

    const inCart = cart.find(c => c.key === key)
    const qty = inCart ? inCart.qty : 0

    return (
        <motion.div
            className='shop-card'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
        >
            {item.img ? (
                <div className='shop-card-img-wrap'>
                    <img className='shop-card-img' src={item.img} alt={item.name} />
                </div>
            ) : (
                <div className='shop-card-img-wrap shop-card-img-wrap--emoji'>
                    <img className='shop-card-icon' src={item.icon} alt={item.name} />
                </div>
            )}

            <div className='shop-card-top'>
                <div className='shop-card-info'>
                    <div className='shop-card-name'>{item.name}</div>
                    <div className='shop-card-cat'>{item.category}</div>
                    <div className='shop-card-price'>{showPrice(item.price)}</div>
                </div>
            </div>

            <div className='shop-card-details'>
                <p className='shop-card-desc'>{item.desc}</p>
            </div>

            {item.sizes && (
                <div className='shop-sizes'>
                    {item.sizes.map(s => (
                        <button
                            key={s}
                            className={`size-btn ${pickedSize === s ? 'size-btn--on' : ''}`}
                            onClick={() => setPickedSize(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {qty > 0 ? (
                <div className='card-cart-controls'>
                    <div className='card-qty-row'>
                        <button
                            className='card-qty-btn'
                            onClick={() => onRemoveOne(key)}
                        >
                            −
                        </button>
                        <span className='card-qty-num'>{qty}</span>
                        <button
                            className='card-qty-btn'
                            onClick={() => onAdd(item, pickedSize)}
                        >
                            +
                        </button>
                    </div>
                    <button
                        className='card-remove-btn'
                        onClick={() => onRemoveAll(key)}
                    >
                        Убрать из корзины
                    </button>
                </div>
            ) : (
                <button
                    className={`add-btn ${justAdded ? 'add-btn--done' : ''}`}
                    onClick={() => onAdd(item, pickedSize)}
                >
                    {justAdded ? '✓ Добавлено!' : 'В корзину'}
                </button>
            )}
        </motion.div>
    )
}
