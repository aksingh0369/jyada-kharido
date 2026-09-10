import { Product, Category, Festival, Blog, SiteSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-earphones',
    name: 'Earphones',
    slug: 'earphones',
    shortLabel: 'Enjoy With',
    description: 'High-fidelity audio, noise cancellation, and seamless wireless connectivity.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    bgColor: '#18191B', // Dark charcoal/black like Behance card
    textColor: '#FFFFFF',
    accentColor: '#F52D56',
    displayOrder: 1,
    active: true,
    affiliateLink: 'https://www.amazon.in/s?k=earphones+headphones&tag=jyadakharido-21',
    buttonText: 'Browse'
  },
  {
    id: 'cat-watches',
    name: 'Gadgets',
    slug: 'gadgets',
    shortLabel: 'New Wearable',
    description: 'Smart wearables, health tracking, and next-generation AMOLED displays.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    bgColor: '#FEBF00', // Yellow like Behance card
    textColor: '#FFFFFF',
    accentColor: '#18191B',
    displayOrder: 2,
    active: true,
    affiliateLink: 'https://www.amazon.in/s?k=smartwatches+wearables&tag=jyadakharido-21',
    buttonText: 'Browse'
  },
  {
    id: 'cat-laptops',
    name: 'Laptop',
    slug: 'laptops',
    shortLabel: 'Trend Devices',
    description: 'Sleek ultrabooks, creator laptops, and AI-accelerated high performance.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    bgColor: '#EB3B5A', // Bold Crimson red like Behance card
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    displayOrder: 3,
    active: true,
    affiliateLink: 'https://www.amazon.in/s?k=laptops+notebooks&tag=jyadakharido-21',
    buttonText: 'Browse'
  },
  {
    id: 'cat-gaming',
    name: 'Console',
    slug: 'gaming',
    shortLabel: 'Best Gaming',
    description: 'Next-gen consoles, low-latency controllers, and immersive 4K gaming.',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    bgColor: '#E6E8EC', // Light silver/gray like Behance card
    textColor: '#18191B',
    accentColor: '#EB3B5A',
    displayOrder: 4,
    active: true,
    affiliateLink: 'https://www.amazon.in/s?k=gaming+consoles&tag=jyadakharido-21',
    buttonText: 'Browse'
  },
  {
    id: 'cat-vr',
    name: 'Oculus',
    slug: 'vr-oculus',
    shortLabel: 'Play Game',
    description: 'Standalone virtual reality headsets and mixed reality spatial experiences.',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&auto=format&fit=crop&q=80',
    bgColor: '#2ED573', // Vibrant green like Behance card
    textColor: '#FFFFFF',
    accentColor: '#18191B',
    displayOrder: 5,
    active: true,
    affiliateLink: 'https://www.amazon.in/s?k=vr+headsets&tag=jyadakharido-21',
    buttonText: 'Browse'
  },
  {
    id: 'cat-speakers',
    name: 'Speaker',
    slug: 'speakers',
    shortLabel: 'New Amazon',
    description: 'Voice-controlled smart speakers with rich 360 sound and smart home hubs.',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80',
    bgColor: '#1E90FF', // Electric blue like Behance card
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    displayOrder: 6,
    active: true,
    affiliateLink: 'https://www.amazon.in/s?k=smart+speakers+bluetooth&tag=jyadakharido-21',
    buttonText: 'Browse'
  },
  {
    id: 'cat-fashion',
    name: 'Fashion',
    slug: 'fashion',
    shortLabel: 'Trending',
    description: 'Curated premium fashion, streetwear, and everyday essentials from top brands.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
    bgColor: '#8854D0',
    textColor: '#FFFFFF',
    accentColor: '#FFFFFF',
    displayOrder: 7,
    active: true,
    affiliateLink: 'https://www.amazon.in/s?k=trending+fashion+clothing&tag=jyadakharido-21',
    buttonText: 'Browse'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-beats-solo-4',
    name: 'Beats Solo 4 Wireless On-Ear Headphones',
    brand: 'Beats by Dre',
    categoryId: 'cat-earphones',
    categoryName: 'Earphones',
    subcategory: 'Wireless Headphones',
    shortDescription: 'Custom acoustic architecture with upgraded drivers for powerful, balanced Beats sound and spatial audio.',
    description: 'Engineered for music, Beats Solo 4 features re-engineered acoustics, ultra-lightweight design with UltraPlush cushions, up to 50 hours of battery life, lossless audio via USB-C or 3.5 mm cable, and Personalised Spatial Audio with dynamic head tracking.',
    discountPercent: 28,
    affiliateLink: 'https://link.amazon/B06cXgVyp',
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Brand': 'Beats',
      'Model Name': 'Solo 4',
      'Form Factor': 'On Ear',
      'Connectivity': 'Bluetooth 5.3, USB-C, 3.5mm Aux',
      'Battery Life': 'Up to 50 Hours',
      'Fast Charging': 'Fast Fuel: 10-min charge gives 5 hours',
      'Spatial Audio': 'Personalized Spatial Audio with Dynamic Head Tracking',
      'Weight': '217 Grams',
      'Microphone': 'Beamforming Digital Mics',
      'Compatibility': 'iOS & Android One-Touch Pairing'
    },
    featured: true,
    active: true,
    isNew: true,
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'prod-smartwatch-active',
    name: 'Amazfit Active Edge Rugged Sports Smartwatch',
    brand: 'Amazfit',
    categoryId: 'cat-watches',
    categoryName: 'Gadgets',
    subcategory: 'Smartwatches',
    shortDescription: 'Bold dual-tone rugged smartwatch with 16-day battery life, 10 ATM water resistance, and AI training coach.',
    description: 'Designed for active explorers with military-grade toughness, multi-GNSS satellite positioning, Zepp Coach AI training plans, 130+ sports modes, and real-time heart rate, SpO2, and stress monitoring.',
    discountPercent: 35,
    affiliateLink: 'https://www.amazon.in/s?k=amazfit+active+edge+smartwatch&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Display': '1.32 inch TFT HD Color Touchscreen',
      'Battery Life': 'Up to 16 Days normal use (24 Days Battery Saver)',
      'Water Resistance': '10 ATM (100 Meters)',
      'Positioning': '5 Satellite Positioning Systems',
      'Sensors': 'BioTracker PPG biometric sensor, Acceleration',
      'Sports Modes': '130+ workout profiles',
      'Weight': '54 Grams with strap',
      'OS Support': 'Android 7.0+ / iOS 14.0+'
    },
    featured: true,
    active: true,
    isNew: true,
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'prod-asus-zenbook-oled',
    name: 'ASUS Zenbook 14 OLED Ultra-Thin Intel Evo Laptop',
    brand: 'ASUS',
    categoryId: 'cat-laptops',
    categoryName: 'Laptop',
    subcategory: 'Premium Ultrabooks',
    shortDescription: 'Intel Core Ultra 7 processor with dedicated NPU for AI, stunning 3K 120Hz Lumina OLED display, and all-day battery.',
    description: 'The ASUS Zenbook 14 OLED combines whisper-thin portability (1.2 kg, 14.9 mm thin) with raw productivity. Featuring an Intel Core Ultra processor with Intel Arc graphics, Harman Kardon audio, military-grade durability, and super-fast Thunderbolt 4 ports.',
    discountPercent: 22,
    affiliateLink: 'https://www.amazon.in/s?k=asus+zenbook+14+oled+intel+core+ultra&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Processor': 'Intel Core Ultra 7 155H (16 cores, up to 4.8 GHz)',
      'Display': '14-inch 3K (2880 x 1800) OLED 16:10 120Hz 0.2ms',
      'Memory': '16GB LPDDR5X on board',
      'Storage': '1TB M.2 NVMe PCIe 4.0 SSD',
      'Graphics': 'Intel Arc Graphics',
      'Battery': '75WHrs 4-cell Li-ion (up to 15+ hours)',
      'Weight': '1.20 kg (2.65 lbs)',
      'Security': 'FHD IR camera with Windows Hello support'
    },
    featured: true,
    active: true,
    isNew: false,
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'prod-ps5-console',
    name: 'Sony PlayStation 5 Console (Slim Disc Edition)',
    brand: 'Sony Interactive Entertainment',
    categoryId: 'cat-gaming',
    categoryName: 'Console',
    subcategory: 'Gaming Hardware',
    shortDescription: 'Slim design with 1TB SSD storage, Ray Tracing, 4K gaming at up to 120fps, and Tempest 3D AudioTech.',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio, and an all-new generation of incredible PlayStation games.',
    discountPercent: 15,
    affiliateLink: 'https://www.amazon.in/s?k=playstation+5+console+slim&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1612287233207-6c8c9371050e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Storage': '1TB Custom High-Speed NVMe SSD',
      'Resolution': 'Up to 4K 120Hz, 8K output support, HDR',
      'Ray Tracing': 'Hardware-accelerated Ray Tracing',
      'Audio': 'Tempest 3D AudioTech',
      'Controller Included': 'DualSense Wireless Controller with Haptics',
      'Disc Drive': 'Ultra HD Blu-ray Disc Drive (removable)'
    },
    featured: true,
    active: true,
    isNew: false,
    createdAt: '2026-08-05T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'prod-echo-dot-5',
    name: 'Amazon Echo Dot (5th Gen) Smart Speaker with Alexa',
    brand: 'Amazon',
    categoryId: 'cat-speakers',
    categoryName: 'Speaker',
    subcategory: 'Smart Speakers',
    shortDescription: 'Best-sounding Echo Dot yet with deeper bass, clearer vocals, built-in temperature sensor, and motion detection.',
    description: 'Enjoy improved audio experience compared to any previous Echo Dot with Alexa for clearer vocals, deeper bass and vibrant sound in any room. Ask Alexa for music, news, weather, timers, and voice control smart compatible appliances effortlessly.',
    discountPercent: 25,
    affiliateLink: 'https://www.amazon.in/s?k=echo+dot+5th+gen+smart+speaker&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Speaker': '1.73 inch (44 mm) front-firing speaker',
      'Voice Assistant': 'Amazon Alexa built-in (English & Hindi)',
      'Connectivity': 'Dual-band Wi-Fi 802.11a/b/g/n/ac (2.4 & 5 GHz), Bluetooth Low Energy',
      'Sensors': 'Indoor Temperature Sensor, Ultrasound Motion Detection',
      'Privacy': 'Microphone Off button & hardware disconnection indicator'
    },
    featured: true,
    active: true,
    isNew: false,
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'prod-meta-quest-3',
    name: 'Meta Quest 3 Breakthrough Mixed Reality Headset',
    brand: 'Meta',
    categoryId: 'cat-vr',
    categoryName: 'Oculus',
    subcategory: 'VR & MR Headsets',
    shortDescription: 'Transform your home into an exciting new playground with full-color passthrough mixed reality and 4K+ Infinite Display.',
    description: 'The world’s leading consumer mixed reality headset. Dive into breathtaking immersive experiences with next-gen Snapdragon XR2 Gen 2 graphics performance, Touch Plus ring-free controllers with TruTouch haptics, and spatial audio with 40% louder volume range.',
    discountPercent: 18,
    affiliateLink: 'https://www.amazon.in/s?k=meta+quest+3+mixed+reality+headset&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Processor': 'Snapdragon XR2 Gen 2 Platform',
      'Display': '4K+ Infinite Display (2064x2208 pixels per eye)',
      'Optics': 'Pancake lens optical stack with slim profile',
      'Passthrough': 'Dual RGB color cameras with 18 PPD resolution',
      'Audio': 'Integrated stereo speakers with 3D spatial audio',
      'Tracking': '6DoF inside-out tracking via 4 IR cameras'
    },
    featured: true,
    active: true,
    isNew: true,
    createdAt: '2026-08-25T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'prod-sony-wh1000xm5',
    name: 'Sony WH-1000XM5 Wireless Industry Leading Noise Cancelling',
    brand: 'Sony',
    categoryId: 'cat-earphones',
    categoryName: 'Earphones',
    subcategory: 'Noise Cancelling',
    shortDescription: 'Two processors and 8 microphones for unprecedented noise cancellation, exceptional Hi-Res audio, and crystal clear calls.',
    description: 'The Sony WH-1000XM5 rewrites the rules for distraction-free listening with the Auto NC Optimizer, 30-hour battery life, quick charge, and multipoint Bluetooth connection.',
    discountPercent: 30,
    affiliateLink: 'https://www.amazon.in/s?k=sony+wh-1000xm5+noise+cancelling&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520170350707-b2da59970118?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Processor': 'Integrated Processor V1 + HD Noise Cancelling Processor QN1',
      'Driver': 'Carbon fiber composite 30mm precision driver',
      'Battery': 'Up to 30 hours with ANC ON (40 hours ANC OFF)',
      'Audio Codecs': 'LDAC, AAC, SBC with DSEE Extreme AI upscaling',
      'Call Quality': '4 beamforming mics calibrated for speech'
    },
    featured: true,
    active: true,
    isNew: false,
    createdAt: '2026-08-18T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'prod-apple-watch-s9',
    name: 'Apple Watch Series 9 GPS with Midnight Aluminum Case',
    brand: 'Apple',
    categoryId: 'cat-watches',
    categoryName: 'Gadgets',
    subcategory: 'Smartwatches',
    shortDescription: 'S9 SiP chip enables a magical way to interact with double tap gesture and an ultra-bright display.',
    description: 'The ultimate device for a healthy life is now even more powerful. Features advanced health sensors for blood oxygen and ECG, crash detection, fall detection, and seamless iOS integration.',
    discountPercent: 12,
    affiliateLink: 'https://www.amazon.in/s?k=apple+watch+series+9+gps&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Chip': 'S9 SiP with 64-bit dual-core processor and 4-core Neural Engine',
      'Brightness': 'Up to 2000 nits (2x Series 8)',
      'Water Resistance': '50m swimproof',
      'Health': 'ECG app, Blood Oxygen app, High and low heart rate notifications'
    },
    featured: false,
    active: true,
    isNew: false,
    createdAt: '2026-08-16T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'prod-airpods-pro-2',
    name: 'Apple AirPods Pro (2nd Gen) with MagSafe Case USB-C',
    brand: 'Apple',
    categoryId: 'cat-earphones',
    categoryName: 'Earphones',
    subcategory: 'True Wireless',
    shortDescription: 'Up to 2x more Active Noise Cancellation, Transparency mode, and Adaptive Audio with Personalized Spatial Audio.',
    description: 'Powered by the Apple H2 headphone chip, AirPods Pro push advanced audio performance even further with richer bass, crystal-clear sound, and next-level Active Noise Cancellation.',
    discountPercent: 18,
    affiliateLink: 'https://www.amazon.in/s?k=apple+airpods+pro+2+usbc&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Chip': 'Apple H2 headphone chip, Apple U1 chip in MagSafe Charging Case',
      'ANC': 'Active Noise Cancellation with Adaptive Transparency',
      'Battery': 'Up to 6 hours listening time with ANC on, up to 30 hours total with case',
      'Resistance': 'IP54 dust, sweat, and water resistant'
    },
    featured: true,
    active: true,
    isNew: true,
    createdAt: '2026-08-28T10:00:00.000Z',
    updatedAt: '2026-09-03T10:00:00.000Z'
  },
  {
    id: 'prod-bose-qc45',
    name: 'Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones',
    brand: 'Bose',
    categoryId: 'cat-earphones',
    categoryName: 'Earphones',
    subcategory: 'Over-Ear Headphones',
    shortDescription: 'Iconic quiet, comfort, and sound. TriPort acoustic architecture delivers deep, full audio with Quiet & Aware modes.',
    description: 'The perfect balance of quiet, comfort, and sound. Bose QuietComfort 45 wireless headphones use tiny microphones to measure, compare, and react to outside noise, then cancel it with opposite signals.',
    discountPercent: 24,
    affiliateLink: 'https://www.amazon.in/s?k=bose+quietcomfort+45&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Brand': 'Bose',
      'Model': 'QuietComfort 45',
      'Battery Life': 'Up to 22 Hours',
      'Charging': 'USB-C quick charge (15 mins = 3 hours)'
    },
    featured: false,
    active: true,
    isNew: false,
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'prod-galaxy-watch-6',
    name: 'Samsung Galaxy Watch 6 Bluetooth 44mm Smartwatch',
    brand: 'Samsung',
    categoryId: 'cat-watches',
    categoryName: 'Gadgets',
    subcategory: 'Smartwatches',
    shortDescription: 'Sapphire crystal glass display with 20% larger screen and advanced sleep & heart coaching.',
    description: 'Track workouts, heart rhythms, body composition, and detailed sleep stages on the vibrant Super AMOLED display of Galaxy Watch 6.',
    discountPercent: 22,
    affiliateLink: 'https://www.amazon.in/s?k=samsung+galaxy+watch+6&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Screen': '1.5-inch Super AMOLED 480x480',
      'Processor': 'Exynos W930 Dual-core 1.4GHz',
      'Durability': '5ATM + IP68 / MIL-STD-810H'
    },
    featured: false,
    active: true,
    isNew: true,
    createdAt: '2026-08-22T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'prod-macbook-air-m3',
    name: 'Apple MacBook Air 15-inch M3 Chip 16GB RAM 512GB SSD',
    brand: 'Apple',
    categoryId: 'cat-laptops',
    categoryName: 'Laptop',
    subcategory: 'Ultrabooks',
    shortDescription: 'Strikingly thin and fast with up to 18 hours battery life, Liquid Retina display, and MagSafe 3.',
    description: 'MacBook Air sails through work and play with the blazing M3 chip. With a spacious 15.3-inch Liquid Retina display, silent fanless design, and support for up to two external displays.',
    discountPercent: 10,
    affiliateLink: 'https://www.amazon.in/s?k=macbook+air+15+m3&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Processor': 'Apple M3 8-core CPU, 10-core GPU',
      'Memory': '16GB Unified Memory',
      'Storage': '512GB Ultrafast SSD',
      'Display': '15.3-inch Liquid Retina with True Tone'
    },
    featured: true,
    active: true,
    isNew: true,
    createdAt: '2026-08-25T10:00:00.000Z',
    updatedAt: '2026-09-03T10:00:00.000Z'
  },
  {
    id: 'prod-xbox-series-x',
    name: 'Xbox Series X 1TB Gaming Console 4K 120FPS',
    brand: 'Microsoft',
    categoryId: 'cat-gaming',
    categoryName: 'Console',
    subcategory: 'Gaming Consoles',
    shortDescription: 'The fastest, most powerful Xbox ever. Explore rich new worlds with 12 teraflops of raw graphic processing power.',
    description: 'Xbox Series X delivers sensational smooth frame rates of up to 120FPS with the visual pop of HDR. Immerse yourself with sharper characters, brighter worlds, and impossible details with true 4K gaming.',
    discountPercent: 15,
    affiliateLink: 'https://www.amazon.in/s?k=xbox+series+x&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Resolution': 'True 4K Gaming, 8K HDR Ready',
      'Frame Rate': 'Up to 120 FPS',
      'Internal Storage': '1TB Custom NVME SSD'
    },
    featured: false,
    active: true,
    isNew: false,
    createdAt: '2026-08-19T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'prod-jbl-charge-5',
    name: 'JBL Charge 5 Portable Waterproof Bluetooth Speaker with Powerbank',
    brand: 'JBL',
    categoryId: 'cat-speakers',
    categoryName: 'Speaker',
    subcategory: 'Bluetooth Speakers',
    shortDescription: 'Bold JBL Original Pro Sound with long excursion driver, separate tweeter and dual passive bass radiators.',
    description: 'Take the party with you no matter what the weather. The JBL Charge 5 speaker delivers bold JBL Original Pro Sound, with its optimized long excursion driver, separate tweeter and dual pumping JBL bass radiators. Up to 20 hours of playtime.',
    discountPercent: 25,
    affiliateLink: 'https://www.amazon.in/s?k=jbl+charge+5&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Output Power': '30W RMS woofer + 10W RMS tweeter',
      'Battery Life': 'Up to 20 hours',
      'Waterproof': 'IP67 Waterproof and Dustproof'
    },
    featured: false,
    active: true,
    isNew: true,
    createdAt: '2026-08-21T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'prod-rayban-aviator',
    name: 'Ray-Ban Aviator Classic Polarized Sunglasses Green Classic G-15',
    brand: 'Ray-Ban',
    categoryId: 'cat-fashion',
    categoryName: 'Fashion',
    subcategory: 'Eyewear',
    shortDescription: 'Timeless style, authenticity and premium sun protection with crystal polarized lenses and lightweight gold metal frame.',
    description: 'Originally created for U.S. aviators in 1937, Ray-Ban Aviator Classic sunglasses are an iconic design that combines great aviator styling with exceptional quality, performance and comfort.',
    discountPercent: 20,
    affiliateLink: 'https://www.amazon.in/s?k=rayban+aviator+classic&tag=jyadakharido-21',
    primaryImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop&q=80'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    specifications: {
      'Frame Material': 'Metal Gold Tone',
      'Lens Color': 'G-15 Green Polarized',
      'UV Protection': '100% UV400'
    },
    featured: true,
    active: true,
    isNew: true,
    createdAt: '2026-08-24T10:00:00.000Z',
    updatedAt: '2026-09-03T10:00:00.000Z'
  }
];

export const INITIAL_FESTIVALS: Festival[] = [
  {
    id: 'fest-diwali',
    name: 'Diwali',
    startMonthDay: '10-20',
    endMonthDay: '11-15',
    theme: 'diwali',
    bannerHeadline: 'Diwali Mega Finds',
    bannerSubtext: 'Discover festive favourites & golden deals for your home and family',
    bannerBg: 'linear-gradient(135deg, #FF9900 0%, #E65100 50%, #B71C1C 100%)',
    accentColor: '#FFD700',
    particleType: 'sparkle',
    enabled: true,
    bannerImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1000&auto=format&fit=crop&q=80'
  },
  {
    id: 'fest-holi',
    name: 'Holi',
    startMonthDay: '03-15',
    endMonthDay: '03-31',
    theme: 'holi',
    bannerHeadline: 'Rangon Wali Shopping',
    bannerSubtext: 'Celebrate with colourful finds, waterproof gadgets, and festive treats',
    bannerBg: 'linear-gradient(135deg, #FF007F 0%, #7928CA 50%, #0070F3 100%)',
    accentColor: '#00E5FF',
    particleType: 'colors',
    enabled: true,
    bannerImage: 'https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?w=1000&auto=format&fit=crop&q=80'
  },
  {
    id: 'fest-christmas',
    name: 'Christmas',
    startMonthDay: '12-15',
    endMonthDay: '12-31',
    theme: 'christmas',
    bannerHeadline: 'Christmas Special',
    bannerSubtext: 'Festive holiday favourites and gifts are here with special seasonal discounts',
    bannerBg: 'linear-gradient(135deg, #C62828 0%, #880E4F 60%, #1B5E20 100%)',
    accentColor: '#FFEB3B',
    particleType: 'snow',
    enabled: true,
    bannerImage: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1000&auto=format&fit=crop&q=80'
  },
  {
    id: 'fest-valentine',
    name: 'Valentine’s Day',
    startMonthDay: '02-07',
    endMonthDay: '02-18',
    theme: 'valentine',
    bannerHeadline: 'Valentine Special',
    bannerSubtext: 'Discover something special for someone you cherish this season',
    bannerBg: 'linear-gradient(135deg, #E91E63 0%, #C2185B 50%, #880E4F 100%)',
    accentColor: '#FF80AB',
    particleType: 'hearts',
    enabled: true,
    bannerImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1000&auto=format&fit=crop&q=80'
  },
  {
    id: 'fest-karvachauth',
    name: 'Karva Chauth',
    startMonthDay: '10-01',
    endMonthDay: '10-25',
    theme: 'karvachauth',
    bannerHeadline: 'Karva Chauth Shringar',
    bannerSubtext: 'Elegance, ethnic elegance, and meaningful gifting curated with care',
    bannerBg: 'linear-gradient(135deg, #880E4F 0%, #AD1457 50%, #E91E63 100%)',
    accentColor: '#FFD54F',
    particleType: 'gold',
    enabled: true,
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'How to Choose the Perfect Wireless Gadgets in 2026',
    excerpt: 'Key factors to consider when choosing ANC headphones, smartwatch sensors, and wireless ecosystems for everyday life.',
    content: 'Wireless technology has evolved rapidly with Bluetooth 5.4, Auracast, and lossless audio streaming codecs. In this buying guide, we review how driver size, active noise cancelling, latency, and battery cycles impact real-world performance so you make an informed Amazon purchase.',
    image: 'https://images.unsplash.com/photo-1510519138161-58474ebf8996?w=800&auto=format&fit=crop&q=80',
    date: 'August 28, 2026',
    author: 'Jyada Kharido Editorial',
    category: 'Buying Guide',
    readTime: '4 min read'
  },
  {
    id: 'blog-2',
    title: 'Top Smartwatches with True Health & GPS Tracking Tested',
    excerpt: 'A comprehensive breakdown of multi-band GPS, AMOLED displays, and workout battery stamina across leading brands.',
    content: 'From daily heart rate tracking to sleep score analysis and multi-GNSS satellite mapping, modern smart wearables provide incredible insights. We compare key sensors and water resistance standards so you pick the best companion for fitness.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    date: 'August 15, 2026',
    author: 'Tech Desk',
    category: 'Reviews',
    readTime: '5 min read'
  },
  {
    id: 'blog-3',
    title: 'Minimalist Desk Setup Essentials for Creators and Gamers',
    excerpt: 'Curated audio gear, monitor arms, ergonomic peripherals, and smart ambient lights to supercharge your desk aesthetic.',
    content: 'Creating a clutter-free, inspiring desk setup doesn’t require overspending. By investing in smart wireless speakers, clean cable management, and high-efficiency laptops, you can achieve a studio-grade workspace.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    date: 'July 30, 2026',
    author: 'Lifestyle Team',
    category: 'Inspiration',
    readTime: '3 min read'
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  brandName: 'Jyada Kharido',
  tagline: 'Best Deals • Big Savings',
  amazonStoreUrl: 'https://link.amazon/B012S1jyj',
  heroHeading: 'Wireless',
  heroSubheading: 'Beats Solo',
  heroDescription: 'Discover handpicked products across fashion, electronics, gadgets, and lifestyle with verified deals.',
  heroImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
  heroBadge: 'HEADPHONE',
  affiliateDisclosure: 'As an Amazon Associate, Jyada Kharido earns from qualifying purchases. Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon at the time of purchase will apply to the purchase of this product.',
  footerDescription: 'Jyada Kharido is your premier destination for discovering curated Amazon deals, trending electronics, wearable technology, and lifestyle finds. More Choices, Better Finds.',
  contactEmail: 'support@jyadakharido.com',
  contactPhone: '+91 98765 43210',
  socialLinks: {
    instagram: 'https://instagram.com/jyadakharido',
    facebook: 'https://facebook.com/jyadakharido',
    twitter: 'https://twitter.com/jyadakharido',
    youtube: 'https://youtube.com/@jyadakharido'
  },
  socialHandles: {
    instagram: 'jyadakharido',
    x: 'jyadakharido',
    facebook: 'Jyada Kharido Official'
  },
  featureBarItems: [
    {
      id: 'fb-1',
      title: 'Free Shipping',
      subtitle: 'On Eligible Amazon Orders',
      icon: 'truck'
    },
    {
      id: 'fb-2',
      title: 'Money Guarantee',
      subtitle: 'Amazon A-to-z Safe Returns',
      icon: 'shield'
    },
    {
      id: 'fb-3',
      title: '24/7 Support',
      subtitle: 'Technical & Buying Guides',
      icon: 'headphones'
    },
    {
      id: 'fb-4',
      title: 'Secure Payment',
      subtitle: 'All Cards & UPI on Amazon',
      icon: 'credit-card'
    }
  ],
  activeFestivalOverride: 'auto'
};
