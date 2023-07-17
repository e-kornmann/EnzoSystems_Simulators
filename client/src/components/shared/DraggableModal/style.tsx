import styled from 'styled-components';
import * as Sv from '../stylevariables';

type Props = { 
	$grabbing: boolean;
}

export const Wrapper = styled.div<Props>`
	position: absolute;
	display: flex;
	justify-content: center;
	aligng-items: flex-start;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 700;
	outline: 0;
	cursor: ${(props) => (props.$grabbing ? "grabbing" : "grab")};
	user-select: none;
	&:active {
		cursor: grabbing;
	}

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
	position: relative;
	background: ${Sv.black};
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
	font-family: 'Inter', sans-serif;
	font-weight: 400;
	font-size: 15px;
	align-self: center;
	color: ${Sv.enzoOrange};
`;

export const CloseButton = styled.button`
	font-family: 'Rubik', sans-serif;
	font-weight: 100;
	font-size: 1.53rem;
	margin-right: -5px;
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
	overflow-x: hidden;
	overflow-y: auto;
`;