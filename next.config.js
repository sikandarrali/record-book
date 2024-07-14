const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const withPWA = require("@ducanh2912/next-pwa").default({
	dest: "public",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["lh3.googleusercontent.com"],
	},
};

// Apply both plugins sequentially
const combinedConfig = withNextIntl(withPWA(nextConfig));

module.exports = combinedConfig;
