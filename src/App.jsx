import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MLB日本人選手クイズ</h1>
        <p>Wikipedia記事から生成されるクイズに挑戦しよう！</p>
        <button className="start-button">
          クイズを始める
        </button>
      </header>
    </div>
  )
}

export default App
