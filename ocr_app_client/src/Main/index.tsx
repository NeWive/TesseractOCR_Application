import React, {useState, useEffect, useRef} from 'react';
import {ImgInfoArr, ImgTxtDataType, TessProcessResponse} from "./interface";
import Loading from "./Loading";
import "./index.scss";
import Switcher from "./Switcher";
import {findIndex} from "lodash";
import {toGrey} from "../util";
import {useNavigate} from "react-router-dom";

const ipcRenderer = window.require("electron").ipcRenderer

export default function Main() {
    const [imgInfo, setImgInfo] = useState<ImgInfoArr>([]);
    const [isImgSelected, setIsImgSelected] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [height, setHeight] = useState(0);
    const [isInit, setIsInit] = useState(false);
    const [width, setWidth] = useState(0);
    const [displayIndex, setDisplayIndex] = useState(-1);
    const canvasRef = useRef(null);
    const nav = useNavigate();

    const setImgList = (originArr: ImgInfoArr, handledArr: ImgInfoArr) => {
        setImgInfo(originArr);
        setIsImgSelected(true);
    }

    /**
     * 更新剪切后的图片数据
     * @param nd
     * @param index
     */
    const updateImgData = (nd: string, index: number) => {
        const nArr = [...imgInfo];
        nArr[index].data = nd;
        setImgInfo(nArr);
    }

    const init = (e: Event, h: number, w: number) => {
        setHeight(h - 50);
        setWidth(w);
        setIsInit(true);
        nav("/select");
    }

    const updateInfo = async (e: Event, d: ImgTxtDataType) => {
        const index = findIndex(imgInfo, (i) => {
            return i.key === d.key;
        });
        let n = [
            ...imgInfo
        ];
        if (index > -1) {
            console.log(d);
            n[index].txt = d.data.replace(/\x20/g, '');
            n[index].done = true;
            setImgInfo(n);
            if (index < imgInfo.length - 1) {
                await sendToTess(index + 1);
            }
        }
    }

    const reSelect = () => {
        ipcRenderer.send("stop-ocr");
        nav("/select");
        setDisplayIndex(-1);
    }

    const updateTessProcess = async (e: Event, m: TessProcessResponse) => {
        const index = findIndex(imgInfo, (i) => {
            return i.key === m.key;
        });
        if (index > -1) {
            let n = [
                ...imgInfo
            ];
            n[index].percentage = m.progress;
            setImgInfo(n);
        }
    }

    const sendToTess = async (i: number) => {
        let nData = imgInfo[i];
        nData.data = await toGrey(nData.data, canvasRef);
        ipcRenderer.send("start-ocr", nData);
    }

    const cropDone = async () => {
        nav("/display");
        await sendToTess(0);
    }

    const updateTxt = (txt: string, index: number) => {
        let n = [
            ...imgInfo
        ];
        n[index].txt = txt;
    }

    const ocrDone = () => {
        setIsDone(true);
        if (displayIndex < 0) {
            setDisplayIndex(0);
        }
    }

    useEffect(() => {
        ipcRenderer.once("recv-height", init);
        ipcRenderer.send("get-height");
    }, []);

    useEffect(() => {
        ipcRenderer.on("img-done", updateInfo);
        ipcRenderer.on("ocr-done", ocrDone);
        ipcRenderer.on("img-tess-process", updateTessProcess);
        return () => {
            ipcRenderer.removeListener("recv-height", init);
            ipcRenderer.removeListener("img-done", updateInfo);
            ipcRenderer.removeListener("ocr-done", ocrDone);
            ipcRenderer.removeListener("img-tess-process", updateTessProcess);
        }
    })


    return (
        <div className="main grey-background" style={height ? {height: height, width} : {}}>
            <canvas ref={canvasRef} style={{display: "none"}}/>
            {
                isInit ? (
                    <Switcher updateTxt={updateTxt} reSelect={reSelect} cropDone={cropDone} updateData={updateImgData} height={height} setIndex={setDisplayIndex} index={displayIndex} setImgList={setImgList} imgInfo={imgInfo} isImgSelected={isImgSelected} isDone={isDone}/>
                ) : (
                    <Loading/>
                )
            }
        </div>
    )
}
