import Markdown from 'react-markdown'
import './App.css'
import VideoPlayer, { Chapter } from './videoplayer/src'

function App() {

  const videoChapters: Chapter[] = [
    {
      title: "First Chapter",
      startTime: 0
    },
    {
      title: "Second Chapter",
      startTime: 59
    },
    {
      title: "Third Chapter",
      startTime: 125
    },
    {
      title: "Last Chapter",
      startTime: 450
    }

  ]

  return (
    <>
      <h1 className='animated-text'><span>CUSTOM VIDEO PLAYER</span></h1>
      <div style={{ height: "60px" }}>
        <a
          href='https://github.com/Prathamattri/videoplayer.git'
          style={{ filter: "invert(1)" }}
        >
          <GithubIcon />
        </a>
      </div>
      <VideoPlayer
        type='video/mp4'
        src={import.meta.env.VITE_VideoURI}
        spriteSrc={import.meta.env.VITE_SpriteURI}
        chapters={videoChapters}
        style={{ maxWidth: "80vw", borderRadius: "0.4em" }}
      />
      <div style={{ textAlign: "left" }}>
        <Markdown>
          {pageMarkdown}
        </Markdown>
      </div>
    </>
  )
}

const pageMarkdown = `
# CustomVideoPlayer

A custom video player built and designed to enhance video playback with advanced features.

## Features

- **Chapter Support**: Easily add chapters to the video progress bar to allow users to skip directly to specific sections.
- **Progress Bar Preview**: Hover over the progress bar to view a preview at a specific timestamp in the video.
- **Double Click to Full - Screen**: On supported browsers(Chrome, Edge, Firefox), you can double - click on the video to toggle full - screen mode.

## Installation

To get started with the project, follow the steps below.

### 1. Clone the repository
  \`\`\`bash
git clone https://github.com/Prathamattri/VideoPlayer.git
cd VideoPlayer
  \`\`\`
### 2. Install dependencies
  \`\`\`bash
pnpm install
  \`\`\`
### 3. Run the development server
  \`\`\`bash
pnpm dev
  \`\`\`
---
## The custom videoplayer component
  \`\`\`src / videoplayer / \`\`\`: This folder contains the actual VideoPlayer component where all the functionality is implemented.The player includes features like chapters, progress bar preview, and full - screen support.

## Features Breakdown

-  **Chapters**: Chapters can be added to the video by providing a \`chapters\` array where each entry has a \`timestamp\` and a \`title\`.
-  **Progress Bar Preview**:  When a user hovers over the progress bar, a preview image will appear at that specific timestamp.
-  **Full - Screen Mode**:
    - The player supports double - click functionality to toggle full - screen mode.
    - This works on Chrome, Edge, and Firefox browsers.

## Browser Support

  -  **Full - Screen**: Supported in Chrome, Edge, and Firefox.
  -  **General Playback**: The player should work across all modern browsers.

  `

function GithubIcon() {
  return (
    <>
      <svg height="32" width="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" data-view-component="true">
        <path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
      </svg>
    </>
  )
}

export default App
