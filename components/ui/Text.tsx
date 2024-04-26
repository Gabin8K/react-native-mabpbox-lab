import useTheme from '@/hooks/useTheme';
import React, { forwardRef } from 'react';
import { Text as RNText, TextProps } from 'react-native';

type Props = TextProps & {
  extraBold?: boolean;
  bold?: boolean;
  semiBold?: boolean;
  size?: number;
  color?: string;
}


export default forwardRef<RNText, Props>(function  ({ style, ...props }: Props, ref) {
  const { value: { colors } } = useTheme();

  const fontSize = props.size || 14;
  const color = (style as any)?.color ?? props.color ?? colors.text;
  const fontFamily =
    props.extraBold ? 'TwEB' :
      props.bold ? 'TwB' :
        props.semiBold ? 'TwSB' :
          'TwN';


  return (
    <RNText
      ref={ref}
      style={[
        style,
        {
          fontFamily,
          fontSize,
          color,
        },
      ]}
      {...props}
    />
  )
})