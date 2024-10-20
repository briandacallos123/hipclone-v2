'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
// gqls

// Nexus
import { NexusGenInputs, NexusGenObjects } from 'generated/nexus-typegen';
import {
  FEEDS_QUERY,
  FEEDS_POST,
  FEEDS_LIKE,
  QUERY_LIKES,
  FEEDS_POST_TEXT,
  FEEDS_POST_DELETE,
} from 'src/libs/gqls/feeds';
import { useAuthContext } from '@/auth/hooks';
// ----------------------------------------------------------------------
type Props = {
  skip: Number;
  take: Number;
  setFeedData?: any | Function | void;
  requestType?: String;
  ignoreRefetch?: boolean;
};
export default function FeedsController(
  props: Props = {
    skip: 0,
    take: 5,
    setFeedData: () => void 0,
    requestType: 'FirstFetch',
    ignoreRefetch: true,
  }
) {
  const { user, socket } = useAuthContext();

  const [queryFunc, queryResults] = useLazyQuery<any>(FEEDS_QUERY, {
    variables: {
      skip: props.skip,
      take: props.take,
      requestType: props?.requestType,
    },
    context: {
      requestTrackerId: 'queryFunc[FEEDS_QUERY]',
    },
    notifyOnNetworkStatusChange: true,
    // fetchPolicy: 'network-only',
  });

  const isLoading = queryResults.loading;

  // first request
  /* useEffect(() => {
    queryFunc();
    }, []); */

  // image upload

  // console.log(allData,'ALLDATA@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

  const [createFunc, createResults] = useMutation(FEEDS_POST);
  const [createTextFunc, createTextesults] = useMutation(FEEDS_POST_TEXT);

  const handleSubmitCreate = useCallback(
    async (model: any) => {
      try {
        if (model.attachment === null) {
          await createTextFunc({
            variables: {
              data: {
                text: model.text,
                isPublic: model.isPublic,
              },
            },
          })
          await queryResults.refetch();
        } else {
          await createFunc({
            variables: {
              data: {
                text: model.text,
                isPublic: model.isPublic,
              },
              file: model.attachment,
            },
          })
        await queryResults.refetch();

        }

        await queryResults.refetch();
        socket.emit('test', {
          message: 'Success',
        });
      } catch (error) {
        console.error(error);
      }
    },
    [createFunc, createTextFunc, queryResults, socket]
  );

  const [likeFunc, likeResults] = useMutation(FEEDS_LIKE);
  const handleLikePost = useCallback(
    async (model: any, id: any) => {
      try {
        await likeFunc({
          variables: {
            data: {
              id: Number(id),
              like: Boolean(model),
            },
          },
        });
        await queryResults.refetch();
      } catch (error) {
        console.error(error);
      }
    },
    [likeFunc, queryResults]
  );

  // query likes

  const [condition, setCondition] = useState<any>();

  const [PostID, setPostID] = useState<any>();

  const [queryLikeFunc, queryLikeResults] = useLazyQuery(QUERY_LIKES, {
    context: {
      requestTrackerId: 'queryFunc[QUERY_LIKES]',
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    queryLikeFunc({
      variables: {
        data: {
          postsId: Number(PostID),
        },
      },
    }).then(async (result) => {
      const { data } = result;

      if (data) {
        setCondition(data.QueryLikes);
      }
    });
  }, [PostID, queryLikeFunc]);

  // delete
  const [deleteFunc, deleteResults] = useMutation(FEEDS_POST_DELETE);
  const handleDeletePost = useCallback(
    async (id: any) => {
      try {
        await deleteFunc({
          variables: {
            data: {
              id: Number(id),
            },
          },
        });
        await queryResults.refetch();
      } catch (error) {
        console.error(error);
      }
    },
    [deleteFunc, queryResults]
  );

  return {
    handleSubmitCreate,
    handleLikePost,
    handleDeletePost,
    condition,
    setPostID,
    //
    queryFunc,
    queryResults,
    createResults,
    isLoading,
    createTextesults,
  };
}
