import { routes } from './routes';

const siteUrl = 'https://hyperweb.io';
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);

const title = 'Hyperweb - End-to-End TypeScript for Web3';
const pageDescription = `Hyperweb brings TypeScript on-chain, executing smart contracts via a JavaScript VM and opening web3 to more developers. As a core component of the Interchain JavaScript Stack, Hyperweb’s TypeScript contracts seamlessly integrate with other tools and libraries to enable interoperable, cross-chain application development. With state-of-the-art UI and client-side tooling, Hyperweb offers a complete, end-to-end TypeScript ecosystem for building and deploying decentralized applications.`;
const seoDescription = `Hyperweb brings TypeScript on-chain, executing smart contracts via a JavaScript VM and opening web3 to more developers. As a core component of the Interchain JavaScript Stack, Hyperweb’s TypeScript contracts seamlessly integrate with other tools and libraries to enable interoperable, cross-chain application development. With state-of-the-art UI and client-side tooling, Hyperweb offers a complete, end-to-end TypeScript ecosystem for building and deploying decentralized applications.`;
// Hyperweb brings TypeScript on-chain, executing smart contracts via a JavaScript VM and opening web3 to more developers. Part of the Interchain JavaScript Stack, Hyperweb’s TypeScript contracts enable seamless cross-chain development. Hyperweb provides a complete, end-to-end TypeScript ecosystem for building decentralized apps, combining infrastructure, client tools, and smart contract frameworks.

const fbAppId = null;

export const seoConfig = {
	siteUrl,
	title,
	canonical,
	pageDescription,
	description: seoDescription,
	openGraph: {
		type: 'website',
		url: siteUrl,
		title,
		description: seoDescription,
		site_name: title,
		images: [
			{
				url: canonical + '/hyperweb-og-image.png',
				width: 1200,
				height: 630,
				alt: 'Hyperweb',
			},
		],
	},
	twitter: {
		handle: '@Hyperweb_',
		site: '@Hyperweb_',
	},
	facebook: fbAppId
		? {
				appId: fbAppId,
			}
		: undefined,
};

export const siteConfig = {
	company: {
		nick: 'Hyperweb',
		name: 'Hyperweb',
		addr: ['San Francisco, CA'],
		legalCounty: 'San Francisco',
		legalState: 'California',
	},
	site: {
		siteUrl,
		www: `www.${siteAddress.host}`,
		host: siteAddress.host,
		canonical,
	},
	emails: {
		hello: 'hello@hyperweb.io',
		support: 'support@hyperweb.io',
		abuse: 'abuse@hyperweb.io',
		privacy: 'privacy@hyperweb.io',
		legal: 'legal@hyperweb.io',
		copyright: 'copyright@hyperweb.io',
		arbitrationOptOut: 'arbitration-opt-out@hyperweb.io',
	},
};

export const socialLinks = {
	createHyperwebApp: 'https://github.com/hyperweb-io',
	twitter: 'https://twitter.com/Hyperweb_',
	discord: 'https://discord.com/invite/xh3ZwHj2qQ',
	docs: 'https://docs.hyperweb.io',
	youtube: 'https://www.youtube.com/channel/UCA9jzRlnUJRxec8S5Lt7Vcw',
	storybook: 'https://storybook.cosmology.zone',
};

export interface FooterLink {
	label: string;
	href: string;
}

export interface FooterSection {
	title: string;
	links: FooterLink[];
	subSection?: FooterLink[];
}

type FooterLinks = {
	[K in 'products' | 'learn' | 'company' | 'legal']: FooterSection;
};

export const footerLinks: FooterLinks = {
	products: {
		title: 'Products',
		links: [
			{ label: 'All Products', href: routes.stack.index },
			{ label: 'InterchainJS', href: routes.stack.product('interchainjs') },
			{ label: 'InterchainKit', href: routes.stack.product('interchain-kit') },
			{
				label: 'Create Interchain App',
				href: routes.stack.product('create-interchain-app'),
			},
			{ label: 'Hyperweb', href: routes.stack.product('hyperweb') },
		],
		subSection: [
			{
				label: 'Create Hyperweb App',
				href: routes.stack.product('create-hyperweb-app'),
			},
			{ label: 'Starship', href: routes.stack.product('starship') },
			{ label: 'Telescope', href: routes.stack.product('telescope') },
			{ label: 'Interchain UI', href: routes.stack.product('interchain-ui') },
			{ label: 'Chain Registry', href: routes.stack.product('chain-registry') },
		],
	},
	learn: {
		title: 'Learn',
		links: [
			{ label: 'TSCodegen', href: routes.learn.course('ts-codegen') },
			{ label: 'Frontend & UI', href: routes.learn.course('frontend') },
			{ label: 'Telescope', href: routes.learn.course('telescope') },
		],
	},
	company: {
		title: 'Company',
		links: [
			{ label: 'About', href: routes.company.about },
			{ label: 'Brand Kit', href: routes.company.brandKit },
		],
	},
	legal: {
		title: 'Legal',
		links: [
			{ label: 'Disclaimer', href: routes.legal.disclaimer },
			{ label: 'Privacy Policy', href: routes.legal.privacy },
			{ label: 'Brand Guidelines', href: routes.legal.brand },
			{ label: 'Acceptable Use Policy', href: routes.legal.acceptableUse },
		],
	},
};
