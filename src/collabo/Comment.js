import React, {useContext, useState, forwardRef, useEffect} from 'react';
import {Button, Card, Col, Dropdown, Form, Image, Row} from "react-bootstrap";
import {CheckLg, ThreeDotsVertical} from 'react-bootstrap-icons';
import {CommentsSidebarContext, UserContext} from "../App";
import Autosuggest from 'react-autosuggest';
import CommentInput from "./CommentForm/CommentInput";
import CommentForm from "./CommentForm/CommentForm";
import './Comment.css';

const dateHelper = (date) => {
    const formatNumber = (number) => {
        return number.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
    };

    const [month, day, year] = [formatNumber(date.getMonth() + 1), formatNumber(date.getDate()), date.getFullYear()];
    const [hour, minutes, seconds] = [formatNumber(date.getHours()), formatNumber(date.getMinutes()), formatNumber(date.getSeconds())];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez"];

    return hour + ":" + minutes + " " + day + " " + months[month-1];
};

const CustomOptionToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Button variant="outline-light"
            ref={ref}
            onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                onClick(e);
            }}
    >
        <ThreeDotsVertical color="gray" />
        {children}
    </Button>
));


export default Comment = forwardRef((props, ref) => {

    const csc = useContext(CommentsSidebarContext);
    const usc = useContext(UserContext);

    const comment = props.comment;
    const selected = props.selected;
    const selectedCard = props.selectedCard;
    const cardTop = props.cardTop;
    const position = props.position;
    const selectHandler = props.selectHandler;
    const changedHeightHandler = props.changedHeightHandler;

    const id = comment.id;
    const data = comment.data;

    const user = data.user;
    const userName = data.user.name;
    const text = data.text || "";

    let style = {};

    const suggestions = usc.userState.users;
    const me = usc.userState.me;

    const date = dateHelper(new Date(data.date));

    const [top, setTop] = useState(position.top);
    const [isEdit, setIsEdit] = useState(false);
    const [editReply, setEditReply] = useState("");

    useEffect(() => {
        setTop(cardTop);
    }, [cardTop]);

    if (position) {
        style = { position: "absolute", top: top + "px" };
        console.log("selected?" + selected)
        if (selected) {
            style["left"] = "-50px";
        }
    }

    const replies = comment.replies.length === 0 ? null : comment.replies.map(reply => {
        const date = dateHelper(new Date(reply.data.time));
        const user = reply.data.user;
        const userName = user.name;
        const html = reply.data.text;

        const editReplyForm = <CommentForm comment={reply}
                                           top={top}
                                           suggestions={suggestions}
                                           me={me}
                                           changedHeightHandler={changedHeightHandler}
                                           selectedCard={selectedCard}
                                           selectHandler={selectHandler}
                                           isReply={true}
                                           isEdit={true}
                                           isEditHandler={setIsEdit}
                                           editReplyHandler={setEditReply}
                                           commentId={id} />

        const options = <Dropdown >
                <Dropdown.Toggle as={CustomOptionToggle}>
                </Dropdown.Toggle>
                <Dropdown.Menu size="sm" title="">
                    <Dropdown.Header>Options</Dropdown.Header>
                    <Dropdown.Item onClick={e => {
                            setEditReply(reply.id);
                        }}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={e => {
                        csc.deleteReply(id, reply.id);
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}>Delete</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

        return <div className={"reply"} key={reply.id}>
            <div className={"reply-title"}>
                <div className={"comment-info-left"}>
                    <div className={"avatar"}>
                        <Image src={user.picture} roundedCircle/>
                    </div>
                    <div className={"user-data"}>
                        <div className={"user-name"}>{ userName }</div>
                        <div className={"comment-date"}>{ date }</div>
                    </div>
                </div>
                <div className={"comment-info-right"}>
                    {options}
                </div>
            </div>
            {(editReply === reply.id && editReplyForm) || <div dangerouslySetInnerHTML={{__html: html}}></div>}
        </div>
    });


    const firstComment = !text ? null : <Card.Text dangerouslySetInnerHTML={{__html: text}}></Card.Text>;

    const commentField = <CommentForm comment={comment}
                                      top={top}
                                      suggestions={suggestions}
                                      me={me}
                                      changedHeightHandler={changedHeightHandler}
                                      isReply={firstComment}
                                      selectedCard={selectedCard}
                                      selectHandler={selectHandler}/>

    const editCommentForm = <CommentForm comment={comment}
                                         top={top}
                                         suggestions={suggestions}
                                         me={me}
                                         changedHeightHandler={changedHeightHandler}
                                         selectedCard={selectedCard}
                                         selectHandler={selectHandler}
                                         isReply={false}
                                         isEdit={true}
                                         isEditHandler={setIsEdit}/>

    const select = () => {
        if (!selected) {
            csc.setCurrentSelectedComment(id, userName);
            selectHandler(id);
        } else {
            csc.unsetCurrentSelectedComment(id, userName, true);
            selectHandler();
        }
    }

    const options = <Dropdown>
        <Dropdown.Toggle as={CustomOptionToggle}>
        </Dropdown.Toggle>
        <Dropdown.Menu size="sm" title="">
            <Dropdown.Item onClick={e => {
                setIsEdit(true);
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
            }}>Edit</Dropdown.Item>
            <Dropdown.Item  onClick={e => {
                csc.deleteComment(id);
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
            }}>Delete</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>

    const className = selected ? "comment-card selected" : "comment-card";

    return (
        <Card ref={ref} id={id} className={className} style={style} onClick={select}>
            <Card.Title>
                <div className={"comment-info-left"}>
                    <div className={"avatar"}>
                        <Image src={user.picture} roundedCircle/>
                    </div>
                    <div className={"user-data"}>
                        <div className={"user-name"}>{userName}</div>
                        <div className={"comment-date"}>{ date }</div>
                    </div>
                </div>
                <div className={"comment-info-right"}>
                    { firstComment && <Button variant="light" onClick={e => {
                        csc.approveComment(id);
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }}><CheckLg color="royalBlue"/></Button> }
                    { firstComment && options}
                </div>
            </Card.Title>
            { (isEdit && editCommentForm) || firstComment }
            <div>
                { replies }
            </div>
            { commentField }
        </Card>
    );
});

