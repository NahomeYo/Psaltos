import testAudio from './01.Ⲛⲓⲉⲑⲛⲟⲥ_ⲧⲏⲣⲟⲩ.mp3';
import WavesurferPlayer from '@wavesurfer/react'
import { useState } from 'react'

function Audio() {
    const [wavesurfer, setWavesurfer] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const onReady = (ws) => {
        setWavesurfer(ws)
        setIsPlaying(false)
    }

    const onPlayPause = () => {
        wavesurfer && wavesurfer.playPause()
    }

    return (
        <>
            <WavesurferPlayer
                height={100}
                waveColor="blue"
                url={testAudio}
                onReady={onReady}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            <button onClick={onPlayPause}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </>
    )
}

export default Audio;