import React, { useEffect, useRef } from "react";

function Waves({ mp3 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchAudioData = async () => {
            if (!mp3) return;

            console.log("Fetching audio data from:", mp3);

            try {
                const response = await fetch(mp3);
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }

                const arrayBuffer = await response.arrayBuffer();
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const audioData = await audioContext.decodeAudioData(arrayBuffer);
                const channelData = audioData.getChannelData(0); // Get data from the first channel
                drawWaveform(canvasRef.current, channelData);
            } catch (error) {
                console.error("Error fetching audio data:", error);
            }
        };

        fetchAudioData();
    }, [mp3]);

    const drawWaveform = (canvas, drawData) => {
        if (!canvas || !drawData) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const drawHeight = height / 2;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#4A90E2";

        for (let i = 0; i < width; i++) {
            const sampleIndex = Math.floor((i / width) * drawData.length);
            const sampleValue = drawData[sampleIndex];
            const yPosition = (sampleValue + 1) * drawHeight;

            ctx.fillRect(i, yPosition, 1, height - yPosition);
        }
    };


    return <canvas ref={canvasRef} width={400} height={100} />;
}

export default Waves;