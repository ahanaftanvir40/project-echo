/** @type {import('next').NextConfig} */
const nextConfig = {
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
