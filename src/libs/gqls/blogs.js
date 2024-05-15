import { gql } from "@apollo/client";

export const CREATE_BLOG = gql`
mutation CreateBlog($input: UpdateCreateBlogInputType!) {
   createBlog(data: $input) {
    id
    userId
    title
    description
    cover
    createdAt
    user{
       id
       name
       image
     }
  }
}
`;

export const ALL_BLOGS = gql`
query Blogs($userId: String!) {
   blogs(userId: $userId) {
    id
    userId
    title
    description
    cover
    createdAt
    user{
       id
       name
       image
     }
  }
}
`;