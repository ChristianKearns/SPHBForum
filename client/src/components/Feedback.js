import React, { useState } from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { useAsyncFn } from '../hooks/useAsync'
import { IconBtn } from './IconBtn'
import { createFeedback } from '../services/feedback'

export default function Feedback() {
    const [clicked, setClicked] = useState(false)
    const [feedback, setFeedback] = useState("")
    const createFeedbackFn = useAsyncFn(createFeedback)

    function handleClick() {
        setClicked(!clicked)
    }

    function onFeedbackCreate(feedback) {
        return createFeedbackFn.execute({ feedback })
    }

    function handleSubmit(e) {
        e.preventDefault()
        onFeedbackCreate(feedback).then(() => {
            setFeedback("")
            setClicked(false)
        })
    }

    return (
        <>
            <button
                onClick={handleClick}
                className={`${clicked ? 'feedback-clicked' : 'feedback'}`}>
                Provide Feedback!
            </button>
            <div>
                <div className={`${clicked ? 'feedback-container-clicked' : 'feedback-container'}`}>
                    <div className="feedback-bot-profile">
                        <IconBtn Icon={FaUserAlt} />
                    </div>
                    <div className='feedback-bot-chat-bubble'>
                        Hi! Do you have any feedback as to how the forum
                        can be improved? Please type it out below!
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <textarea
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            className={`${clicked ? 'feedback-chat-box' : 'feedback-container'}`}>
                        </textarea>
                        <button
                            type="submit"
                            className={`${clicked ? 'feedback-btn' : 'feedback-container'}`}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}
