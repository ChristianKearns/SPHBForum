import SubCategoryList from "./SubCategoryList"
import { createClient } from '@supabase/supabase-js'
import { useAsync } from "../hooks/useAsync"
import { Link } from "react-router-dom";

const supabase = createClient(
    "https://uvzlykichvbwpbqcmqid.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2emx5a2ljaHZid3BicWNtcWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MzM4MjAsImV4cCI6MTk5MTIwOTgyMH0.9UEbNncg2fk8ZuN8dbfoO2mJrthprzE6deEUsT_CQzo"
);

export default function CategoryList() {

    const categories = ["League", "Season", "Off-Topic"]
    const leagueCategories = ["Announcements", "Media", "League Discussion"]
    const SeasonCategories = ["Match scores", "Season Discussion"]
    const OffTopic = ["Fishing", "Sports", "Snoozy is Gay"]
    const subCategories = [leagueCategories, SeasonCategories, OffTopic]
    const { loading, error, value: user } = useAsync(() => supabase.auth.getUser())
    if (loading) return <h1>Loading</h1>
    if (error) return <h1 className="error-msg"> {error} </h1>

    return (
        user.data.user ? (
            <div className="post-list-container" >
                {
                    categories.map((category, index) => {
                        return (
                            <div key={index}>
                                <h1 className="categories">{category}</h1>
                                <SubCategoryList child_categories={subCategories[index]} />
                            </div>
                        )
                    })
                }
            </div>
        ) :
            (
                <div className="logged-out-users">
                    <div className="logged-out-text">
                        Only logged in users can browse the forum.
                        Please log in to proceed!
                    </div>
                    <Link to="/login" className="new-post-button logged">Login</Link>
                </div>
            )

    )
}