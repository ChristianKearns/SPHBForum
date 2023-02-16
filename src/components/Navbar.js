import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../images/logo.png"
import { createClient } from '@supabase/supabase-js'
import Feedback from "./Feedback";
import { useUser } from "../hooks/useUser";

const supabase = createClient(
    "https://uvzlykichvbwpbqcmqid.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2emx5a2ljaHZid3BicWNtcWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MzM4MjAsImV4cCI6MTk5MTIwOTgyMH0.9UEbNncg2fk8ZuN8dbfoO2mJrthprzE6deEUsT_CQzo"
);

export default function Navbar() {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const currentUser = useUser()

    supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
            setIsLoggedIn(true)
        }
        else {
            setIsLoggedIn(false)
        }
    })

    if (Object.keys(currentUser).length === 0 && isLoggedIn) return <></>
    async function UserSignOut() {
        await supabase.auth.signOut()
        navigate("/")
        window.location.reload(false)
    }

    return (
        <nav className="nav">
            <Link to="/" className="logo"><img src={logo} alt="SPHB Logo" /></Link>
            <div className="nav-links-container"><div className="nav-border-link">
                <Link to="/" className="nav-links">Home</Link>
            </div></div>
            <div className="nav-links-container"><div className="nav-border-link">
                <Link to="/" className="nav-links">Forum</Link>
            </div></div>
            {isLoggedIn ? (
                <>
                    <div className="nav-links-container"><div className="nav-border-link">
                        <Link to="/profiles" className="nav-links">Profiles</Link>
                    </div></div>
                    <div className="nav-links-container"><div className="nav-border-link">
                        <Link to="/profiles/user/pms/inbox" className="nav-links">Private Messages</Link>
                    </div></div>
                    <div className="nav-sign-up">
                        <button onClick={UserSignOut} className="new-post-button">Logout</button>
                        <div className="nav-welcome">Hi {currentUser.user_metadata.full_name}!</div>
                    </div>
                    <Feedback />
                </>
            ) : (
                <div className="nav-sign-up">
                    <Link to="/login" className="new-post-button">Login</Link>
                </div>
            )}

        </nav>
    )
}