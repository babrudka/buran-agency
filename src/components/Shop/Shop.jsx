import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { items, categories } from '../../data/items'
import Footer from '../Footer/Footer'
import './Shop.css'
import '../Modal/Modal.css'

function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽'
}

function loadCart() {
    try {
        const saved = localStorage.getItem('buran-cart')
        if (saved) return JSON.parse(saved)
    } catch {
    }
    return []
}

function saveCart(cart) {
    localStorage.setItem('buran-cart', JSON.stringify(cart))
}

export default function Shop() {
    const [activeCategory, setActiveCategory] = useState('все')
    const [cart, setCart] = useState(loadCart)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isOrderOpen, setIsOrderOpen] = useState(false)
    const [orderSubmitted, setOrderSubmitted] = useState(false)
    const [orderData, setOrderData] = useState({ name: '', phone: '', email: '' })
    const [orderErrors, setOrderErrors] = useState({})

    useEffect(() => {
        saveCart(cart)
    }, [cart])

    const filteredItems = activeCategory === 'все'
        ? items
        : items.filter(item => item.category === activeCategory)

    function addToCart(item, size) {
        const key = item.id + (size || '')
        setCart(previousCart => {
            const existingItem = previousCart.find(cartItem => cartItem.key === key)
            if (existingItem) {
                return previousCart.map(cartItem =>
                    cartItem.key === key ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
                )
            }
            return [...previousCart, {
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

    }

    function addOneMore(cartItem) {
        const originalItem = items.find(storeItem => storeItem.id === cartItem.id)
        if (originalItem) {
            addToCart(originalItem, cartItem.size)
        }
    }

    function removeOne(key) {
        setCart(previousCart => {
            const foundItem = previousCart.find(cartItem => cartItem.key === key)
            if (foundItem && foundItem.qty > 1) {
                return previousCart.map(cartItem =>
                    cartItem.key === key ? { ...cartItem, qty: cartItem.qty - 1 } : cartItem
                )
            }
            return previousCart.filter(cartItem => cartItem.key !== key)
        })
    }

    function removeAll(key) {
        setCart(previousCart => previousCart.filter(cartItem => cartItem.key !== key))
    }

    function clearCart() {
        setCart([])
    }

    const totalItemsCount = cart.reduce((sum, cartItem) => sum + cartItem.qty, 0)
    const totalPrice = cart.reduce((sum, cartItem) => sum + cartItem.price * cartItem.qty, 0)

    function openOrder() {
        setIsCartOpen(false)
        setIsOrderOpen(true)
        setOrderSubmitted(false)
        setOrderData({ name: '', phone: '', email: '' })
        setOrderErrors({})
    }

    function handleOrderInput(event) {
        setOrderData({ ...orderData, [event.target.name]: event.target.value })
        setOrderErrors({ ...orderErrors, [event.target.name]: '' })
    }

    function validateOrder() {
        const validationErrors = {}
        if (orderData.name.trim().length < 2) validationErrors.name = 'введите ваше имя'
        if (orderData.phone.trim().length < 6) validationErrors.phone = 'введите ваш номер телефона'
        if (!orderData.email.includes('@') || !orderData.email.includes('.')) validationErrors.email = 'введите вашу электронную почту'
        setOrderErrors(validationErrors)
        return Object.keys(validationErrors).length === 0
    }

    function handleOrderSubmit(event) {
        event.preventDefault()
        if (validateOrder()) {
            setOrderSubmitted(true)
            clearCart()
        }
    }

    return (
        <div className='shop'>

            <button className='cart-btn' onClick={() => setIsCartOpen(!isCartOpen)}>
                <img className='cart-btn-icon' src='/img/icons/cart.svg' alt='' />
                Корзина
                {totalItemsCount > 0 && (
                    <span className='cart-badge'>{totalItemsCount}</span>
                )}
            </button>

            <div className='shop-header'>
                <h1 className='shop-title'>Магазин экипировки</h1>
                <p className='shop-subtitle'>
                    Всё для вашего космического путешествия
                </p>
            </div>

            <div className='shop-categories'>
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`shop-category-btn ${activeCategory === category.id ? 'shop-category-btn--active' : ''}`}
                        onClick={() => setActiveCategory(category.id)}
                    >
                        <img className='shop-category-icon' src={category.icon} alt='' />
                        {category.name}
                    </button>
                ))}
            </div>

            <div className='shop-grid'>
                {filteredItems.map((item, itemIndex) => (
                    <ShopCard
                        key={item.id}
                        item={item}
                        index={itemIndex}
                        onAdd={addToCart}
                        cart={cart}
                        onRemoveOne={removeOne}
                        onRemoveAll={removeAll}
                    />
                ))}
            </div>

            <Footer />

            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            className='cart-overlay'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
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
                                <button className='cart-close' onClick={() => setIsCartOpen(false)}>✕</button>
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
                                        {cart.map(cartItem => (
                                            <div className='cart-item' key={cartItem.key}>
                                                {cartItem.img
                                                    ? <img className='cart-item-img' src={cartItem.img} alt={cartItem.name} />
                                                    : <img className='cart-item-icon' src={cartItem.icon} alt={cartItem.name} />
                                                }
                                                <div className='cart-item-info'>
                                                    <div className='cart-item-name'>
                                                        {cartItem.name}
                                                        {cartItem.size && <span className='cart-item-size'> ({cartItem.size})</span>}
                                                    </div>
                                                    <div className='cart-item-price'>{formatPrice(cartItem.price)}</div>
                                                </div>
                                                <div className='cart-item-controls'>
                                                    <button className='qty-btn' onClick={() => removeOne(cartItem.key)}>−</button>
                                                    <span className='qty-num'>{cartItem.qty}</span>
                                                    <button className='qty-btn' onClick={() => addOneMore(cartItem)}>+</button>
                                                    <button className='del-btn' onClick={() => removeAll(cartItem.key)}>✕</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className='cart-bottom'>
                                        <div className='cart-total'>
                                            <span>Итого:</span>
                                            <span className='cart-total-price'>{formatPrice(totalPrice)}</span>
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
                {isOrderOpen && (
                    <motion.div
                        className='modal-bg'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOrderOpen(false)}
                    >
                        <motion.div
                            className='modal-popup'
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <button
                                className='modal-back'
                                onClick={() => setIsOrderOpen(false)}
                            >
                                <img src='/img/icons/Arrow-btn.svg' alt='Назад' />
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
                                    onSubmit={handleOrderSubmit}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className='modal-form-group'>
                                        <label className='modal-form-label'>Имя</label>
                                        <input
                                            type='text'
                                            name='name'
                                            value={orderData.name}
                                            onChange={handleOrderInput}
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
                                            onChange={handleOrderInput}
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
                                            onChange={handleOrderInput}
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

export function ShopCard({ item, index, onAdd, cart, onRemoveOne, onRemoveAll }) {
    const [selectedSize, setSelectedSize] = useState(
        item.sizes ? item.sizes[Math.floor(item.sizes.length / 2)] : null
    )

    const cartKey = item.id + (selectedSize || '')
    const itemInCart = cart.find(cartItem => cartItem.key === cartKey)
    const quantity = itemInCart ? itemInCart.qty : 0

    return (
        <motion.div
            className='shop-card'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
        >
            {item.img ? (
                <div className='shop-card-img-wrap'>
                    <img className='shop-card-img' src={item.img} alt={item.name} loading='lazy' />
                </div>
            ) : (
                <div className='shop-card-img-wrap shop-card-img-wrap--emoji'>
                    <img className='shop-card-icon' src={item.icon} alt={item.name} loading='lazy' />
                </div>
            )}

            <div className='shop-card-top'>
                <div className='shop-card-info'>
                    <div className='shop-card-name'>{item.name}</div>
                    <div className='shop-card-cat'>{item.category}</div>
                    <div className='shop-card-price'>{formatPrice(item.price)}</div>
                </div>
            </div>

            <div className='shop-card-details'>
                <p className='shop-card-desc'>{item.desc}</p>
            </div>

            {item.sizes && (
                <div className='shop-sizes'>
                    {item.sizes.map(size => (
                        <button
                            key={size}
                            className={`size-btn ${selectedSize === size ? 'size-btn--active' : ''}`}
                            onClick={() => setSelectedSize(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            )}

            {quantity > 0 ? (
                <div className='card-cart-controls'>
                    <div className='card-qty-row'>
                        <button
                            className='card-qty-btn'
                            onClick={() => onRemoveOne(cartKey)}
                        >
                            −
                        </button>
                        <span className='card-qty-num'>{quantity}</span>
                        <button
                            className='card-qty-btn'
                            onClick={() => onAdd(item, selectedSize)}
                        >
                            +
                        </button>
                    </div>
                    <button
                        className='card-remove-btn'
                        onClick={() => onRemoveAll(cartKey)}
                    >
                        Убрать из корзины
                    </button>
                </div>
            ) : (
                <button
                    className='add-btn'
                    onClick={() => onAdd(item, selectedSize)}
                >
                    В корзину
                </button>
            )}
        </motion.div>
    )
}