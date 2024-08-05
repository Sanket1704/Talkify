import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Button, Divider, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router";

import { db, auth } from "../firebase";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";

function UsersComponent(props) {
    const handleToggle = (username, userId) => {
        props.setReceiverData({
            username: username,
            userId: userId,
        });

        props.navigate(`/chat-home/${userId}`);
    };

    return (
        <List
            dense
            sx={{
                width: "100%", maxWidth: 360,
                bgcolor: "background.paper"
            }}
        >
            {props.users?.map((value, index) => {
                const labelId = `checkbox-list-secondary-label-${value}`;

                if (props.currentUserId !== value.userId)
                    return (
                        <ListItem key={value.userId} disablePadding sx = {{bgcolor:"#00B2CA"}}>
                            <ListItemButton
                                onClick={() => {
                                    handleToggle(value.username, value.userId);
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        alt={`${value.username}`}
                                        src={`${value.username}.jpg`}
                                    />
                                </ListItemAvatar>
                                <ListItemText id={labelId}
                                    primary={`${value.username}`} />
                            </ListItemButton>
                        </ListItem>
                    );
            })}
        </List>
    );
}

export default function Home() {
    const [users, setUsers] = useState([]);

    const [receiverData, setReceiverData] = useState(null);
    const [chatMessage, setChatMessage] = useState("");

    const [allMessages, setAllMessages] = useState([]);

    const user = auth.currentUser;

    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map((doc) => doc.data()));
        });
        return unsub;
    }, []);

    useEffect(() => {
        if (receiverData) {
            const unsub = onSnapshot(
                query(
                    collection(
                        db,
                        "users",
                        user?.uid,
                        "chatUsers",
                        receiverData?.userId,
                        "messages"
                    ),
                    orderBy("timestamp")
                ),
                (snapshot) => {
                    setAllMessages(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            messages: doc.data(),
                        }))
                    );
                }
            );
            return unsub;
        }
    }, [receiverData?.userId]);

    const sendMessage = async () => {
        try {
            if (user && receiverData) {
                await addDoc(
                    collection(
                        db,
                        "users",
                        user.uid,
                        "chatUsers",
                        receiverData.userId,
                        "messages"
                    ),
                    {
                        username: user.displayName,
                        messageUserId: user.uid,
                        message: chatMessage,
                        timestamp: new Date(),
                    }
                );

                await addDoc(
                    collection(
                        db,
                        "users",
                        receiverData.userId,
                        "chatUsers",
                        user.uid,
                        "messages"
                    ),
                    {
                        username: user.displayName,
                        messageUserId: user.uid,
                        message: chatMessage,
                        timestamp: new Date(),
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }
        setChatMessage("");
    };

    return (
        <div style={root}>
            <Paper style={left}>
                <div
                    style={{
                        display: "flex",
                        padding: 5,
                        justifyContent: "space-between",
                        backgroundColor:"#1D4E89"
                    }}
                >
                    <h4 style={{ margin: 0, color : "white"}}>{user?.displayName} </h4>
                    <Button
                        
                        onClick={() => {
                            auth.signOut();
                            navigate("/");
                        }}
                    >
                        Logout
                    </Button>
                </div>
                <Divider />
                All users
                <div style={{ overflowY: "scroll" }}>
                    <UsersComponent
                        users={users}
                        setReceiverData={setReceiverData}
                        navigate={navigate}
                        currentUserId={user?.uid}
                    />
                </div>
            </Paper>

            <Paper style={right}>
                <h4 style={{ margin: 2, padding: 10,backgroundColor: "#04BADE", color : "white" }}>
                    {receiverData ? receiverData.username : user?.displayName}{" "}
                </h4>

                <Divider />
                <div style={messagesDiv}>
                    {/* messages area */}

                    {allMessages &&
                        allMessages.map(({ id, messages }) => {
                            return (
                                <div
                                    key={id}
                                    style={{
                                        margin: 2,
                                        display: "flex",
                                        flexDirection:
                                            user?.uid == messages.messageUserId
                                                ? "row-reverse"
                                                : "row",
                                    }}
                                >
                                    <span
                                        style={{
                                            // backgroundColor: "#BB8FCE",
                                            backgroundColor: "#04BADE",
                                            padding: 6,
                                            borderTopLeftRadius:
                                                user?.uid == messages.messageUserId ? 10 : 0,
                                            borderTopRightRadius:
                                                user?.uid == messages.messageUserId ? 0 : 10,
                                            borderBottomLeftRadius: 10,
                                            borderBottomRightRadius: 10,
                                            maxWidth: 400,
                                            fontSize: 15,
                                            textAlign:
                                                user?.uid == messages.messageUserId ? "right" : "left",
                                        }}
                                    >
                                        {messages.message}
                                    </span>
                                </div>
                            );
                        })}
                </div>

                <div style={{ width: "100%", display: "flex", flex: 0.08 }}>
                    <input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        style={input}
                        type="text"
                        placeholder="Type message..."
                    />
                    <IconButton onClick={sendMessage}>
                        <SendIcon style={{ margin: 10 , color :"#7DCFB6"}} />
                    </IconButton>
                </div>
            </Paper>
        </div>
    );
}

const root = {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    width: "100%",
};

const left = {
    display: "flex",
    flex: 0.2,
    height: "95vh",
    margin: 10,
    flexDirection: "column",
    backgroundColor: "#1D4E89"
};

const right = {
    display: "flex",
    flex: 0.8,
    height: "95vh",
    margin: 10,
    flexDirection: "column",
};

const input = {
    flex: 1,
    outline: "none",
    borderRadius: 5,
    border: "none",
    backgroundColor: "#7DCFB6"
};

const messagesDiv = {
    // backgroundColor: "#FBEEE6",
    backgroundColor : "#02367B",
    // backgroundImage: 'url(' + require('../chat_background.jpg') + ')',
    padding: 5,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    maxHeight: 460,
    overflowY: "scroll",
};