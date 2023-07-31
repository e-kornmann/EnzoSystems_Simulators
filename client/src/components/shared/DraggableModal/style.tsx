import styled from 'styled-components';
import * as Sv from '../../../styles/stylevariables';

type Props = { 
	$grabbing: boolean;
}

export const Wrapper = styled.div`
	position: fixed;
	display: flex;
	justify-content: center;
	aligng-items: flex-start;
	top: 50%;
	left: 50%;
	pointer-events: none;
	transform: translate(-50%, -50%);
	z-index: 30;
`;

export const StyledModal = styled.div<Props>`
	z-index: 70;
	cursor:  ${(props) => (props.$grabbing ? "grabbing" : "grab")};
	pointer-events: auto;
`;

export const CloseButton = styled.button`
	position: absolute;
	right: 0;
	top: -40px;
	font-family: 'Rubik', sans-serif;
	width: 30px;
	height: 30px;
	font-weight: 100;
	font-size: 1.53rem;
	color: white;
	border: none;
	border-radius: 3px;
	background: ${Sv.gray};
	&:hover {
		cursor: pointer;
		color: ${Sv.enzoOrange};
	}
`;

type ContentProps = { 
	$width: number;
	$height: number;
}

export const Content = styled.div<ContentProps>`
	width: ${(props) => props.$width}px;
	height: ${(props) => props.$height}px;
	border-radius: 5px;	
	overflow-x: hidden;
	overflow-y: auto;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
`;