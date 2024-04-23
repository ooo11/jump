import { fetchCategoryById, fetchCityById } from '@/data/fetch-data';
import { getAllProductByUserId } from "@/data/fetch-data";
import { getVendorById, getVendorIdByLink } from '@/data/user';
import PublicProductCard from '@/app/ui/s/public-product-card';
import { VendorInfo } from '@/app/ui/s/vendor-info';
import { Metadata } from 'next'
import style from '@/public/styles/grid.module.css'
import { ErrorPageNotFound } from '@/components/error-page-not-found';

export const metadata: Metadata = {
    title: 'Shop',
}

export default async function ShopPage({ params }: { params: { url: string } }) {
    const vendorId = await getVendorIdByLink(params.url);
    let city = null;
    let category = null;

    if (!vendorId) {
        // If no vendorId could be resolved, consider this as "Page Not Found"
        return <ErrorPageNotFound />;
    }

    const user = await getVendorById(vendorId.userId);
    const products = await getAllProductByUserId(vendorId.userId);

    if (!products) {
        // Return a "Page Not Found" message if products is null
        return <ErrorPageNotFound />;
    }

    if (user?.cityId) {
        city = await fetchCityById(user.cityId);
    }

    if (user?.categoryId) {
        category = await fetchCategoryById(user.categoryId);
    }

    return (
        <main className='flex-grow p-6 md:overflow-y-auto md:p-24'>
            <div className="flex items-center justify-center pt-10">
                <VendorInfo user={user} city={city} category={category} />
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:p-10 items-start place-items-center ${style.grid}`}>
                {products.map((product) => (
                    <PublicProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        detail={product.detail}
                        price={product.price}
                        image={product.image || ""}
                        url={params.url}
                    />
                ))}
            </div>
        </main>
    );
}
