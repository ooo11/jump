import Image from 'next/image';
import { fetchPostByVendorId, fetchVendorById } from '@/app/lib/data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CreatePost, DeletePost, UpdatePost } from '@/app/ui/portfolio/buttons';


export const metadata: Metadata = {
    title: 'Portfolio',
};


export default async function Page() {
    const id = "c0e13b73-8511-4871-b631-e4e51fbc0136";
    const [vendor, posts] = await Promise.all([
        fetchVendorById(id),
        fetchPostByVendorId(id)
    ]);
    if (!vendor) {
        notFound();
    }
    return (
        <>
            <div className="my-4 flex items-center justify-between gap-2 md:mt-8">
                <CreatePost />
            </div>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:px-5'>

                {posts.map((post, index) => (
                    <div key={index} className='ring-1 ring-gray-200 overflow-hidden'>
                        <Image
                            className="p-2 h-auto max-w-full rounded-lg"
                            src={post.image_url}
                            width={300}
                            height={300}
                            priority
                            alt="This is post image"
                        />
                        <div className='p-8'>
                            <h1 className='text-xl'>{post.name}</h1>

                            <p className=" text-base text-gray-900">
                                {post.detail}
                            </p>
                        </div>
                        <div className='flex items-center justify-center'>
                            <UpdatePost id={post.id} />
                            <DeletePost id={post.id} />
                        </div>
                    </div>
                ))}

            </div>
        </>
    );
}