import { EnvelopeIcon } from "@heroicons/react/24/outline";

interface FormSuccessProps {
    message?: string;
}

export const FormEmailVerificationSent = ({
    message,
}: FormSuccessProps) => {
    if (!message) {
        return null;
    }
    return (
        <div className="bg-white p-3 rounded-md flex items-center gap-x-2 text-sm font-semibold mt-6">
            <EnvelopeIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
    )
};