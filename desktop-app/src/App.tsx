declare const require: any
import './App.css'
import { useState, useEffect } from 'react'

export default function App() {
  const [sources, setSources] = useState<any[]>([])
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [activeScene, setActiveScene] = useState('camera')

  useEffect(() => {
    loadSources()
  }, [])
const loadSources = async () => {
  const result = await require('electron')
    .ipcRenderer
    .invoke('get-sources')

  console.log(result)

 setSources(
  result.filter(
    (source: any) =>
      source.name &&
      source.name !== 'DesktopWindowXamlSource'
  )
)
}
const selectSource = async (sourceId: string) => {
  setSelectedSource(sourceId)

    try {
    const stream = await (navigator.mediaDevices as any).getUserMedia({
  audio: false,
  video: {
    mandatory: {
      chromeMediaSource: 'desktop',
      chromeMediaSourceId: sourceId
    }
  }
})

    const video = document.getElementById(
      'preview-video'
    ) as HTMLVideoElement

    if (video) {
      video.srcObject = stream
      await video.play()
    }
  } catch (err) {
    console.error(err)
  }
}
  const startCapture = async () => {
  try {

    const stream = await (navigator.mediaDevices as any).getUserMedia({
      video: {
        mandatory: {
          chromeMediaSource: 'desktop'
        }
      }
    })

    const video = document.getElementById(
      'preview-video'
    ) as HTMLVideoElement

    if (video) {
      video.srcObject = stream
      await video.play()
    }

  } catch (err) {
    console.error(err)
    alert(JSON.stringify(err))
  }
}

  return (
    <div className="app">

      <div className="topbar">

        <h1>Broadcast Suite</h1>

        <div className="controls">

          <button
            className="stream-btn"
            onClick={startCapture}
          >
            START STREAM
          </button>

          <button className="record-btn">
            START RECORDING
          </button>

        </div>

      </div>

      <div className="main-layout">

        <div className="sidebar">

          <h2>Scenes</h2>

          <div
  className={activeScene === 'camera' ? 'scene active' : 'scene'}
  onClick={() => setActiveScene('camera')}
>
  📹 Camera 1
</div>

          <div
  className={activeScene === 'lyrics' ? 'scene active' : 'scene'}
  onClick={() => setActiveScene('lyrics')}
>
  🎵 Lyrics
</div>

          <div
  className={activeScene === 'announcement' ? 'scene active' : 'scene'}
  onClick={() => setActiveScene('announcement')}
>
  📢 Announcement
</div>

          <h2>Sources</h2>

          <div className="source">
            📷 Camera Capture
          </div>
{sources.map((source) => (
  <button
  key={source.id}
  className={
    selectedSource === source.id
      ? "source-btn active"
      : "source-btn"
  }
  onClick={() => selectSource(source.id)}
>
  {source.name}
</button>
))}
          <div className="source">
            🌐 Browser Source
          </div>

          <div className="source">
            🎬 Media Source
          </div>

        </div>

        <div className="preview-area">

          <div className="preview-window">

  {activeScene === 'camera' && (
    <video
      id="preview-video"
      autoPlay
      muted
      playsInline
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  )}

  {activeScene === 'lyrics' && (
    <div className="lyrics-scene">
      <h1>Amazing Grace</h1>
      <p>How sweet the sound</p>
    </div>
  )}

  {activeScene === 'announcement' && (
    <div className="announcement-scene">
      <h1>Announcement</h1>
      <p>Service will begin in 10 minutes</p>
    </div>
  )}

</div>

</div>

<div className="mixer">

          <h2>Audio Mixer</h2>

          <div className="slider-group">
            <label>Mic</label>
            <input type="range" />
          </div>

          <div className="slider-group">
            <label>Desktop Audio</label>
            <input type="range" />
          </div>

          <div className="slider-group">
            <label>Music</label>
            <input type="range" />
          </div>

        </div>

 </div>
</div>
)
}