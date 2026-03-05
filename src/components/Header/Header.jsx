import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "./Header.css"

export default function Header() {

  const [isBurgerOpen, setBurgerOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 790) setBurgerOpen(false)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <header>

      <img src="/img/icons/logo.svg" alt="Логотип БУРАН" />

      <nav className="header-nav">
        <a href="#" className="header-link">планеты</a>
        <a href="#" className="header-link">туры</a>
        <a href="#" className="header-link">о нас</a>
        <a href="#" className="header-link">экипировка</a>

        <a href="#" id="basket-link">
          <img src="/img/icons/basket.svg" alt="корзина" />
        </a>
      </nav>

      <button
        className={`burger-btn ${isBurgerOpen ? "active" : ""}`}
        onClick={() => setBurgerOpen(prev => !prev)}
      >
        <span className="line line-1"></span>
        <span className="line line-2"></span>
        <span className="line line-3"></span>
      </button>

      <AnimatePresence>
        {isBurgerOpen && (
          <motion.div
            className="burger-menu"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
          >
            <nav className="burger-nav">
              <a href="#" onClick={()=>setBurgerOpen(false)} className="burger-link">планеты</a>
              <a href="#" onClick={()=>setBurgerOpen(false)} className="burger-link">туры</a>
              <a href="#" onClick={()=>setBurgerOpen(false)} className="burger-link">о нас</a>
              <a href="#" onClick={()=>setBurgerOpen(false)} className="burger-link">экипировка</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}