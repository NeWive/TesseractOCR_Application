import React from 'react';
import {CSSTransition} from "react-transition-group";
import "./index.scss";

interface MenuToggle {
    isToggled: boolean,
    toggleMenu: (a: boolean) => any;
}

export default function MenuToggle(p: MenuToggle) {
    return (
        <CSSTransition in={p.isToggled} classNames={"menu-toggle-anime"} timeout={300}>
            <div className="menu-toggle" onClick={() => {
                p.toggleMenu(!p.isToggled);
            }}>
                <div className="toggle-sel transition-all">

                </div>
                <div className="toggle-sel transition-all">

                </div>
                <div className="toggle-sel transition-all">

                </div>
            </div>
        </CSSTransition>
    )
}
