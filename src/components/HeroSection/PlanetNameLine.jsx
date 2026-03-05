import { AnimatePresence, motion } from 'framer-motion'

const ANGLE_DEG = 210
const LINE_LENGTH_RATIO = 0.85
const UNDERLINE_WIDTH = 180
const TITLE_HEIGHT = 52
const SUBTITLE_HEIGHT = 36

export default function PlanetNameLine({ circleSize, planetName, planetId, subtitle, showPin }) {
	if (!circleSize) return null

	const r = circleSize / 2
	const cx = r
	const cy = r
	const rad = (ANGLE_DEG * Math.PI) / 180

	const bx = cx + r * Math.cos(rad)
	const by = cy + r * Math.sin(rad)
	const ex = bx + LINE_LENGTH_RATIO * r * Math.cos(rad)
	const ey = by + LINE_LENGTH_RATIO * r * Math.sin(rad)

	const contentHeight = SUBTITLE_HEIGHT + TITLE_HEIGHT

	return (
		<AnimatePresence mode="wait">
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
				{/* Solid line from planet edge to end of underline */}
				<line
					x1={bx}
					y1={by}
					x2={ex}
					y2={ey}
					stroke="rgba(255,255,255,1)"
					strokeWidth="1.5"
				/>
				{/* Horizontal underline — extends left from the line endpoint */}
				<line
					x1={ex - UNDERLINE_WIDTH}
					y1={ey}
					x2={ex}
					y2={ey}
					stroke="rgba(255,255,255,1)"
					strokeWidth="1.5"
				/>
				{/* Subtitle + planet name above the underline */}
				<foreignObject
					x={ex - UNDERLINE_WIDTH}
					y={ey - contentHeight}
					width={UNDERLINE_WIDTH}
					height={contentHeight}
					style={{ overflow: 'visible' }}
				>
					<div
						xmlns="http://www.w3.org/1999/xhtml"
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-end',
							userSelect: 'none',
						}}
					>
						{subtitle && (
							<div
								style={{
									color: 'rgba(255,255,255,0.45)',
									fontFamily: 'UNCAGE, sans-serif',
									fontSize: '11px',
									letterSpacing: '0.03em',
									whiteSpace: 'nowrap',
									lineHeight: `${SUBTITLE_HEIGHT}px`,
								}}
							>
								{subtitle}
							</div>
						)}
						<div
							style={{
								color: '#ffffff',
								fontFamily: 'Widock, sans-serif',
								fontSize: '42px',
								whiteSpace: 'nowrap',
								lineHeight: `${TITLE_HEIGHT}px`,
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
							}}
						>
							{showPin && (
								<svg width="30" height="42" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M5 0C2.24 0 0 2.24 0 5C0 8.75 5 14 5 14C5 14 10 8.75 10 5C10 2.24 7.76 0 5 0ZM5 6.5C4.17 6.5 3.5 5.83 3.5 5C3.5 4.17 4.17 3.5 5 3.5C5.83 3.5 6.5 4.17 6.5 5C6.5 5.83 5.83 6.5 5 6.5Z" fill="#FF0000"/>
								</svg>
							)}
							{planetName}
						</div>
					</div>
				</foreignObject>
			</motion.svg>
		</AnimatePresence>
	)
}
