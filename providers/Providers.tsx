import React, { memo, PropsWithChildren } from 'react'
import { ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider, } from 'react-native-safe-area-context'
import useTheme from '@/hooks/useTheme';
import ToastProvider from './ToastProvider';
import ConfigProvider from './ConfigProvider';

export default memo(function ({ children }: PropsWithChildren<{}>) {
  const { value } = useTheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={value}>
        <ToastProvider>
          <ConfigProvider>
            {children}
          </ConfigProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
})