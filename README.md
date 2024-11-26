# VideoPlayer

A custom video player built, designed to enhance video playback with advanced features.

## Features

- **Chapter Support**: Easily add chapters to the video progress bar to allow users to skip directly to specific sections.
- **Progress Bar Preview**: Hover over the progress bar to view a preview at a specific timestamp in the video.
- **Double Click to Full-Screen**: On supported browsers (Chrome, Edge, Firefox), you can double-click on the video to toggle full-screen mode.

## Installation

To get started with the project, follow the steps below.

### 1. Clone the repository
```bash
git clone https://github.com/Prathamattri/VideoPlayer.git
cd VideoPlayer
```
### 2. Install dependencies
```bash
pnpm install
```
### 3. Run the development server
```bash
pnpm dev
```
---
### The custom videoplayer component
```src/videoplayer/```: This folder contains the actual VideoPlayer component where all the functionality is implemented. The player includes features like chapters, progress bar preview, and full-screen support.

## Features Breakdown

-   **Chapters**:
    -   Chapters can be added to the video by providing a `chapters` array where each entry has a `timestamp` and a `title`.
-   **Progress Bar Preview**:
    -   When a user hovers over the progress bar, a preview image will appear at that specific timestamp.
-   **Full-Screen Mode**:
    -   The player supports double-click functionality to toggle full-screen mode.
    -   This works on Chrome, Edge, and Firefox browsers.

## Browser Support

-   **Full-Screen**: Supported in Chrome, Edge, and Firefox.
-   **General Playback**: The player should work across all modern browsers.

## License

This project is licensed under the MIT License.
