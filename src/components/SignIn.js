import '../style.css';
import React, { useState } from 'react';
import axios from 'axios';

const SignIn = ({ SERVER, clickSignUp }) => {
	const [formInfo, setFormInfo] = useState({ userId: null, password: null });
	const [errMsg, setErrMsg] = useState('');

	const clickSignIn = e => {
		e.preventDefault();
		console.log(formInfo);
		if (formInfo.userId === null) {
			setErrMsg('아이디를 입력해주세요');
			return;
		}
		if (formInfo.password === null) {
			setErrMsg('비밀번호를 입력해주세요');
			return;
		}
		axios.post(SERVER + '/sign_in', formInfo).then(res => {
			if (res.data === 'not exist') {
				setErrMsg('아이디, 비밀번호를 확인해주세요.');
			} else if (res.data === 'failure') {
				setErrMsg('아이디, 비밀번호를 확인해주세요.');
			} else {
				sessionStorage.setItem('uid', res.data);
				window.location.reload();
			}
		});
	};
	const inputInfo = e => {
		setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
	};
	return (
		<div id="signIn">
			<div className="title">Connect에 오신 것을 환영합니다!</div>
			<form id="signInForm">
				<input
					type="text"
					placeholder="아이디"
					id="userId"
					name="userId"
					onChange={inputInfo}
					onKeyPress={e => {
						if (e.key === 'Enter') {
							e.preventDefault();
						}
					}}
				/>
				<input
					type="password"
					placeholder="비밀번호"
					id="password"
					name="password"
					onChange={inputInfo}
					onKeyPress={e => {
						if (e.key === 'Enter') {
							e.preventDefault();
						}
					}}
				/>
				<div id="errorMessage">{errMsg}</div>
				<div className="buttonContainer">
					<button id="signInButton" onClick={clickSignIn}>
						Sign In
					</button>
					<button id="signUpButton" onClick={clickSignUp}>
						Sign Up
					</button>
				</div>
			</form>
		</div>
	);
};

export default SignIn;
