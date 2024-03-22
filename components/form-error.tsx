import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface FormErrorProps {
    message?: string;
}

export const FormError = ({
    message,
}: FormErrorProps) => {
    if (!message) {
        return null;
    }
    return (
        <div className="bg-rose-600/50 p-3 rounded-md flex items-center gap-x-2 text-sm text-rose-600">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
};