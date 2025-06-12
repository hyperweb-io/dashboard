import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

export const Spinner = ({ className }: { className?: string }) => {
	return <LoaderCircle className={cn('size-10 animate-spin', className)} />;
};
