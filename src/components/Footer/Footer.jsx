import './Footer.css'

export default function Footer() {
	return (
		<footer className='footer'>
			<div className='footer-inner'>

			<div className='footer-brand'>
					<img className='footer-logo' src='/img/icons/logo.svg' alt='БУРАН' />
					<p className='footer-tagline'>
						межпланетное<br />туристическое агентство
					</p>
					<p className='footer-copy'>© 2026 БУРАН. Все права защищены.</p>
				</div>

			<div className='footer-col'>
					<div className='footer-col-title'>Контакты</div>

					<div className='footer-col-item'>
						<svg fill="#ffffff" width="14px" height="14px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"></path></g></svg>
						Основатель агенства: Макаров Тимофей Александрович
					</div>

					<div className='footer-col-item'>
						<svg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z' fill='currentColor'/>
						</svg>
						Планета Земля, Космопорт «Байконур-2»
					</div>

					<div className='footer-col-item'>
						<svg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z' fill='currentColor'/>
						</svg>
						+7 (1961) 12 04 61
					</div>

					<div className='footer-col-item'>
						<svg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' fill='currentColor'/>
						</svg>
						tima.makrov222@gmail.com
					</div>
				</div>

			<div className='footer-col'>
					<div className='footer-col-title'>Информация</div>

					<div className='footer-col-item'>
						<svg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z' fill='currentColor'/>
						</svg>
						Пн — Вс: 06:00 — 00:00 
					</div>

					<div className='footer-col-item'>
						<svg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-2z' fill='currentColor'/>
						</svg>
						Лицензия №19081960
					</div>


				</div>

				<div className='footer-divider' />

			<div className='footer-bottom'>
					<span>Сделано на орбите Земли</span>
					<div className='footer-bottom-links'>
						<a>Условия полётов</a>
					</div>
				</div>

			</div>
		</footer>
	)
}
