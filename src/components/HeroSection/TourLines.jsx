import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ANGLES = {
	1: [40],
	2: [0, 140],
}
const LINE_LEN = 0.55
const AMP_X = 8
const AMP_Y = 12
const FREQ = 0.45

export default function TourLines({ tours, planetId, size }) {
	const [wave, setWave] = useState(() =>
		tours.map(() => ({ x: 0, y: 0 })),
	)
	const raf = useRef(null)

	useEffect(() => {
		const count = tours.length
		if (count === 0) return
		const phases = tours.map((_, i) => (i / Math.max(count, 1)) * 2 * Math.PI)
		const start = performance.now()

		const tick = now => {
			const t = (now - start) / 1000
			setWave(
				tours.map((_, i) => ({
					x: AMP_X * Math.sin(2 * Math.PI * FREQ * t + phases[i]),
					y: AMP_Y * Math.sin(2 * Math.PI * FREQ * t + phases[i] + Math.PI / 3),
				})),
			)
			raf.current = requestAnimationFrame(tick)
		}
		raf.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf.current)
	}, [tours.length])

	if (!tours.length || !size) return null

	const r = size / 2
	const cx = r
	const cy = r
	const angles = ANGLES[tours.length] ?? ANGLES[1]

	return (
		<AnimatePresence mode='wait'>
			<motion.svg
				key={planetId}
				className="tour-layer"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.2 } }}
				exit={{ opacity: 0, transition: { duration: 0.2 } }}
			>
				{tours.map((name, i) => {
					const angle = angles[i] ?? 30
					const rad = (angle * Math.PI) / 180
					const bx = cx + r * Math.cos(rad)
					const by = cy + r * Math.sin(rad)
					const ex =
						bx + LINE_LEN * r * Math.cos(rad) + (wave[i]?.x ?? 0)
					const ey =
						by + LINE_LEN * r * Math.sin(rad) + (wave[i]?.y ?? 0)

					const w = Math.round(size * 0.35)
					const h = Math.round(size * 0.06)
					const isRight = Math.cos(rad) < 0
					const lx = isRight ? ex - w : ex
					const ly = ey - h / 2

					return (
						<g key={name}>
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
							<foreignObject
								x={lx}
								y={ly}
								width={w}
								height={h}
								className="fo-click"
							>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									className={`tour-tag${isRight ? ' tour-tag--right' : ''}`}
								>
									Тур «{name}»
								</div>
							</foreignObject>
						</g>
					)
				})}
			</motion.svg>
		</AnimatePresence>
	)
}
