import React, {useEffect, useState} from 'react';
import "./index.scss";
import {ImgInfoArr} from "../interface";
import { v4 as uuid } from 'uuid';
import {useNavigate} from "react-router-dom";
import {CSSTransition} from "react-transition-group";

const ipcRenderer = window.require("electron").ipcRenderer;

interface SelectProps {
    setImgList: (arr: ImgInfoArr, arr1: ImgInfoArr) => any;
}

export default function Select(p: SelectProps) {
    const nav = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const handlePath = async (e: Event, path: Array<string>) => {
        if (path.length) {
            let originDataArr = path.map(i => {
                return {
                    data: i,
                    key: uuid(),
                    txt: "",
                    done: false,
                    percentage: 0
                }
            });
            // let nDataArr = nDataTemp.map((i, index) => {
            //     return {
            //         data: i,
            //         key: originDataArr[index].key,
            //         txt: "",
            //         done: false,
            //         percentage: 0
            //     }
            // })
            p.setImgList(originDataArr, originDataArr);
            nav("/crop");
        } else {
            setIsLoading(false);
        }
    }
    const selectFiles = (isDir = false) => {
        if (!isLoading) {
            ipcRenderer.send("select-files", isDir);
            setIsLoading(true);
        }
    }
    useEffect(() => {
        ipcRenderer.on("reply-select-files", handlePath);
        return () => {
            ipcRenderer.removeListener("reply-select-files", handlePath);
        }
    }, []);
    return (
        <div className="select flex-all-center">
            <CSSTransition timeout={200} classNames="select-button" in={isLoading}>
                <div className="container">
                    <button className="teal-background title-font trans-background transition-all" onClick={() => {
                        selectFiles();
                    }}>
                        <span className="transition-all">选择图片</span>
                    </button>
                    <button className="teal-background title-font trans-background transition-all" onClick={() => {
                        selectFiles(true);
                    }}>
                        <span className="transition-all">选择文件夹</span>
                    </button>
                    <div className="loading-pulse absolute-center transition-all">

                    </div>
                </div>
            </CSSTransition>
        </div>
    )
}
