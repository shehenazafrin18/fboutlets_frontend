import React, { useEffect } from 'react';

const LogoutListener = () => {
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'logoutSignal' || event.key === 'loginSignal') {
                window.location.reload();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return null; // No need to render anything for this component
};

export default LogoutListener;
