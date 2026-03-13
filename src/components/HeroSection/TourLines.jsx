import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TOUR_ANGLES = {
    1: [40],
    2: [0, 140],
}

const LINE_LENGTH = 0.55

export default function TourLines({ tours, planetId, size, onTourClick }) {
    const [offsets, setOffsets] = useState(() =>
        tours.map(() => ({ x: 0, y: 0 })),
    )
    const timerRef = useRef(null)

    useEffect(() => {
        const count = tours.length
        if (count === 0) return

        let step = 0
        const phaseShifts = tours.map((_, i) => (i / count) * Math.PI * 2)

        timerRef.current = setInterval(() => {
            step += 1
            setOffsets(
                tours.map((_, i) => ({
                    x: 8 * Math.sin(step * 0.07 + phaseShifts[i]),
                    y: 12 * Math.cos(step * 0.07 + phaseShifts[i]),
                })),
            )
        }, 30)

        return () => clearInterval(timerRef.current)
    }, [tours.length])

    if (!tours.length || !size) return null

    const radius = size / 2
    const center = radius
    const angles = TOUR_ANGLES[tours.length] ?? TOUR_ANGLES[1]

    return (
        <AnimatePresence mode='wait'>
            <motion.svg
                key={planetId}
                className="tour-layer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.35, delay: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
            {tours.map((name, i) => {
                const angleDeg = angles[i] ?? 30
                const angleRad = (angleDeg * Math.PI) / 180

                const startX = center + radius * Math.cos(angleRad)
                const startY = center + radius * Math.sin(angleRad)

                const endX = startX + LINE_LENGTH * radius * Math.cos(angleRad) + (offsets[i]?.x ?? 0)
                const endY = startY + LINE_LENGTH * radius * Math.sin(angleRad) + (offsets[i]?.y ?? 0)

                const tagWidth = 800
                const tagHeight = 150
                const isRight = Math.cos(angleRad) < 0
                
                const tagX = isRight ? endX - tagWidth : endX
                const tagY = endY - 35

                return (
                    <g key={name}>
                        <line
                            x1={startX}
                            y1={startY}
                            x2={endX}
                            y2={endY}
                            stroke='rgba(255,255,255,1)'
                            strokeWidth='1.5'
                            strokeDasharray='5 4'
                        />
                        <circle cx={endX} cy={endY} r='3' fill='rgba(255,255,255,1)' />
                        <foreignObject
                            x={tagX}
                            y={tagY}
                            width={tagWidth}
                            height={tagHeight}
                            className="fo-click"
                        >
                            <div
                                xmlns='http://www.w3.org/1999/xhtml'
                                className={`tour-tag${isRight ? ' tour-tag--right' : ''}`}
                                onClick={() => onTourClick?.(name, i)}
                            >
                                Тур «{name}»
                            </div>
                        </foreignObject>
                    </g>
                )
            })}
            </motion.svg>
        </AnimatePresence>
    )
}