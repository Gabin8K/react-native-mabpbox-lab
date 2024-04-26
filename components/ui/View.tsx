import useTheme from '@/hooks/useTheme';
import React from 'react';
import { View as RNView, ViewProps } from 'react-native';

type Props = ViewProps & {
  container?: boolean;
}

export default function View({ style, ...props }: Props) {
  const { value: { colors, space } } = useTheme();
  return (
    <RNView
      style={[
        style,
        {
          marginHorizontal: props.container ? space.container : undefined,
          backgroundColor: (style as any)?.backgroundColor ?? colors.background,
        },
      ]}
      {...props}
    />
  )
}