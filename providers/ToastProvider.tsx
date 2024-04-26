import Text from "@/components/ui/Text";
import useStyle from "@/theme/useStyle";
import createStyleSheet from "@/utils/createStyleSheet";
import { Toast } from "@/utils/type";
import { createContext, memo, PropsWithChildren, useCallback, useState } from "react";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";


type ToastState = {
  message?: string;
  color?: string;
}

const initialState: Toast = {
  success: () => { },
  error: () => { },
  info: () => { },
  clear: () => { },
}

const DURATION = 3000;
const DURATION_VIEW = 700;


export const ToastContext = createContext<Toast>(initialState);

export default memo(function ({ children }: PropsWithChildren) {
  const { style, value: { colors } } = useStyle(styles);
  const [toast, setToast] = useState<ToastState>();

  const success = useCallback((message: string) => {
    setToast({ message, color: colors.primary });
    setTimeout(() => setToast(undefined), DURATION);
  }, [])

  const error = useCallback((message: string) => {
    setToast({ message, color: colors.error });
    setTimeout(() => setToast(undefined), DURATION);
  }, [])

  const info = useCallback((message: string) => {
    setToast({ message, color: colors.info });
    setTimeout(() => setToast(undefined), DURATION);
  }, [])

  const clear = () => {
    setToast(undefined);
  }

  return (
    <ToastContext.Provider
      value={{
        success,
        error,
        info,
        clear
      }}
    >
      {children}
      {toast ?
        <Animated.View
          style={style.container}
          entering={SlideInDown.duration(DURATION_VIEW)}
          exiting={SlideOutDown.duration(DURATION_VIEW)}
        >
          <Text
            semiBold
            style={{ color: toast.color }}
          >
            {toast.message}
          </Text>
        </Animated.View> :
        null
      }
    </ToastContext.Provider>
  )
});


const styles = createStyleSheet(({ colors }) => ({
  container: {
    bottom: 20,
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.background,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: 1000
  }
}))