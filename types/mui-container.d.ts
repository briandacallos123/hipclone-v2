
declare module '@mui/material/Container' {

    export interface OverridableComponent<M extends OverridableTypeMap> {
        <C extends React.ElementType>(
            props: {
                component: C | any;
            } & OverrideProps<M, C>,
        ): JSX.Element | null;
        (props: DefaultComponentProps<M>): JSX.Element | null;
    }

    export interface ContainerTypeMap<P = {}, D extends React.ElementType = 'div'> {
        props: P & {
            children?: React.ReactNode;
            classes?: Partial<ContainerClasses>;
            disableGutters?: boolean;
            fixed?: boolean;

            maxWidth?: Breakpoint | false;
            sx?: SxProps<Theme>;
        };
        defaultComponent: D;
    }


    declare const Container: OverridableComponent<ContainerTypeMap>;

    export type ContainerProps<
        D extends React.ElementType = ContainerTypeMap['defaultComponent'],
        P = {},
        > = OverrideProps<ContainerTypeMap<P, D>, D>;

    export default Container;

}
