import CreateProductForm from "@/app/ui/products/create-form";
import UploadForm from "@/app/(protected)/_components/upload-form";





export default function Page() {

    return (
        <div>
            <h1>S3 File Upload</h1>
            <UploadForm />
        </div>
    );
}