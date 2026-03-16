import { AnimatePresence, motion } from 'framer-motion'
import usePopulationCounter from './usePopulationCounter'

const LINE_ANGLE_DEG = 210
const LINE_DISTANCE_MULTIPLIER = 0.85

export default function PlanetNameLine({ circleSize, name, id, subtitle, showPin, facts }) {
	const hasPopulationCounter = facts?.some(fact => fact.counter)
	const populationText = usePopulationCounter(hasPopulationCounter)

	if (!circleSize) return null

	const radius = circleSize / 2
	const centerPoint = radius
	const angleRad = (LINE_ANGLE_DEG * Math.PI) / 180

	const lineStartX = centerPoint + radius * Math.cos(angleRad)
	const lineStartY = centerPoint + radius * Math.sin(angleRad)

	const lineEndX = lineStartX + LINE_DISTANCE_MULTIPLIER * radius * Math.cos(angleRad)
	const lineEndY = lineStartY + LINE_DISTANCE_MULTIPLIER * radius * Math.sin(angleRad)

	const nameBlockWidth = Math.round(circleSize * 0.4)
	const titleHeight = Math.round(circleSize * 0.12)
	const subtitleHeight = Math.round(circleSize * 0.08)
	const factsSectionGap = Math.round(circleSize * 0.025)
	const nameBlockHeight = subtitleHeight + titleHeight

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
			x1={lineStartX}
			y1={lineStartY}
			x2={lineEndX}
			y2={lineEndY}
			stroke="rgba(255,255,255,1)"
			strokeWidth="1.5"
		/>

		<line
			x1={lineEndX - nameBlockWidth}
			y1={lineEndY}
			x2={lineEndX}
			y2={lineEndY}
			stroke="rgba(255,255,255,1)"
			strokeWidth="1.5"
		/>
		<foreignObject
			x={lineEndX - nameBlockWidth}
			y={lineEndY - nameBlockHeight}
			width={nameBlockWidth}
				height={nameBlockHeight}
					className="display-overlay"
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
				x={lineEndX - nameBlockWidth}
				y={lineEndY + factsSectionGap}
				width={nameBlockWidth + Math.round(circleSize * 0.2)}
				height={facts.length * Math.round(circleSize * 0.13) + Math.round(circleSize * 0.07)}
						className="display-overlay"
					>
						<div xmlns="http://www.w3.org/1999/xhtml" className="facts">
							{facts.map((fact, factIndex) => (
								<div key={factIndex} className="fact">
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
												{fact.counter ? populationText : fact.description}
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
