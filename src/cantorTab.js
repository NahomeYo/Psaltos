import ArtistIcon from "./img/icons/artistIcon";
import { React } from "react";
import Robe from "./img/robe.svg";

const RenderArtist = ({
    selectedArtist = {},
    cantorContainerStyle = {},
    handleArtistClick = () => { },
    imgStyle = {},
    tabIndex = 0,
    HeaderComponent,
    hymn = {},
}) => {

    if (!selectedArtist) return null;
    
    return (
        <div className="cantorTab001">
            <div className="cantorContainer"
                onClick={() => handleArtistClick(selectedArtist)}
                style={cantorContainerStyle}
            >
                <div className="topRow">
                    {tabIndex === 2 && HeaderComponent ? (
                        <HeaderComponent
                            placeholder={hymn.name}
                            customFont="Aladin"
                        />
                    ) : (
                        <img
                            style={imgStyle}
                            src={selectedArtist.img}
                            alt={`Artist ${selectedArtist.artistName}`}
                        />
                    )}
                </div>

                <div className="artist">
                    <span>
                        <ArtistIcon />
                        <p>CANTOR</p>
                    </span>
                    <h3>{selectedArtist.artistName}</h3>
                </div>

            </div>
            <img
                className="robe"
                src={Robe}
                alt="robeImg"
            />
        </div>
    );
};

export default RenderArtist;