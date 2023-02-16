import { Link } from "react-router-dom";
import { PostList } from "./PostList";
import { useParams } from "react-router-dom";
import { IconBtn } from "./IconBtn";
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function SubCategory() {
    const { category } = useParams()

    return (
        <>
            <Link to="/" className="nav-arrow-container">
                <IconBtn
                    Icon={FaLongArrowAltLeft}
                    className="navigation-arrow" />
                <div className="postlist-category-name-container">
                    <div className="postlist-category-name">
                        Back to List of Categories
                    </div>
                </div>
            </Link>
            <Link to={`/${category}/new-post`} className="new-post-button">Create new post!</Link>
            <PostList />
        </>
    )
}