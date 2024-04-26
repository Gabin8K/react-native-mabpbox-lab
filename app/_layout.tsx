import Providers from '@/providers/Providers';
import { Slot } from 'expo-router';

export default function RootLayout() {

  return (
    <Providers>
      <Slot />
    </Providers>
  )
}