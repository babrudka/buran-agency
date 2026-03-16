import { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TOUR_ANGLES = {
    1: [40],
    2: [0, 140],
}

const LINE_LENGTH = 0.55

export default function TourLines({ tours, planetId, circleSize, onTourClick }) {
    const [tourOffsets, setTourOffsets] = useState(() =>
        tours.map(() => ({ x: 0, y: 0 })),
    )
    const timerRef = useRef(null)

    useEffect(() => {
        const tourCount = tours.length
        if (tourCount === 0) return

        let animationStep = 0
        const phaseShifts = tours.map((_, tourIndex) => (tourIndex / tourCount) * Math.PI * 2)

        timerRef.current = setInterval(() => {
            animationStep += 1
            setTourOffsets(
                tours.map((_, tourIndex) => ({
                    x: 8 * Math.sin(animationStep * 0.07 + phaseShifts[tourIndex]),
                    y: 12 * Math.cos(animationStep * 0.07 + phaseShifts[tourIndex]),
                })),
            )
        }, 30)

        return () => clearInterval(timerRef.current)
    }, [tours.length])

    if (!tours.length || !circleSize) return null

    const radius = circleSize / 2
    const centerPoint = radius
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
            {tours.map((tourName, tourIndex) => {
                const angleDeg = angles[tourIndex] ?? 30
                const angleRad = (angleDeg * Math.PI) / 180

                const lineStartX = centerPoint + radius * Math.cos(angleRad)
                const lineStartY = centerPoint + radius * Math.sin(angleRad)

                const lineEndX = lineStartX + LINE_LENGTH * radius * Math.cos(angleRad) + (tourOffsets[tourIndex]?.x ?? 0)
                const lineEndY = lineStartY + LINE_LENGTH * radius * Math.sin(angleRad) + (tourOffsets[tourIndex]?.y ?? 0)

                const tagWidth = 800
                const tagHeight = 150
                const isOnRightSide = Math.cos(angleRad) < 0
                
                const tagX = isOnRightSide ? lineEndX - tagWidth : lineEndX
                const tagY = lineEndY - 35

                return (
                    <g key={tourName}>
                        <line
                            x1={lineStartX}
                            y1={lineStartY}
                            x2={lineEndX}
                            y2={lineEndY}
                            stroke='rgba(255,255,255,1)'
                            strokeWidth='1.5'
                            strokeDasharray='5 4'
                        />
                        <circle cx={lineEndX} cy={lineEndY} r='3' fill='rgba(255,255,255,1)' />
                        <foreignObject
                            x={tagX}
                            y={tagY}
                            width={tagWidth}
                            height={tagHeight}
                            className="clickable-overlay"
                        >
                            <div
                                xmlns='http://www.w3.org/1999/xhtml'
                                className={`tour-tag${isOnRightSide ? ' tour-tag--right' : ''}`}
                                onClick={() => onTourClick?.(tourName, tourIndex)}
                            >
                                Тур «{tourName}»
                            </div>
                        </foreignObject>
                    </g>
                )
            })}
            </motion.svg>
        </AnimatePresence>
    )
}