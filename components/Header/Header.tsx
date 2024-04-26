import { memo, useCallback, useState } from "react";
import createStyleSheet from "@/utils/createStyleSheet";
import useStyle from "@/theme/useStyle";
import Animated, { SlideInLeft, SlideInRight, SlideOutRight, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { ActivityIndicator, Pressable, TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import View from "../ui/View";
import useToast from "@/hooks/useToast";
import MapboxApi from "@/service/mapbox.api";
import { Position, SearchItem } from "@/utils/type";
import SearchResult from "./SearchResult";
import useBackHandler from "@/hooks/useBackHandler";
import useMapStore from "@/stores/map.store";

type Props = {
  location?: Position;
}

const AnimatedInput = Animated.createAnimatedComponent(TextInput);


export default memo<Props>(function (props) {
  const { style, value } = useStyle(styles);
  const toast = useToast();
  const store = useMapStore();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);

  const onChangeText = useCallback(async (text: string, mode: string = 'driving') => {
    if (text === '') {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      if (!props.location) return;
      const data = await MapboxApi.search(text, props.location, mode);
      setSuggestions(data);
      store.setQuery(text);
    } catch (err) {
      toast.error(`Cannot search: ${text}`);
    } finally {
      setLoading(false);
    }
  }, [props.location]);

  const onModeChange = useCallback((mode: string) => {
    if (store.query !== undefined) {
      onChangeText(store.query, mode);
    }
  }, [onChangeText, store.query]);


  const onOpen = useCallback(() => {
    setShow(show => !show);
    if (show) {
      setSuggestions([])
    }
  }, [show]);


  const onSelectAdress = useCallback((address: string, name: string) => {
    store.setAddress(address ?? name ?? '');
    store.setName(name ?? '');
    setShow(false);
    setSuggestions([]);
  }, [])


  const uas = useAnimatedStyle(() => {
    const size = value.space.width - 2 * value.space.container;
    const width = withTiming(show ? size : 50);
    const borderRadius = withTiming(show ? 8 : 50);
    return {
      width,
      borderRadius,
    }
  }, [show])


  useBackHandler(() => {
    if (show) {
      setShow(false);
      return true;
    }
    return false;
  }, [show]);


  return (
    <>
      <Animated.View
        style={[style.container, uas]}
      >
        <View style={style.row}>
          <Pressable
            style={style.button}
            onPress={onOpen}
          >
            {show ?
              <AntDesign
                name={'left'}
                size={24}
                color={value.colors.primary}
              /> :
              <AntDesign
                name={'search1'}
                size={24}
                color={value.colors.primary}
              />
            }
          </Pressable>
          {show ?
            <AnimatedInput
              entering={SlideInLeft.duration(500)}
              exiting={SlideOutRight.duration(500)}
              autoFocus
              placeholder={'Type to search...'}
              style={style.input}
              onChangeText={onChangeText}
              cursorColor={value.colors.textLight}
              selectionColor={value.colors.textLight}
              placeholderTextColor={value.colors.textLight}
            /> :
            null
          }
          {loading ?
            <ActivityIndicator
              size={16}
              color={value.colors.primary}
              style={style.loading}
            /> :
            null
          }
        </View>
        {show && suggestions.length > 0 ?
          <SearchResult
            suggestions={suggestions}
            onModeChange={onModeChange}
            onSelectAdress={onSelectAdress}
          /> :
          null
        }
      </Animated.View>
      {!show && (store.address || store.name) ?
        <Animated.Text
          entering={SlideInRight.duration(500)}
          style={style.title}
        >
          {store.address ? store.address.length > 30 ? store.address.slice(0, 30) + '...' : store.address : store.name}
        </Animated.Text> :
        null
      }
    </>
  );
});


const styles = createStyleSheet(({ colors, space }) => ({
  container: {
    top: 10,
    left: space.container,
    minHeight: 50,
    zIndex: 2,
    position: 'absolute',
    paddingLeft: 12,
    backgroundColor: colors.background,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  row: {
    height: 50,
    flexDirection: 'row',
    columnGap: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    fontFamily: 'TwB',
    fontSize: 18,
    color: colors.primary,
  },
  loading: {
    marginRight: 10,
  },
  title: {
    zIndex: 2,
    top: 25,
    left: 80,
    fontSize: 16,
    fontFamily: 'TwB',
    position: 'absolute',
    color: colors.textLight,
  }
}));