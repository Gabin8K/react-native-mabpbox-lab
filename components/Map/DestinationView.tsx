import { memo, useEffect } from "react";
import { Point } from "@/utils/type";
import { MarkerView } from "@rnmapbox/maps";
import createStyleSheet from "@/utils/createStyleSheet";
import useStyle from "@/theme/useStyle";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";
import Text from "../ui/Text";
import View from "../ui/View";

type Props = {
  point: Point;
  distance: number;
  diabledAnimation?: boolean;
}

const RIPPLES = Array.from({ length: 2 }, (_, i) => i);


export default memo<Props>(function ({ point, distance, diabledAnimation }) {
  const { style, value: { colors } } = useStyle(styles);

  return (
    <MarkerView
      allowOverlap
      coordinate={[...point]}
    >
      <View
        style={style.container}
      >
        {!diabledAnimation ?
          RIPPLES.map((_, index) => (
            <AnimatedView
              key={index}
              index={index}
            />
          )) :
          null}
        <Text
          bold
          size={16}
          color={colors.textLight}
        >
          {(distance / 1000).toFixed(2)}
          <Text
            bold
            size={8}
            color={colors.textLight}
          >
            {' Km'}
          </Text>
        </Text>
      </View>
    </MarkerView>
  );
});


const AnimatedView = memo(({ index }: { index: number }) => {
  const { style } = useStyle(styles);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  const uas = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
      ]
    }
  }, []);

  useEffect(() => {
    scale.value = withDelay(index * 500, withRepeat(withTiming(1.4, { duration: 1000 }), -1, false));
    opacity.value = withDelay(index * 500, withRepeat(withTiming(0, { duration: 1000 }), -1, false));
  }, [])

  return (
    <Animated.View
      style={[style.rounded, uas]}
    />
  )
});

const styles = createStyleSheet(({ colors }) => ({
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  rounded: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: colors.textLight,
  },
}));