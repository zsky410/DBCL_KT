export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  image: string;
  description: string;
  isNew?: boolean;
  isTrending?: boolean;
  sizes?: string[];
  colors?: string[];
  bestForWear?: string;
  gender?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

export const categories: Product['category'][] = ['Unisex', 'Nữ', 'Nam', 'Trẻ em'];

// 5 sản phẩm mẫu được lấy từ Adidas Webstore Shoe Data (shoes_dim.csv)
export const products: Product[] = [
  {
    id: 'HP9426',
    name: 'Breaknet 2.0 Schuh',
    price: 1999000,
    oldPrice: 2499000,
    category: 'Unisex',
    gender: 'U',
    bestForWear: 'City',
    image:
      'https://assets.adidas.com/images/w_600,f_auto,q_auto/2474f3034df146b58c89af2c0011f75c_9366/Breaknet_2.0_Schuh_Weiss_HP9426_01_standard.jpg',
    description:
      'Breaknet 2.0 là đôi giày phong cách tennis cổ điển, phù hợp đi phố với phối màu Cloud White / Core Black.',
    isNew: true,
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: ['Cloud White', 'Core Black'],
  },
  {
    id: 'HQ4199',
    name: 'Ultraboost 1.0 Laufschuh',
    price: 4599000,
    oldPrice: 5299000,
    category: 'Unisex',
    gender: 'U',
    bestForWear: 'City',
    image:
      'https://assets.adidas.com/images/w_600,f_auto,q_auto/4ff790231b7f461baee3c291e96b74af_9366/Ultraboost_1.0_Laufschuh_Schwarz_HQ4199_HM1.jpg',
    description:
      'Ultraboost 1.0 mang lại cảm giác êm ái tối đa với đế Boost, lý tưởng cho chạy bộ và sử dụng hằng ngày.',
    isNew: true,
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: ['Core Black', 'Beam Green'],
  },
  {
    id: 'IH5467',
    name: 'Breaknet Sleek Schuh',
    price: 1899000,
    oldPrice: 2299000,
    category: 'Nữ',
    gender: 'W',
    bestForWear: 'Neutral',
    image:
      'https://assets.adidas.com/images/w_600,f_auto,q_auto/9403730c077b4221b51acf25fd197359_9366/Breaknet_Sleek_Schuh_Blau_IH5467_01_standard.jpg',
    description:
      'Breaknet Sleek là phiên bản nữ tính với dáng thấp gọn gàng, phối màu Shadow Navy / Pink Spark.',
    isNew: true,
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: ['Shadow Navy', 'Pink Spark', 'Off White'],
  },
  {
    id: 'IG7323',
    name: 'Racer TR23 Schuh',
    price: 2199000,
    oldPrice: 2699000,
    category: 'Nam',
    gender: 'M',
    bestForWear: 'Neutral',
    image:
      'https://assets.adidas.com/images/w_600,f_auto,q_auto/595712d9ae664c7497e1324fd35b607e_9366/Racer_TR23_Schuh_Schwarz_IG7323_01_standard.jpg',
    description:
      'Racer TR23 là đôi giày lifestyle lấy cảm hứng từ running, tông đen Core Black dễ phối đồ.',
    isNew: true,
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['Core Black', 'Cloud White', 'Grey Four'],
  },
  {
    id: 'IE8593',
    name: 'Runfalcon 5 Kids Schuh',
    price: 1299000,
    oldPrice: 1699000,
    category: 'Trẻ em',
    gender: 'K',
    bestForWear: 'Neutral',
    image:
      'https://assets.adidas.com/images/w_600,f_auto,q_auto/8d36c7c56ce54e84a8c678351175da6c_9366/Runfalcon_5_Kids_Schuh_Weiss_IE8593_01_standard.jpg',
    description:
      'Runfalcon 5 Kids là đôi giày chạy bộ cho trẻ em với phần upper Cloud White nhẹ và bền.',
    isNew: true,
    sizes: ['30', '31', '32', '33', '34', '35'],
    colors: ['Cloud White', 'Core Black'],
  },
];

export const trendingProducts: Product[] = products.slice(0, 3).map((p) => ({
  ...p,
  isTrending: true,
}));

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    role: 'Khách hàng',
    rating: 5,
    text: 'Chất lượng giày tuyệt vời! Rất thoải mái và thời trang. Giao hàng nhanh và đóng gói cẩn thận. Rất khuyên dùng cửa hàng này.',
    avatar: 'https://i.pravatar.cc/48?img=1',
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    role: 'Khách hàng',
    rating: 5,
    text: 'Giày chất lượng xuất sắc! Rất thoải mái và đẹp. Giao hàng nhanh và đóng gói tuyệt vời. Rất khuyên dùng cửa hàng này.',
    avatar: 'https://i.pravatar.cc/48?img=5',
  },
  {
    id: '3',
    name: 'Lê Minh Cường',
    role: 'Khách hàng',
    rating: 5,
    text: 'Trải nghiệm mua giày tốt nhất từ trước đến nay. Đa dạng sản phẩm, giá cả hợp lý và dịch vụ khách hàng tuyệt vời. Chắc chắn sẽ mua lại!',
    avatar: 'https://i.pravatar.cc/48?img=12',
  },
];
