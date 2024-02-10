'use client';
import { updatePosts } from '@/app/lib/actions';
import { useFormState } from 'react-dom';
import { PostForm } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export default function EditPostForm({
    post
}: {
    post: PostForm;
}) {
    const initialState = { message: null, errors: {} };
    const updatePostWithId = updatePosts.bind(null, post.id);
    const [state, dispatch] = useFormState(updatePostWithId, initialState);

    const baseLink = `/dashboard/portfolio`


    return (
        <form action={dispatch}>
            <input type="hidden" name="id" value={post.id} />
            <input type="hidden" name="vendor_id" value={post.vendor_id} />
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Post Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        What&apos;s your post title?
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                type="text"
                                name="name"
                                defaultValue={post.name}
                                placeholder="Enter post title"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="name-error"
                            />
                        </div>
                    </div>


                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Post Detail */}

                <div className="mb-4">
                    <label htmlFor="detail" className="mb-2 block text-sm font-medium">
                        Describe your post
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="detail"
                                type="text"
                                name="detail"
                                defaultValue={post.detail}
                                placeholder="Describe the post detail"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="detail-error"
                            />
                        </div>
                    </div>


                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.detail &&
                            state.errors.detail.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                {/* Post Image */}

                <div className="mb-4">
                    <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
                        Insert photo url
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="image_url"
                                type="text"
                                name="image_url"
                                defaultValue={post.image_url}
                                placeholder="link to image"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="detail-error"
                            />
                        </div>
                    </div>


                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.image_url &&
                            state.errors.image_url.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>


            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href={baseLink}
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Edit Post</Button>
            </div>
        </form>
    );
}
