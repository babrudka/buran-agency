import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const LINE_ANGLE_DEG = 330
const LINE_DISTANCE_MULTIPLIER = 1.55

export default function EarthLine({ circleSize, onGoToEarth }) {
	const [offsetX, setOffsetX] = useState(0)
	const [offsetY, setOffsetY] = useState(0)
	const timerRef = useRef(null)

	useEffect(() => {
		let animationStep = 0
		timerRef.current = setInterval(() => {
			animationStep += 1
			setOffsetX(12 * Math.sin(animationStep * 0.06))
			setOffsetY(9 * Math.cos(animationStep * 0.06))
		}, 30)
		return () => clearInterval(timerRef.current)
	}, [])

	if (!circleSize) return null

	const radius = circleSize / 2
	const centerPoint = radius
	const angleRad = (LINE_ANGLE_DEG * Math.PI) / 180

	const lineStartX = centerPoint + radius * Math.cos(angleRad)
	const lineStartY = centerPoint + radius * Math.sin(angleRad)

	const lineEndX = centerPoint + LINE_DISTANCE_MULTIPLIER * radius * Math.cos(angleRad) + offsetX
	const lineEndY = centerPoint + LINE_DISTANCE_MULTIPLIER * radius * Math.sin(angleRad) + offsetY

	const earthButtonSize = Math.round(circleSize * 0.22)

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
						x2={lineEndX}
						y2={lineEndY}
						stroke='rgba(255,255,255,1)'
						strokeWidth='1.5'
						strokeDasharray='5 4'
					/>
					<circle cx={lineEndX} cy={lineEndY} r='3' fill='rgba(255,255,255,1)' />
				</svg>

				<button
					onClick={onGoToEarth}
					className="space-btn"
					style={{ left: lineEndX, top: lineEndY, width: earthButtonSize, height: earthButtonSize }}
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
