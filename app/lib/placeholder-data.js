// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

const cities = [
  { id: "85474787-5d3e-4868-a53d-4a7d0d1c213e", name: "Beaufort" },
  { id: "07ac2f7a-1bdb-42fa-9fc3-16ab54af569c", name: "Beluran" },
  { id: "857348ba-e9fb-42d1-851d-f72755b98852", name: "Beverly" },
  { id: "d8771ec4-b4d2-4f23-ba88-c1414d62be84", name: "Bongawan" },
  { id: "705afe58-9f89-4849-8f8a-9e0f36c600d5", name: "Inanam" },
  { id: "2b77c8d7-49e8-48b9-bf19-13d176db66b8", name: "Keningau" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a21", name: "Kota Belud" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a22", name: "Kota Kinabalu" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a23", name: "Kota Kinabatangan" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a24", name: "Kota Marudu" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a25", name: "Kuala Penyu" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a26", name: "Kudat" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a27", name: "Kunak" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a28", name: "Lahad Datu" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a29", name: "Likas" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a30", name: "Membakut" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3331", name: "Menumbok" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a33", name: "Nabawan" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a34", name: "Pamol" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a36", name: "Papar" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a37", name: "Penampang" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a38", name: "Putatan" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a39", name: "Ranau" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a11", name: "Sandakan" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a12", name: "Semporna" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a13", name: "Sipitang" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a14", name: "Tambunan" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a16", name: "Tamparuli" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a15", name: "Tanjung Aru" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a17", name: "Tawau" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a19", name: "Tenghilan" },
  { id: "6fa442bc-cd95-4f28-91de-0fb6796a3a50", name: "Tenom" },
  { id: "2b8956eb-c213-4a5a-97bd-ad2d5e846ec9", name: "Tuaran" },

];
const categories = [
  { id: "1ef2e254-6ece-4e8c-8861-38edff01410a", name: "Photographer" },
  { id: "2ef2e254-6ece-4e8c-8861-38edff01410b", name: "Entertainment" },
  { id: "3ef2e254-6ece-4e8c-8861-38edff01410c", name: "Decor" },
  { id: "4ef2e254-6ece-4e8c-8861-38edff01410d", name: "Makeup" },
  { id: "5ef2e254-6ece-4e8c-8861-38edff01410e", name: "Venue" },
  { id: "6ef2e254-6ece-4e8c-8861-38edff01410f", name: "Soundsystem & Lighting" },
  { id: "41d59243-d209-4b01-b7f6-7bfc6c7205cd", name: "Attire" },
  { id: "0549a373-839e-4454-a70f-2431cda7e336", name: "Accessories" },
];

const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    phone: '01116145510',
    password: '123456',
    city_id: cities[21].id,
  },
  {
    id: 'a297d2fd-63a0-4cb4-bda6-1404e2c8c09c',
    name: 'Jue',
    email: 'jue@nextmail.com',
    phone: '0138953423',
    password: '123456',
    city_id: cities[19].id,
  },
];

const vendors = [
  {
    id: '46f6b95b-067b-4553-af41-2a3f572b86c8',
    name: 'Chop Chop Wedding Photography',
    about: 'Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Molestie a iaculis at erat pellentesque adipiscing commodo elit at.',
    user_id: users[0].id,
    category_id: categories[0].id,
  },
  {
    id: '57c76c6a-a085-4bfc-89de-b07850d17a6f',
    name: 'Vue Studio',
    about: 'Vulputate odio ut enim blandit volutpat maecenas volutpat blandit. Molestie a iaculis at erat pellentesque adipiscing commodo elit at.',
    user_id: users[1].id,
    category_id: categories[1].id,
  }

];

const vendorprofilepic = [
  {
    id: '85627e91-2046-4641-9347-bf5fdee51525',
    image_url: '/customers/evil-rabbit.png',
    vendor_id: vendors[0].id,
  },
  {
    id: '0dd45029-c3e0-4f1f-9010-863a20d6f9c7',
    image_url: '/customers/amy-burns.png',
    vendor_id: vendors[1].id,
  }

];


const vendorlinks = [
  {
    id: 'ee49f1fd-8fe6-4911-9f1f-5078247836af',
    name: 'Twitter',
    url: 'https://twitter.com/mizuropeter',
    vendor_id: vendors[0].id,
  },
  {
    id: 'ac8475a5-7034-4adc-aad1-99fcd8668caa',
    name: 'Youtube',
    url: 'https://www.youtube.com/@mizurotaa',
    vendor_id: vendors[0].id,
  },
  {
    id: '65593696-2823-4671-82ca-4f42cc05357d',
    name: 'Tik Tok',
    url: 'https://www.tiktok.com/@chelsism',
    vendor_id: vendors[0].id,
  },
  {
    id: '13deefd0-b779-4b38-9b24-53de0383a287',
    name: 'Facebook',
    url: 'https://www.facebook.com/mizuropeter',
    vendor_id: vendors[0].id,
  },
  {
    id: 'e27bb63e-e5d0-43df-b83c-3e966ebdb42f',
    name: 'Youtube',
    url: 'https://www.youtube.com/@mizurotaa',
    vendor_id: vendors[1].id,
  },
  {
    id: 'f673131b-ada4-4695-8141-e5ac16990dee',
    name: 'Tik Tok',
    url: 'https://www.tiktok.com/@chelsism',
    vendor_id: vendors[1].id,
  },
  {
    id: 'fcea529e-68c4-4048-af8c-6208497322a6',
    name: 'Twitter',
    url: 'https://twitter.com/mizuropeter',
    vendor_id: vendors[1].id,
  },
  {
    id: 'a1aad978-830e-4790-a049-904524aa0186',
    name: 'Facebook',
    url: 'https://www.facebook.com/@chelsism',
    vendor_id: vendors[1].id,
  }
];

const packages = [
  {
    id: 'c825b19d-de42-441e-ba45-6dcca2aa445f',
    name: 'Starter Pack',
    detail: 'This is a starter pack that cover most of the needs.',
    vendor_id: vendors[0].id,
    image_url: '/customers/instreet.jpg',
    price: 1299,
    features: [
      'Data number 1',
      'Time to write this 1',
      'Its raining no 1',
      'This is the data 1',
    ],
  },
  {
    id: 'd1d8975b-93c6-4ac3-94d0-38860961db9d',
    name: 'Gold Pack',
    detail: 'This is an upgrade which include all the needs.',
    vendor_id: vendors[0].id,
    image_url: '/customers/tokyostreet.jpg',
    price: 689,
    features: [
      'sdvffsdfsdfsf no 2',
      'Writing this or not for no 2',
      'No its not raining 2',
      'Stop doing start going no 2',
    ],
  },
  {
    id: '7e3eb8ae-e563-4b55-b9d4-81d3235c43c1',
    name: 'Cheap Pack',
    detail: 'This is basic plan that cover most of the needs.',
    vendor_id: vendors[1].id,
    image_url: '/customers/donkey.jpg',
    price: 689,
    features: [
      'sdvffsdfsdfsf no 3',
      'Writing this or not for no 3',
      'No its not raining 3',
      'Stop doing start going no 3',
    ],
  },
  {
    id: 'fe857d75-6d1a-4a87-b7d7-f5df0bb2ada1',
    name: 'Bit expesive but not too expensive',
    detail: 'This  is the best package you can get',
    vendor_id: vendors[1].id,
    image_url: '/customers/yasai.jpg',
    price: 689,
    features: [
      'sdvffsdfsdfsf no 4',
      'Writing this or not for no 4',
      'No its not raining 4',
      'Stop doing start going no 4',
    ],
  },
  {
    id: '3de78727-9a2b-4d7b-a259-07c55c2d96cf',
    name: 'Diamond Pack',
    detail: 'Everyone loves their rocks. ',
    vendor_id: vendors[0].id,
    image_url: '/customers/yasai.jpg',
    price: 689,
    features: [
      'sdvffsdfsdfsf no 5',
      'Writing this or not for no 5',
      'No its not raining 5',
      'Stop doing start going no 5',
    ],
  },
];

const customers = [
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '3958dc9e-737f-4377-85e9-fec4b6a6442a',
    name: 'Hector Simpson',
    email: 'hector@simpson.com',
    image_url: '/customers/hector-simpson.png',
  },
  {
    id: '50ca3e18-62cd-11ee-8c99-0242ac120002',
    name: 'Steven Tey',
    email: 'steven@tey.com',
    image_url: '/customers/steven-tey.png',
  },
  {
    id: '3958dc9e-787f-4377-85e9-fec4b6a6442a',
    name: 'Steph Dietz',
    email: 'steph@dietz.com',
    image_url: '/customers/steph-dietz.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '126eed9c-c90c-4ef6-a4a8-fcf7408d3c66',
    name: 'Emil Kowalski',
    email: 'emil@kowalski.com',
    image_url: '/customers/emil-kowalski.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    customer_id: customers[7].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    customer_id: customers[6].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    customer_id: customers[2].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-18',
  },
  {
    customer_id: customers[0].id,
    amount: 8945,
    status: 'paid',
    date: '2023-10-04',
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];


const posts = [
  {
    id: '4bfdeaae-c468-11ee-94bd-325096b39f47',
    name: 'This Is My Post',
    detail: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
    image_url: '/posts/post1.jpg',
    vendor_id: vendors[0].id
  },
  {
    id: '4bfdedd8-c468-11ee-9839-325096b39f47',
    name: 'This is the Second',
    detail: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    image_url: '/posts/post2.jpg',
    vendor_id: vendors[0].id
  },
  {
    id: '4bfdee8c-c468-11ee-97db-325096b39f47',
    name: 'Third Post of The Year',
    detail: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image_url: '/posts/post3.jpg',
    vendor_id: vendors[0].id,
  },
  {
    id: '4bfdef2c-c468-11ee-9180-325096b39f47',
    name: 'Lorem ipsum',
    detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image_url: '/posts/bird.jpg',
    vendor_id: vendors[0].id,
  },
  {
    id: '4bfdefb8-c468-11ee-ab07-325096b39f47',
    name: 'Excepteur sint',
    detail: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image_url: '/posts/post1.jpg',
    vendor_id: vendors[1].id,
  },
  {
    id: '4bfdf03a-c468-11ee-8d72-325096b39f47',
    name: 'Eleifend',
    detail: 'Eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Tellus rutrum tellus pellentesque eu tincidunt tortor. ',
    image_url: '/posts/post2.jpg',
    vendor_id: vendors[1].id,
  },
  {
    id: '4bfdf0c6-c468-11ee-8fe3-325096b39f47',
    name: 'Aliquam',
    detail: 'Viverra mauris in aliquam sem fringilla ut morbi. Enim eu turpis egestas pretium aenean pharetra magna ac placerat. Eleifend donec pretium vulputate sapien nec sagittis.',
    image_url: '/posts/post3.jpg',
    vendor_id: vendors[1].id,
  },
];

const tags = [
  {
    id: '482a2fda-c46a-11ee-b69e-325096b39f47',
    name: 'beach'
  },
  {
    id: '482a3296-c46a-11ee-a091-325096b39f47',
    name: 'sea'
  },
  {
    id: '482a3318-c46a-11ee-bc23-325096b39f47',
    name: 'mountain'
  },
  {
    id: '482a341c-c46a-11ee-87f0-325096b39f47',
    name: 'bird'
  },
  {
    id: '482a34d0-c46a-11ee-9c9c-325096b39f47',
    name: 'duck'
  }
];

const postsTags = [
  {
    id: '1a44856e-c46c-11ee-8a1f-325096b39f47',
    post_id: posts[0].id,
    tag_id: tags[0].id
  },
  {
    id: '79690182-c471-11ee-99f9-325096b39f47',
    post_id: posts[0].id,
    tag_id: tags[1].id
  },
  {
    id: '7969061e-c471-11ee-bebe-325096b39f47',
    post_id: posts[0].id,
    tag_id: tags[3].id
  },
  {
    id: '1a448956-c46c-11ee-9651-325096b39f47',
    post_id: posts[1].id,
    tag_id: tags[2].id
  },
  {
    id: '796906d2-c471-11ee-a81c-325096b39f47',
    post_id: posts[2].id,
    tag_id: tags[0].id
  },
  {
    id: '7969074a-c471-11ee-bd69-325096b39f47',
    post_id: posts[2].id,
    tag_id: tags[1].id
  },
  {
    id: '796909c0-c471-11ee-8da9-325096b39f47',
    post_id: posts[2].id,
    tag_id: tags[3].id
  },
  {
    id: '1a448b36-c46c-11ee-bb8b-325096b39f47',
    post_id: posts[3].id,
    tag_id: tags[3].id
  },
  {
    id: '796907c2-c471-11ee-9579-325096b39f47',
    post_id: posts[3].id,
    tag_id: tags[4].id
  },
  {
    id: '79690966-c471-11ee-991a-325096b39f47',
    post_id: posts[4].id,
    tag_id: tags[0].id
  },
  {
    id: '796908f8-c471-11ee-83e5-325096b39f47',
    post_id: posts[4].id,
    tag_id: tags[1].id
  },
  {
    id: '79690894-c471-11ee-b3f4-325096b39f47',
    post_id: posts[4].id,
    tag_id: tags[3].id
  },
  {
    id: '1a448c94-c46c-11ee-8339-325096b39f47',
    post_id: posts[5].id,
    tag_id: tags[2].id
  },
  {
    id: '1a448f5a-c46c-11ee-8b18-325096b39f47',
    post_id: posts[6].id,
    tag_id: tags[3].id
  },
  {
    id: '79690830-c471-11ee-b95f-325096b39f47',
    post_id: posts[6].id,
    tag_id: tags[3].id
  },
]








const jumpers = [
  {
    id: '66403b7c-2c2a-4b4e-96a1-1a1335d4389a',
    name: 'Luke Sky',
    email: 'luke@skywalker.com',
    phone: '0164448888',
    city_id: cities[13].id,
  },
  {
    id: 'f73a218f-cc07-435d-95ca-2c399641007e',
    name: 'soka nobender',
    email: 'soka@avatar.com',
    phone: '01922244555',
    city_id: cities[9].id,
  },
  {
    id: 'e5a07a99-da75-40ac-82ea-a48c2df7d817',
    name: 'bumi indah',
    email: 'bumi@earth.com',
    phone: '0114562222',
    city_id: cities[10].id,
  }
]

const orders = [
  {
    id: '6326a628-9c89-4b2c-8944-fd7aa6b51f45',
    package_id: packages[3].id,
    jumper_id: jumpers[0].id,
    datetime: '2024-03-19 12:00:00',
    submittime: '2024-09-03 06:15:18'
  },
  {
    id: '0430b23c-ae2a-4f68-8fa1-020e0ad11e07',
    package_id: packages[1].id,
    jumper_id: jumpers[1].id,
    datetime: '2024-09-16 19:00:00',
    submittime: '2024-09-03 06:15:18'
  },
  {
    id: '6de1ab51-7529-405d-a57a-c03f68bc71ba',
    package_id: packages[0].id,
    jumper_id: jumpers[2].id,
    datetime: '2024-12-23 17:00:00',
    submittime: '2024-09-03 06:15:18'
  }
]


module.exports = {
  cities,
  categories,
  users,
  vendors,
  vendorprofilepic,
  vendorlinks,
  packages,
  customers,
  invoices,
  revenue,
  posts,
  tags,
  postsTags,
  jumpers,
  orders
};
