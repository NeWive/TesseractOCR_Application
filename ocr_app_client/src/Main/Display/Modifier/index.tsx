import React, {useEffect, useState} from 'react';
import "./index.scss";
import {ImgInfoArr} from "../../interface";
import {v4 as getId} from "uuid";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import {findIndex} from "lodash";
// @ts-ignore
import save from "../../../assets/icons8-save-30.png";
// @ts-ignore
import stopIcon from "../../../assets/icons8-stop-64.png";
// @ts-ignore
import restartIcon from "../../../assets/icons8-restart-40.png";
// @ts-ignore
import copyIcon from "../../../assets/icons8-copy-64.png";
const ipcRenderer = window.require("electron").ipcRenderer;
const clipboard = window.require("electron").clipboard;

interface ModifierProps {
    imgInfo: ImgInfoArr;
    index: number;
    reSelect: () => any;
    updateTxt: (t: string, i: number) => any;
}

interface TipsType {
    message: string;
    id: string;
}

export default function Modifier(p: ModifierProps) {
    const [tempTxt, setTempTxt] = useState("");
    const [tips, setTips] = useState<Array<TipsType>>([]);
    useEffect(() => {
        if (p.index > -1) {
            setTempTxt(JSON.parse(JSON.stringify(p.imgInfo[p.index].txt)));
        }
    }, [p.index]);
    const stopOCR = () => {
        ipcRenderer.send("stop-ocr");
    }
    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTempTxt(e.target.value);
    }
    const saveChanges = () => {
        addTips("更改已保存");
        p.updateTxt(tempTxt, p.index);
    }
    const saveToClipboard = () => {
        saveChanges();
        clipboard.writeText(tempTxt);
    }
    const removeTips = (key: string) => {
        setTimeout(() => {
            setTips((prevState => {
                const index = findIndex(prevState, (i) => {
                    return i.id === key;
                });
                if (index > -1) {
                    let n = [...tips];
                    n.splice(index, 1);
                    return n;
                } else {
                    return prevState;
                }
            }));
        }, 2000);
    }
    const addTips = (m: string) => {
        const key = getId();
        const nTips = {
            message: m,
            id: key
        };
        setTips([...tips, nTips]);
        removeTips(key);
    }
    return (
        <div className="modifier">
            <div className="watcher modifier-sel">
                {
                    p.index >= 0 && <img src={p.imgInfo[p.index].data} alt=""/>
                }
            </div>
            <div className="txt modifier-sel">
                <div className="tools">
                    {
                        p.index >= 0 && (
                            <>
                                <div className={"txt-tool trans-background"} title="保存修改" onClick={saveChanges}>
                                    <img src={save} alt=""/>
                                </div>
                                <div className={"txt-tool trans-background"} title="复制到剪切板" onClick={saveToClipboard}>
                                    <img src={copyIcon} alt=""/>
                                </div>
                            </>
                        )
                    }
                    <div className="stop-button tool-button trans-background" onClick={stopOCR}>
                        <img src={stopIcon} alt="" title="中止识别"/>
                    </div>
                    <div className="restart-button tool-button transition-opacity" onClick={p.reSelect}>
                        <img src={restartIcon} alt="" title="重新选择图片"/>
                    </div>
                    <TransitionGroup className={"tips-box"}>
                        {
                            tips.map(i => (
                                <CSSTransition key={i.id} timeout={200} classNames="item">
                                    <p>
                                        {
                                            i.message
                                        }
                                    </p>
                                </CSSTransition>
                            ))
                        }
                    </TransitionGroup>
                </div>
                {
                    p.index >= 0 && (
                        <>
                            <div className="input">
                                <textarea name="ocr-result" id="" value={tempTxt} onChange={onChangeHandler}>

                                </textarea>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}
