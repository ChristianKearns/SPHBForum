import { Link } from "react-router-dom"

export default function SubCategoryList({ child_categories }) {
    // Each Sub-Category will render out a different postlist page.
    return (
        <>
            <div className="post-list-container">
                {
                    child_categories.map((categories, index) => {
                        return (
                            <div className="post-list-item-container" key={4 * index}>
                                <Link to={`/${categories}`} className="post-link">{categories}</Link>
                            </div>
                        )
                    })

                }
            </div>
        </>
    )
}