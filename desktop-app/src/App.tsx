declare const require: any
import './App.css'
import { useState, useEffect } from 'react'

export default function App() {
const [sources, setSources] = useState<any[]>([])
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

          <div className="scene active">
            🎥 Camera 1
          </div>

          <div className="scene">
            🎵 Lyrics
          </div>

          <div className="scene">
            📢 Announcement
          </div>

          <h2>Sources</h2>

          <div className="source">
            📷 Camera Capture
          </div>
{sources.map((source) => (
  <button
  key={source.id}
  className="source-btn"
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