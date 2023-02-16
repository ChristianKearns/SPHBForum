import React from "react"
import { Routes, Route } from "react-router-dom"
import { Post } from "./components/Post"
import { PostProvider } from "./contexts/PostContext"
import NewPostPage from "./components/NewPostForm"
import CategoryList from "./components/CategoryList"
import SubCategory from "./components/SubCategory"
import ProfileList from "./components/ProfileList"
import Profile from "./components/Profile"
import Inbox from "./components/Inbox"
import Sent from "./components/Sent"
import NewPMForm from "./components/NewPMForm"
import PM from "./components/PM"
import Admin from "./components/Admin"
import AdminNewRole from "./components/AdminNewRole"
import AdminNewReport from "./components/AdminNewReport"
import AdminNewFeedback from "./components/AdminNewFeedback"
import LogIn from "./components/LogIn"
import Navbar from "./components/Navbar"

function App() {

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<CategoryList />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/new-role" element={<AdminNewRole />} />
          <Route path="/admin/create-report" element={<AdminNewReport />} />
          <Route path="/admin/create-feedback" element={<AdminNewFeedback />} />
          <Route path="/profiles" element={<ProfileList />} />
          <Route path="/profiles/user/:user" element={<Profile />} />
          <Route path="/profiles/user/pms/inbox" element={<Inbox />} />
          <Route path="/profiles/user/pms/sent" element={<Sent />} />
          <Route path="/profiles/user/pms/new-pm" element={<NewPMForm />} />
          <Route path="/profiles/user/pms/inbox/:id" element={<PM />} />
          <Route path="/profiles/user/pms/sent/:id" element={<PM />} />
          <Route path="/:category" element={<SubCategory />} />
          <Route path="/:category/new-post" element={<NewPostPage />} />
          <Route
            path="/:category/posts/:id"
            element={
              <PostProvider>
                <Post />
              </PostProvider>
            }
          />
        </Routes>
      </div>
    </>
  )
}

export default App;