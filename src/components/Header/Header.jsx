import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Header.css'

export default function Header({ currentView, onNavigate }) {
	const [menuOpen, setMenuOpen] = useState(false)


	return (
		<>
			<div className='location'>
				<svg
					width='12'
					height='16'
					viewBox='0 0 12 16'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M6 0C2.69 0 0 2.69 0 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6zm0 8.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z'
						fill='rgba(255,255,255,0.4)'
					/>
				</svg>
				<span className='span-loc'>
					Ваша локация: <br></br> Земля
				</span>
			</div>
			<header>
				<img
					src='/img/icons/logo.svg'
					alt='Логотип БУРАН'
					style={{ cursor: 'pointer' }}
					onClick={() => onNavigate('home')}
				/>

				<nav className='nav'>
					<a href='#' className={`nav-link${currentView === 'planets' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); onNavigate('planets') }}>
						планеты
					</a>
					<a href='#' className={`nav-link${currentView === 'tours' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); onNavigate('tours') }}>
						туры
					</a>
				<a href='#' className={`nav-link${currentView === 'about' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); onNavigate('about') }}>
					о нас
				</a>
					<a href='#' className={`nav-link${currentView === 'shop' ? ' active' : ''}`} onClick={(e) => { e.preventDefault(); onNavigate('shop') }}>
						экипировка
					</a>

					<a href='#' id='basket-link' onClick={(e) => { e.preventDefault(); onNavigate('shop') }}>
						<img src='/img/icons/basket.svg' alt='корзина' />
					</a>
				</nav>

				<button
					className={`menu-btn ${menuOpen ? 'active' : ''}`}
					onClick={() => setMenuOpen(prev => !prev)}
				>
					<span className='line line-1'></span>
					<span className='line line-2'></span>
					<span className='line line-3'></span>
				</button>

				<AnimatePresence>
					{menuOpen && (
						<motion.div
							className='menu'
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.18 }}
						>
							<nav className='menu-nav'>
								<a
									href='#'
									onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate('planets') }}
									className={`menu-link${currentView === 'planets' ? ' active' : ''}`}
								>
									планеты
								</a>
								<a
									href='#'
									onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate('tours') }}
									className={`menu-link${currentView === 'tours' ? ' active' : ''}`}
								>
									туры
								</a>
							<a
								href='#'
								onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate('about') }}
								className={`menu-link${currentView === 'about' ? ' active' : ''}`}
							>
								о нас
							</a>
								<a
									href='#'
									onClick={(e) => { e.preventDefault(); setMenuOpen(false); onNavigate('shop') }}
									className={`menu-link${currentView === 'shop' ? ' active' : ''}`}
								>
									экипировка
								</a>
							</nav>
						</motion.div>
					)}
				</AnimatePresence>
			</header>
			<p className='subtitle'>межпланетное туристическое агентство</p>
		</>
	)
}
