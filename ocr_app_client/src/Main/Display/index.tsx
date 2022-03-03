import React, {useState} from 'react';
import "./index.scss";
import ImgList from "./ImgList";
import Modifier from "./Modifier";
import MenuToggle from "./MenuToggle";
import {ImgInfoArr} from "../interface";


interface DisplayProps {
    isImgSelected: boolean;
    imgInfo: ImgInfoArr;
    isDone: boolean;
    index: number;
    setIndex: (i: number) => any;
    reSelect: () => any;
    updateTxt: (t: string, i: number) => any;
}

export default function Display(p: DisplayProps) {
    const [isToggleList, setIsToggleList] = useState(true);
    return (
        <div className="display">
            {
                isToggleList && <ImgList imgInfo={p.imgInfo} setIndex={(i: number) => {
                    p.setIndex(i);
                    setIsToggleList(false);
                }} closeMenu={() => {
                    setIsToggleList(false);
                }}/>
            }
            <Modifier updateTxt={p.updateTxt} reSelect={p.reSelect} imgInfo={p.imgInfo} index={p.index}/>
            <MenuToggle isToggled={isToggleList} toggleMenu={setIsToggleList}/>
        </div>
    )
}
