/** @type {import('next').NextConfig} */

const nextConfig = {

    reactStrictMode: false,
    env: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dqqwgyyfw",
        NEXT_PUBLIC_CLOUDINARY_PRESET_NAME: "a22lneez"
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '**',
            }
        ],
    },
};


module.exports = nextConfig;
