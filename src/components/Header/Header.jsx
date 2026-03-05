import "./Header.css"

export default function Header() {
  return (
    <header>
      <img src="/img/icons/logo.svg" alt="Логотип БУРАН" />

      <nav>
        <a href="#" className="header-link">планеты</a>
        <a href="#" className="header-link">туры</a>
        <a href="#" className="header-link">о нас</a>
        <a href="#" className="header-link">экипировка</a>

        <a href="#" id="basket-link">
          <img src="/img/icons/basket.svg" alt="корзина" />
        </a>
      </nav>
    </header>
  )
}
