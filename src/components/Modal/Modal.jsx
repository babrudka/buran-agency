import "./Modal.css"

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  )
}
