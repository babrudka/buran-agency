import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Угол направления линии (в градусах от центра планеты)
const ANGLE_DEG = 330
// Насколько далеко от центра находится Луна (множитель радиуса)
const DISTANCE_MULT = 1.55

export default function MoonLine({ size, onGoToMoon }) {
	// Лёгкое покачивание Луны (имитация орбиты)
	const [offsetX, setOffsetX] = useState(0)
	const [offsetY, setOffsetY] = useState(0)
	const timerRef = useRef(null)

	useEffect(() => {
		let step = 0
		timerRef.current = setInterval(() => {
			step += 1
			// Плавное покачивание по синусоиде, чуть другая фаза чем у Земли
			setOffsetX(10 * Math.sin(step * 0.065))
			setOffsetY(8 * Math.cos(step * 0.065))
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

	// Позиция Луны — удалённая точка + покачивание
	const moonX = center + DISTANCE_MULT * radius * Math.cos(angleRad) + offsetX
	const moonY = center + DISTANCE_MULT * radius * Math.sin(angleRad) + offsetY

	const moonBtnSize = Math.round(size * 0.216)

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
					x2={moonX}
					y2={moonY}
					stroke='rgba(255,255,255,1)'
					strokeWidth='1.5'
					strokeDasharray='5 4'
				/>
				<circle cx={moonX} cy={moonY} r='3' fill='rgba(255,255,255,1)' />
			</svg>

		<button
				onClick={onGoToMoon}
				className="space-btn"
				style={{ left: moonX, top: moonY, width: moonBtnSize, height: moonBtnSize }}
			>
					<img
						src='/img/planets/themoon.png'
						alt='Луна'
						className="space-img"
					/>
				</button>
			</motion.div>
		</AnimatePresence>
	)
}
