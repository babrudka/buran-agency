import { AnimatePresence, motion } from 'framer-motion'
import usePopulationCounter from './usePopulationCounter'

// Угол линии от центра планеты к подписи (в градусах)
const ANGLE_DEG = 210
// Длина линии (доля от радиуса)
const LINE_LENGTH = 0.85

export default function PlanetNameLine({ size, name, id, subtitle, showPin, facts }) {
	// Проверяем, есть ли факт со счётчиком населения
	const hasPopulationCounter = facts?.some(fact => fact.counter)
	const populationText = usePopulationCounter(hasPopulationCounter)

	if (!size) return null

	const radius = size / 2
	const center = radius
	const angleRad = (ANGLE_DEG * Math.PI) / 180

	// Начало линии — на краю планеты
	const startX = center + radius * Math.cos(angleRad)
	const startY = center + radius * Math.sin(angleRad)

	// Конец линии — дальше от планеты
	const endX = startX + LINE_LENGTH * radius * Math.cos(angleRad)
	const endY = startY + LINE_LENGTH * radius * Math.sin(angleRad)

	// Размеры блока с названием
	const blockWidth = Math.round(size * 0.4)
	const titleHeight = Math.round(size * 0.12)
	const subtitleHeight = Math.round(size * 0.08)
	const factsGap = Math.round(size * 0.025)
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
				x1={startX}
				y1={startY}
				x2={endX}
				y2={endY}
				stroke="rgba(255,255,255,1)"
				strokeWidth="1.5"
			/>

			{/* Горизонтальная линия под названием */}
			<line
				x1={endX - blockWidth}
				y1={endY}
				x2={endX}
				y2={endY}
				stroke="rgba(255,255,255,1)"
				strokeWidth="1.5"
			/>
			<foreignObject
				x={endX - blockWidth}
				y={endY - nameBlockHeight}
				width={blockWidth}
				height={nameBlockHeight}
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
					x={endX - blockWidth}
					y={endY + factsGap}
					width={blockWidth + Math.round(size * 0.2)}
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
