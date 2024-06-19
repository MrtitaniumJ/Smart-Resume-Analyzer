import React, { useEffect, useState } from 'react';

function SuccessPopup({ message }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000);   // hide after 2 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg ${isVisible ? 'block' : 'hidden'}`}>
            {message}
        </div>
    );
}

export default SuccessPopup;