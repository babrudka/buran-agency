import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { planets, moon, buildTourData } from '../../data/planets'
import ModalTours from '../Modal/ModalTours'
import Footer from '../Footer/Footer'
import './ToursCatalog.css'

const ROCKET_SPEED = 578

const allPlanets = [moon, ...planets]

const tours = allPlanets.flatMap(planet =>
    (planet.tours || []).map((tourName, tourIndex) => ({
        ...buildTourData(planet, tourName, tourIndex),
        planet: planet.id,
        image: planet.image,
        temperature: planet.temp,
        flightTime: planet.distance / ROCKET_SPEED,
    }))
)

const planetsWithTours = allPlanets.filter(planet => planet.tours && planet.tours.length > 0)

const MIN_TEMPERATURE = -224
const MAX_TEMPERATURE = 460
const MAX_FLIGHT_TIME = Math.max(...tours.map(tour => tour.flightTime))

const MIN_STAY_TIME = Math.min(...tours.map(tour => tour.stayTime || 0))
const MAX_STAY_TIME = Math.max(...tours.map(tour => tour.stayTime || 0))

const MIN_TOTAL_DURATION = Math.min(...tours.map(tour => tour.totalDuration || 0))
const MAX_TOTAL_DURATION = Math.max(...tours.map(tour => tour.totalDuration || 0))

function formatFlightTime(seconds) {
    if (seconds === 0) return 'Вы здесь'

    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24

    if (minutes < 120) return `~${Math.round(minutes)} мин`
    if (hours < 24)    return `~${hours.toFixed(1)} ч`
    return `~${days.toFixed(1)} дн`
}

function formatTemperature(degrees) {
    return `${degrees > 0 ? '+' : ''}${degrees}°C`
}

function formatHours(hours) {
    if (hours === 0) return '0 ч'
    if (hours < 24) return `${Math.round(hours)} ч`
    const days = hours / 24
    if (days < 30) return `${Math.round(days)} дн`
    const months = days / 30
    if (months < 12) return `~${months.toFixed(1)} мес`
    return `~${(days / 365).toFixed(1)} г`
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
                onChange={event => {
                    const newLowValue = Number(event.target.value)
                    if (newLowValue <= highValue) onChange([newLowValue, highValue])
                }}
            />
            <input
                type='range'
                min={min}
                max={max}
                step={step}
                value={highValue}
                onChange={event => {
                    const newHighValue = Number(event.target.value)
                    if (newHighValue >= lowValue) onChange([lowValue, newHighValue])
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
    const [temperatureRange, setTemperatureRange] = useState([MIN_TEMPERATURE, MAX_TEMPERATURE])
    const [flightTimeRange, setFlightTimeRange] = useState([0, MAX_FLIGHT_TIME])
    const [stayTimeRange, setStayTimeRange] = useState([MIN_STAY_TIME, MAX_STAY_TIME])
    const [totalDurationRange, setTotalDurationRange] = useState([MIN_TOTAL_DURATION, MAX_TOTAL_DURATION])

    const [isTourModalOpen, setIsTourModalOpen] = useState(false)
    const [selectedTour, setSelectedTour] = useState(null)

    const openTour = (tour) => {
        setSelectedTour(tour)
        setIsTourModalOpen(true)
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
            if (selectedPlanets.size > 0 && !selectedPlanets.has(tour.planet)) return false

            if (tour.temperature < temperatureRange[0] || tour.temperature > temperatureRange[1]) return false
            if (tour.flightTime < flightTimeRange[0] || tour.flightTime > flightTimeRange[1]) return false

            const stayTime = tour.stayTime || 0
            if (stayTime < stayTimeRange[0] || stayTime > stayTimeRange[1]) return false

            const totalDuration = tour.totalDuration || 0
            if (totalDuration < totalDurationRange[0] || totalDuration > totalDurationRange[1]) return false

            return true
        })
    }, [selectedPlanets, temperatureRange, flightTimeRange, stayTimeRange, totalDurationRange])

    return (
        <div className='catalog'>

            <div className='filters'>

                <div className='chips'>
                    {planetsWithTours.map(planet => (
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
                            min={MIN_TEMPERATURE}
                            max={MAX_TEMPERATURE}
                            value={temperatureRange}
                            onChange={setTemperatureRange}
                        />
                        <div className='slider-nums'>
                            <span>{formatTemperature(temperatureRange[0])}</span>
                            <span>{formatTemperature(temperatureRange[1])}</span>
                        </div>
                    </div>

                    <div className='slider-box'>
                        <span className='slider-name'>Время полёта в одну сторону</span>
                        <Slider
                            min={0}
                            max={MAX_FLIGHT_TIME}
                            value={flightTimeRange}
                            onChange={setFlightTimeRange}
                            step={60}
                        />
                        <div className='slider-nums'>
                            <span>{formatFlightTime(flightTimeRange[0])}</span>
                            <span>{formatFlightTime(flightTimeRange[1])}</span>
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
                            min={MIN_STAY_TIME}
                            max={MAX_STAY_TIME}
                            value={stayTimeRange}
                            onChange={setStayTimeRange}
                        />
                        <div className='slider-nums'>
                            <span>{formatHours(stayTimeRange[0])}</span>
                            <span>{formatHours(stayTimeRange[1])}</span>
                        </div>
                    </div>

                    <div className='slider-box'>
                        <span className='slider-name'>Полная длительность тура</span>
                        <Slider
                            min={MIN_TOTAL_DURATION}
                            max={MAX_TOTAL_DURATION}
                            value={totalDurationRange}
                            onChange={setTotalDurationRange}
                        />
                        <div className='slider-nums'>
                            <span>{formatHours(totalDurationRange[0])}</span>
                            <span>{formatHours(totalDurationRange[1])}</span>
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
                            key={`${tour.planet}-${tour.name}`}
                            className='card'
                            custom={cardIndex}
                            initial='hidden'
                            animate='visible'
                            variants={cardAnimation}
                            onClick={() => openTour(tour)}
                        >

                            <img
                                className='card-img'
                                src={tour.image}
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
                                        {formatTemperature(tour.temperature)}
                                    </span>

                                    <span className='meta-item'>
                                        {formatFlightTime(tour.flightTime)}
                                    </span>

                                </div>

                            </div>

                        </motion.div>

                    ))}

                </div>

            )}

            <Footer />

            <AnimatePresence>
                {isTourModalOpen && (
                    <ModalTours
                        isOpen={isTourModalOpen}
                        onClose={() => setIsTourModalOpen(false)}
                        tour={selectedTour}
                    />
                )}
            </AnimatePresence>

        </div>
    )
}
