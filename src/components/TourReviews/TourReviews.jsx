import './TourReviews.css'

function StarRow({ value, size = 'md' }) {
    const clamped = Math.min(5, Math.max(0, value))
    const stars = []
    for (let i = 1; i <= 5; i++) {
        const fill = Math.min(1, Math.max(0, clamped - i + 1))
        stars.push(
            <span key={i} className={`star-box star-box--${size}`} aria-hidden>
                <span className="star-icon star-icon--empty">★</span>
                <span
                    className="star-icon star-icon--filled"
                    style={{ width: `${fill * 100}%` }}
                >
                    ★
                </span>
            </span>
        )
    }
    return <span className="star-row">{stars}</span>
}

export function TourRatingBadge({ rating, className = '' }) {
    if (rating == null) return null
    const formatted = rating.toLocaleString('ru-RU', {
        minimumFractionDigits: Number.isInteger(rating) ? 0 : 1,
        maximumFractionDigits: 1,
    })
    return (
        <div className={`rating-badge ${className}`.trim()} title={`Рейтинг: ${formatted} из 5`}>
            <StarRow value={rating} size="sm" />
            <span className="rating-number">{formatted}</span>
        </div>
    )
}

function pluralReviews(n) {
    if (n === 1) return 'отзыв'
    if (n >= 2 && n <= 4) return 'отзыва'
    return 'отзывов'
}

export function TourReviewsPanel({ data, compact }) {
    if (!data?.reviews?.length) return null

    const formatted = data.rating.toLocaleString('ru-RU', {
        minimumFractionDigits: Number.isInteger(data.rating) ? 0 : 1,
        maximumFractionDigits: 1,
    })

    return (
        <section className={`reviews-panel ${compact ? 'reviews-panel--compact' : ''}`} aria-label="Отзывы о туре">
            {!compact && (
                <div className="reviews-header">
                    <h2 className="reviews-title">отзывы путешественников</h2>
                    <div className="reviews-info">
                        <StarRow value={data.rating} size="lg" />
                        <span className="reviews-info-text">
                            {formatted} · {data.count} {pluralReviews(data.count)}
                        </span>
                    </div>
                </div>
            )}
            <ul className="reviews-list">
                {data.reviews.map((rev, i) => (
                    <li key={i} className="review-item">
                        <div className="review-item-header">
                            <span className="review-author">{rev.author}</span>
                            <StarRow value={rev.stars} size="sm" />
                        </div>
                        <p className="review-text">{rev.text}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}
