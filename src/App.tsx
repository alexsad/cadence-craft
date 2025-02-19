import './App.css'
import { MidWatch } from './components/mid-watch/MidWatch'
import { PianoKeyBoard } from './components/piano-key-board/PianoKeyBoard'
import { SoundWatch } from './components/sound-watch/SoundWatch'
import { TrackRecord } from './components/track-record/TrackRecord'
import { Start } from './start/Start'

function App() {
  return (
    <Start>
      <PianoKeyBoard />
      <MidWatch />
      <SoundWatch />
      <TrackRecord />
    </Start>
  )
}

export default App
