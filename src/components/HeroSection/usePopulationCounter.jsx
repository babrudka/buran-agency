import { useState, useEffect, useRef } from 'react'

const START_POPULATION = 8272345242

// Форматирование числа с пробелами
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

		// Каждые 150мс случайно меняем население на ±1..3
		timerRef.current = setInterval(() => {
			const direction = Math.random() < 0.55 ? 1 : -1  // чуть чаще растёт
			const step = 1 + Math.floor(Math.random() * 3)     // шаг от 1 до 3
			setCount(prev => prev + direction * step)
		}, 150)

		return () => clearInterval(timerRef.current)
	}, [active])

	return formatNumber(count) + ' человек'
}
