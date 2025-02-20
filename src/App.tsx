import './App.css'
import { MidWatch } from './components/mid-watch/MidWatch'
import { PianoKeyBoard } from './components/piano-key-board/PianoKeyBoard'
import { SoundWatch } from './components/sound-watch/SoundWatch'
import { TrackRecord } from './components/track-record/TrackRecord'
import { Start } from './start/Start'
import { Flex } from './ui/flex'

function App() {
  return (
    <Start>
      <Flex vertical>
        <PianoKeyBoard />
        <TrackRecord />
      </Flex>
      <MidWatch />
      <SoundWatch />
    </Start>
  )
}

export default App
