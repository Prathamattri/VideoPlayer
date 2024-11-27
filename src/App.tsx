import './App.css'
import VideoPlayer, { Chapter } from './videoplayer/src'

function App() {

  const videoChapters: Chapter[] = [
    {
      title: "starting chapter title is here",
      startTime: 0
    },
    {
      title: "middle1 chapter title is here",
      startTime: 59
    },
    {
      title: "middle2 chapter title is here",
      startTime: 125
    },
    {
      title: "end chapter title is here",
      startTime: 450
    }

  ]

  return (
    <>
      <VideoPlayer
        type='video/mp4'
        src='http://localhost:8080/test_video.mp4'
        spriteSrc='http://localhost:8080/test_sprite2.jpeg'
        style={{ maxWidth: "80vw" }}
        chapters={videoChapters}
      />
    </>
  )
}

export default App
