import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Угол направления линии (в градусах от центра планеты)
const ANGLE_DEG = 330
// Насколько далеко от центра находится конечная точка (множитель радиуса)
const DISTANCE_MULT = 1.55

export default function EarthLine({ size, onGoToEarth }) {
	// Лёгкое покачивание конечной точки (имитация невесомости)
	const [offsetX, setOffsetX] = useState(0)
	const [offsetY, setOffsetY] = useState(0)
	const timerRef = useRef(null)

	useEffect(() => {
		let step = 0
		timerRef.current = setInterval(() => {
			step += 1
			// Плавное покачивание по синусоиде с шагом
			setOffsetX(12 * Math.sin(step * 0.06))
			setOffsetY(9 * Math.cos(step * 0.06))
		}, 30)
		return () => clearInterval(timerRef.current)
	}, [])

	if (!size) return null

	const radius = size / 2
	const center = radius
	const angleRad = (ANGLE_DEG * Math.PI) / 180

	// Начало линии — точка на краю планеты
	const startX = center + radius * Math.cos(angleRad)
	const startY = center + radius * Math.sin(angleRad)

	// Конец линии — удалённая точка + покачивание
	const endX = center + DISTANCE_MULT * radius * Math.cos(angleRad) + offsetX
	const endY = center + DISTANCE_MULT * radius * Math.sin(angleRad) + offsetY

	const buttonSize = Math.round(size * 0.22)

	return (
		<AnimatePresence>
			<motion.div
				className="motion-wrap"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.35 } }}
				exit={{ opacity: 0, transition: { duration: 0.25 } }}
			>
				<svg className="svg-layer">
				<line
						x1={startX}
						y1={startY}
						x2={endX}
						y2={endY}
						stroke='rgba(255,255,255,1)'
						strokeWidth='1.5'
						strokeDasharray='5 4'
					/>
					<circle cx={endX} cy={endY} r='3' fill='rgba(255,255,255,1)' />
				</svg>

				<button
					onClick={onGoToEarth}
					className="space-btn"
					style={{ left: endX, top: endY, width: buttonSize, height: buttonSize }}
				>
					<img
						src='/img/planets/theEarth.svg'
						alt='Земля'
						className="space-img"
					/>
				</button>
			</motion.div>
		</AnimatePresence>
	)
}
