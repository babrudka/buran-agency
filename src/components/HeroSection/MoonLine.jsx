import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const LINE_ANGLE_DEG = 330
const LINE_DISTANCE_MULTIPLIER = 1.55

export default function MoonLine({ circleSize, onGoToMoon }) {
	const [offsetX, setOffsetX] = useState(0)
	const [offsetY, setOffsetY] = useState(0)
	const timerRef = useRef(null)

	useEffect(() => {
		let animationStep = 0
		timerRef.current = setInterval(() => {
			animationStep += 1
			setOffsetX(10 * Math.sin(animationStep * 0.065))
			setOffsetY(8 * Math.cos(animationStep * 0.065))
		}, 30)
		return () => clearInterval(timerRef.current)
	}, [])

	if (!circleSize) return null

	const radius = circleSize / 2
	const centerPoint = radius
	const angleRad = (LINE_ANGLE_DEG * Math.PI) / 180

	const lineStartX = centerPoint + radius * Math.cos(angleRad)
	const lineStartY = centerPoint + radius * Math.sin(angleRad)

	const moonX = centerPoint + LINE_DISTANCE_MULTIPLIER * radius * Math.cos(angleRad) + offsetX
	const moonY = centerPoint + LINE_DISTANCE_MULTIPLIER * radius * Math.sin(angleRad) + offsetY

	const moonButtonSize = Math.round(circleSize * 0.216)

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
					x1={lineStartX}
					y1={lineStartY}
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
				style={{ left: moonX, top: moonY, width: moonButtonSize, height: moonButtonSize }}
			>
					<img
						src='/img/planets/themoon.webp'
						alt='Луна'
						className="space-img"
					/>
				</button>
			</motion.div>
		</AnimatePresence>
	)
}
