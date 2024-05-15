import React from 'react';
import {  FieldPath, FieldValues} from 'react-hook-form';

declare module 'react-hook-form' {

    export interface CustomRenderInterface {
        field: any;
        fieldState: any;
        formState: any;
    };

    export type ControllerProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
        render: ({ field, fieldState, formState, }: {
            field: ControllerRenderProps<TFieldValues, TName> | any;
            fieldState: ControllerFieldState | any;
            formState: UseFormStateReturn<TFieldValues> | any;
        }) => React.ReactElement;
    } & UseControllerProps<TFieldValues, TName>;


    declare const Controller: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: ControllerProps<TFieldValues, TName>) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;

    export { Controller };


}