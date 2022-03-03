import React, {useState} from 'react';
import "./index.scss";
import {ImgInfoArr} from "../interface";
import Crop from "./Crop";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import confirmIcon from "../../assets/icons8-confirm-32.png";
// @ts-ignore
import cancelIcon from "../../assets/icons8-cancel-64.png";

interface CropperProps {
    imgInfo: ImgInfoArr;
    height: number;
    updateData: (nd: string, i: number) => any;
    cropDone: () => any;
}

export default function Cropper(p: CropperProps) {
    const [index, setIndex] = useState(-1);
    const nav = useNavigate();
    const crop = (nd: string) => {
        const temp = index;
        cancel();
        p.updateData(nd, temp);
    }
    const cancel = () => {
        setIndex(-1);
    }
    const backToSelect = () => {
        nav("/select");
    }
    const forwardToTess = () => {
        p.cropDone();
    }
    return (
        <div className="cutter_handler_container">
            <div className="title">
                裁切图片
            </div>
            {
                index > -1 ? <Crop cancel={cancel} crop={crop} height={p.height} index={index} imgInfo={p.imgInfo}/> :
                    <>
                        <ul className="display_container">
                            {
                                p.imgInfo.map((img, i) => (
                                    <li className="sel" key={img.key} onClick={() => {
                                        setIndex(i);
                                    }}>
                                        <div>
                                            <img src={img.data} alt=""/>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                        <div className="display_button_box">
                            <div className="confirm transition-all" onClick={forwardToTess}>
                                <img src={confirmIcon} alt=""/>
                            </div>
                            <div className="cancel transition-all" onClick={backToSelect}>
                                <img src={cancelIcon} alt=""/>
                            </div>
                        </div>
                    </>
            }
        </div>
    )
}
