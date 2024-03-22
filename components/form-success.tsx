import { ShieldCheckIcon } from "@heroicons/react/24/outline";

interface FormSuccessProps {
    message?: string;
}

export const FormSuccess = ({
    message,
}: FormSuccessProps) => {
    if (!message) {
        return null;
    }
    return (
        <div className="bg-green-600/50 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600">
            <ShieldCheckIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
};