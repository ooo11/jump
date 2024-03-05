/** @type {import('next').NextConfig} */

const nextConfig = {

    reactStrictMode: false,
    env: {
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "dqqwgyyfw",
        NEXT_PUBLIC_CLOUDINARY_PRESET_NAME: "a22lneez"
    },
    images: {
        domains: [
            'res.cloudinary.com'
        ],
    },
};


module.exports = nextConfig;
