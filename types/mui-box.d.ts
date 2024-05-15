import React from 'react';
import { Theme } from '@mui/material';
import { OverrideProps } from '@mui/types';

declare module '@mui/material/Box' {

  export interface BoxTypeMap<P = {}, D extends React.ElementType = 'div', T extends object = Theme> {
    props: P &
    SystemProps<T> & {
      children?: React.ReactNode;
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      component?: React.ElementType;
      ref?: React.Ref<unknown>;
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx?: SxProps<T>;
    };
    defaultComponent: D;
  }
  declare const Box: OverridableComponent<BoxTypeMap<{}, 'div', Theme>>;

  interface HD extends BoxTypeMap['defaultComponent'] {
    style?:{
      scaleX?: string | number | any;
      scaleY?: string | number | any;
    }
  }

  export type BoxProps<
    D extends React.ElementType = HD,
    P = {},
    > = OverrideProps<BoxTypeMap<P, D, Theme>, D>;

  export default Box;
}