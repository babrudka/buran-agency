// import React, { useState, useEffect } from 'react';

// function Timer() {
//     const [seconds, setSeconds] = useState(0);

//     useEffect(() => {
//         // 1. Создаем интервал
//         const interval = setInterval(() => {
//             setSeconds(prev => prev + 1);
//         }, 1000);

//         // 2. Возвращаем функцию очистки (cleanup)
//         // Она сработает, когда компонент удалится или перед следующим запуском эффекта
//         return () => clearInterval(interval);
//     }, []); // Пустой массив: запускаем только один раз при старте

//     return (
//         <div>
//             <h1>Прошло времени: {seconds} сек.</h1>
//         </div>
//     );
// }

// export default Timer;


import { useState, useRef } from 'react';

function StopWatch() {
    const [seconds, setSeconds] = useState(0);
    const timerRef = useRef(null); // Здесь будет лежать ID интервала

    const start = () => {
        if (timerRef.current) return; // Чтобы не запустить дважды
        timerRef.current = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
    };

    const stop = () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    };

    return (
        <div>
            <p>Секунды: {seconds}</p>
            <button onClick={start}>Старт</button>
            <button onClick={stop}>Стоп</button>
        </div>
    );
}