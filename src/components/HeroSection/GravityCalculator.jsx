import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const LINE_ANGLE_DEG = 10
const LINE_DISTANCE = 1.35
const GRAVITY_RATIO = 6.0535

export default function GravityCalculator({ size, id }) {
	const [weight, setWeight] = useState('')

	if (!size) return null

	const radius = size / 2
	const centerX = radius
	const centerY = radius
	const angleRad = (LINE_ANGLE_DEG * Math.PI) / 180

	// Точка на краю планеты (начало линии)
	const borderX = centerX + radius * Math.cos(angleRad)
	const borderY = centerY + radius * Math.sin(angleRad)

	// Конец линии (где будет калькулятор)
	const lineEndX = centerX + LINE_DISTANCE * radius * Math.cos(angleRad)
	const lineEndY = centerY + LINE_DISTANCE * radius * Math.sin(angleRad)

	const boxWidth = Math.round(size * 0.55)
	const boxHeight = Math.round(size * 0.45)

	const moonWeight = weight
		? (parseFloat(weight) / GRAVITY_RATIO).toFixed(1)
		: ''

	return (
		<AnimatePresence mode='wait'>
			<motion.svg
				key={id}
				className='svg-layer'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.3 } }}
				exit={{ opacity: 0, transition: { duration: 0.2 } }}
			>
				<line
					x1={borderX}
					y1={borderY}
					x2={lineEndX}
					y2={lineEndY}
					stroke='rgba(255,255,255,1)'
					strokeWidth='1.5'
				/>

				<foreignObject
					x={lineEndX}
					y={lineEndY - boxHeight / 2}
					width={boxWidth}
					height={boxHeight}
					className='clickable-overlay'
				>
					<div
						xmlns='http://www.w3.org/1999/xhtml'
						className='gravity'
					>
						<div className='gravity-head'>
							<img
								src='/img/icons/astronaut.svg'
								className='gravity-icon'
								alt=''
							/>
							<div className='gravity-title'>
								Сила — в 6 раз слабее, чем на Земле
							</div>
						</div>

						<div className='gravity-desc'>
							На Луне вы сможете прыгнуть в 6 раз выше и дальше
						</div>

						<div className='gravity-fields'>
							<div className='gravity-field'>
								<label className='gravity-label'>Ваш вес на Земле</label>
								<div className='gravity-input-wrap gravity-input-calc'>
									<input
										type='number'
										className='gravity-input'
										placeholder='70'
										value={weight}
										onChange={e => setWeight(e.target.value)}
									/>
									<span className='gravity-unit'>кг</span>
								</div>
							</div>
							<div className='gravity-field'>
								<label className='gravity-label'>Вес на Луне</label>
								<div className='gravity-input-wrap gravity-result'>
									<span className='gravity-value'>
										{moonWeight || ''}
									</span>
									<span className='gravity-unit'>кг</span>
								</div>
							</div>
						</div>
					</div>
				</foreignObject>
			</motion.svg>
		</AnimatePresence>
	)
}
