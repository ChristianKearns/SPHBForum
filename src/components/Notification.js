import React, { useEffect, useState } from 'react'

export default function Notification({ message, display }) {
    const [show, setShow] = useState(display)
    const [opacity, setOpacity] = useState(100)
    const [fade, setFade] = useState(false)

    // Set timer to begin fade animation (3000ms / 3s delay)
    useEffect(() => {
        const delayId = setTimeout(() => {
            setFade(true)
        }, 3000)
        return () => clearTimeout(delayId)
    }, [])

    // Once fade is set to begin, set opacity progressively lower until it is below 0. Then get rid of the notification.
    if (fade) {
        const timerId = setInterval(() => {
            setOpacity((prev) => {
                return prev - 0.005
            })
            if (opacity < 0) {
                setShow(false)
                clearInterval(timerId)
            }
        }, 50)
    }

    // If someone clicks the 'x' button, close the notification
    function handleClick() {
        setShow(false);
    }

    return (
        <>
            {
                show && <div className='notification-container' style={{ opacity: `${opacity}%` }}>
                    <div className='notification-message'>
                        {message}
                    </div>
                    <button className='close-notification-btn' onClick={handleClick}>&times;</button>
                </div>
            }
        </>
    )
}
