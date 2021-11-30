import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ReceivedMessage = ({ SERVER, oppositeProfileImage, msg, time, getTime }) => {
	return (
		<div className="receivedMessageContainer">
			<div className="receivedMessage">
				<div className="userIcon" style={{ backgroundImage: `url(${SERVER}/${oppositeProfileImage})` }}></div>
				<div className="message">{msg}</div>
			</div>
			<div className="receivedTime">{getTime(new Date(time))}</div>
		</div>
	);
};

const SendedMessage = ({ msg, time, getTime }) => {
	return (
		<div className="sendedMessageContainer">
			<div className="sendedMessage">
				<div className="message">{msg}</div>
			</div>
			<div className="sendedTime">{getTime(new Date(time))}</div>
		</div>
	);
};

const Chat = ({ newMessage, setNewMessage, socket, chat, SERVER, openChat }) => {
	const inputBox = useRef();
	const chatContainer = useRef();
	const [inputLines, setLines] = useState(0);
	const [beforeLine, setBeforeLine] = useState([0]);
	const [logs, setLogs] = useState(null);
	useEffect(() => {
		setLines(inputBox.current.scrollHeight);
		console.log(sessionStorage.uid, chat.otherPerson.uid);
		axios
			.post(`${SERVER}/get_msgs`, { sender: Number(sessionStorage.uid), receiver: chat.otherPerson.uid })
			.then(res => {
				console.log(res.data);
				setLogs([...res.data]);
				adjustChatContainer();
			})
			.catch(err => {
				console.error(err);
			});
		console.log(newMessage);

		if (newMessage) {
			setLogs([
				...logs,
				{ sender: chat.otherPerson.uid, receiver: Number(sessionStorage.uid), msg: newMessage, time: new Date().toString() },
			]);
			setNewMessage(null);
		}
	}, [newMessage]);
	const getTime = date => {
		const h = date.getHours();
		let str = h >= 12 ? '오후' : '오전';
		let hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
		let min = date.getMinutes();
		return `${str} ${hour}시 ${min}분`;
	};
	const adjustChatContainer = () => {
		console.dir(chatContainer.current);
		chatContainer.current.scrollTop = chatContainer.current.scrollHeight + 90;
	};
	const adjustInputBox = e => {
		if (e.target.scrollHeight !== inputLines) {
			if (e.target.scrollHeight > beforeLine[beforeLine.length - 1]) {
				setBeforeLine([...beforeLine, inputLines]);
			}
			if (e.target.scrollHeight < inputLines) {
				if (e.target.value === '') {
					setLines(0);
					setBeforeLine([]);
					return;
				}
				setLines(beforeLine[beforeLine.length - 1]);
				setBeforeLine(beforeLine.slice(0, beforeLine.length - 1));
			} else {
				setLines(e.target.scrollHeight);
			}
		}
	};
	const sendMessage = () => {
		const msg = inputBox.current.value;
		inputBox.current.value = '';
		socket.emit('send_message', msg, sessionStorage.uid, chat.otherPerson.uid);
		setLogs([...logs, { sender: Number(sessionStorage.uid), receiver: chat.otherPerson.uid, msg, time: new Date().toString() }]);
		adjustChatContainer();
	};
	return (
		<div className="chatBackground">
			<div className="chat">
				<div className="chatInfo">
					<div className="opposite">{chat.otherPerson.name}</div>
					<div
						className="exit"
						onClick={() => {
							openChat();
							chatContainer.current.innerHTML = '';
						}}
					>
						나가기
					</div>
				</div>
				<div className="chatData" ref={chatContainer}>
					{logs !== null ? (
						logs.map(data =>
							data.sender === Number(sessionStorage.uid) ? (
								<SendedMessage key={data.time} msg={data.msg} time={data.time} getTime={getTime} />
							) : (
								<ReceivedMessage
									key={data.time}
									SERVER={SERVER}
									oppositeProfileImage={chat.otherPerson.profileImage}
									msg={data.msg}
									time={data.time}
									getTime={getTime}
								/>
							)
						)
					) : (
						<div className="loading">로딩 중</div>
					)}
				</div>
				<div className="inputBox">
					{/*textarea 최대 33글자 */}
					<textarea
						ref={inputBox}
						onChange={adjustInputBox}
						style={{ height: inputLines + 'px' }}
						type="text"
						id="msg"
						maxLength="125"
						placeholder="메시지를 입력해주세요"
					/>
					<button id="send" onClick={sendMessage}>
						전송
					</button>
				</div>
			</div>
		</div>
	);
};

export default Chat;
