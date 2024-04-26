import View from '@/components/ui/View';
import createStyleSheet from '@/utils/createStyleSheet';
import useStyle from '@/theme/useStyle';
import MapView from '@/components/Map/MapView';
import Header from '@/components/Header/Header';
import useLocation from '@/hooks/useLocation';

export default function TabOneScreen() {
  const { style } = useStyle(styles);
  const location = useLocation();

  return (
    <View style={style.container}>
      <Header
        location={location}
      />
      <MapView
        location={location}
      />
    </View>
  );
}

const styles = createStyleSheet(() => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
