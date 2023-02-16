# SPHBForum

This project is a full-stack web development forum. The project is not entirely integrated into Github, so this page is temporarily being used to store an incomplete, disfunctional version of the forum the has "halfway" implemented user log-ins with the following issues.

1) Most importantly, the project needs a UserContext.js file. This should resolve the need to make multiple async calls dependent on each other's information.
2) Finish the server to implement the currentUser being the logged in user. Only post is currently "supported."
3) Make sure there are not general errors breaking the site. (i.e. page not loading because a user has no roles so roles[0] is undefined).

Other things to implement:
1) Notifications that can disappear and then be recalled.
2) Search bars
3) Pagination
4) Different ways to search for posts (i.e. "New Posts")
