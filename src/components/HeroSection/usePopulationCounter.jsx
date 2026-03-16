import { useState, useEffect, useRef } from 'react'

const START_POPULATION = 8272345242

function formatNumber(number) {
	return number.toLocaleString('ru-RU')
}

export default function usePopulationCounter(active) {
	const [population, setPopulation] = useState(START_POPULATION)
	const timerRef = useRef(null)

	useEffect(() => {
		if (!active) {
			clearInterval(timerRef.current)
			return
		}

		timerRef.current = setInterval(() => {
			const changeDirection = Math.random() < 0.55 ? 1 : -1
			const changeAmount = 1 + Math.floor(Math.random() * 3)
			setPopulation(previousPopulation => previousPopulation + changeDirection * changeAmount)
		}, 150)

		return () => clearInterval(timerRef.current)
	}, [active])

	return formatNumber(population) + ' человек'
}
