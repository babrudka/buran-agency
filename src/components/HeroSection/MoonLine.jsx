import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Angle from positive-X axis (SVG coords, Y down)
// 55° = lower-right, clearly separate from TourLines angles (340°, 140°)
const MOON_ANGLE_DEG = 55
const MOON_DISTANCE_RATIO = 1.55 // from circle center, in multiples of radius
const AMP_X = 10
const AMP_Y = 8
const FREQ = 0.4
const PHASE = Math.PI * 0.7 // offset so moon doesn't sync with tour lines

export default function MoonLine({ circleSize, onGoToMoon }) {
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const rafRef = useRef(null)

	useEffect(() => {
		const start = performance.now()
		const tick = now => {
			const t = (now - start) / 1000
			setOffset({
				x: AMP_X * Math.sin(2 * Math.PI * FREQ * t + PHASE),
				y: AMP_Y * Math.sin(2 * Math.PI * FREQ * t + PHASE + Math.PI / 2.5),
			})
			rafRef.current = requestAnimationFrame(tick)
		}
		rafRef.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(rafRef.current)
	}, [])

	if (!circleSize) return null

	const r = circleSize / 2
	const cx = r
	const cy = r
	const rad = (MOON_ANGLE_DEG * Math.PI) / 180

	// Line starts at circle border
	const bx = cx + r * Math.cos(rad)
	const by = cy + r * Math.sin(rad)

	// Moon center (floating)
	const mx = cx + MOON_DISTANCE_RATIO * r * Math.cos(rad) + offset.x
	const my = cy + MOON_DISTANCE_RATIO * r * Math.sin(rad) + offset.y

	const moonSize = Math.round(circleSize * 0.216)

	return (
		<AnimatePresence>
			<motion.div
				style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.35 } }}
				exit={{ opacity: 0, transition: { duration: 0.25 } }}
			>
				{/* SVG line */}
				<svg
					style={{
						position: 'absolute',
						inset: 0,
						width: '100%',
						height: '100%',
						overflow: 'visible',
						pointerEvents: 'none',
					}}
				>
					<line
						x1={bx}
						y1={by}
						x2={mx}
						y2={my}
						stroke='rgba(255,255,255,1)'
						strokeWidth='1.5'
						strokeDasharray='5 4'
					/>
					<circle cx={mx} cy={my} r='3' fill='rgba(255,255,255,1)' />
				</svg>

				{/* Moon button */}
				<button
					onClick={onGoToMoon}
					style={{
						position: 'absolute',
						left: mx,
						top: my,
						width: moonSize,
						height: moonSize,
						transform: 'translate(-50%, -50%)',
						borderRadius: '50%',
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						padding: 0,
						pointerEvents: 'auto',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<img
						src='/img/planets/themoon.png'
						alt='Луна'
						style={{ width: '100%', borderRadius: '50%', display: 'block' }}
					/>
					{/* <div
						style={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '44%',
							height: '44%',
							borderRadius: '50%',
							backgroundColor: 'black',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{`->`}
					</div> */}
				</button>
			</motion.div>
		</AnimatePresence>
	)
}
