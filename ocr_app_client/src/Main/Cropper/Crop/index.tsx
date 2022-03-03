import React, {useState, useCallback, useRef, createRef} from 'react';
import Cropper from "react-cropper";
import {ImgInfoArr} from "../../interface";
import "cropperjs/dist/cropper.css";
// @ts-ignore
import confirmIcon from "../../../assets/icons8-confirm-32.png";
// @ts-ignore
import cancelIcon from "../../../assets/icons8-cancel-64.png";
import "./index.scss";

interface CropProps {
    imgInfo: ImgInfoArr;
    index: number;
    height: number;
    crop: (nd: string) => any;
    cancel: () => any;
}

export default function Crop(p: CropProps) {
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState<any>();
    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            const nd = cropper.getCroppedCanvas().toDataURL("image/jpeg", 1);
            p.crop(nd);
        }
    }
    return (
        <div className="cropper_handler_container">
            <Cropper
                style={{ height: p.height * 0.9, width: "100%" }}
                zoomTo={0.8}
                initialAspectRatio={1}
                preview=".img-preview"
                src={p.imgInfo[p.index].data}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                onInitialized={(instance) => {
                    setCropper(instance);
                }}
                guides={true}
            />
            <div className="button_box">
                <div className="confirm transition-all" onClick={getCropData}>
                    <img src={confirmIcon} alt=""/>
                </div>
                <div className="cancel transition-all" onClick={p.cancel}>
                    <img src={cancelIcon} alt=""/>
                </div>
            </div>
        </div>

    )
}
