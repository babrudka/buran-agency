import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ANGLE = 330
const DIST = 1.55
const AMP_X = 10
const AMP_Y = 8
const FREQ = 0.4
const PHASE = Math.PI * 0.7

export default function MoonLine({ size, onGoToMoon }) {
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

	const mx = cx + DIST * r * Math.cos(rad) + wave.x
	const my = cy + DIST * r * Math.sin(rad) + wave.y

	const moonSize = Math.round(size * 0.216)

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
						x2={mx}
						y2={my}
						stroke='rgba(255,255,255,1)'
						strokeWidth='1.5'
						strokeDasharray='5 4'
					/>
					<circle cx={mx} cy={my} r='3' fill='rgba(255,255,255,1)' />
				</svg>

		<button
					onClick={onGoToMoon}
					className="space-btn"
					style={{ left: mx, top: my, width: moonSize, height: moonSize }}
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
