import styled from 'styled-components';
import * as Sv from '../stylevariables';

export const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 700;
	outline: 0;
`;

export const Backdrop = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.3);
	z-index: 500;
`;

export const StyledModal = styled.div`
	z-index: 100;
	background: ${Sv.black};
	position: relative;
	border-radius: 4px;
`;

export const Header = styled.div`
	border-radius: 4px 4px 0 0;
	display: flex;
	justify-content: space-between;
	background-color: ${Sv.black};
	padding: 0.5rem 1.3rem;
`;

export const HeaderText = styled.div`
	font-family: 'Rubik', sans-serif;
	font-weight: 600;
	align-self: center;
	color: ${Sv.enzoOrange};
`;

export const CloseButton = styled.button`
	font-family: 'Rubik', sans-serif;
	font-weight: 100;
	font-size: 1.53rem;
	margin-right: -10px;
	color: white;
	border: none;
	border-radius: 13px;
	background: none;
	&:hover {
		cursor: pointer;
		color: ${Sv.enzoOrange};
	}
`;

export const Content = styled.div`
	padding: 10px;
	max-height: 30rem;
	overflow-x: hidden;
	overflow-y: auto;
`;