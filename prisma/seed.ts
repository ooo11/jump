import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

async function main() {
    // Wrap deletion and seeding in a transaction
    await prisma.$transaction(async (tx) => {
        await deleteAllCities(tx);
        await deleteAllCategories(tx);


        const citiesToSeed = [
            { name: "Beaufort" },
            { name: "Beluran" },
            { name: "Beverly" },
            { name: "Bongawan" },
            { name: "Inanam" },
            { name: "Keningau" },
            { name: "Kota Belud" },
            { name: "Kota Kinabalu" },
            { name: "Kota Kinabatangan" },
            { name: "Kota Marudu" },
            { name: "Kuala Penyu" },
            { name: "Kudat" },
            { name: "Kunak" },
            { name: "Lahad Datu" },
            { name: "Likas" },
            { name: "Membakut" },
            { name: "Menumbok" },
            { name: "Nabawan" },
            { name: "Pamol" },
            { name: "Papar" },
            { name: "Penampang" },
            { name: "Putatan" },
            { name: "Ranau" },
            { name: "Sandakan" },
            { name: "Semporna" },
            { name: "Sipitang" },
            { name: "Tambunan" },
            { name: "Tamparuli" },
            { name: "Tanjung Aru" },
            { name: "Tawau" },
            { name: "Tenghilan" },
            { name: "Tenom" },
            { name: "Tuaran" },
            { name: "Asajaya" },
            { name: "Balingian" },
            { name: "Baram" },
            { name: "Bau" },
            { name: "Bekenu" },
            { name: "Belaga" },
            { name: "Belaga" },
            { name: "Belawai" },
            { name: "Betong" },
            { name: "Bintangor" },
            { name: "Bintulu" },
            { name: "Dalat" },
            { name: "Daro" },
            { name: "Debak" },
            { name: "Engkilili" },
            { name: "Julau" },
            { name: "Kabong" },
            { name: "Kanowit" },
            { name: "Kapit" },
            { name: "Kota Samarahan" },
            { name: "Kuching" },
            { name: "Lawas" },
            { name: "Limbang" },
            { name: "Lingga" },
            { name: "Long Lama" },
            { name: "Lubok Antu" },
            { name: "Lundu" },
            { name: "Lutong" },
            { name: "Matu" },
            { name: "Miri" },
            { name: "Mukah" },
            { name: "Nanga Medamit" },
            { name: "Niah" },
            { name: "Pusa" },
            { name: "Roban" },
            { name: "Saratok" },
            { name: "Sarikei" },
            { name: "Sebauh" },
            { name: "Sebuyau" },
            { name: "Serian" },
            { name: "Sibu" },
            { name: "Siburan" },
            { name: "Simunjan" },
            { name: "Song" },
            { name: "Spaoh" },
            { name: "Sri Aman" },
            { name: "Sundar" },
            { name: "Tatau" },
            // Add more city names here
        ]; //expend ">"" to see all cities

        const categoriesToSeed = [
            { name: "Photographer" },
            { name: "Entertainment" },
            { name: "Decor" },
            { name: "Makeup" },
            { name: "Venue" },
            { name: "Soundsystem & Lighting" },
            { name: "Attire" },
            { name: "Accessories" },
            { name: "Cats" },

        ];



        const city = await tx.city.createMany({
            data: citiesToSeed,
            skipDuplicates: true,
        });

        const category = await tx.category.createMany({
            data: categoriesToSeed,
            skipDuplicates: true,
        });

        console.log(`Seeded ${city.count} cities.`);
        console.log(`Seeded ${category.count} categories.`);
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

// Pass the transaction object (tx) to use in the transaction
async function deleteAllCities(tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) {
    const resultCity = await tx.city.deleteMany();
    console.log(`${resultCity.count} cities have been deleted.`);
}

async function deleteAllCategories(tx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) {
    const resultCategory = await tx.category.deleteMany();
    console.log(`${resultCategory.count} categories have been deleted.`);
}
