import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { planets, moon, buildTourData, formatDuration } from '../../data/planets'
import ModalTours from '../Modal/ModalTours'
import Footer from '../Footer/Footer'
import './ToursCatalog.css'

const allPlanets = [moon, ...planets]

const tours = allPlanets.flatMap(planet =>
    (planet.tours || []).map((tourName, tourIndex) => {
        const data = buildTourData(planet, tourName, tourIndex)
        return {
            ...data,
            planetId: planet.id,
            temp: Number(data.temp),
            flyTime: Number(data.flyTime),
            stayTime: Number(data.stayTime || 0),
            totalDuration: Number(data.totalDuration || 0)
        }
    })
)

const planetList = allPlanets.filter(planet => planet.tours && planet.tours.length > 0)

const MIN_TEMP = Math.min(...tours.map(t => t.temp))
const MAX_TEMP = Math.max(...tours.map(t => t.temp))
const MAX_FLY_TIME = Math.ceil(Math.max(...tours.map(t => t.flyTime)))
const MIN_STAY = Math.floor(Math.min(...tours.map(t => t.stayTime)))
const MAX_STAY = Math.ceil(Math.max(...tours.map(t => t.stayTime)))
const MIN_TOTAL = Math.floor(Math.min(...tours.map(t => t.totalDuration)))
const MAX_TOTAL = Math.ceil(Math.max(...tours.map(t => t.totalDuration)))

function formatTemperature(degrees) {
    return `${degrees > 0 ? '+' : ''}${degrees}°C`
}

function Slider({ min, max, value, onChange, step = 1 }) {
    const [lowValue, highValue] = value
    const leftPercent = ((lowValue - min) / (max - min)) * 100
    const rightPercent = ((highValue - min) / (max - min)) * 100

    return (
        <div className='range'>
            <div className='range-track' />
            <div
                className='range-fill'
                style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
            />
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={lowValue}
                className="range-input"
                style={{ zIndex: lowValue > max / 2 ? 5 : 4 }}
                onChange={event => {
                    const val = Number(event.target.value)
                    if (val <= highValue) onChange([val, highValue])
                }}
            />
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={highValue}
                className="range-input"
                style={{ zIndex: highValue < max / 2 ? 5 : 4 }}
                onChange={event => {
                    const val = Number(event.target.value)
                    if (val >= lowValue) onChange([lowValue, val])
                }}
            />
        </div>
    )
}

const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: cardIndex => ({
        opacity: 1,
        y: 0,
        transition: { delay: cardIndex * 0.04, duration: 0.3 },
    }),
}

export default function ToursCatalog() {
    const [selectedPlanets, setSelectedPlanets] = useState(new Set())
    const [temperatureRange, setTemperatureRange] = useState([MIN_TEMP, MAX_TEMP])
    const [flyTimeRange, setFlyTimeRange] = useState([0, MAX_FLY_TIME])
    const [stayRange, setStayRange] = useState([MIN_STAY, MAX_STAY])
    const [totalRange, setTotalRange] = useState([MIN_TOTAL, MAX_TOTAL])

    const [tourModalOpen, setTourModalOpen] = useState(false)
    const [selectedTour, setSelectedTour] = useState(null)

    const openTour = (tour) => {
        setSelectedTour(tour)
        setTourModalOpen(true)
    }

    const togglePlanet = useCallback(planetId => {
        setSelectedPlanets(previousSelection => {
            const updatedSelection = new Set(previousSelection)
            if (updatedSelection.has(planetId)) {
                updatedSelection.delete(planetId)
            } else {
                updatedSelection.add(planetId)
            }
            return updatedSelection
        })
    }, [])

    const filteredTours = useMemo(() => {
        return tours.filter(tour => {
            if (selectedPlanets.size > 0 && !selectedPlanets.has(tour.planetId)) return false
            if (tour.temp < temperatureRange[0] || tour.temp > temperatureRange[1]) return false
            if (tour.flyTime < flyTimeRange[0] || tour.flyTime > flyTimeRange[1]) return false
            if (tour.stayTime < stayRange[0] || tour.stayTime > stayRange[1]) return false
            if (tour.totalDuration < totalRange[0] || tour.totalDuration > totalRange[1]) return false
            return true
        })
    }, [selectedPlanets, temperatureRange, flyTimeRange, stayRange, totalRange])

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
                            step={1}
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

                    <div className='slider-box'>
                        <span className='slider-name'>Время пребывания на планете</span>
                        <Slider
                            min={MIN_STAY}
                            max={MAX_STAY}
                            value={stayRange}
                            onChange={setStayRange}
                        />
                        <div className='slider-nums'>
                            <span>{formatDuration(stayRange[0])}</span>
                            <span>{formatDuration(stayRange[1])}</span>
                        </div>
                    </div>

                    <div className='slider-box'>
                        <span className='slider-name'>Полная длительность тура</span>
                        <Slider
                            min={MIN_TOTAL}
                            max={MAX_TOTAL}
                            value={totalRange}
                            onChange={setTotalRange}
                        />
                        <div className='slider-nums'>
                            <span>{formatDuration(totalRange[0])}</span>
                            <span>{formatDuration(totalRange[1])}</span>
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
                    {filteredTours.map((tour, cardIndex) => (
                        <motion.div
                            key={`${tour.planetId}-${tour.name}-${tour.totalDuration}`}
                            className='card'
                            custom={cardIndex}
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
                                <div className='card-name'>{tour.name}</div>
                                <div className='card-planet'>{tour.planetName}</div>
                                <div className='card-meta'>
                                    <span className='meta-item'>
                                        <img className='meta-icon' src='/img/icons/temp.svg' alt='' />
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