import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ANGLE = 10
const DIST = 1.35
const GRAVITY = 6.0535

export default function GravityCalculator({ size, id }) {
	const [weight, setWeight] = useState('')

	if (!size) return null

	const r = size / 2
	const cx = r
	const cy = r
	const rad = (ANGLE * Math.PI) / 180

	const bx = cx + r * Math.cos(rad)
	const by = cy + r * Math.sin(rad)
	const sx = cx + DIST * r * Math.cos(rad)
	const sy = cy + DIST * r * Math.sin(rad)

	const w = Math.round(size * 0.55)
	const h = Math.round(size * 0.45)

	const result = weight
		? (parseFloat(weight) / GRAVITY).toFixed(1)
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
					x1={bx}
					y1={by}
					x2={sx}
					y2={sy}
					stroke='rgba(255,255,255,1)'
					strokeWidth='1.5'
				/>

				<foreignObject
					x={sx}
					y={sy - h / 2}
					width={w}
					height={h}
					className='fo-click'
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
										{result || ''}
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
