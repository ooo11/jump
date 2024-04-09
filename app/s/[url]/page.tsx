
import { fetchCategoryById, fetchCityById } from '@/data/fetch-data';
import { getAllProductByUserId } from "@/data/fetch-data";
import { getVendorById, getVendorIdByLink } from '@/data/user';
import PublicProductCard from '@/app/ui/s/public-product-card';
import { VendorInfo } from '@/app/ui/s/vendor-info';


export default async function ShopPage({ params }: { params: { url: string } }) {

    const vendorId = await getVendorIdByLink(params.url);

    // Initial null checks and setting default values if necessary
    let city = null;
    let category = null;


    // Fetch the vendor details

    const user = await getVendorById(vendorId?.userId);
    const products = await getAllProductByUserId(vendorId?.userId);


    // If the user exists and has a cityId, fetch the city details
    if (user?.cityId) {
        city = await fetchCityById(user.cityId);
    }

    // If the user exists and has a categoryId, fetch the category details
    if (user?.categoryId) {
        category = await fetchCategoryById(user.categoryId);
    }

    return (
        <main>
            <div className="flex items-center justify-center py-10">
                <VendorInfo user={user} city={city} category={category} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {(
                    products.map((product) => (
                        <PublicProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            detail={product.detail}
                            price={product.price}
                            image={product.image || ""}
                        />
                    ))
                )}
            </div>
        </main>
    );
}
