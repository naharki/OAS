/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      '@sajanm/nepali-date-picker': '@sajanm/nepali-date-picker',
    },
  },
  // Suppress the Turbopack warning for dynamic imports that aren't resolvable at build time
  onDemandEntries: {
    maxInactiveAge: 15 * 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
