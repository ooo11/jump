
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: 'Guest Homepage',
};





export default async function Page() {


    return (

        <main>
            <div className="mt-5 flex w-full justify-center">
                <p>✨✨✨Your order is placed!✨✨✨</p>
            </div>


        </main>

    );
}