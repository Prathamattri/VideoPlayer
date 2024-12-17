import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import "./index.css"
import { PlayIconSvg, PauseIconSvg, ChaptersSvg, PipIconSvg, AudioOffSvg, AudioPrimarySvg, FullScreenSvg, ExitFullScreenSvg, ReplayIconSvg } from "./assets/"

type VideoPlayerPropTypes = {
	src: string,
	spriteSrc: string,
	type: "video/x-msvideo" | "video/mp4" | "video/mpeg" | "video/ogg" | "video/mp2t" | "video/webm" | "video/3gpp" | "video/3gpp2",
	chapters?: Chapter[],
	previewTilesUrl?: string
	previewTileDimension?: number
	style?: React.CSSProperties
}

export type Chapter = {
	startTime: number,
	title: string
}


type VideoSharedContextTypes = {
	videoMetadata: {
		currentTime: number,
		duration: number,
		atPointerTime: number,
		currentChapter: string,
	},
	setVideoMetadata: React.Dispatch<React.SetStateAction<{
		currentTime: number,
		duration: number,
		atPointerTime: number,
		currentChapter: string,
	}>>,
	videoRef: React.MutableRefObject<HTMLVideoElement | null>,
	spriteSrc: string
}

const VideoMetadataContext = createContext<VideoSharedContextTypes | null>(null)

/**
 * @function calculateDuration
 * @param duration Duration in seconds
 */
function calculateDuration(duration: number): string {
	const hours = Math.floor(duration / 3600).toString().padStart(2, "0");
	const minutes = Math.floor((duration % 3600) / 60).toString().padStart(2, "0");
	const seconds = Math.floor((duration % 3600) % 60).toString().padStart(2, "0");

	return `${hours !== "00" ? hours + ':' : ''}${minutes}:${seconds}`
}

/**This is the main component of the custom react video player */
export default function VideoPlayer({
	src,
	spriteSrc,
	type,
	style,
	chapters
}: VideoPlayerPropTypes
) {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const [videoMetadata, setVideoMetadata] = useState({
		currentTime: 0,
		duration: 0,
		atPointerTime: 0,
		currentChapter: ""
	})
	const [videoCurrentState, setVideoCurrentState] = useState({
		playState: "pause",
		volumeLevel: 1,
		fullScreen: false,
		playbackRate: 1
	});
	const [isControlsVisible, setIsControlsVisible] = useState(false)
	const visibilityTimeout = useRef<number | undefined>()

	const [playPauseToggleIcon, setPlayPauseToggleIcon] = useState(<img src={PlayIconSvg} alt="Play Icon" />);

	// Creating value context for avoiding props chain
	const videoSharedContextValue: VideoSharedContextTypes = {
		videoMetadata: videoMetadata,
		setVideoMetadata: setVideoMetadata,
		videoRef: videoRef,
		spriteSrc: spriteSrc
	}


	useEffect(() => {
		videoRef.current?.addEventListener("loadedmetadata", function() {
			setVideoMetadata(prevState => ({
				...prevState,
				duration: videoRef.current?.duration!
			}))
		})

		videoRef.current?.addEventListener("waiting", function() {
			setVideoCurrentState(prevState => ({
				...prevState,
				playState: "pause",
			}));
		})
		videoRef.current?.addEventListener("playing", function() {
			setVideoCurrentState(prevState => ({
				...prevState,
				playState: "play"
			}));
		})
		videoRef.current?.addEventListener("timeupdate", function() {
			if (videoRef.current == undefined) return;
			const time = videoRef.current.currentTime
			setVideoMetadata(prevState => ({
				...prevState,
				currentTime: time
			}))
		})

		return () => {
			videoRef.current?.removeEventListener("loadedmetadata", () => { })
		}
	}, [])

	useEffect(() => {
		/** @function handleKeyDown
		 * @description Responsible for working with videoplayer state on keypress
		 */
		let newVolume: number
		const handleKeyDown = (e: KeyboardEvent) => {
			let newTime: number
			switch (e.key) {
				case "k":
				case " ":
					e.preventDefault();
					togglePlayState()
					break;
				case "f":
					toggleFullScreen();
					break;
				case "m":
					changeAudioVolume();
					break;
				case "ArrowUp":
					if (!videoRef.current?.paused) e.preventDefault()
					newVolume = Math.min(Math.max(0, videoCurrentState.volumeLevel + 0.05), 1)
					changeAudioVolume(newVolume);
					break;
				case "ArrowDown":
					if (!videoRef.current?.paused) e.preventDefault()
					newVolume = Math.min(Math.max(0, videoCurrentState.volumeLevel - 0.05), 1)
					changeAudioVolume(newVolume);
					break;
				case "h":
				case "ArrowLeft":
					console.log("arrow left")
					newTime = Math.min(Math.max(0, videoMetadata.currentTime - 10), videoMetadata.duration)
					setVideoMetadata(prevData => ({
						...prevData,
						currentTime: newTime
					}))
					if (videoRef.current != null)
						videoRef.current.currentTime = newTime
					break;
				case "l":
				case "ArrowRight":
					console.log("arrow right")
					newTime = Math.min(Math.max(0, videoMetadata.currentTime + 10), videoMetadata.duration)
					setVideoMetadata(prevData => ({
						...prevData,
						currentTime: newTime
					}))
					if (videoRef.current != null)
						videoRef.current.currentTime = newTime
					break;


			}
			if (e.key <= "9" && e.key >= "0") {
				let newTime = videoMetadata.duration * 0.1 * parseInt(e.key)
				setVideoMetadata(prevData => ({
					...prevData,
					currentTime: newTime
				}))
				if (videoRef.current != null)
					videoRef.current.currentTime = newTime
			}


		}

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [videoCurrentState]);


	/** @function togglePlayState
	 * @description 
	 * Toggle VideoCurrentState.PlayState variable when used
	 */
	function togglePlayState(playState?: string) {
		if (!playState) playState = videoCurrentState.playState
		switch (playState) {
			case "waiting":
				setVideoCurrentState(prevState => ({
					...prevState,
					playState: "pause"
				}));
				break;
			case "play":
				videoRef.current?.pause();
				setPlayPauseToggleIcon(<img src={PlayIconSvg} alt="Play Icon" />);
				setVideoCurrentState(prevState => ({
					...prevState,
					playState: "pause"
				}));
				break;
			case "pause":
			case "replay":
				videoRef.current?.play();
				setPlayPauseToggleIcon(<img src={PauseIconSvg} alt="Pause Icon" />);
				setVideoCurrentState(prevState => ({
					...prevState,
					playState: "play"
				}));
				break;
			default:
				throw Error("Unexpected input recieved")
		}
	}


	/**
	 * @function toggleFullScreen
	 * @description
	 * Toggle Full Screen state on use
	 */
	const toggleFullScreen = useCallback(() => {
		switch (videoCurrentState.fullScreen) {
			case true:
				document.exitFullscreen()
				setVideoCurrentState(prevState => ({
					...prevState,
					fullScreen: false
				}));
				break;
			case false:
				document.getElementById("videoplayer")?.requestFullscreen();
				setVideoCurrentState(prevState => ({
					...prevState,
					fullScreen: true
				}));
				break;
			default:
				throw new Error("Unable to toggle fullscreen state");
		}
	}, [videoCurrentState.fullScreen])

	/**
	 * @function changeAudioVolume
	 * @description
	 * Toggle Audio Muted state
	 * @param volumeLevel 
	 */
	const changeAudioVolume = useCallback(function(volumeLevel?: number) {
		if (videoRef.current)
			if (volumeLevel) {
				// User is trying to change volume using slider

				videoRef.current.volume = volumeLevel
				setVideoCurrentState(prevState => ({
					...prevState,
					volumeLevel: Math.min(Math.max(volumeLevel, 0), 1)
				}));
			} else
				// User is trying to change volume using icon
				// toggling volume based on current volume level
				switch (videoCurrentState.volumeLevel) {
					case 0:
						videoRef.current.volume = 0.5
						setVideoCurrentState(prevState => ({
							...prevState,
							volumeLevel: 0.5
						}));
						break;
					default:
						videoRef.current.volume = 0
						setVideoCurrentState(prevState => ({
							...prevState,
							volumeLevel: 0
						}));
				}
	}, [videoCurrentState.volumeLevel])

	/**
	 * @function changeVideoPlaybackRate
	 * @description
	 * Change plaback speed of video
	 * @param playbackRate 
	 */
	function changeVideoPlaybackRate(playbackRate: number) {
		if (videoRef.current) {
			setVideoCurrentState(prevVal => ({
				...prevVal,
				playbackRate: playbackRate
			}))
			videoRef.current.playbackRate = playbackRate
		}
	}
	return (
		<VideoMetadataContext.Provider value={videoSharedContextValue}>
			<div className="videoplayer" id="videoplayer" style={style} onDoubleClick={toggleFullScreen} onMouseMove={() => {

				setIsControlsVisible(true)
				clearTimeout(visibilityTimeout.current)

				if (!videoRef.current?.paused) {
					visibilityTimeout.current = setTimeout(() => {
						setIsControlsVisible(false)
					}, 1000)
				}

			}}>
				<video
					ref={videoRef}
					onClick={() => {
						togglePlayState()
					}}
					onEnded={() => {
						setPlayPauseToggleIcon(<img src={ReplayIconSvg} alt="Play Icon" />);
						setVideoCurrentState(prevState => ({
							...prevState,
							playState: "replay"
						}));
					}}>
					<source src={src} type={type} />
				</video>
				<div className={`controls-group ${isControlsVisible ? "visible" : "hidden"}`}>
					<div className="video-buttons">
						<div className="btn-group">
							<button className="player-btn-xs tool" data-icon="P" aria-label="play pause toggle" onClick={() => togglePlayState()}>
								{playPauseToggleIcon}
								<span className="tooltip">Play Pause Toggle</span>
							</button>
							<time>
								{calculateDuration(videoMetadata.currentTime)}
							</time>
							/
							<time>
								{calculateDuration(videoMetadata.duration)}
							</time>
							<div className="audio-ctrl-group">
								<button className="player-btn-xs tool" onClick={() => changeAudioVolume()}>
									{
										videoCurrentState.volumeLevel == 0 ?
											<img src={AudioOffSvg} alt="Audio Icon" />
											:
											<img src={AudioPrimarySvg} alt="Audio Icon" />
									}
									<span className="tooltip">Audio Mute on/off</span>
								</button>
								<input type="range" step={0.05} max={1} min={0} value={videoCurrentState.volumeLevel} onChange={(e) => changeAudioVolume(e.target.valueAsNumber)} />
							</div>
						</div>
						<div className="btn-group">
							<select className="speed-ctrl" onChange={(e) => changeVideoPlaybackRate(parseFloat(e.currentTarget.value))} defaultValue={videoCurrentState.playbackRate}>
								<option value={0.25} >0.25x</option>
								<option value={0.5} >0.5x</option>
								<option value={1}>1x</option>
								<option value={1.5} >1.5x</option>
								<option value={1.75} >1.75x</option>
								<option value={2} >2x</option>
								<option value={3} >3x</option>
							</select>
							<GoToChapter chapters={chapters} />
							<button className="player-btn-xs tool" onClick={() => videoRef.current?.requestPictureInPicture()}>
								<img src={PipIconSvg} alt="Picture in Picture icon" />
								<span className="tooltip">Picture in picture</span>
							</button>
							{
								videoCurrentState.fullScreen == false ?
									<button className="player-btn-xs tool" onClick={toggleFullScreen}>
										<img src={FullScreenSvg} alt="FullScreen Icon" />
										<span className="tooltip">Enter Fullscreen</span>
									</button>

									:

									<button className="player-btn-xs tool" onClick={toggleFullScreen}>
										<img src={ExitFullScreenSvg} alt="Exit FullScreen Icon" />
										<span className="tooltip">Exit Fullscreen</span>
									</button>
							}
						</div>
					</div>

					<div className="progress-bar" >
						{
							chapters !== undefined &&
							<ChaptersOverlay data={chapters} totalDuration={videoRef.current?.duration!} />
						}

					</div>
				</div>
			</div>
		</VideoMetadataContext.Provider>
	);
}


/**This component contains the chapters info for rendering
 *chapter on the progress bar
 */

function ChaptersOverlay({ data, totalDuration }: { data: Chapter[], totalDuration: number }) {

	const video_ctx = useContext(VideoMetadataContext)

	const thumbnailLeftSpacingRef = useRef(0);

	if (video_ctx?.videoMetadata.duration !== undefined) {
		thumbnailLeftSpacingRef.current = video_ctx.videoMetadata.atPointerTime / video_ctx.videoMetadata.duration * 100;
	}


	const chaptersMappedToProgressBarElements = data.map((chapter, idx) => {
		let widthOfChapterBar;
		let chapterDuration;
		if (idx < data.length - 1) {
			chapterDuration = (data[idx + 1].startTime - chapter.startTime);
			widthOfChapterBar = chapterDuration * 100 / totalDuration;
		} else {
			chapterDuration = (totalDuration - chapter.startTime);
			widthOfChapterBar = chapterDuration * 100 / totalDuration;
		}
		return <ChapterContainer chapter={chapter} props={{ widthOfChapterBar, chapterDuration }} key={idx} />
	});

	/**Thumbnail are extracted from sprites in 10x10 grid
		*our thumbnail size in CSS : 160px / 90px
		*/
	const thumbnailBackgroundSize = "1600px 900px"
	let background_pos_x = 0;
	let background_pos_y = 0;

	if (video_ctx?.videoMetadata !== undefined) {

		background_pos_x = Math.floor(video_ctx?.videoMetadata.atPointerTime / video_ctx?.videoMetadata.duration * 100);
		background_pos_y = Math.floor(video_ctx?.videoMetadata.atPointerTime / video_ctx?.videoMetadata.duration * 10);

	}
	const thumbnailBackgroundPos = `${background_pos_x * -160}px ${background_pos_y * -90}px`;

	return (
		<div className="video-chapters">
			<div className="player-chapter-thumbnail-container"
				style={{ left: `min(max(150px,${thumbnailLeftSpacingRef.current}%),calc(100% - 150px))` }}
			>
				<div className="player-chapter-thumbnail"
					style={{
						background: `url('${video_ctx?.spriteSrc}')`, backgroundSize: thumbnailBackgroundSize, backgroundPosition: thumbnailBackgroundPos
					}}
				>
				</div>
				<p>
					{video_ctx?.videoMetadata.currentChapter}
				</p>
				<time>{video_ctx !== null && video_ctx?.videoMetadata?.currentTime !== null && calculateDuration(video_ctx.videoMetadata.atPointerTime)}</time>
			</div>
			{chaptersMappedToProgressBarElements}
		</div>
	)
}

function GoToChapter({ chapters }: { chapters?: Chapter[] }) {
	const [showChapter, setShowChapter] = useState(false)

	const video_ctx = useContext(VideoMetadataContext)
	if (chapters == undefined) {
		return <> </>
	}

	return (
		<div className="chapter-list-container">
			<button className="player-btn-xs tool" onClick={() => setShowChapter(prevVal => !prevVal)}>
				<img src={ChaptersSvg} alt="Chapters Icon" />
				<span className="tooltip">Chapters</span>
			</button>
			<ul className={`chapters-list ${showChapter ? "show-chapters" : "hide-chapters"}`}>
				{chapters.map((chapter, ind) => {
					return <li key={ind}>
						<button onClick={() => {

							if (video_ctx && video_ctx.videoRef.current) {
								video_ctx.videoRef.current.currentTime = chapter.startTime
								video_ctx.setVideoMetadata(prevData => ({
									...prevData,
									currentTime: chapter.startTime
								}))
								setShowChapter(prevVal => !prevVal)
							}
						}}>
							{chapter.title}
						</button>
						<time>{calculateDuration(chapter.startTime)}</time>
					</li>
				})}
			</ul>
		</div>
	);
}

function ChapterContainer({ chapter, props }: { chapter: Chapter, props: { chapterDuration: number, widthOfChapterBar: number } }) {

	let chapterProgressWidth = 0;
	const video_ctx = useContext(VideoMetadataContext)
	if (video_ctx?.videoMetadata.currentTime! > chapter.startTime)
		chapterProgressWidth = (video_ctx?.videoMetadata.currentTime! - chapter.startTime) / props.chapterDuration * 100;

	return (
		<div className="player-chapter-container" style={{ width: `${props.widthOfChapterBar}%` }}
			onClick={() => {
				video_ctx?.setVideoMetadata(prevProps => ({ ...prevProps, currentTime: prevProps.atPointerTime }))
				if (video_ctx !== null && video_ctx.videoRef.current !== null)
					video_ctx.videoRef.current.currentTime = video_ctx?.videoMetadata.atPointerTime!;
			}}
			onDragStart={() => {
				video_ctx?.setVideoMetadata(prevProps => ({ ...prevProps, currentTime: prevProps.atPointerTime }))

			}}
			onMouseMove={(e) => {
				const timeAtPointer = chapter.startTime + props.chapterDuration * (e.nativeEvent.offsetX / e.currentTarget.clientWidth)
				video_ctx?.setVideoMetadata(prevProps => ({ ...prevProps, atPointerTime: timeAtPointer, currentChapter: chapter.title }))
			}}
		>
			<div className="player-chapter-progress" style={{ width: `${chapterProgressWidth}%` }}>
			</div >
		</div >
	);
}


