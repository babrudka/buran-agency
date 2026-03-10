import { useState, useEffect, useRef } from 'react'

const START_POP = 8_272_345_242

function format(n) {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export default function usePopulationCounter(active) {
	const [count, setCount] = useState(START_POP)
	const raf = useRef(null)
	const lastTick = useRef(0)
	const interval = useRef(randTime())

	function randTime() {
		return 100 + Math.random() * 200
	}

	useEffect(() => {
		if (!active) {
			if (raf.current) cancelAnimationFrame(raf.current)
			return
		}

		lastTick.current = performance.now()
		interval.current = randTime()

		function tick(now) {
			if (now - lastTick.current >= interval.current) {
				const delta = Math.random() < 0.55 ? 1 : -1
				const step = 1 + Math.floor(Math.random() * 3)
				setCount(c => c + delta * step)
				lastTick.current = now
				interval.current = randTime()
			}
			raf.current = requestAnimationFrame(tick)
		}

		raf.current = requestAnimationFrame(tick)
		return () => {
			if (raf.current) cancelAnimationFrame(raf.current)
		}
	}, [active])

	return format(count) + ' человек'
}
