import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { planets, moon } from '../../data/planets'
import ModalTours from '../Modal/ModalTours'
import './ToursCatalog.css'

const SPEED = 578

const allPlanets = [moon, ...planets]

const tours = allPlanets.flatMap(p =>
	(p.tours || []).map((name, i) => ({
		name,
		planet: p.id,
		planetName: p.name,
		img: p.image,
		tourImage: p.tourImage,
		score: p.score,
		desc: p.tourDescs?.length > 1 ? p.tourDescs[i] : p.tourDescs?.[0],
		temp: p.temp,
		flyTime: p.distance / SPEED,
	}))
)

const planetList = allPlanets.filter(p => p.tours && p.tours.length > 0)

const MIN_TEMP = -224
const MAX_TEMP = 460
const MAX_FLY_TIME = Math.max(...tours.map(t => t.flyTime))

function showTime(sec) {
	if (sec === 0) return 'Вы здесь'
	const min = sec / 60
	if (min < 120) return `~${Math.round(min)} мин`
	const days = sec / 86400
	if (days < 1) return `~${(min / 60).toFixed(1)} ч`
	return `~${days.toFixed(1)} дн`
}

function showTemp(val) {
	return `${val > 0 ? '+' : ''}${val}°C`
}

function Slider({ min, max, value, onChange, step = 1 }) {
	const [low, high] = value
	const left = ((low - min) / (max - min)) * 100
	const right = ((high - min) / (max - min)) * 100

	return (
		<div className='range'>
			<div className='range-track' />
			<div
				className='range-fill'
				style={{ left: `${left}%`, right: `${100 - right}%` }}
			/>
			<input
				type='range'
				min={min}
				max={max}
				step={step}
				value={low}
				onChange={e => {
					const v = Number(e.target.value)
					if (v <= high) onChange([v, high])
				}}
			/>
			<input
				type='range'
				min={min}
				max={max}
				step={step}
				value={high}
				onChange={e => {
					const v = Number(e.target.value)
					if (v >= low) onChange([low, v])
				}}
			/>
		</div>
	)
}

const cardAnim = {
	hidden: { opacity: 0, y: 20 },
	visible: i => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.04, duration: 0.3 },
	}),
}

export default function ToursCatalog() {

	const [picked, setPicked] = useState(new Set())
	const [temp, setTemp] = useState([MIN_TEMP, MAX_TEMP])
	const [fly, setFly] = useState([0, MAX_FLY_TIME])

	const [tourModalOpen, setTourModalOpen] = useState(false)
	const [selectedTour, setSelectedTour] = useState(null)

	const openTour = (tour) => {
		setSelectedTour(tour)
		setTourModalOpen(true)
	}

	const toggle = useCallback(id => {
		setPicked(prev => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}, [])

	const shown = useMemo(() => {
		return tours.filter(t => {
			if (picked.size > 0 && !picked.has(t.planet)) return false
			if (t.temp < temp[0] || t.temp > temp[1]) return false
			if (t.flyTime < fly[0] || t.flyTime > fly[1]) return false
			return true
		})
	}, [picked, temp, fly])

	return (
		<div className='catalog'>

			<div className='filters'>

				<div className='chips'>
					{planetList.map(p => (
						<button
							key={p.id}
							className={`chip ${picked.has(p.id) ? 'chip--on' : ''}`}
							onClick={() => toggle(p.id)}
						>
							{p.name}
						</button>
					))}
				</div>

				<div className='filters-row'>

					<div className='slider-box'>
						<span className='slider-name'>Температура</span>
						<Slider
							min={MIN_TEMP}
							max={MAX_TEMP}
							value={temp}
							onChange={setTemp}
						/>
						<div className='slider-nums'>
							<span>{showTemp(temp[0])}</span>
							<span>{showTemp(temp[1])}</span>
						</div>
					</div>

					<div className='slider-box'>
						<span className='slider-name'>Время полёта</span>
						<Slider
							min={0}
							max={MAX_FLY_TIME}
							value={fly}
							onChange={setFly}
							step={60}
						/>
						<div className='slider-nums'>
							<span>{showTime(fly[0])}</span>
							<span>{showTime(fly[1])}</span>
						</div>

						<div className='hint'>
							<span className='hint-i'>i</span>
							<span className='hint-txt'>
								Скорость полёта на сверхбыстрой ракете ТАЙФУН 578 км/с
							</span>
						</div>

					</div>

				</div>

			</div>

			{shown.length === 0 ? (

				<div className='empty'>
					Нет туров по заданным фильтрам
				</div>

			) : (

				<div className='grid'>

					{shown.map((t, i) => (

						<motion.div
							key={`${t.planet}-${t.name}`}
							className='card'
							custom={i}
							initial='hidden'
							animate='visible'
							variants={cardAnim}
							onClick={() => openTour(t)}
						>

							<img
								className='card-img'
								src={t.img}
								alt={t.planetName}
							/>

							<div className='card-info'>

								<div className='card-name'>
									{t.name}
								</div>

								<div className='card-planet'>
									{t.planetName}
								</div>

								<div className='card-meta'>

									<span className='meta-item'>
										<img
											className='meta-icon'
											src='/img/icons/temp.svg'
											alt=''
										/>
										{showTemp(t.temp)}
									</span>

									<span className='meta-item'>
										{showTime(t.flyTime)}
									</span>

								</div>

							</div>

						</motion.div>

					))}

				</div>

			)}

			<AnimatePresence>
				{tourModalOpen && (
					<ModalTours
						isOpen={tourModalOpen}
						onClose={() => setTourModalOpen(false)}
						tour={selectedTour}
					/>
				)}
			</AnimatePresence>

		</div>
	)
}