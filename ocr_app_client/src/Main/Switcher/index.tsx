import React from 'react';
import Select from "../Select";
import Display from "../Display";
import Cropper from "../Cropper";
import {Routes, Route} from "react-router-dom";
import {ImgInfoArr} from "../interface";

interface SwitcherProps {
    setImgList: (arr: ImgInfoArr, arr1: ImgInfoArr) => any;
    imgInfo: ImgInfoArr;
    isDone: boolean;
    isImgSelected: boolean;
    index: number;
    setIndex: (i: number) => any;
    height: number;
    updateData: (nd: string, i: number) => any;
    cropDone: () => any;
    reSelect: () => any;
    updateTxt: (t: string, i: number) => any;
}

export default function Switcher(p: SwitcherProps) {
    return (
        <Routes>
            <Route path={"/display"} element={<Display updateTxt={p.updateTxt}  reSelect={p.reSelect} setIndex={p.setIndex} imgInfo={p.imgInfo} isDone={p.isDone} isImgSelected={p.isImgSelected} index={p.index}/>}/>
            <Route path={"/select"} element={<Select setImgList={p.setImgList}/>}/>
            <Route path={"/crop"} element={<Cropper cropDone={p.cropDone} updateData={p.updateData} imgInfo={p.imgInfo} height={p.height}/>}/>
            <Route path={"/"} element={<Select setImgList={p.setImgList}/>}/>
        </Routes>
    )
}
