import './App.css'
import { MidWatch } from './components/mid-watch/MidWatch'
import { PianoKeyBoard } from './components/piano-key-board/PianoKeyBoard'
import { Start } from './start/Start'

function App() {
  return (
    <Start>
      <PianoKeyBoard />
      <MidWatch />
    </Start>
  )
}

export default App
