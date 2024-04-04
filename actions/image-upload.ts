import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
require('dotenv').config();


// Assuming AWS credentials are correctly configured in the environment variables,
// and the S3 bucket name is correctly specified.

interface UploadResponse {
    status: string;
    message: string;
}

export async function handleFormSubmit(currentState: any, formData: FormData): Promise<UploadResponse> {
    console.log("Access Key:", process.env.AWS_IAM_USER_ACCESS_KEY!);
    console.log("Secret Key:", process.env.AWS_IAM_USER_SECRET_KEY!);

    const fileEntry = formData.get("my-file");

    if (!(fileEntry instanceof File)) {
        throw new Error("File not found");
    }

    const fileName = fileEntry.name;
    const fileType = fileEntry.type;

    // Convert file to buffer for S3 upload
    const binaryFile = await fileEntry.arrayBuffer();
    const fileBuffer = Buffer.from(binaryFile);

    // Initialize the S3 client with your region and credentials
    const s3Client = new S3({
        region: 'ap-southeast-1', // Ensure this is your correct region
        credentials: {
            accessKeyId: process.env.AWS_IAM_USER_ACCESS_KEY!,
            secretAccessKey: process.env.AWS_IAM_USER_SECRET_KEY!
        }
    });

    const bucketName = 'jump-say-889'; // Ensure this is your actual bucket name
    // const objectKey = `uploads/${fileName}`;

    try {
        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: fileType
        }));

        return {
            status: "success",
            message: "File uploaded successfully."
        };
    } catch (error) {
        console.error("Error uploading file: ", error);
        return {
            status: "error",
            message: "Failed to upload file."
        };
    }
}
