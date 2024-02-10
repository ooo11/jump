import Form from '@/app/ui/portfolio/edit-form';
import { fetchPostById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Posts',
};


export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [post] = await Promise.all([
        fetchPostById(id),
    ]);
    if (!post) {
        notFound();
    }
    return (
        <main>
            <Form post={post} />
        </main>
    );
}