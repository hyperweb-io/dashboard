'use client';

import { HyperwebExplorer } from '@hyperweb/explorer';
import { useTheme } from '@/hooks';

export default function ExplorerPage() {
  const theme = useTheme();

  return <HyperwebExplorer theme={theme} className='mt-4' />;
}
