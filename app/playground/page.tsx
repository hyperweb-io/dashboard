'use client';

import { HyperwebPlayground } from '@hyperweb/playground';
import { useTheme } from '@/hooks';

export default function PlaygroundPage() {
  const theme = useTheme();

  return <HyperwebPlayground theme={theme} />;
}
