import './App.css';
import outlineLogo from "./img/outlinelogoV2.svg";

export function Footer() {
    return (
        <>
            <div className="Footer" style={{ position: "relative", background: "var(--primary)", padding: "4.7915vw 9.583vw" }}>
                <div className="content" style={{ paddingBottom: "var(--padding)", position: "relative", display: "flex", gap: "var(--sectionSpacing)", zIndex: 2, borderBottom: "5px solid var(--fourthy)" }}>
                    <span style={{ flexGrow: 0, flexBasis: "20%" }}>
                        <img src={outlineLogo} style={{ width: "100%", height: "100%" }} />
                    </span>

                    <span style={{ display: "flex", flexDirection: "column", flexGrow: 2, flexBasis: "60%", gap: "var(--padding)" }}>
                        <p style={{ flexGrow: 0 }}>Subscribe to our Email Newsletter</p>
                        <input type="text" style={{
                            height: "100%", flexBasis: "100%", flexGrow: 2, borderRadius: "20px", textAlign: "start",
                            padding: "10px",
                            boxSizing: "border-box",
                            resize: "none"
                        }} />
                        <h2 className="secondaryButton" style={{ flexGrow: 0, fontFamily: "BoucherieSans" }}>
                            Subscribe
                        </h2>
                    </span>
                </div>

                <div style={{ position: "relative", display: "flex", marginTop: "calc(var(--padding) / 2)", zIndex: 2 }}>
                    <p style={{ color: "var(--thirdly)", flexGrow: 1, flexBasis: "80%" }}>Copyright @2025 Psaltos / All rights reserved / privacy</p>

                    <span className="iconRow" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexBasis: "20%" }}>
                    </span>
                </div>
            </div>
        </>
    )
}

export default function init() {
    return (
        <>
            <Footer />
        </>
    )
}