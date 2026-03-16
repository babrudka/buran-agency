import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Header.css'

const NAV_ITEMS = [
	{ id: 'planets', label: 'планеты' },
	{ id: 'tours', label: 'туры' },
	{ id: 'about', label: 'о нас' },
	{ id: 'shop', label: 'экипировка' },
]

export default function Header({ currentView, onNavigate }) {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	function handleNavigation(pageId) {
		setIsMenuOpen(false)
		onNavigate(pageId)
	}

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
				<span className='location-text'>
					Ваша локация: <br></br> Земля
				</span>
			</div>
			<header>
				<img
					src='/img/icons/logo.svg'
					alt='Логотип БУРАН'
					style={{ cursor: 'pointer' }}
					onClick={() => handleNavigation('planets')}
				/>

				<nav className='nav'>
					{NAV_ITEMS.map(item => (
						<a
							key={item.id}
							href='#'
							className={`nav-link${currentView === item.id ? ' active' : ''}`}
						onClick={(event) => { event.preventDefault(); handleNavigation(item.id) }}
					>
						{item.label}
					</a>
				))}
			</nav>

			<button
				className={`menu-btn ${isMenuOpen ? 'active' : ''}`}
				onClick={() => setIsMenuOpen(previousState => !previousState)}
				>
					<span className='line line-1'></span>
					<span className='line line-2'></span>
					<span className='line line-3'></span>
				</button>

				<AnimatePresence>
					{isMenuOpen && (
						<motion.div
							className='menu'
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.18 }}
						>
							<nav className='menu-nav'>
								{NAV_ITEMS.map(item => (
									<a
										key={item.id}
										href='#'
										className={`menu-link${currentView === item.id ? ' active' : ''}`}
										onClick={(event) => { event.preventDefault(); handleNavigation(item.id) }}
									>
										{item.label}
									</a>
								))}
							</nav>
						</motion.div>
					)}
				</AnimatePresence>
			</header>
			<p className='subtitle'>межпланетное туристическое агентство</p>
		</>
	)
}
