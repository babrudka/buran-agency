import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { planets, moon, buildTourData, formatDuration } from '../../data/planets'
import ModalTours from '../Modal/ModalTours'
import Footer from '../Footer/Footer'
import './ToursCatalog.css'

const allPlanets = [moon, ...planets]

const tours = allPlanets.flatMap(p =>
    (p.tours || []).map((name, i) => ({
        ...buildTourData(p, name, i)
    }))
)

const planetList = allPlanets.filter(p => p.tours && p.tours.length > 0)

const MIN_TEMP = -224
const MAX_TEMP = 460
const MAX_FLY_TIME = Math.max(...tours.map(t => t.flyTime))

function formatTemperature(degrees) {
    return `${degrees > 0 ? '+' : ''}${degrees}°C`
}

function Slider({ min, max, value, onChange, step = 1 }) {
    const [low, high] = value
    const left = ((low - min) / (max - min)) * 100
    const right = ((high - min) / (max - min)) * 100

    return (
        <div className='range'>
            <div className='range-track' />
            <div
                className='range-fill'
                style={{ left: `${left}%`, right: `${100 - right}%` }}
            />
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={low}
                onChange={e => {
                    const newLow = Number(e.target.value)
                    if (newLow <= high) onChange([newLow, high])
                }}
            />
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={high}
                onChange={e => {
                    const newHigh = Number(e.target.value)
                    if (newHigh >= low) onChange([low, newHigh])
                }}
            />
        </div>
    )
}

const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.04, duration: 0.3 },
    }),
}

export default function ToursCatalog() {

    const [selectedPlanets, setSelectedPlanets] = useState(new Set())
    const [temperatureRange, setTemperatureRange] = useState([MIN_TEMP, MAX_TEMP])
    const [flyTimeRange, setFlyTimeRange] = useState([0, MAX_FLY_TIME])

    const [tourModalOpen, setTourModalOpen] = useState(false)
    const [selectedTour, setSelectedTour] = useState(null)

    const openTour = (tour) => {
        setSelectedTour(tour)
        setTourModalOpen(true)
    }

    const togglePlanet = useCallback(id => {
        setSelectedPlanets(prev => {
            const updated = new Set(prev)
            if (updated.has(id)) {
                updated.delete(id)
            } else {
                updated.add(id)
            }
            return updated
        })
    }, [])

    const filteredTours = useMemo(() => {
        return tours.filter(tour => {
            if (selectedPlanets.size > 0 && !selectedPlanets.has(tour.planet)) return false
            if (tour.temp < temperatureRange[0] || tour.temp > temperatureRange[1]) return false
            if (tour.flyTime < flyTimeRange[0] || tour.flyTime > flyTimeRange[1]) return false
            return true
        })
    }, [selectedPlanets, temperatureRange, flyTimeRange])

    return (
        <div className='catalog'>

            <div className='filters'>

                <div className='chips'>
                    {planetList.map(planet => (
                        <button
                            key={planet.id}
                            className={`chip ${selectedPlanets.has(planet.id) ? 'chip--active' : ''}`}
                            onClick={() => togglePlanet(planet.id)}
                        >
                            {planet.name}
                        </button>
                    ))}
                </div>

                <div className='filters-row'>

                    <div className='slider-box'>
                        <span className='slider-name'>Температура</span>
                        <Slider
                            min={MIN_TEMP}
                            max={MAX_TEMP}
                            value={temperatureRange}
                            onChange={setTemperatureRange}
                        />
                        <div className='slider-nums'>
                            <span>{formatTemperature(temperatureRange[0])}</span>
                            <span>{formatTemperature(temperatureRange[1])}</span>
                        </div>
                    </div>

                    <div className='slider-box'>
                        <span className='slider-name'>Время полёта</span>
                        <Slider
                            min={0}
                            max={MAX_FLY_TIME}
                            value={flyTimeRange}
                            onChange={setFlyTimeRange}
                            step={60}
                        />
                        <div className='slider-nums'>
                            <span>{formatDuration(flyTimeRange[0])}</span>
                            <span>{formatDuration(flyTimeRange[1])}</span>
                        </div>

                        <div className='hint'>
                            <span className='hint-icon'>i</span>
                            <span className='hint-text'>
                                Скорость полёта на сверхбыстрой ракете ТАЙФУН 578 км/с
                            </span>
                        </div>

                    </div>

                </div>

            </div>

            {filteredTours.length === 0 ? (

                <div className='empty'>
                    Нет туров по заданным фильтрам
                </div>

            ) : (

                <div className='grid'>

                    {filteredTours.map((tour, i) => (

                        <motion.div
                            key={`${tour.planet}-${tour.name}`}
                            className='card'
                            custom={i}
                            initial='hidden'
                            animate='visible'
                            variants={cardAnimation}
                            onClick={() => openTour(tour)}
                        >

                            <img
                                className='card-img'
                                src={tour.img}
                                alt={tour.planetName}
                            />

                            <div className='card-info'>

                                <div className='card-name'>
                                    {tour.name}
                                </div>

                                <div className='card-planet'>
                                    {tour.planetName}
                                </div>

                                <div className='card-meta'>

                                    <span className='meta-item'>
                                        <img
                                            className='meta-icon'
                                            src='/img/icons/temp.svg'
                                            alt=''
                                        />
                                        {formatTemperature(tour.temp)}
                                    </span>

                                    <span className='meta-item'>
                                        {formatDuration(tour.flyTime)}
                                    </span>

                                </div>

                            </div>

                        </motion.div>

                    ))}

                </div>

            )}

            <Footer />

            <AnimatePresence>
                {tourModalOpen && (
                    <ModalTours
                        isOpen={tourModalOpen}
                        onClose={() => setTourModalOpen(false)}
                        tour={selectedTour}
                    />
                )}
            </AnimatePresence>

        </div>
    )
}