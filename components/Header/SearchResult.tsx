import useStyle from "@/theme/useStyle";
import createStyleSheet from "@/utils/createStyleSheet";
import { memo, useCallback, useMemo, useState } from "react";
import Animated, { SlideInUp, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { ListRenderItemInfo, Pressable } from "react-native";
import Text from "../ui/Text";
import View from "../ui/View";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SearchItem } from "@/utils/type";

type Props = {
  suggestions: SearchItem[];
  onSelectAdress?: (address: string, name: string) => void;
  onModeChange?: (text: string) => void;
}

type ChipProps = typeof NAVIGATION_MODE[number] & {
  onPress: () => void;
}

const NAVIGATION_MODE = [
  {
    id: 1,
    name: 'Driving',
    icon: 'car-outline',
    active: true
  },
  {
    id: 2,
    name: 'Cycling',
    icon: 'bicycle-outline',
    active: false
  },
  {
    id: 3,
    name: 'Walking',
    icon: 'walk-outline',
    active: false
  },
]


const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


export default memo<Props>(function (props) {
  const { style, value } = useStyle(styles);

  const [chips, setChips] = useState(NAVIGATION_MODE);
  const offsetY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  }, [])

  const onSelelect = useCallback((id: number) => () => {
    setChips(chips => chips.map(item => ({
      ...item,
      active: item.id === id
    })))
    props.onModeChange?.(id === 1 ? 'driving' : id === 2 ? 'cycling' : 'walking');
  }, [])


  const uas = useAnimatedStyle(() => ({
    shadowRadius: withTiming(offsetY.value > 5 ? 4 : 0),
    elevation: withTiming(offsetY.value > 5 ? 4 : 0),
  }), [])

  const renderItem = useMemo(() => ({ item }: ListRenderItemInfo<SearchItem>) => (
    <Pressable
      onPress={() => props.onSelectAdress?.(item.address ?? item.name ?? '', item.name ?? '')}
      style={({ pressed }) => [
        style.item,
        { backgroundColor: pressed ? value.colors.card : value.colors.background },
      ]}
    >
      <View style={style.row1}>
        {item.distance ?
          <View style={style.row2}>
            <MaterialCommunityIcons
              name={'map-marker-distance'}
              size={16}
              color={value.colors.primary}
            />
            <Text
              semiBold
              color={value.colors.primary}
            >
              {(item.distance / 1000).toFixed(1)} km
            </Text>
          </View> :
          null
        }
        <Text
          bold
          size={16}
          color={value.colors.textLight}
        >
          {item.name ? item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name : ''}
        </Text>
      </View>
      {item.address ?
        <Text
          color={value.colors.textLight}
        >
          {item.address}
        </Text> :
        null
      }
      {item.time ?
        <Text
          bold
          size={12}
          style={style.time}
        >
          {(item.time.toFixed(0))} min
        </Text> :
        null
      }
    </Pressable>
  ), [])

  return (
    <View style={style.container}>
      <Animated.View
        style={[style.containerChips, uas]}
      >
        {chips.map((item) => (
          <Chip
            key={item.id}
            {...item}
            onPress={onSelelect(item.id)}
          />
        ))}
      </Animated.View>
      <Animated.FlatList
        entering={SlideInUp.duration(500)}
        showsVerticalScrollIndicator={false}
        style={style.list}
        data={props.suggestions}
        onScroll={scrollHandler}
        renderItem={renderItem}
      />
    </View>
  );
});



const Chip = memo(function ({ name, icon, active, onPress }: ChipProps) {
  const { style, value } = useStyle(styles2);
  const scale = useSharedValue(1);

  const uas = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: withTiming(active ? value.colors.textLight : 'transparent')
  }), [active])

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withTiming(1.1))}
      onPressOut={() => (scale.value = withTiming(1))}
      onPress={onPress}
      style={[style.chip, uas]}
    >
      <Ionicons
        name={icon as any}
        size={18}
        color={value.colors.textLight}
      />
      <Text
        bold
        size={12}
        color={value.colors.textLight}
      >
        {name}
      </Text>
    </AnimatedPressable>
  );
});


const styles2 = createStyleSheet(({ colors }) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.card,
    borderRadius: 10,
    columnGap: 2,
    borderWidth: 1,
  },
}));


const styles = createStyleSheet(({ colors, space }) => ({
  container: {
    borderRadius: 8,
    marginLeft: -12,
    borderTopWidth: 1,
    overflow: 'hidden',
    borderTopColor: colors.border,
  },
  containerChips: {
    zIndex: 1,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 18,
    backgroundColor: colors.background,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
  },
  list: {
    maxHeight: space.height * 0.6
  },
  item: {
    paddingVertical: 10,
    columnGap: 2,
    paddingHorizontal: 18
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    backgroundColor: 'transparent'
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
    backgroundColor: 'transparent'
  },
  time: {
    position: 'absolute',
    right: 18,
    top: 10
  }
}));