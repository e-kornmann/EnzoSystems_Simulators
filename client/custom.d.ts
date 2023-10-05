declare module '*.svg' {
  import * as React from 'react';

  // eslint-disable-next-line import/prefer-default-export
  export const ReactComponent: React.FunctionComponent<
  React.ComponentProps<'svg'> & { title?: string }
  >;

}
