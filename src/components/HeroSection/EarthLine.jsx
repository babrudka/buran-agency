import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const EARTH_ANGLE_DEG = 330
const EARTH_DISTANCE_RATIO = 1.55
const AMP_X = 12
const AMP_Y = 9
const FREQ = 0.38
const PHASE = Math.PI * 0.3

export default function EarthLine({ circleSize, onGoToEarth }) {
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
	const rad = (EARTH_ANGLE_DEG * Math.PI) / 180

	const bx = cx + r * Math.cos(rad)
	const by = cy + r * Math.sin(rad)

	const ex = cx + EARTH_DISTANCE_RATIO * r * Math.cos(rad) + offset.x
	const ey = cy + EARTH_DISTANCE_RATIO * r * Math.sin(rad) + offset.y

	const earthSize = Math.round(circleSize * 0.22)

	return (
		<AnimatePresence>
			<motion.div
				style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.35 } }}
				exit={{ opacity: 0, transition: { duration: 0.25 } }}
			>
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
						x2={ex}
						y2={ey}
						stroke='rgba(255,255,255,1)'
						strokeWidth='1.5'
						strokeDasharray='5 4'
					/>
					<circle cx={ex} cy={ey} r='3' fill='rgba(255,255,255,1)' />
				</svg>

				<button
					onClick={onGoToEarth}
					style={{
						position: 'absolute',
						left: ex,
						top: ey,
						width: earthSize,
						height: earthSize,
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
						src='/img/planets/theEarth.svg'
						alt='Земля'
						style={{ width: '100%', borderRadius: '50%', display: 'block' }}
					/>
				</button>
			</motion.div>
		</AnimatePresence>
	)
}
