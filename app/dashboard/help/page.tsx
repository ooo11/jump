"use client"

import { useState } from "react";
import { CldImage } from 'next-cloudinary';
import { CldUploadButton } from "next-cloudinary";
import crypto from "crypto";
import axios from 'axios';


export default function Page() {

    const [uploadURL, setUploadURL] = useState();

    const [publicId, setPublicId] = useState(); // Track the public ID of the uploaded image


    const generateSHA1 = (data: any) => {
        const hash = crypto.createHash("sha1");
        hash.update(data);
        return hash.digest("hex");
    }

    const generateSignature = (publicId: string, apiSecret: string | undefined) => {
        const timestamp = new Date().getTime();
        return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    };

    // Your React component
    const handleDelete = async (publicId: string) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const timestamp = new Date().getTime();
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
        const signature = generateSHA1(generateSignature(publicId, apiSecret));
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

        try {
            const response = await axios.post(url, {
                public_id: publicId,
                signature: signature,
                api_key: apiKey,
                timestamp: timestamp,
            });

            console.log("Image deleted! Here are the delete callback: ", response);

        } catch (error) {
            console.error(error);
        }
        finally {
            setUploadURL(undefined);
            setPublicId(undefined);
        }
    };


    return (
        <div>
            {uploadURL && publicId && (
                <div>
                    <h3>{uploadURL}</h3>
                    <CldImage
                        width="960"
                        height="600"
                        src={uploadURL}
                        sizes="100vw"
                        alt="Description of my uploaded image"
                    />
                    <button onClick={() => handleDelete(publicId)}>Delete Image</button>
                </div>
            )}


            {/* once upload -> show image */}

            <CldUploadButton
                options={{ sources: ['local'], maxFiles: 1, clientAllowedFormats: ['jpeg', 'png', 'jpg'], maxImageFileSize: 6900000 }}

                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
                onSuccess={(result, { widget }) => {
                    if (result && result.event === "success") {
                        const secureUrl = result.info?.secure_url;
                        const publicId = result.info?.public_id;
                        console.log("Done! Here is the image info: ", secureUrl);
                        setUploadURL(secureUrl);
                        setPublicId(publicId);
                    }


                    widget.close();
                }}
            >
                <span>
                    Upload
                </span>
            </CldUploadButton>
        </div>
    );
}