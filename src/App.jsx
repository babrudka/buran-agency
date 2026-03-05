import { useState } from "react"

function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (

    <div>

      <header>

        <img src="/img/logo.svg" alt="Логотип БУРАН" />

        <nav>
          <a href="#" className="header-link">планеты</a>
          <a href="#" className="header-link">туры</a>
          <a href="#" className="header-link">о нас</a>
          <a href="#" className="header-link">экипировка</a>

          <a href="#" id="basket-link">
            <img src="/img/basket.svg" alt="корзина" />
          </a>
        </nav>

      </header>


      <main>

        <div className="front">

          <p className="zag">
            межпланетное туристическое агентство
          </p>

          <div className="planet">
            <img src="/img/theEarth.svg" alt="планета Земля" className="mainPlanet" />
          </div>

          <a
            href="#"
            className="more-details"
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(true)
            }}
          >
            подробнее о планете
          </a>

          {isOpen && (
            <div className="overlay" onClick={() => setIsOpen(false)}>

              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setIsOpen(false)}>
                  close
                </button>
              </div>

            </div>
          )}



        </div>


        <section className="swipe-planet">

          <img src="/img/venera.svg" alt="Венера" className="planet-left" />

          <div className="swipe swipe-left">

            <h1 className="onBtn">Венера</h1>

            <button className="btn-arrow">
              <img src="/img/Arrow-btn.svg" alt="Стрелка влево" />
            </button>

          </div>


          <div className="swipe swipe-right">

            <h1 className="onBtn">марс</h1>

            <button className="btn-arrow">
              <img src="/img/Arrow-btn-right.svg" alt="Стрелка вправо" />
            </button>

          </div>


          <img src="/img/mars.svg" alt="Марс" className="planet-right" />

        </section>

      </main>

    </div>

  )

}

export default App