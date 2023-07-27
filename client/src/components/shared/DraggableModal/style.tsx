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
	border-radius: 2px;	
	z-index: 70;
	cursor:  ${(props) => (props.$grabbing ? "grabbing" : "grab")};
	pointer-events: auto;
`;

export const Header = styled.div`
	border-radius: 4px 4px 0 0;
	display: flex;
	justify-content: flex-end;
	padding: 0.5rem 1.3rem;
`;

export const CloseButton = styled.button`
	font-family: 'Rubik', sans-serif;
	font-weight: 100;
	font-size: 1.53rem;
	margin-right: -5px;
	color: white;
	border: none;
	border-radius: 13px;
	background: ${Sv.gray};
	&:hover {
		cursor: pointer;
		color: ${Sv.enzoOrange};
	}
`;

export const Content = styled.div`
	border-radius: 8px;	
	overflow-x: hidden;
	overflow-y: auto;
	box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
`;