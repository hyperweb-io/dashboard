import { join } from 'path';

import { withContractLayout } from '@/components/contract/contract-layout';
import {
	FALLBACK_PROJECT_PATH,
	getFallbackProjectItems,
} from '@/components/contract/editor/contract-editor.server-utils';
import { ContractPanes } from '@/components/contract/editor/contract-panes';
import { type ProjectItem } from '@/components/contract/editor/hooks/use-contract-project';

interface CreateContractProps {
	fallbackProjectItems: Record<string, ProjectItem>;
}

export const getStaticProps = async () => {
	// Read fallback project files
	const fallbackPath = join(process.cwd(), FALLBACK_PROJECT_PATH);
	const fallbackProjectItems = getFallbackProjectItems(fallbackPath, fallbackPath);

	return {
		props: {
			fallbackProjectItems,
		},
	};
};

function CreateContractPage({ fallbackProjectItems }: CreateContractProps) {
	return (
		<div className='h-[calc(100vh-4rem)]'>
			<ContractPanes fallbackProjectItems={fallbackProjectItems} />
		</div>
	);
}

export default withContractLayout(CreateContractPage, { requiresHyperwebSetup: false });
