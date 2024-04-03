"use client"
import EditPackageForm from "@/app/ui/products/edit-form";
import { fetchProductById } from "@/data/fetch-data";
import { useEffect, useState } from 'react';


interface Product {
    id: string;
    name: string;
    image: string | null;
    price: string;
    detail: string;
    userId: string;
}

export default function Page({ params }: { params: { id: string } }) {

    const [data, setData] = useState<Product | null>(null);

    useEffect(() => {
        fetchProductById(params.id).then(product => {
            if (!product) {

                return { error: "Product Not Found" }
            } else {

                setData(product);
                return
            }
        });
    }, [params.id]);

    if (!data) {
        // Placeholder while loading or if product is not found
        return <div>Loading...</div>;
    }

    return (
        <div>
            <EditPackageForm pack={data} />
        </div>
    );
}
