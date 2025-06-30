import { FurnitureModelKey, furnitureModels } from './mocks';
export interface FurnitureVariant {
  name: any;
  image: any; // Use a specific type like ImageSourcePropType for React Native images
 // thumbnail:any;
  color: string;
  price: number;
  dimensions: string; // Furniture dimensions
  roomType: string;   // Suggested room type (e.g., "Living Room")
  furnitureType: string; // Category of furniture (e.g., "Sofa")
  a:any;
  b:any;
  //modelSource: any; // 3D model source
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
      image: require('../assets/images/brownSofa.jpg'),
      color: 'Gray',
      price: 899.99,
      dimensions: '82.68" x 35.43" x 33.46"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
      //modelSource: 'Modern Sofa - Variant 1',
    },
    {
      name: 'Modern Sofa - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
      a:require('../assets/res/TESLA2/TESLA/object_car.obj'),
      b:require('../assets/res/TESLA2/TESLA/object_car_2.mtl')

    },
  ],
  sofa2: [
    {
      name: 'Classic Sofa - Variant 1',
      image: require('../assets/images/brownSofa.jpg'),
      color: 'Gray',
      price: 699.99,
      dimensions: '78" x 32" x 28"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
      a:require('../assets/res/a/red_and_black_gaming_chair.obj'),
      b:require('../assets/res/TESLA2/TESLA/object_car_2.mtl')
     // modelSource: 'Classic Sofa - Variant 1',
    },
    {
      name: 'Classic Sofa - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
      //modelSource: 'Modern Sofa - Variant 1',
      a:require('../assets/res/a/lady_in_black_dress.obj'),
      b:require('../assets/res/a/lady_in_black_dress.mtl')
    },
  ],
  sofa3: [
    {
      name: 'L-Shaped Sofa - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
     // modelSource: 'Modern Sofa - Variant 1',
     a:require('../assets/res/a/dublin_chair.obj'),
     b:require('../assets/res/a/dublin_chair.mtl')
    },
    {
      name: 'L-Shaped Sofa - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Sofa',
     // modelSource: 'Modern Sofa - Variant 1',
     a:require('../assets/res/a/old_chair.obj'),
      b:require('../assets/res/a/old_chair.mtl')
    },
  ],
  dining1: [
    {
      name: 'Wooden Dining Table - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Table',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
    {
      name: 'Wooden Dining Table - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Table',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
  dining2: [
    {
      name: 'Glass Dining Table - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Table',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
    {
      name: 'Glass Dining Table - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Table',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
  bed1: [
    {
      name: 'Queen Size Bed - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Bed',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
    {
      name: 'Queen Size Bed - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Bed',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
  bed2: [
    {
      name: 'King Size Bed - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Bed',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
    {
      name: 'King Size Bed - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Bed',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
  closet1: [
    {
      name: 'Sliding Door Closet - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Closet',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
    {
      name: 'Sliding Door Closet - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Closet',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
  closet2: [
    {
      name: 'Classic Wooden Closet - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Closet',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
    {
      name: 'Classic Wooden Closet - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Closet',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
  chair1: [
    {
      name: 'Office Chair - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Chair',
      a:require('../assets/res/a/red_and_black_gaming_chair.obj'),
      b:require('../assets/res/TESLA2/TESLA/object_car_2.mtl')
    },
    {
      name: 'Office Chair - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Chair',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
  chair2: [
    {
      name: 'Dining Chair - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Chair',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
    {
      name: 'Dining Chair - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Chair',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
  desk1: [
    {
      name: 'Wooden Office Desk - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Desk',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
    {
      name: 'Wooden Office Desk - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Desk',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
  desk2: [
    {
      name: 'Modern Office Desk - Variant 1',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Desk',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
    {
      name: 'Modern Office Desk - Variant 2',
      image: require('../assets/images/explore_1.png'),
      color: 'Gray',
      price: 899.99,
      dimensions: '84" x 36" x 32"',
      roomType: 'Living Room',
      furnitureType: 'Desk',
      a:require('../assets/res/mainsofa.obj'),
      b:require('../assets/res/office_sofa_-25mb.glb')
    },
  ],
};

// constants/mocks.tsx or constants/mocks.ts



export { sofas, diningTables, beds, closets, chairs, officeDesks, sofaDetails };

