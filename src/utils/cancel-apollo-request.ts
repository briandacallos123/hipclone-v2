import {
    ApolloLink,
    Observable,
    WatchQueryOptions
} from '@apollo/client';


const connections: { [key: string]: any } = {};

export const cancelRequestLink = new ApolloLink(
    (operation, forward) =>
        new Observable(observer => {
            const context = operation.getContext();
            const connectionHandle = forward(operation).subscribe({
                next: (...arg) => {
                    observer.next(...arg)
                },
                error: (...arg) => {
                    cleanUp();
                    observer.error(...arg);
                },
                complete: (...arg) => {
                    cleanUp();
                    observer.complete(...arg)
                }
            });

            const cleanUp = () => {
                connectionHandle?.unsubscribe();
                delete connections[context.requestTrackerId];
            }

            if (context.requestTrackerId) {
                const controller = new AbortController();
                controller.signal.onabort = cleanUp;
                operation.setContext({
                    ...context,
                    fetchOptions: {
                        signal: controller.signal,
                        ...context?.fetchOptions
                    },
                });
           
                if (connections[context.requestTrackerId]) {
                    connections[context.requestTrackerId]?.abort(); 
                 
                }
                connections[context.requestTrackerId] = controller;
    
            }

            return connectionHandle;
        }),             

);

