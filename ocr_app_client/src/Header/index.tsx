import React from 'react';
import "./index.scss";
// @ts-ignore
import closeIcon from "../assets/icons8-close-48.png";
// @ts-ignore
import minIcon from "../assets/icons8-minus-48.png";
const ipcRenderer = window.require("electron").ipcRenderer;

export default function Header() {
    const hide = () => {
        ipcRenderer.send("window-min");
    }
    const close = () => {
        ipcRenderer.send("app-exit");
    }
    return (
        <div className="header teal-background">
            <div className="title flex-all-center">
                <span className={"title-font"}>
                    OCR APP
                </span>
            </div>
            <div className="window-tools">
                <div className="min-box window-button transition-opacity" onClick={hide}>
                    <img src={minIcon} alt=""/>
                </div>
                <div className="close-box window-button transition-opacity" onClick={close}>
                    <img src={closeIcon} alt=""/>
                </div>
            </div>
        </div>
    )
}
