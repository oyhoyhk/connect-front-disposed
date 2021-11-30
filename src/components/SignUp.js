import React, { useState, useRef } from 'react';
import '../style.css';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const Tag = props => {
	return (
		<div
			className="tagContainer"
			onClick={() => {
				props.rcTagDeleteHandler(props.text);
			}}
		>
			<div className="tagText">{props.text}</div>
			<div className="tagDeleteButton"></div>
		</div>
	);
};

const SignUp = ({ SERVER, signUpPage, openSignUpPage, openConfirmWindow, settingConfirmWindow }) => {
	const [userInfo, setUserInfo] = useState({
		userId: null,
		name: null,
		nickname: null,
		tel: null,
		password: null,
		email: null,
		profileImage: null,
		randomProfileImage: null,
		useRandomChatting: 0,
		statusMessage: null,
		rcTag: [],
	});
	const outerContainer = useRef();
	const rcButton = useRef();
	const [confirmWindow, setConfirmWindow] = useState(false);
	const [completion, setCompletion] = useState(false);
	const [page, setPage] = useState(0);
	const [telExist, setTelExist] = useState(false);
	const [errMsg, setErrMsg] = useState('');

	const [profilePreviewSrc, setProfilePreviewSrc] = useState('/img/default_profile.jpg');
	const [randomChatProfilePreviewSrc, setRandomChatProfilePreviewSrc] = useState(profilePreviewSrc);
	const profilePreview = e => {
		if (e.target.files && e.target.files[0]) {
			imageCompress(e.target.files[0]).then(res => {
				setUserInfo({ ...userInfo, profileImage: res });
			});
			const reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);

			reader.onload = e => {
				console.log(e.target.result.toString());
				setProfilePreviewSrc(e.target.result.toString());
				console.log(e);
			};
		}
	};
	const afterSignUpProcess = () => {
		setUserInfo({
			userId: null,
			name: null,
			nickname: null,
			tel: null,
			password: null,
			email: null,
			profileImage: null,
			randomProfileImage: null,
			statusMessage: null,
			useRandomChatting: 0,
			rcTag: [],
		});
		setCompletion(true);
		setPage(0);
		setTelExist(false);
		setErrMsg('');
		setProfilePreviewSrc('/img/default_profile.jpg');
		setRandomChatProfilePreviewSrc(profilePreviewSrc);
	};
	const randomChatProfilePreview = e => {
		if (e.target.files && e.target.files[0]) {
			const reader = new FileReader();
			console.log(e.target);
			imageCompress(e.target.files[0]).then(res => {
				setUserInfo({ ...userInfo, randomProfileImage: res });
			});

			reader.readAsDataURL(e.target.files[0]);
			reader.onload = e => {
				console.log(e.target.result.toString());
				setRandomChatProfilePreviewSrc(e.target.result.toString());
				console.log(e);
			};
		}
	};
	const rcTagInput = e => {
		if (e.key === 'Enter' || e.code === 'Space') {
			e.preventDefault();
			if (e.target.value.trim() === '') {
				e.target.value = null;
				return;
			}
			const reg = /[`~!@#$%^&*()_|+\-=?;:'",.<> ]/gim;
			const input = e.target.value.replace(reg, '');
			setUserInfo({ ...userInfo, rcTag: [...userInfo.rcTag, input] });
			e.target.value = '';
			console.log(userInfo.rcTag);
		}
	};
	const rcToggle = () => {
		if (userInfo.useRandomChatting) {
			setUserInfo({ ...userInfo, useRandomChatting: 0 });
			rcButton.current.classList.remove('checked');
		} else {
			setUserInfo({ ...userInfo, useRandomChatting: 1 });
			rcButton.current.classList.add('checked');
		}
		console.log('hi');
		console.log(userInfo);
	};
	const rcTagDeleteHandler = text => {
		setUserInfo({ ...userInfo, rcTag: userInfo.rcTag.filter(el => el !== text) });
	};
	const clickPrevButton = e => {
		e.preventDefault();
		outerContainer.current.style.transform = `translateX(${-480 * (page - 1)}px)`;
		setPage(page - 1);
	};
	const clickExitButton = () => {
		openConfirmWindow('취소');
		if (!signUpPage) {
			afterSignUpProcess();
		}
	};
	const confirmHandler = e => {
		if (e.target.textContent === '이어하기') setCompletion(false);
		if (e.target.textContent === '가입하기') {
			const formData = new FormData();
			formData.append('userId', userInfo.userId);
			formData.append('name', userInfo.name);
			formData.append('nickname', userInfo.nickname);
			formData.append('tel', userInfo.tel);
			formData.append('password', userInfo.password);
			formData.append('email', userInfo.email);
			formData.append('statusMessage', userInfo.statusMessage);
			formData.append('useRandomChatting', userInfo.useRandomChatting);
			formData.append('profileImage', userInfo.profileImage);
			formData.append('randomProfileImage', userInfo.randomProfileImage);
			axios({
				method: 'post',
				url: SERVER + '/sign_up',
				data: formData,
				hedaer: {
					'Content-Type': 'multipart/form-data',
				},
			}).then(res => {
				console.log('제대로 axios 실행 됐을때 res', res);
				afterSignUpProcess();
				openConfirmWindow('성공');
				openSignUpPage(false);
			});
			setCompletion(true);
		}
		setConfirmWindow(false);
	};
	const clickNextButton = e => {
		e.preventDefault();
		if (page === 2 && !userInfo.useRandomChatting) {
			// 랜챗 설정안해요! 바로 회원가입
			setConfirmWindow(true);

			console.log(userInfo);
			console.log(completion);
			if (completion) {
				console.log('confirm에서 가입하기누르면');
			}

			console.log('랜쳇설정안하고바로가입');
			return;
		}
		if (page === 3) {
			// 4페이지에서 가입
			console.log(userInfo);
			const formData = new FormData();
			formData.append('userId', userInfo.userId);
			formData.append('name', userInfo.name);
			formData.append('nickname', userInfo.nickname);
			formData.append('tel', userInfo.tel);
			formData.append('password', userInfo.password);
			formData.append('email', userInfo.email);
			formData.append('useRandomChatting', userInfo.useRandomChatting);
			formData.append('tags', userInfo.rcTag.join(','));
			formData.append('statusMessage', userInfo.statusMessage);
			formData.append('profileImage', userInfo.profileImage);
			formData.append('randomProfileImage', userInfo.randomProfileImage);
			axios({
				method: 'post',
				url: SERVER + '/sign_up',
				data: formData,
				hedaer: {
					'Content-Type': 'multipart/form-data',
				},
			}).then(res => {
				console.log('page4에서 성공적으로 data 전송함');
				afterSignUpProcess();
				openConfirmWindow('성공');
				openSignUpPage(false);
			});
			console.log('랜쳇설정하고가입');
			return;
		}
		outerContainer.current.style.transform = `translateX(${-480 * (page + 1)}px)`;
		setPage(page + 1);
	};
	const checkTelInfo = e => {
		e.preventDefault();
		console.log(userInfo);
		if (userIdChange() && nameChange() && nicknameChange() && telChange() && passwordChange() && emailChange()) {
			setErrMsg('');
			axios.post(SERVER + '/info_check', { tel: userInfo.tel }).then(res => {
				if (res.data === 'next') {
					setTelExist(false);
					console.log('다음 페이지로');
					clickNextButton(e);
				} else if (res.data === 'exist') {
					console.log('휴대폰 번호 중복됨');
					setErrMsg('이미 가입된 휴대폰 번호입니다.');
					setTelExist(true);
				}
			});
		} else {
			setErrMsg('회원 정보를 올바르게 입력해주세요');
		}
	};
	const imageCompress = fileSrc => {
		const options = {
			maxSizeMB: 0.2,
			maxWidthOrHeight: 380,
			userWebWorker: true,
		};
		return imageCompression(fileSrc, options);
	};
	const handleStatusMessage = e => {
		setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
	};
	const infoChange = e => {
		e.preventDefault();
		if (e.target.name === 'userId') {
			e.target.value = e.target.value.replace(/[^A-Za-z0-9]/gi, '');
		}
		if (e.target.name === 'tel') {
			e.target.value = e.target.value.replace(/[^0-9-]/gi, '');
		}
		if (e.target.name === 'email') {
			e.target.value = e.target.value.replace(/[^A-Za-z0-9@.]/gi, '');
		}
		setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
	};
	const userIdChange = () => {
		if (userInfo.userId === null) return false;
		if (userInfo.userId.length >= 6 && userInfo.userId.length <= 15) return true;
		else return false;
	};
	const nameChange = () => {
		if (userInfo.name === null) return false;
		if (userInfo.name.length >= 2 && userInfo.name.length <= 10) return true;
		else return false;
	};

	const passwordChange = () => {
		if (userInfo.password === null) return false;
		const regexp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,12}$/;
		if (regexp.test(userInfo.password)) return true;
		else return false;
	};
	const nicknameChange = () => {
		if (userInfo.nickname === null) return false;
		if (userInfo.nickname.length >= 2 && userInfo.nickname.length <= 8) return true;
		else return false;
	};

	const emailChange = () => {
		if (userInfo.email === null) return false;
		const regexp = /^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/;
		if (regexp.test(userInfo.email)) return true;
		else return false;
	};

	const telChange = () => {
		if (userInfo.tel === null) return false;
		const regexp = /^\d{3}-\d{3,4}-\d{4}$/;
		if (regexp.test(userInfo.tel)) return true;
		else return false;
	};

	return (
		<>
			<form id="signUp" onSubmit={() => false}>
				<div className="title">회원가입</div>
				<div className="exit" onClick={clickExitButton}>
					그만두기
				</div>
				<div className="signUpContainer">
					<div className="signUpOuterContainer" ref={outerContainer}>
						{/* 아이디, 이름, 비밀번호, 닉네임 , 이메일, 전화번호 */}
						<div className="signUpInnerContainer">
							<div className="inputContainer">
								<input
									type="text"
									name="userId"
									id="userId"
									placeholder="아이디 6글자 ~ 15글자"
									onChange={infoChange}
									onKeyPress={e => {
										if (e.key === 'Enter') {
											e.preventDefault();
										}
									}}
									maxLength="15"
								/>
								<div
									id="nameCheckbox"
									className="checkbox"
									style={{
										backgroundImage:
											userInfo.userId === null
												? ''
												: userIdChange()
												? 'url("./img/satisfied.png")'
												: 'url("./img/unsatisfied.png")',
									}}
								>
									<div
										className="inputInfo"
										style={{ display: userInfo.userId === null ? 'none' : userIdChange() ? 'none' : 'block' }}
									>
										{telExist ? '' : '아이디는 6글자 ~ 15글자 이내로 해주세요'}
									</div>
								</div>
							</div>
							<div className="inputContainer">
								<input
									type="password"
									id="password"
									name="password"
									placeholder="비밀번호(영문, 숫자, 특문 포함 8~16 글자)"
									onChange={infoChange}
									onKeyPress={e => {
										if (e.key === 'Enter') {
											e.preventDefault();
										}
									}}
									maxLength="20"
								/>
								<div
									id="passwordCheckbox"
									className="checkbox"
									style={{
										backgroundImage:
											userInfo.password === null
												? ''
												: passwordChange()
												? 'url("./img/satisfied.png")'
												: 'url("./img/unsatisfied.png")',
									}}
								>
									<div
										className="inputInfo"
										style={{ display: userInfo.password === null ? 'none' : passwordChange() ? 'none' : 'block' }}
									>
										영문, 숫자, 특수문자를 포함하여 8글자 ~ 12글자
									</div>
								</div>
							</div>
							<div className="inputContainer">
								<input
									type="text"
									name="name"
									id="name"
									placeholder="이름 2글자 ~ 10글자"
									onChange={infoChange}
									onKeyPress={e => {
										if (e.key === 'Enter') {
											e.preventDefault();
										}
									}}
									maxLength="10"
								/>
								<div
									id="nameCheckbox"
									className="checkbox"
									style={{
										backgroundImage:
											userInfo.name === null
												? ''
												: nameChange()
												? 'url("./img/satisfied.png")'
												: 'url("./img/unsatisfied.png")',
									}}
								>
									<div
										className="inputInfo"
										style={{ display: userInfo.name === null ? 'none' : nameChange() ? 'none' : 'block' }}
									>
										{telExist ? '' : '이름은 2글자 ~ 10글자 이내로 해주세요'}
									</div>
								</div>
							</div>
							<div className="inputContainer">
								<input
									type="text"
									name="nickname"
									id="nickname"
									placeholder="닉네임 2~8 글자"
									onChange={infoChange}
									onKeyPress={e => {
										if (e.key === 'Enter') {
											e.preventDefault();
										}
									}}
									maxLength="10"
								/>
								<div
									id="nicknameCheckbox"
									className="checkbox"
									style={{
										backgroundImage:
											userInfo.nickname === null
												? ''
												: nicknameChange()
												? 'url("./img/satisfied.png")'
												: 'url("./img/unsatisfied.png")',
									}}
								>
									<div
										className="inputInfo"
										style={{ display: userInfo.nickname === null ? 'none' : nicknameChange() ? 'none' : 'block' }}
									>
										닉네임은 2글자 ~ 8글자 이내로 해주세요
									</div>
								</div>
							</div>
							<div className="inputContainer">
								<input
									type="text"
									name="email"
									id="email"
									placeholder="이메일 example@email.com"
									onChange={infoChange}
									onKeyPress={e => {
										if (e.key === 'Enter') {
											e.preventDefault();
										}
									}}
								/>
								<div
									id="emailCheckbox"
									className="checkbox"
									style={{
										backgroundImage:
											userInfo.email === null
												? ''
												: emailChange()
												? 'url("./img/satisfied.png")'
												: 'url("./img/unsatisfied.png")',
									}}
								>
									<div
										className="inputInfo"
										style={{ display: userInfo.email === null ? 'none' : emailChange() ? 'none' : 'block' }}
									>
										이메일 형식을 지켜주세요 example@email.com
									</div>
								</div>
							</div>
							<div className="inputContainer">
								<input
									type="tel"
									id="tel"
									name="tel"
									placeholder="전화번호 010-1234-5678"
									onChange={infoChange}
									onKeyPress={e => {
										if (e.key === 'Enter') {
											e.preventDefault();
										}
									}}
									maxLength="13"
								/>
								<div
									id="telCheckbox"
									className="checkbox"
									style={{
										backgroundImage:
											userInfo.tel === null
												? ''
												: telChange()
												? !telExist
													? 'url("./img/satisfied.png")'
													: 'url("./img/unsatisfied.png")'
												: 'url("./img/unsatisfied.png")',
									}}
								>
									<div
										className="inputInfo"
										style={{ display: userInfo.tel === null ? 'none' : telChange() ? 'none' : 'block' }}
									>
										-를 붙여서 입력해주세요
									</div>
								</div>
							</div>
							<div id="signUpErrorMessage">{errMsg}</div>
							<button className="next" onClick={checkTelInfo}>
								다음 단계
							</button>
						</div>
						{/* 프로필 사진 업로드 */}
						<div className="signUpInnerContainer">
							<div id="profilePreview" style={{ backgroundImage: `url(${profilePreviewSrc})` }} />
							<label id="profileUploadLabel" htmlFor="profileUpload">
								업로드
							</label>
							<input type="file" accept="image/*" name="profile" id="profileUpload" onChange={profilePreview} />
							<input
								type="text"
								onChange={handleStatusMessage}
								className="statusMessage"
								name="statusMessage"
								placeholder="상태 메시지"
							/>
							<div className="buttonBox">
								<button className="prev" onClick={clickPrevButton}>
									이전
								</button>
								<button className="next" onClick={clickNextButton}>
									다음
								</button>
							</div>
						</div>
						{/* 랜덤채팅 사용 여부 */}
						<div className="signUpInnerContainer">
							<div className="rcInfoContainer">
								<div className="rcCheck">
									<div style={{ marginLeft: '10px' }}>랜덤 채팅</div>
									<div className="rcToggle" onClick={rcToggle}>
										<div className={userInfo.useRandomChatting ? 'rcButton checked' : 'rcButton'} ref={rcButton}>
											{userInfo.useRandomChatting ? 'on' : 'off'}
										</div>
									</div>
								</div>
								<div className="rcTagContainer">
									<div className="rcCover" style={{ display: userInfo.useRandomChatting ? 'none' : 'flex' }}>
										<div className="rcCoverInfo">
											<div>랜덤 채팅 활성화를 하시려면 우측 상단의 off를 눌러주세요</div>
											<div>랜덤 채팅 설정은 나중에 하셔도 됩니다. 넘어가시려면 아래의 가입하기를 눌러주세요</div>
										</div>
									</div>
									<div className="rcTagText">
										<div style={{ marginLeft: '10px' }}>랜덤 채팅 관심사</div>
										<input type="text" id="inputTag" maxLength="15" placeholder="Tag" onKeyPress={rcTagInput} />
									</div>
									<div className="rcTags">
										{userInfo.rcTag.length === 0
											? '태그를 입력하지 않으면 모든 카테고리의 유저 리스트를 내보냅니다.'
											: ''}
										{userInfo.rcTag.map((el, idx) => (
											<Tag text={el} key={idx} rcTagDeleteHandler={rcTagDeleteHandler} />
										))}
									</div>
								</div>
							</div>

							<div className="buttonBox">
								<button className="prev" onClick={clickPrevButton}>
									이전
								</button>
								<button className="next" onClick={clickNextButton}>
									{userInfo.useRandomChatting ? '다음' : '가입하기'}
								</button>
							</div>
						</div>
						<div className="signUpInnerContainer">
							<div id="randomChatProfilePreview" style={{ backgroundImage: `url(${randomChatProfilePreviewSrc})` }} />
							<label id="randomChatProfileUploadLabel" htmlFor="randomChatProfileUpload">
								업로드
							</label>
							<input
								type="file"
								accept="image/*"
								name="randomChatProfile"
								id="randomChatProfileUpload"
								onChange={randomChatProfilePreview}
							/>
							<div className="buttonBox">
								<button className="prev" onClick={clickPrevButton}>
									이전
								</button>
								<button className="next" onClick={clickNextButton}>
									가입완료
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
			{confirmWindow &&
				settingConfirmWindow(
					'랜덤채팅 설정은 나중에 개인정보에서 설정하실 수 있습니다.\n회원가입을 완료하시겠습니까?',
					'이어하기',
					'가입하기',
					confirmHandler
				)}
		</>
	);
};

export default SignUp;
