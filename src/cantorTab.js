import ArtistIcon from "./img/icons/artistIcon";
import { React, useEffect, useState } from "react";

const RenderArtist = ({
    selectedArtist,
    cantorContainerStyle,
    handleArtistClick,
    imgStyle,
    tabIndex,
    HeaderComponent,
    hymn,
    robe
}) => {
    const [heightVal, setHeightVal] = useState();

    useEffect(() => {
        const cantorTab = document.querySelector('.TabList .cantorTab001 .cantorContainer');
        const style = window.getComputedStyle(cantorTab);
        const heightVal = style.getPropertyValue('height');

        setHeightVal(heightVal);
    }, [])

    return (
        <div className="cantorTab001">
            <div className="cantorContainer"
                onClick={() => { handleArtistClick(selectedArtist) }}
                style={cantorContainerStyle}
            >
                <div className="topRow">
                    {tabIndex === 2 && <HeaderComponent placeholder={hymn.name} customFont='Aladin' />}
                    {tabIndex !== 2 && <img style={imgStyle} src={selectedArtist.img} alt={`Artist ${selectedArtist.artistName}`} />}
                </div>

                <div className="artist">
                    <span>
                        <ArtistIcon />
                        <p>CANTOR</p>
                    </span>
                    <h3>{selectedArtist.artistName}</h3>
                </div>
            </div>
            <img style={{ height: `calc(${heightVal} * 1.2) ` }} className="robe" src={robe} alt="robeImg" />
        </div>
    )
}

export default RenderArtist;