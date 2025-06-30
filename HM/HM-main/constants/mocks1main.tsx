interface FurnitureVariant {
  name: string;
  image: any; // Use a specific type like ImageSourcePropType for React Native images
  color: string;
  price: number;
  dimensions: string; // Furniture dimensions
  roomType: string;   // Suggested room type (e.g., "Living Room")
  furnitureType: string; // Category of furniture (e.g., "Sofa")
}


const sofas = [
  {
    id: 'sofa1',
    name: 'Modern Sofa',
    count: 5,
    image: require('../assets/icons/Msofa.png'),
  },
  {
    id: 'sofa2',
    name: 'Classic Sofa',
    count: 3,
    image: require('../assets/icons/Csofa.png'),
  },
  {
    id: 'sofa3',
    name: 'L-Shaped Sofa',
    count: 4,
    image: require('../assets/icons/Lsofa.png'),
  },
];

const diningTables = [
  {
    id: 'dining1',
    name: 'Wooden Dining Table',
    count: 6,
    image: require('../assets/icons/Wdinning-table.png'),
  },
  {
    id: 'dining2',
    name: 'Glass Dining Table',
    count: 4,
    image: require('../assets/icons/Gdinning-table.png'),
  },
];

const beds = [
  {
    id: 'bed1',
    name: 'Queen Size Bed',
    count: 5,
    image: require('../assets/icons/Qdouble-bed.png'),
  },
  {
    id: 'bed2',
    name: 'King Size Bed',
    count: 2,
    image: require('../assets/icons/Kbed.png'),
  },
];

const closets = [
  {
    id: 'closet1',
    name: 'Sliding Door Closet',
    count: 3,
    image: require('../assets/icons/Scloset.png'),
  },
  {
    id: 'closet2',
    name: 'Classic Wooden Closet',
    count: 4,
    image: require('../assets/icons/wardrobe.png'),
  },
];

const chairs = [
  {
    id: 'chair1',
    name: 'Office Chair',
    count: 7,
    image: require('../assets/icons/Ochair.png'),
  },
  {
    id: 'chair2',
    name: 'Dining Chair',
    count: 8,
    image: require('../assets/icons/Dchair.png'),
  },
];

const officeDesks = [
  {
    id: 'desk1',
    name: 'Wooden Office Desk',
    count: 4,
    image: require('../assets/icons/workspace1.png'),
  },
  {
    id: 'desk2',
    name: 'Modern Office Desk',
    count: 3,
    image: require('../assets/icons/Woffice-desk.png'),
  },
];

const sofaDetails: Record<string, FurnitureVariant[]> = {
  sofa1: [
    {
      name: 'Modern Sofa - Variant 1',
      image: { uri: 'https://github.com/TUHINMODAK/ARapp/blob/main/ARapp-main/assets/images/brownSofa.jpg?raw=true' },
      color: 'Brown',
      price: 799.99,
      dimensions: '80" x 34" x 30"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
    },
    {
      name: 'Modern Sofa - Variant 2',
      image: require('../assets/images/sofa3.jpeg'),
      color: 'Blue',
      price: 849.99,
      dimensions: '82" x 35" x 31"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
    },
  ],
  sofa2: [
    {
      name: 'Classic Sofa - Variant 1',
      image: require('../assets/images/sofa7.jpeg'),
      color: 'Gray',
      price: 699.99,
      dimensions: '78" x 32" x 28"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
    },
    {
      name: 'Classic Sofa - Variant 2',
      image: require('../assets/images/sofa4.jpeg'),
      color: 'Green',
      price: 749.99,
      dimensions: '80" x 33" x 29"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
    },
  ],
  sofa3: [
    {
      name: 'L-Shaped Sofa - Variant 1',
      image: require('../assets/images/sofa5.jpeg'),
      color: 'Black',
      price: 999.99,
      dimensions: '90" x 60" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
    },
    {
      name: 'L-Shaped Sofa - Variant 2',
      image: require('../assets/images/sofa6.jpeg'),
      color: 'White',
      price: 1049.99,
      dimensions: '92" x 62" x 33"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
    },
  ],
  dining1: [
    {
      name: 'Wooden Dining Table - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Oak',
      price: 549.99,
      dimensions: '72" x 36" x 30"',
      roomType: 'Dining Room',
      furnitureType: 'Dining Table',
    },
    {
      name: 'Wooden Dining Table - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Walnut',
      price: 599.99,
      dimensions: '74" x 38" x 31"',
      roomType: 'Dining Room',
      furnitureType: 'Dining Table',
    },
  ],
  dining2: [
    {
      name: 'Glass Dining Table - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Transparent',
      price: 699.99,
      dimensions: '70" x 36" x 30"',
      roomType: 'Dining Room',
      furnitureType: 'Dining Table',
    },
    {
      name: 'Glass Dining Table - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Smoked Glass',
      price: 749.99,
      dimensions: '72" x 38" x 31"',
      roomType: 'Dining Room',
      furnitureType: 'Dining Table',
    },
  ],
  bed1: [
    {
      name: 'Queen Size Bed - Variant 1',
      image: require('../assets/images/download.jpeg'),
      color: 'Cherry',
      price: 899.99,
      dimensions: '60" x 80" x 48"',
      roomType: 'Bedroom',
      furnitureType: 'Bed',
    },
    {
      name: 'Queen Size Bed - Variant 2',
      image: require('../assets/images/explore_2.png'),
      color: 'Teak',
      price: 949.99,
      dimensions: '62" x 82" x 49"',
      roomType: 'Bedroom',
      furnitureType: 'Bed',
    },
  ],
  bed2: [
    {
      name: 'King Size Bed - Variant 1',
      image: require('../assets/images/bed2.jpeg'),
      color: 'Mahogany',
      price: 1099.99,
      dimensions: '76" x 80" x 50"',
      roomType: 'Bedroom',
      furnitureType: 'Bed',
    },
    {
      name: 'King Size Bed - Variant 2',
      image: require('../assets/images/bed3.jpeg'),
      color: 'Maple',
      price: 1149.99,
      dimensions: '78" x 82" x 51"',
      roomType: 'Bedroom',
      furnitureType: 'Bed',
    },
  ],
  closet1: [
    {
      name: 'Sliding Door Closet - Variant 1',
      image: require('../assets/images/closet1.jpeg'),
      color: 'White',
      price: 749.99,
      dimensions: '60" x 24" x 72"',
      roomType: 'Bedroom',
      furnitureType: 'Closet',
    },
    {
      name: 'Sliding Door Closet - Variant 2',
      image: require('../assets/images/closet2.jpeg'),
      color: 'Gray',
      price: 799.99,
      dimensions: '62" x 26" x 74"',
      roomType: 'Bedroom',
      furnitureType: 'Closet',
    },
  ],
  closet2: [
    {
      name: 'Classic Wooden Closet - Variant 1',
      image: require('../assets/images/closet3.jpeg'),
      color: 'Brown',
      price: 899.99,
      dimensions: '64" x 28" x 76"',
      roomType: 'Bedroom',
      furnitureType: 'Closet',
    },
    {
      name: 'Classic Wooden Closet - Variant 2',
      image: require('../assets/images/closet4.jpeg'),
      color: 'Dark Brown',
      price: 949.99,
      dimensions: '66" x 30" x 78"',
      roomType: 'Bedroom',
      furnitureType: 'Closet',
    },
  ],
  chair1: [
    {
      name: 'Office Chair - Variant 1',
      image: require('../assets/images/chair1.jpeg'),
      color: 'Black',
      price: 199.99,
      dimensions: '24" x 24" x 36"',
      roomType: 'Office',
      furnitureType: 'Chair',
    },
    {
      name: 'Office Chair - Variant 2',
      image: require('../assets/images/chair2.jpeg'),
      color: 'Blue',
      price: 249.99,
      dimensions: '26" x 26" x 38"',
      roomType: 'Office',
      furnitureType: 'Chair',
    },
  ],
  
    chair2: [
      {
        name: 'Dining Chair - Variant 2',
        image: require('../assets/images/chair3.jpeg'),
        color: 'Beige',
        price: 129.99,
        dimensions: '18" x 20" x 36"',
        roomType: 'Dining Room',
        furnitureType: 'Chair',
      },
    ],
    desk1: [
      {
        name: 'Wooden Office Desk - Variant 1',
        image: require('../assets/images/desk1.jpeg'),
        color: 'Mahogany',
        price: 499.99,
        dimensions: '60" x 30" x 30"',
        roomType: 'Office',
        furnitureType: 'Desk',
      },
      {
        name: 'Wooden Office Desk - Variant 2',
        image: require('../assets/images/desk2.jpeg'),
        color: 'Oak',
        price: 459.99,
        dimensions: '55" x 28" x 30"',
        roomType: 'Office',
        furnitureType: 'Desk',
      },
    ],
    desk2: [
      {
        name: 'Modern Office Desk - Variant 1',
        image: require('../assets/images/desk3.jpeg'),
        color: 'White',
        price: 549.99,
        dimensions: '63" x 30" x 29"',
        roomType: 'Office',
        furnitureType: 'Desk',
      },
      {
        name: 'Modern Office Desk - Variant 2',
        image: require('../assets/images/desk4.jpeg'),
        color: 'Black',
        price: 599.99,
        dimensions: '70" x 35" x 29"',
        roomType: 'Office',
        furnitureType: 'Desk',
      },
    ],
  };
  

// constants/mocks.tsx or constants/mocks.ts
export type FurnitureModelKey = 
  'Modern Sofa - Variant 1' | 
  'Modern Sofa - Variant 2' | 
  'Classic Sofa - Variant 1' | 
  'Classic Sofa - Variant 2' | 
  'default';

export const furnitureModels: Record<FurnitureModelKey, any> = {
  'Modern Sofa - Variant 1': { uri: 'https://github.com/TUHINMODAK/ARapp/raw/refs/heads/main/ARapp-main/assets/res/old_tv_stand.glb' },// https://github.com/TUHINMODAK/ARapp/raw/refs/heads/main/ARapp-main/assets/res/heart.obj
  'Modern Sofa - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Classic Sofa - Variant 1': require("../assets/res/c.glb"),
  'Classic Sofa - Variant 2': require("../assets/res/c.glb"),
  'default': require("../assets/res/office_sofa_-25mb.glb")
};


export { sofas, diningTables, beds, closets, chairs, officeDesks, sofaDetails };

