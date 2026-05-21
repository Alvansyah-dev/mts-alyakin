/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'placehold.co' },
            { protocol: 'https', hostname: 'i.ibb.co' },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/imgbb/:path*',
                destination: 'https://i.ibb.co/:path*',
            },
        ]
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    },
}

module.exports = nextConfig