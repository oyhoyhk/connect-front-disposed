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
	console.log('newMessage', newMessage);
	const inputBox = useRef();
	const inputContainer = useRef();
	const chatContainer = useRef();
	const [inputLines, setLines] = useState(0);
	const [beforeLine, setBeforeLine] = useState([0]);
	const [logs, setLogs] = useState(null);
	const logsRef = useRef(logs);
	const [send, setSend] = useState(false);
	useEffect(() => {
		setLines(inputBox.current.scrollHeight);
		console.log(sessionStorage.uid, chat.otherPerson.uid);
		axios
			.post(`${SERVER}/get_msgs`, { sender: Number(sessionStorage.uid), receiver: chat.otherPerson.uid })
			.then(res => {
				console.log(res.data);
				setLogs([...res.data]);
				logsRef.current = adjustChatContainer();
			})
			.catch(err => {
				console.error(err);
			});
		socket.on('received_msg', (sender, msg) => {
			new Promise((resolve, reject) => {
				setLogs(logs => {
					return [...logs, { sender: sender, receiver: Number(sessionStorage.uid), msg, time: new Date().toString() }];
				});
				resolve();
			}).then(() => {
				adjustChatContainer();
			});
		});
	}, []);
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
		if (msg === '') return;
		inputBox.current.value = '';
		socket.emit('send_message', msg, sessionStorage.uid, chat.otherPerson.uid);
		new Promise((resolve, reject) => {
			setLogs(logs => {
				return [...logs, { sender: Number(sessionStorage.uid), receiver: chat.otherPerson.uid, msg, time: new Date().toString() }];
			});
			resolve();
		}).then(() => {
			adjustChatContainer();
		});
	};
	const handleEnter = e => {
		if (e.key === 'Enter') {
			const msg = inputBox.current.value;
			if (msg === '') return;
			inputBox.current.value = '';
			socket.emit('send_message', msg, sessionStorage.uid, chat.otherPerson.uid);
			new Promise((resolve, reject) => {
				setLogs(logs => {
					return [
						...logs,
						{ sender: Number(sessionStorage.uid), receiver: chat.otherPerson.uid, msg, time: new Date().toString() },
					];
				});
				resolve();
			}).then(() => {
				adjustChatContainer();
				inputBox.current.style.height = '40px';
				inputContainer.current.style.height = '60px';
			});
		}
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
				<div className="inputBox" ref={inputContainer}>
					{/*textarea 최대 33글자 */}
					<textarea
						ref={inputBox}
						onChange={adjustInputBox}
						style={{ height: inputLines + 'px' }}
						type="text"
						id="msg"
						maxLength="125"
						placeholder="메시지를 입력해주세요"
						onKeyUp={handleEnter}
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
