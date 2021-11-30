import React from 'react';

const Confirm = ({ text, left, right, confirmHandler }) => {
	return (
		<div id="confirmBackground">
			<div id="confirmWindow">
				<div className="text">{text}</div>
				<div className="buttonContainer">
					{left ? <button onClick={confirmHandler}>{left}</button> : ''}
					{right ? <button onClick={confirmHandler}>{right}</button> : ''}
				</div>
			</div>
		</div>
	);
};

export default Confirm;
