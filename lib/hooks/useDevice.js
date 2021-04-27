import React, { useEffect, useState } from 'react';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';

export const useDevice = () => {
	const size = useWindowSize();
	const [device, setDevice] = useState({
		isMobile: false,
	  	isTablet: false,
	  	isDesktop: false,
	  	isSmartTV: false
	});

	useEffect(() => {
		const isMobileOnSize = innerWidth < 640 ? true : false;
		const isTabletOnSize = (innerWidth >= 640 && innerWidth < 1024) ? true : false;
		const isDesktopOnSize = (innerWidth >= 1024 && innerWidth < 1920) ? true : false;
		const isSmartTVOnSize = innerWidth >= 1920 ? true : false;

        setDevice({
        	isMobile: isMobileOnSize,
		  	isTablet: isTabletOnSize,
		  	isDesktop: isDesktopOnSize,
		  	isSmartTV: isSmartTVOnSize
        });
    }, [size]);

    return {...device};
}