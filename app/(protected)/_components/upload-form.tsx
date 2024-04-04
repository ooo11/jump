"use client"
import React, { useState } from 'react';

// Assuming handleFormSubmit is imported correctly
import { handleFormSubmit } from "@/actions/image-upload";

export default function UploadForm() {
    const [uploadStatus, setUploadStatus] = useState({ status: '', message: '' });

    const onSubmit = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(event.currentTarget); // Retrieve the form data
        try {
            const response = await handleFormSubmit(null, formData); // Pass formData to your upload handler
            setUploadStatus({ status: 'success', message: response.message }); // Update state with success message
        } catch (error) {
            console.error("Upload error:", error);
            setUploadStatus({ status: 'error', message: 'Failed to upload file.' }); // Update state with error message
        }
    };

    return (
        <>
            <form onSubmit={onSubmit}>
                <label htmlFor="my-file">Select image to upload to S3: </label>
                <input type="file" name="my-file" id="my-file" />
                <button type="submit">Upload</button>
            </form>
            {uploadStatus.message &&
                <div className={`p-3 ${uploadStatus.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`}>
                    {uploadStatus.message}
                </div>
            }
        </>
    );
}
