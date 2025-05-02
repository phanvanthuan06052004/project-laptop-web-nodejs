export const products = [
  {
    id: 1,
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Ultrabooks",
    price: 1199.99,
    rating: 4.8,
    reviewCount: 243,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      cpu: "Apple M2 chip with 8-core CPU",
      ram: "8GB unified memory",
      storage: "256GB SSD",
      display: "13.6-inch Liquid Retina display",
      gpu: "8-core GPU",
      os: "macOS",
      battery: "Up to 18 hours"
    },
    featured: true,
    inStock: true,
    description: "The ultrafast, featherlight MacBook Air is supercharged with the M2 chip. Built around next-generation 8-core CPU, 8-core GPU, and up to 24GB of unified memory, M2 brings even more performance and capabilities to our most popular Mac."
  },
  {
    id: 2,
    name: "Dell XPS 13",
    brand: "Dell",
    category: "Ultrabooks",
    price: 1099.99,
    oldPrice: 1299.99,
    rating: 4.7,
    reviewCount: 183,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593642634367-d91a135587b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ],
    specs: {
      cpu: "12th Gen Intel Core i7-1250U",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      display: "13.4-inch FHD+ (1920 x 1200)",
      gpu: "Intel Iris Xe Graphics",
      os: "Windows 11 Home",
      battery: "Up to 12 hours"
    },
    featured: true,
    inStock: true,
    description: "The Dell XPS 13 combines portability with performance in a premium, lightweight design. With a stunning edge-to-edge display and the latest Intel processors, it's the perfect laptop for professionals on the go.",
    discount: 15
  },
  {
    id: 3,
    name: "Razer Blade 15",
    brand: "Razer",
    category: "Gaming",
    price: 1799.99,
    rating: 4.5,
    reviewCount: 127,
    image: "https://images.unsplash.com/photo-1593642531955-b62e17bdaa9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core i7-12700H",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      display: "15.6-inch QHD 240Hz",
      gpu: "NVIDIA GeForce RTX 3070 Ti",
      os: "Windows 11 Home",
      battery: "Up to 6 hours"
    },
    featured: true,
    inStock: true,
    description: "The Razer Blade 15 delivers desktop-class gaming performance in a premium, portable design. Featuring an ultra-fast 240Hz display and powerful RTX graphics, it's built for competitive gamers who demand the best."
  },
  {
    id: 4,
    name: "HP Spectre x360",
    brand: "HP",
    category: "2-in-1 Convertibles",
    price: 1399.99,
    rating: 4.6,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1544117519-cc0d3ba45d36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core i7-1255U",
      ram: "16GB LPDDR4x",
      storage: "512GB SSD",
      display: "14-inch 3K2K OLED Touch",
      gpu: "Intel Iris Xe Graphics",
      os: "Windows 11 Home",
      battery: "Up to 13 hours"
    },
    inStock: true,
    description: "Experience versatile performance with the HP Spectre x360. This premium 2-in-1 convertible features a stunning OLED display, all-day battery life, and a 360-degree hinge that adapts to your workflow."
  },
  {
    id: 5,
    name: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    category: "Business",
    price: 1499.99,
    oldPrice: 1699.99,
    rating: 4.7,
    reviewCount: 172,
    image: "https://images.unsplash.com/photo-1630794180018-433d915c34ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core i7-1260P",
      ram: "16GB LPDDR5",
      storage: "1TB SSD",
      display: "14-inch WUXGA IPS",
      gpu: "Intel Iris Xe Graphics",
      os: "Windows 11 Pro",
      battery: "Up to 14 hours"
    },
    inStock: true,
    description: "The ThinkPad X1 Carbon is a premium business laptop built with durability, security, and performance in mind. Its lightweight carbon-fiber construction and long battery life make it perfect for business professionals.",
    discount: 12
  },
  {
    id: 6,
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    category: "Gaming",
    price: 1599.99,
    rating: 4.8,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "AMD Ryzen 9 6900HS",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      display: "14-inch QHD 120Hz",
      gpu: "AMD Radeon RX 6700S",
      os: "Windows 11 Home",
      battery: "Up to 10 hours"
    },
    featured: true,
    inStock: true,
    description: "The ROG Zephyrus G14 combines incredible power with remarkable portability. This compact gaming laptop delivers desktop-grade performance with a dazzling display and all-day battery life."
  },
  {
    id: 7,
    name: "Microsoft Surface Laptop 4",
    brand: "Microsoft",
    category: "Ultrabooks",
    price: 1299.99,
    rating: 4.6,
    reviewCount: 134,
    image: "https://images.unsplash.com/photo-1608322368735-b8d2d928d85f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "AMD Ryzen 5 4680U",
      ram: "16GB LPDDR4x",
      storage: "512GB SSD",
      display: "13.5-inch PixelSense Touch",
      gpu: "AMD Radeon Graphics",
      os: "Windows 11 Home",
      battery: "Up to 19 hours"
    },
    inStock: false,
    description: "The Surface Laptop 4 brings premium design, all-day battery life, and enhanced performance in an ultra-thin package. The stunning PixelSense touchscreen delivers vibrant colors for a superior viewing experience."
  },
  {
    id: 8,
    name: "Acer Swift 5",
    brand: "Acer",
    category: "Ultrabooks",
    price: 999.99,
    oldPrice: 1099.99,
    rating: 4.4,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1525971977657-8c7893a2b4b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specs: {
      cpu: "Intel Core i7-1165G7",
      ram: "16GB LPDDR4X",
      storage: "512GB SSD",
      display: "14-inch FHD IPS Touch",
      gpu: "Intel Iris Xe Graphics",
      os: "Windows 11 Home",
      battery: "Up to 15 hours"
    },
    inStock: true,
    description: "The ultra-lightweight Acer Swift 5 weighs less than 2.2 pounds, making it one of the lightest 14-inch laptops available. Don't let its light weight fool you – it packs powerful performance in a premium antimicrobial chassis.",
    discount: 9
  }
]

export const getProductById = (id) => {
  return products.find((product) => product.id === id)
}

export const getFeaturedProducts = () => {
  return products.filter((product) => product.featured)
}

export const getRelatedProducts = (product, limit = 4) => {
  // Get products in the same category, excluding the current product
  const related = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  )

  // Randomize and limit the results
  return related.sort(() => 0.5 - Math.random()).slice(0, limit)
}
