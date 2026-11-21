import React, { useEffect, useState } from 'react'

export default function AutoDismissAlert({ message, variant = 'success', duration = 3000 }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), duration);

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, [duration]);

    if (!show) return null; // Return null if the alert is not shown

    return (
        <div className={`alert custom_alert_${variant} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close auto_dismiss_close_btn" aria-label="Close" onClick={() => setShow(false)}>
                <span aria-hidden="true" >&times;</span>
            </button>
        </div>
    )
} 
