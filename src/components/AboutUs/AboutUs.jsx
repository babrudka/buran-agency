import { useEffect, useRef, useCallback } from 'react'
import './AboutUs.css'

// Хук: добавляет класс 'show' когда элемент появляется на экране
function useShow(margin = '-40px') {
	const ref = useRef(null)

	useEffect(() => {
		const element = ref.current
		if (!element) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					element.classList.add('show')
					observer.unobserve(element)
				}
			},
			{ rootMargin: margin }
		)

		observer.observe(element)
		return () => observer.disconnect()
	}, [margin])

	return ref
}

function FadeUp({ children, delay = 0, className = '' }) {
	const ref = useShow()
	return (
		<div
			ref={ref}
			className={`fade-up ${className}`}
			style={{ transitionDelay: `${delay}s` }}
		>
			{children}
		</div>
	)
}

function SlideIn({ children, from = 'left', delay = 0, className = '' }) {
	const ref = useShow()
	const dir = from === 'left' ? 'slide-left' : 'slide-right'
	return (
		<div
			ref={ref}
			className={`${dir} ${className}`}
			style={{ transitionDelay: `${delay}s` }}
		>
			{children}
		</div>
	)
}

// Компонент: анимированный счётчик от 0 до end при появлении на экране
function CountNum({ end, suffix = '' }) {
	const ref = useRef(null)
	const alreadyCounted = useRef(false)

	// Функция запуска анимации счёта
	const startCounting = useCallback(() => {
		const element = ref.current
		if (!element || alreadyCounted.current) return
		alreadyCounted.current = true

		const totalSteps = 30           // сколько шагов до конца
		const intervalMs = 40           // миллисекунд между шагами
		let currentStep = 0

		const timer = setInterval(() => {
			currentStep++
			// Простой расчёт: текущее значение = доля пройденных шагов × конечное значение
			const progress = currentStep / totalSteps
			const currentValue = Math.round(progress * end)
			element.textContent = currentValue + suffix

			if (currentStep >= totalSteps) {
				clearInterval(timer)
				element.textContent = end + suffix  // гарантируем точное конечное значение
			}
		}, intervalMs)
	}, [end, suffix])

	// Наблюдатель: запускаем счёт когда элемент появляется на экране
	useEffect(() => {
		const element = ref.current
		if (!element) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					startCounting()
					observer.unobserve(element)
				}
			},
			{ rootMargin: '-20px' }
		)

		observer.observe(element)
		return () => observer.disconnect()
	}, [startCounting])

	return <span ref={ref} className='count-num'>0</span>
}

export default function AboutUs() {
	return (
		<div className='about-wrap'>

			<section className='about-hero'>
				<div className='about-hero-glow' />
				<img
					className='about-logo-big hero-pop'
					src='/img/icons/logo.svg'
					alt='БУРАН'
				/>
				<h1 className='about-title hero-pop delay-1'>О компании</h1>
				<p className='about-subtitle hero-pop delay-2'>
					межпланетное туристическое агентство
				</p>
				<div className='scroll-hint hero-pop delay-3'>
					<span className='bounce-arrow'>↓</span>
				</div>
			</section>

			<section className='about-section'>
				<FadeUp className='section-header'>
					<span className='section-num'>01</span>
					<h2 className='section-title'>Наша история</h2>
				</FadeUp>

				<SlideIn from='left' delay={0.1}>
					<p className='about-text'>
						История компании <span className='hl'>«БУРАН»</span> начинается с эпохи великих космических открытий —
						времени, когда человечество впервые поднялось к звёздам.
					</p>
				</SlideIn>

				<SlideIn from='right' delay={0.2}>
					<div className='cool-card'>
						<div className='cool-card-icon'>🚀</div>
						<p className='cool-card-text'>
							Полёт первого человека в космос, запуск первых спутников и развитие ракетных технологий
							показали миру, что космос — это не предел, а начало большого пути.
						</p>
					</div>
				</SlideIn>

				<FadeUp delay={0.3}>
					<p className='about-text'>
						Вдохновлённые этой эпохой, инженеры и энтузиасты космических технологий создали
						проект <span className='hl'>«БУРАН»</span>, чтобы сделать путешествия за пределы
						Земли доступными не только космонавтам, но и <span className='hl'>обычным людям</span>.
					</p>
				</FadeUp>
			</section>

			<section className='about-section'>
				<FadeUp className='section-header'>
					<span className='section-num'>02</span>
					<h2 className='section-title'>Что мы делаем</h2>
				</FadeUp>

				<SlideIn from='left' delay={0.1}>
					<p className='about-text big-text'>
						Сегодня наша компания организует туристические экспедиции по Солнечной системе —
						от кратеров <span className='hl'>Луны</span> до далёких ледяных
						облаков <span className='hl'>Нептуна</span>.
					</p>
				</SlideIn>

				<FadeUp delay={0.2}>
					<div className='stats-row'>
						<div className='stat-box'>
							<div className='stat-num'>
								<CountNum end={8} />
							</div>
							<div className='stat-label'>планет</div>
						</div>
						<div className='stat-box'>
							<div className='stat-num'>
								<CountNum end={20} suffix='+' />
							</div>
							<div className='stat-label'>туров</div>
						</div>
						<div className='stat-box'>
							<div className='stat-num'>
								<CountNum end={578} />
							</div>
							<div className='stat-label'>км/с</div>
						</div>
					</div>
				</FadeUp>
			</section>

			<section className='about-section'>
				<FadeUp className='section-header'>
					<span className='section-num'>03</span>
					<h2 className='section-title'>Космолёт «ТАЙФУН»</h2>
				</FadeUp>

				<SlideIn from='left' delay={0.1}>
					<p className='about-text'>
						Гордость компании — межпланетные космолёты <span className='hl'>«ТАЙФУН»</span>.
						Эти корабли оснащены плазменно-ионными двигателями и способны развивать скорость
						до <span className='hl'>578 км/с</span>, что позволяет достигать Нептуна всего за три месяца.
					</p>
				</SlideIn>

				<div className='bullets-grid'>
					{[
						{ icon: '🏠', title: 'Жилые модули', desc: 'С искусственной гравитацией для комфортного проживания' },
						{ icon: '🔭', title: 'Обзорные палубы', desc: 'Панорамные окна для наблюдения за космосом' },
						{ icon: '🔬', title: 'Научные лаборатории', desc: 'Для исследований прямо на борту корабля' },
						{ icon: '🪂', title: 'Зоны невесомости', desc: 'Подготовка и тренировки в условиях невесомости' },
					].map((item, i) => (
						<FadeUp key={i} delay={0.15 * i} className='bullet-card'>
							<div className='bullet-icon'>{item.icon}</div>
							<div className='bullet-info'>
								<div className='bullet-title'>{item.title}</div>
								<div className='bullet-desc'>{item.desc}</div>
							</div>
						</FadeUp>
					))}
				</div>

				<FadeUp delay={0.2}>
					<div className='cool-card tour-card'>
						<p className='cool-card-text'>
							Каждый тур включает <span className='hl'>обучение</span>, наблюдение
							за космическими явлениями и возможность увидеть <span className='hl'>Землю из космоса</span>.
						</p>
					</div>
				</FadeUp>
			</section>

			<section className='about-section'>
				<FadeUp className='section-header'>
					<span className='section-num'>04</span>
					<h2 className='section-title'>Экипировка</h2>
				</FadeUp>

				<SlideIn from='right' delay={0.1}>
					<p className='about-text'>
						Кроме межпланетных путешествий, компания <span className='hl'>«БУРАН»</span> разрабатывает
						и продаёт специализированную космическую экипировку.
					</p>
				</SlideIn>

				<div className='equip-list'>
					{[
						{ icon: '🧑‍🚀', name: 'Защитные костюмы' },
						{ icon: '⛑️', name: 'Герметичные шлемы' },
						{ icon: '🛠️', name: 'Оборудование для экспедиций' },
					].map((item, i) => (
						<SlideIn key={i} from='left' delay={0.12 * i} className='equip-item'>
							<span className='equip-icon'>{item.icon}</span>
							<span className='equip-name'>{item.name}</span>
						</SlideIn>
					))}
				</div>
			</section>

			<section className='about-section about-final'>
				<FadeUp>
					<p className='about-text pride-text'>
						Мы гордимся космической историей нашей страны и верим,
						что будущее человечества — <span className='hl'>среди звёзд</span>.
					</p>
				</FadeUp>

				<FadeUp delay={0.3}>
					<div className='motto-box'>
						<img className='motto-logo' src='/img/icons/logo.svg' alt='' />
						<div className='motto-text'> ваш путь к космосу</div>
					</div>
				</FadeUp>
			</section>

		</div>
	)
}
