import { useState } from 'react';

export const useModal = () => {
	const [isShown, setIsShown] = useState<boolean>(true);
	const toggle = () => setIsShown(!isShown);
	return {
		isShown,
		toggle,
	};
};