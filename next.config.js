/** @type {import('next').NextConfig} */

const nextConfig = {

    reactStrictMode: false,
    env: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dqqwgyyfw",
        NEXT_PUBLIC_CLOUDINARY_PRESET_NAME: "a22lneez",
        AWS_IAM_USER_SECRET_KEY: process.env.AWS_IAM_USER_SECRET_KEY,
        AWS_IAM_USER_ACCESS_KEY: process.env.AWS_IAM_USER_ACCESS_KEY,
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
