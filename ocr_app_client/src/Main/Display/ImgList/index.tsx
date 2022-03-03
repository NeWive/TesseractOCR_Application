import React, {useEffect, useState} from 'react';
import "./index.scss";
import {ImgInfoArr} from "../../interface";
import {CSSTransition} from "react-transition-group";
// @ts-ignore
import loading from "../../../assets/icons8-loading-circle.gif";
// @ts-ignore
import done from "../../../assets/icons8-done-48.png";
// @ts-ignore
import queuing from "../../../assets/icons8-waiting-hall-64.png";

interface ImgListProps {
    imgInfo: ImgInfoArr;
    setIndex: (i: number) => any;
    closeMenu: () => any;
}

export default function ImgList(p: ImgListProps) {
    const [isMounted, setIsMounted] = useState(false);
    const display = (i: number) => {
        if (i >= 0 && p.imgInfo[i].done) {
            p.setIndex(i);
        }
    }
    useEffect(() => {
        setIsMounted(true);
    }, []);
    return (
        <CSSTransition in={isMounted} timeout={200} classNames={"img-list-wrapper-anime"}>
            <div className="img-list-wrapper">
                <ul className="img-list transition-transform">
                    {
                        p.imgInfo.map((i, index) => (
                            <li key={i.key} className="img-container trans-background">
                                <div className="img-sel" style={{
                                    cursor: i.done ? "pointer" : "not-allowed"
                                }} onClick={() => {
                                    display(index);
                                }}>
                                    <img className="preview" src={i.data} alt=""/>
                                    {
                                        (() => {
                                            if (i.done) {
                                                return <img className="tips" src={done} alt=""/>
                                            } else if (i.percentage > 0) {
                                                return <img className="tips" src={loading} alt=""/>
                                            } else {
                                                return <img className="tips" src={queuing} alt=""/>
                                            }
                                        })()
                                    }
                                    <div className="cover" style={{
                                        transform: `scaleX(${(1 - i.percentage) * 100}%)`
                                    }}>

                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <div className="img-list-bottom transition-opacity" onClick={p.closeMenu}>

                </div>
            </div>
        </CSSTransition>
    )
}
