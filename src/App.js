import React, { useState } from 'react';
import './style.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Confirm from './components/Confirm';
import MainPage from './components/MainPage';
const SERVER = 'http://localhost:4000';
// const SERVER = 'https://connect-server.loca.lt';

const App = () => {
	const [signUpPage, openSignUpPage] = useState(false);
	const [confirmWindow, openConfirmWindow] = useState(false);

	const clickSignUp = e => {
		e.preventDefault();
		openSignUpPage(!signUpPage);
	};

	const settingConfirmWindow = (text, left, right, confirmHandler) => {
		return <Confirm text={text} left={left} right={right} confirmHandler={confirmHandler} />;
	};
	return (
		<>
			{sessionStorage.getItem('uid') ? <MainPage SERVER={SERVER} /> : <SignIn SERVER={SERVER} clickSignUp={clickSignUp} />}
			{signUpPage && (
				<div
					style={{
						width: '100vw',
						height: '100vh',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						background: 'rgba(0,0,0,.8)',
						position: 'absolute',
						left: 0,
						top: 0,
					}}
				>
					<SignUp
						SERVER={SERVER}
						openSignUpPage={openSignUpPage}
						openConfirmWindow={openConfirmWindow}
						settingConfirmWindow={settingConfirmWindow}
						signUpPage={signUpPage}
					/>
				</div>
			)}
			{!confirmWindow
				? ''
				: confirmWindow === '성공'
				? settingConfirmWindow('회원가입 성공', '확인', '', () => {
						openConfirmWindow(false);
				  })
				: confirmWindow === '취소'
				? settingConfirmWindow('회원가입 취소', '이어하기', '그만두기', e => {
						openConfirmWindow(false);
						if (e.target.textContent === '그만두기') {
							openSignUpPage(false);
						}
				  })
				: ''}
		</>
	);
};
export default App;
