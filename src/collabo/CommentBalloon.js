import React, {useState} from 'react';
import {ChatLeftFill} from "react-bootstrap-icons";

import './CommentBallon.css';

function CommentBalloon(props) {

    const isVisible = props.isVisible && props.caretPosition;

    const top = props.caretPosition ? props.caretPosition.top : 0;
    const bottom = props.caretPosition ? props.caretPosition.bottom : 0;
    const left = props.ckEditorWidth ? props.ckEditorWidth : 0;

    const caretHeight = bottom - top;

    const balloonHeight = 40;

    const diffCaretBalloon = balloonHeight - caretHeight;
    const yOffsetBalloon = diffCaretBalloon / 2;
    const scrollYOffset = window.pageYOffset;

    return (
        <div onMouseDown={props.onMouseDown} className={"comment-balloon"}
             style={{
                 display: isVisible ? "flex" : "none",
                 position: "absolute",
                 zIndex: 1000,
                 width: "30px",
                 height: balloonHeight + "px",
                 top: (top - yOffsetBalloon - props.ckEditorOffsetTop + scrollYOffset) + "px",
                 left: (left - 15) + "px"
             }}>
            <ChatLeftFill />
        </div>
    );
}

export default CommentBalloon;