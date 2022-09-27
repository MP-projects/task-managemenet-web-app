import React from 'react'
//styles
import "./Board.css"

export default function Board() {
  return (
    <div className='board__wrapper'>
      <section className="board__empty">
        <div className="board__empty-text-wrapper">
          <p className="board__empty-text">This board is empty. Create a new column to get started.</p>
        </div>
        <button className="board__empty-add-button">
          <p className="board__empty-button-text">+ Add New Column</p>
        </button>
     </section>
    </div>
  )
}
