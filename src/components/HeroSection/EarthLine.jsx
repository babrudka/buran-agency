import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ANGLE = 330
const DIST = 1.55
const AMP_X = 12
const AMP_Y = 9
const FREQ = 0.38
const PHASE = Math.PI * 0.3

export default function EarthLine({ size, onGoToEarth }) {
	const [wave, setWave] = useState({ x: 0, y: 0 })
	const raf = useRef(null)

	useEffect(() => {
		const start = performance.now()
		const tick = now => {
			const t = (now - start) / 1000
			setWave({
				x: AMP_X * Math.sin(2 * Math.PI * FREQ * t + PHASE),
				y: AMP_Y * Math.sin(2 * Math.PI * FREQ * t + PHASE + Math.PI / 2.5),
			})
			raf.current = requestAnimationFrame(tick)
		}
		raf.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf.current)
	}, [])

	if (!size) return null

	const r = size / 2
	const cx = r
	const cy = r
	const rad = (ANGLE * Math.PI) / 180

	const bx = cx + r * Math.cos(rad)
	const by = cy + r * Math.sin(rad)

	const ex = cx + DIST * r * Math.cos(rad) + wave.x
	const ey = cy + DIST * r * Math.sin(rad) + wave.y

	const btnSize = Math.round(size * 0.22)

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
					className="space-btn"
					style={{ left: ex, top: ey, width: btnSize, height: btnSize }}
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
