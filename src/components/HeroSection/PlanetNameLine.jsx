import { AnimatePresence, motion } from 'framer-motion'
import usePopulationCounter from './usePopulationCounter'

const ANGLE = 210
const LINE_LEN = 0.85

export default function PlanetNameLine({ size, name, id, subtitle, showPin, facts }) {
	const hasCount = facts?.some(f => f.counter)
	const popText = usePopulationCounter(hasCount)

	if (!size) return null

	const r = size / 2
	const cx = r
	const cy = r
	const rad = (ANGLE * Math.PI) / 180

	const bx = cx + r * Math.cos(rad)
	const by = cy + r * Math.sin(rad)
	const ex = bx + LINE_LEN * r * Math.cos(rad)
	const ey = by + LINE_LEN * r * Math.sin(rad)

	const lineW = Math.round(size * 0.4)
	const titleH = Math.round(size * 0.12)
	const subH = Math.round(size * 0.08)
	const factsGap = Math.round(size * 0.025)
	const contentH = subH + titleH

	return (
		<AnimatePresence mode="wait">
			<motion.svg
				key={id}
				className="svg-layer"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.2 } }}
				exit={{ opacity: 0, transition: { duration: 0.2 } }}
			>
				<line
					x1={bx}
					y1={by}
					x2={ex}
					y2={ey}
					stroke="rgba(255,255,255,1)"
					strokeWidth="1.5"
				/>

				<line
					x1={ex - lineW}
					y1={ey}
					x2={ex}
					y2={ey}
					stroke="rgba(255,255,255,1)"
					strokeWidth="1.5"
				/>
				<foreignObject
					x={ex - lineW}
					y={ey - contentH}
					width={lineW}
					height={contentH}
					className="fo-show"
				>
					<div
						xmlns="http://www.w3.org/1999/xhtml"
						className="name-box"
					>
						{subtitle && (
							<div className="planet-sub">
								{subtitle}
							</div>
						)}
						<div className="planet-name">
							{showPin && (
								<svg width="0.75em" height="1.05em" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.5C4.17 6.5 3.5 5.83 3.5 5C3.5 4.17 4.17 3.5 5 3.5C5.83 3.5 6.5 4.17 6.5 5C6.5 5.83 5.83 6.5 5 6.5Z" fill="#FF0000" />
								</svg>
							)}
							{name}
						</div>
					</div>
				</foreignObject>

				{facts?.length > 0 && (
					<foreignObject
						x={ex - lineW}
						y={ey + factsGap}
						width={lineW + Math.round(size * 0.2)}
						height={facts.length * Math.round(size * 0.13) + Math.round(size * 0.07)}
						className="fo-show"
					>
						<div xmlns="http://www.w3.org/1999/xhtml" className="facts">
							{facts.map((fact, i) => (
								<div key={i} className="fact">
									<img
										src={`/img/icons/${fact.icon}`}
										className="fact-icon"
										alt=""
									/>
									<div>
										<div className="fact-title">
											{fact.title}
										</div>
										{(fact.description || fact.counter) && (
											<div className="fact-desc">
												{fact.counter ? popText : fact.description}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</foreignObject>
				)}
			</motion.svg>
		</AnimatePresence>
	)
}
