import type { ProviderId } from '../types';

/**
 * Bundled reference catalog.
 *
 * Each {@link BaseProduct} is a real-world item that may be carried by several
 * stores. Per-provider entries capture how the *same* product appears on each
 * store — different titles, prices, ratings and stock — which is exactly the
 * signal the cross-store matcher and comparison engine consume.
 *
 * In `live` mode the provider adapters ignore this file and call real APIs; the
 * shape they must return ({@link import('../types').Listing}) is identical.
 */

export interface ProviderEntry {
  provider: ProviderId;
  /** Provider-native id (as it would appear in the store URL). */
  pid: string;
  /** Store-specific title variant. Falls back to the base title. */
  title?: string;
  /** Selling price on this store, in INR. */
  price: number;
  /** MRP on this store, in INR. */
  mrp: number;
  rating: number;
  ratingCount: number;
  inStock?: boolean;
  deliveryEta?: string;
}

export interface BaseProduct {
  key: string;
  title: string;
  brand: string;
  category: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  color: string;
  description: string;
  entries: ProviderEntry[];
}

const img = (key: string) => `https://picsum.photos/seed/pc-${key}/480/600`;

export function imageFor(key: string): string {
  return img(key);
}

export const CATALOG: BaseProduct[] = [
  {
    key: 'nike-revolution-7',
    title: 'Nike Revolution 7 Running Shoes',
    brand: 'Nike',
    category: 'Footwear',
    gender: 'men',
    color: 'Black',
    description:
      'Lightweight everyday running shoes with a soft foam midsole and breathable mesh upper.',
    entries: [
      { provider: 'myntra', pid: 'MYN-NKREV7-BLK', price: 3495, mrp: 4295, rating: 4.4, ratingCount: 1820, deliveryEta: '3-4 days' },
      { provider: 'ajio', pid: 'AJ-NIKE-REV7', title: 'Nike Revolution 7 Lace-Up Running Shoes', price: 3295, mrp: 4295, rating: 4.3, ratingCount: 640, deliveryEta: '4-6 days' },
    ],
  },
  {
    key: 'adidas-galaxy-6',
    title: 'Adidas Galaxy 6 Running Shoes',
    brand: 'Adidas',
    category: 'Footwear',
    gender: 'men',
    color: 'Grey',
    description: 'Cushioned running shoes built for daily miles with a Cloudfoam sockliner.',
    entries: [
      { provider: 'myntra', pid: 'MYN-ADGAL6-GRY', price: 3999, mrp: 5999, rating: 4.2, ratingCount: 980 },
      { provider: 'ajio', pid: 'AJ-ADIDAS-GAL6', title: 'Adidas Galaxy 6 M Sports Shoes', price: 3749, mrp: 5999, rating: 4.1, ratingCount: 410 },
      { provider: 'meesho', pid: 'MSH-88213', title: 'Galaxy 6 Sports Running Shoes for Men', price: 3599, mrp: 5999, rating: 3.9, ratingCount: 2140, deliveryEta: '5-7 days' },
    ],
  },
  {
    key: 'puma-softride',
    title: 'Puma Softride Enzo Sneakers',
    brand: 'Puma',
    category: 'Footwear',
    gender: 'unisex',
    color: 'White',
    description: 'Versatile sneakers with SoftFoam+ comfort for all-day wear.',
    entries: [
      { provider: 'myntra', pid: 'MYN-PMSFT-WHT', price: 2799, mrp: 4499, rating: 4.5, ratingCount: 3120 },
      { provider: 'meesho', pid: 'MSH-77120', title: 'Softride Enzo Casual Sneakers', price: 2499, mrp: 4499, rating: 4.0, ratingCount: 5600 },
    ],
  },
  {
    key: 'levis-511',
    title: "Levi's 511 Slim Fit Jeans",
    brand: "Levi's",
    category: 'Jeans',
    gender: 'men',
    color: 'Blue',
    description: 'Slim through the hip and thigh with a tapered leg in stretch denim.',
    entries: [
      { provider: 'myntra', pid: 'MYN-LV511-BLU', price: 2549, mrp: 3999, rating: 4.5, ratingCount: 7400 },
      { provider: 'ajio', pid: 'AJ-LEVIS-511', title: "Levi's 511 Slim Fit Mid-Rise Jeans", price: 2399, mrp: 3999, rating: 4.4, ratingCount: 2210 },
    ],
  },
  {
    key: 'wrangler-skanders',
    title: 'Wrangler Skanders Slim Jeans',
    brand: 'Wrangler',
    category: 'Jeans',
    gender: 'men',
    color: 'Dark Blue',
    description: 'Slim-fit stretchable jeans with a clean mid-wash finish.',
    entries: [
      { provider: 'myntra', pid: 'MYN-WRSK-DBL', price: 1799, mrp: 2999, rating: 4.3, ratingCount: 1560 },
      { provider: 'meesho', pid: 'MSH-45012', title: 'Skanders Slim Fit Denim Jeans', price: 1499, mrp: 2999, rating: 3.8, ratingCount: 3300 },
    ],
  },
  {
    key: 'hm-cotton-tshirt',
    title: 'H&M Regular Fit Cotton T-Shirt',
    brand: 'H&M',
    category: 'T-Shirts',
    gender: 'men',
    color: 'White',
    description: 'Soft combed-cotton jersey tee in a classic regular fit.',
    entries: [
      { provider: 'myntra', pid: 'MYN-HMTEE-WHT', price: 499, mrp: 799, rating: 4.2, ratingCount: 4200 },
      { provider: 'ajio', pid: 'AJ-HM-TEE', title: 'H&M Regular Fit Crew-Neck T-shirt', price: 449, mrp: 799, rating: 4.1, ratingCount: 1900 },
    ],
  },
  {
    key: 'roadster-henley',
    title: 'Roadster Henley Neck T-Shirt',
    brand: 'Roadster',
    category: 'T-Shirts',
    gender: 'men',
    color: 'Navy',
    description: 'Pure cotton henley with a three-button placket and long sleeves.',
    entries: [
      { provider: 'myntra', pid: 'MYN-RDHEN-NVY', price: 649, mrp: 1299, rating: 4.3, ratingCount: 9800 },
      { provider: 'meesho', pid: 'MSH-33045', title: 'Stylish Henley Neck Cotton T-Shirt', price: 549, mrp: 1299, rating: 3.9, ratingCount: 12400 },
    ],
  },
  {
    key: 'libas-anarkali',
    title: 'Libas Floral Print Anarkali Kurta',
    brand: 'Libas',
    category: 'Kurtas',
    gender: 'women',
    color: 'Maroon',
    description: 'Flared Anarkali kurta in printed viscose rayon with a round neck.',
    entries: [
      { provider: 'myntra', pid: 'MYN-LBANK-MRN', price: 1199, mrp: 2499, rating: 4.4, ratingCount: 6700 },
      { provider: 'ajio', pid: 'AJ-LIBAS-ANK', title: 'Libas Floral Printed Anarkali Kurta', price: 1099, mrp: 2499, rating: 4.2, ratingCount: 1500 },
      { provider: 'meesho', pid: 'MSH-90021', title: 'Trendy Floral Anarkali Kurti for Women', price: 899, mrp: 2499, rating: 4.0, ratingCount: 18900 },
    ],
  },
  {
    key: 'biba-suit-set',
    title: 'Biba Printed Straight Kurta with Trousers',
    brand: 'Biba',
    category: 'Kurtas',
    gender: 'women',
    color: 'Teal',
    description: 'Coordinated straight kurta and trouser set in printed cotton.',
    entries: [
      { provider: 'myntra', pid: 'MYN-BBSET-TEL', price: 2099, mrp: 3499, rating: 4.5, ratingCount: 2400 },
      { provider: 'ajio', pid: 'AJ-BIBA-SET', title: 'Biba Printed Kurta & Trouser Set', price: 1999, mrp: 3499, rating: 4.3, ratingCount: 780 },
    ],
  },
  {
    key: 'vero-moda-dress',
    title: 'Vero Moda Bodycon Midi Dress',
    brand: 'Vero Moda',
    category: 'Dresses',
    gender: 'women',
    color: 'Black',
    description: 'Ribbed bodycon midi dress with a boat neck and short sleeves.',
    entries: [
      { provider: 'myntra', pid: 'MYN-VMDRS-BLK', price: 1499, mrp: 2999, rating: 4.3, ratingCount: 3100 },
      { provider: 'ajio', pid: 'AJ-VEROMODA-BDY', title: 'Vero Moda Ribbed Bodycon Midi Dress', price: 1399, mrp: 2999, rating: 4.2, ratingCount: 990 },
    ],
  },
  {
    key: 'fossil-gen6',
    title: 'Fossil Gen 6 Smartwatch',
    brand: 'Fossil',
    category: 'Watches',
    gender: 'unisex',
    color: 'Silver',
    description: 'Touchscreen smartwatch with heart-rate tracking and Wear OS.',
    entries: [
      { provider: 'myntra', pid: 'MYN-FSGEN6-SLV', price: 18995, mrp: 23995, rating: 4.4, ratingCount: 620 },
      { provider: 'ajio', pid: 'AJ-FOSSIL-G6', title: 'Fossil Gen 6 Touchscreen Smartwatch', price: 17995, mrp: 23995, rating: 4.3, ratingCount: 210 },
    ],
  },
  {
    key: 'titan-neo',
    title: 'Titan Neo Analog Watch',
    brand: 'Titan',
    category: 'Watches',
    gender: 'men',
    color: 'Rose Gold',
    description: 'Slim analog watch with a rose-gold case and a metal bracelet.',
    entries: [
      { provider: 'myntra', pid: 'MYN-TTNEO-RGD', price: 3495, mrp: 4995, rating: 4.5, ratingCount: 5400 },
      { provider: 'meesho', pid: 'MSH-11876', title: 'Neo Analog Metal Strap Watch for Men', price: 2999, mrp: 4995, rating: 4.0, ratingCount: 8700 },
    ],
  },
  {
    key: 'americantourister-backpack',
    title: 'American Tourister Zork Laptop Backpack',
    brand: 'American Tourister',
    category: 'Bags',
    gender: 'unisex',
    color: 'Blue',
    description: '32L water-resistant laptop backpack with a padded sleeve.',
    entries: [
      { provider: 'myntra', pid: 'MYN-ATZRK-BLU', price: 1399, mrp: 2600, rating: 4.4, ratingCount: 11200 },
      { provider: 'ajio', pid: 'AJ-AT-ZORK', title: 'American Tourister Zork 32L Backpack', price: 1299, mrp: 2600, rating: 4.3, ratingCount: 3400 },
      { provider: 'meesho', pid: 'MSH-55231', title: 'Zork Water Resistant Laptop Backpack', price: 1199, mrp: 2600, rating: 4.1, ratingCount: 6100 },
    ],
  },
  {
    key: 'wildcraft-daypack',
    title: 'Wildcraft Trydon Rucksack',
    brand: 'Wildcraft',
    category: 'Bags',
    gender: 'unisex',
    color: 'Black',
    description: '45L rugged rucksack for weekend treks with adjustable straps.',
    entries: [
      { provider: 'myntra', pid: 'MYN-WCTRY-BLK', price: 2499, mrp: 3999, rating: 4.5, ratingCount: 2100 },
      { provider: 'meesho', pid: 'MSH-66190', title: 'Trydon 45L Trekking Rucksack Bag', price: 2199, mrp: 3999, rating: 4.0, ratingCount: 1900 },
    ],
  },
  {
    key: 'rayban-aviator',
    title: 'Ray-Ban Aviator Classic Sunglasses',
    brand: 'Ray-Ban',
    category: 'Eyewear',
    gender: 'unisex',
    color: 'Gold',
    description: 'Iconic metal aviators with G-15 lenses and adjustable nose pads.',
    entries: [
      { provider: 'myntra', pid: 'MYN-RBAVT-GLD', price: 6790, mrp: 8290, rating: 4.6, ratingCount: 4300 },
      { provider: 'ajio', pid: 'AJ-RAYBAN-AVT', title: 'Ray-Ban Aviator Classic Metal Sunglasses', price: 6490, mrp: 8290, rating: 4.5, ratingCount: 1200 },
    ],
  },
  {
    key: 'fastrack-wayfarer',
    title: 'Fastrack Wayfarer Sunglasses',
    brand: 'Fastrack',
    category: 'Eyewear',
    gender: 'unisex',
    color: 'Black',
    description: 'Everyday polarized wayfarers with a lightweight acetate frame.',
    entries: [
      { provider: 'myntra', pid: 'MYN-FTWAY-BLK', price: 999, mrp: 1595, rating: 4.2, ratingCount: 3900 },
      { provider: 'meesho', pid: 'MSH-22004', title: 'Trendy Wayfarer UV Protected Sunglasses', price: 799, mrp: 1595, rating: 3.8, ratingCount: 15200 },
    ],
  },
  {
    key: 'jack-jones-jacket',
    title: 'Jack & Jones Hooded Bomber Jacket',
    brand: 'Jack & Jones',
    category: 'Jackets',
    gender: 'men',
    color: 'Olive',
    description: 'Water-repellent bomber jacket with a detachable hood.',
    entries: [
      { provider: 'myntra', pid: 'MYN-JJBMB-OLV', price: 2999, mrp: 5499, rating: 4.4, ratingCount: 1700 },
      { provider: 'ajio', pid: 'AJ-JJ-BOMBER', title: 'Jack & Jones Hooded Bomber Jacket', price: 2799, mrp: 5499, rating: 4.2, ratingCount: 520 },
    ],
  },
  {
    key: 'allen-solly-blazer',
    title: 'Allen Solly Slim Fit Blazer',
    brand: 'Allen Solly',
    category: 'Jackets',
    gender: 'men',
    color: 'Navy',
    description: 'Slim-fit single-breasted blazer in a textured weave.',
    entries: [
      { provider: 'myntra', pid: 'MYN-ASBLZ-NVY', price: 4499, mrp: 7999, rating: 4.3, ratingCount: 890 },
      { provider: 'ajio', pid: 'AJ-ALLEN-BLZ', title: 'Allen Solly Slim Fit Single-Breasted Blazer', price: 4199, mrp: 7999, rating: 4.2, ratingCount: 340 },
    ],
  },
  {
    key: 'saree-kanjivaram',
    title: 'Mitera Kanjivaram Silk Blend Saree',
    brand: 'Mitera',
    category: 'Sarees',
    gender: 'women',
    color: 'Red',
    description: 'Woven zari-bordered silk-blend saree with an unstitched blouse piece.',
    entries: [
      { provider: 'myntra', pid: 'MYN-MTKAN-RED', price: 1899, mrp: 4999, rating: 4.3, ratingCount: 5600 },
      { provider: 'meesho', pid: 'MSH-70012', title: 'Kanjivaram Zari Woven Silk Blend Saree', price: 1499, mrp: 4999, rating: 4.1, ratingCount: 24300 },
    ],
  },
  {
    key: 'boat-airdopes',
    title: 'boAt Airdopes 141 Wireless Earbuds',
    brand: 'boAt',
    category: 'Electronics',
    gender: 'unisex',
    color: 'Black',
    description: '42-hour playback TWS earbuds with ENx tech and low latency mode.',
    entries: [
      { provider: 'myntra', pid: 'MYN-BTADP-BLK', price: 1299, mrp: 4490, rating: 4.2, ratingCount: 20400 },
      { provider: 'meesho', pid: 'MSH-14501', title: 'Airdopes 141 Bluetooth TWS Earbuds', price: 1099, mrp: 4490, rating: 4.0, ratingCount: 33100 },
    ],
  },
  {
    key: 'noise-colorfit',
    title: 'Noise ColorFit Pro 4 Smartwatch',
    brand: 'Noise',
    category: 'Electronics',
    gender: 'unisex',
    color: 'Black',
    description: '1.72" AMOLED smartwatch with Bluetooth calling and SpO2 tracking.',
    entries: [
      { provider: 'myntra', pid: 'MYN-NSCF4-BLK', price: 1799, mrp: 5999, rating: 4.1, ratingCount: 8800 },
      { provider: 'ajio', pid: 'AJ-NOISE-CF4', title: 'Noise ColorFit Pro 4 Bluetooth Calling Smartwatch', price: 1699, mrp: 5999, rating: 4.0, ratingCount: 2100 },
      { provider: 'meesho', pid: 'MSH-19003', title: 'ColorFit Pro 4 Calling Smart Watch', price: 1599, mrp: 5999, rating: 3.9, ratingCount: 14700 },
    ],
  },
  {
    key: 'campus-north',
    title: 'Campus North Plus Running Shoes',
    brand: 'Campus',
    category: 'Footwear',
    gender: 'men',
    color: 'Grey',
    description: 'Budget-friendly running shoes with a memory-foam insole.',
    entries: [
      { provider: 'myntra', pid: 'MYN-CMNTH-GRY', price: 999, mrp: 1799, rating: 4.1, ratingCount: 15600 },
      { provider: 'meesho', pid: 'MSH-40011', title: 'North Plus Sports Running Shoes for Men', price: 849, mrp: 1799, rating: 3.9, ratingCount: 28900, inStock: false },
    ],
  },
  {
    key: 'zara-oversize-shirt',
    title: 'Zara Oversized Poplin Shirt',
    brand: 'Zara',
    category: 'Shirts',
    gender: 'women',
    color: 'White',
    description: 'Relaxed oversized cotton-poplin shirt with a spread collar.',
    entries: [
      { provider: 'myntra', pid: 'MYN-ZAOVS-WHT', price: 2290, mrp: 2990, rating: 4.2, ratingCount: 1300 },
      { provider: 'ajio', pid: 'AJ-ZARA-POPLIN', title: 'Zara Oversized Cotton Poplin Shirt', price: 2190, mrp: 2990, rating: 4.1, ratingCount: 470 },
    ],
  },
  {
    key: 'uspa-polo',
    title: 'U.S. Polo Assn. Pique Polo T-Shirt',
    brand: 'U.S. Polo Assn.',
    category: 'T-Shirts',
    gender: 'men',
    color: 'Green',
    description: 'Classic-fit cotton pique polo with a ribbed collar.',
    entries: [
      { provider: 'myntra', pid: 'MYN-USPOL-GRN', price: 1274, mrp: 1999, rating: 4.4, ratingCount: 6100 },
      { provider: 'ajio', pid: 'AJ-USPA-POLO', title: 'U.S. Polo Assn. Cotton Pique Polo T-shirt', price: 1199, mrp: 1999, rating: 4.3, ratingCount: 2600 },
    ],
  },
];
