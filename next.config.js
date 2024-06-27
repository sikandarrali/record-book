const withPWA = require("@ducanh2912/next-pwa").default({
	dest: "public",
});

const nextConfig = {
	images: {
		domains: ["lh3.googleusercontent.com"],
	},
};

module.exports = withPWA(nextConfig);