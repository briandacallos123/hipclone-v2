import { gql } from '@apollo/client';

export const FEEDS_QUERY = gql`
  query FEEDS_QUERY($skip: Int!, $take: Int!, $requestType: String!) {
    QueryPosts(skip: $skip, take: $take, requestType: $requestType) {
      id
      requestType
      u_like
      likes
      text
      createdAt
      isPublic
      attachmentData {
        createdAt
        fileName
        id
        imagePath
      }
      userData {
        EMP_FNAME
        EMP_ID
        EMP_LNAME
        EMP_MNAME
        EMP_TITLE
        attachment{
          filename
        }
      }
    }
  }
`;

export const FEEDS_QUERY_COPY = gql`
  query FEEDS_QUERY_COPY {
    QueryPostsCopy {
      id
      likes
      text
      attachmentData {
        createdAt
        fileName
        id
        imagePath
      }
      userData {
        EMP_FNAME
        EMP_ID
        EMP_LNAME
        EMP_MNAME
        EMP_TITLE
      }
    }
  }
`;

export const FEEDS_POST = gql`
  mutation FEEDS_POST($data: postInputType!, $file: Upload!) {
    post_feed_mutation(file: $file, data: $data) {
      message
      status
    }
  }
`;

export const FEEDS_POST_TEXT = gql`
  mutation FEEDS_POST($data: postInputType!) {
    post_feed_mutation(data: $data) {
      message
      status
    }
  }
`;

export const FEEDS_POST_DELETE = gql`
  mutation FEEDS_POST_DELETE($data: DeleteInputType!) {
    postDelete_Mutation(data: $data) {
      message
      status
    }
  }
`;

export const FEEDS_LIKE = gql`
  mutation FEEDS_LIKE($data: postLikeInputType!) {
    post_like_mutation(data: $data) {
      message
      status
    }
  }
`;

export const QUERY_LIKES = gql`
  query QUERY_LIKES($data: QueryLikesInputType!) {
    QueryLikes(data: $data) {
      status
      message
    }
  }
`;
