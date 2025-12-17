/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                hostname: 'utfs.io',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
