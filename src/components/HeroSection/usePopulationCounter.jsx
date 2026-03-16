import { useState, useEffect, useRef } from 'react'

const START_POPULATION = 8272345242

function formatNumber(number) {
	return number.toLocaleString('ru-RU')
}

export default function usePopulationCounter(active) {
	const [count, setCount] = useState(START_POPULATION)
	const timerRef = useRef(null)

	useEffect(() => {
		if (!active) {
			clearInterval(timerRef.current)
			return
		}

		timerRef.current = setInterval(() => {
			const direction = Math.random() < 0.55 ? 1 : -1
			const step = 1 + Math.floor(Math.random() * 3)
			setCount(prev => prev + direction * step)
		}, 150)

		return () => clearInterval(timerRef.current)
	}, [active])

	return formatNumber(count) + ' человек'
}
