import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ANGLES = {
	1: [40],
	2: [0, 140],
}
const LINE_LENGTH_RATIO = 0.55
const AMP_X = 8
const AMP_Y = 12
const FREQ = 0.45

export default function TourLines({ tours, planetId, circleSize }) {
	const [offsets, setOffsets] = useState(() =>
		tours.map(() => ({ x: 0, y: 0 })),
	)
	const rafRef = useRef(null)

	useEffect(() => {
		const count = tours.length
		if (count === 0) return
		const phases = tours.map((_, i) => (i / Math.max(count, 1)) * 2 * Math.PI)
		const start = performance.now()

		const tick = now => {
			const t = (now - start) / 1000
			setOffsets(
				tours.map((_, i) => ({
					x: AMP_X * Math.sin(2 * Math.PI * FREQ * t + phases[i]),
					y: AMP_Y * Math.sin(2 * Math.PI * FREQ * t + phases[i] + Math.PI / 3),
				})),
			)
			rafRef.current = requestAnimationFrame(tick)
		}
		rafRef.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(rafRef.current)
	}, [tours.length])

	if (!tours.length || !circleSize) return null

	const r = circleSize / 2
	const cx = r
	const cy = r
	const angles = ANGLES[tours.length] ?? ANGLES[1]

	return (
		<AnimatePresence mode='wait'>
			<motion.svg
				key={planetId}
				style={{
					position: 'absolute',
					inset: 0,
					width: '100%',
					height: '100%',
					overflow: 'visible',
					pointerEvents: 'none',
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.2 } }}
				exit={{ opacity: 0, transition: { duration: 0.2 } }}
			>
				{tours.map((name, i) => {
					const angleDeg = angles[i] ?? 30
					const rad = (angleDeg * Math.PI) / 180
					const bx = cx + r * Math.cos(rad)
					const by = cy + r * Math.sin(rad)
					const ex =
						bx + LINE_LENGTH_RATIO * r * Math.cos(rad) + (offsets[i]?.x ?? 0)
					const ey =
						by + LINE_LENGTH_RATIO * r * Math.sin(rad) + (offsets[i]?.y ?? 0)

					const labelW = 200
					const labelH = 36
					const alignRight = Math.cos(rad) < 0
					const labelX = alignRight ? ex - labelW : ex
					const labelY = ey - labelH / 2

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
								x={labelX}
								y={labelY}
								width={labelW}
								height={labelH}
								style={{ pointerEvents: 'auto', overflow: 'visible' }}
							>
								<div
									xmlns='http://www.w3.org/1999/xhtml'
									style={{
										background: '#02060D',
										color: '#ffffff',
										fontFamily: 'Widock, sans-serif',
										fontSize: '13px',
										letterSpacing: '0.04em',
										padding: '6px 12px',
										borderRadius: '3px',
										whiteSpace: 'nowrap',
										border: '1px solid rgba(255,255,255,0.3)',
										textAlign: alignRight ? 'right' : 'left',
										width: 'fit-content',
										marginLeft: alignRight ? 'auto' : '0',
									}}
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
