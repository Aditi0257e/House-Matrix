const categories = [
    {
      id: 'Sofa',
      name: 'Sofa',
      tags: ['products', 'inspirations','shop'],
      count: 147,
      image: require('../assets/icons/sofa.png')
    },
    {
      id: 'Dinning Table',
      name: 'Dinning Table',
      tags: ['products', 'shop'],
      count: 16,
      image: require('../assets/icons/chair.png')
    },
    {
      id: 'Bed',
      name: 'Bed',
      tags: ['products', 'inspirations'],
      count: 68,
      image: require('../assets/icons/double-bed.png')
    },
    {
      id: 'closet',
      name: 'closet',
      tags: ['products', 'shop'],
      count: 17,
      image: require('../assets/icons/closet.png')
    },
    {
      id: 'Chair',
      name: 'Chair',
      tags: ['products', 'shop'],
      count: 47,
      image: require('../assets/icons/chair_1.png')
    },
    {
      id: 'office Desk',
      name: 'office Desk',
      tags: ['products', 'shop'],
      count: 47,
      image: require('../assets/icons/workspace.png')
    },
  ];
  
  const products = [
    {
      id: 1, 
      name: '16 Best Plants That Thrive In Your Bedroom',
      description: 'Bedrooms deserve to be decorated with lush greenery just like every other room in the house – but it can be tricky to find a plant that thrives here. Low light, high humidity and warm temperatures mean only certain houseplants will flourish.',
      tags: ['Interior', '27 m²', 'Ideas'],
      images: [
        require('../assets/images/plants_1.png'),
        require('../assets/images/plants_2.png'),
        require('../assets/images/plants_3.png'),
        // showing only 3 images, show +6 for the rest
        require('../assets/images/plants_1.png'),
        require('../assets/images/plants_2.png'),
        require('../assets/images/plants_3.png'),
        require('../assets/images/plants_1.png'),
        require('../assets/images/plants_2.png'),
        require('../assets/images/plants_3.png'),
      ]
    }
  ];
  
  const explore = [
    // images
    require('../assets/images/explore_1.png'),
    require('../assets/images/explore_2.png'),
    require('../assets/images/explore_3.png'),
    require('../assets/images/explore_4.png'),
    require('../assets/images/explore_5.png'),
    require('../assets/images/explore_6.png'),
  ];
  

  const avatarOptions = [
    require('../assets/images/avatar.png'),
    require('../assets/images/avatar2.png'),
    require('../assets/images/avatar3.png'),
    require('../assets/images/avatar4.png'),
    require('../assets/images/avatar5.png'),
    require('../assets/images/avatar6.png'),
    require('../assets/images/avatar7.png'),
    require('../assets/images/avatar8.png'),
    require('../assets/images/avatar9.png'),
    require('../assets/images/avatar10.png'),
    
  ];
  
   let profile = {
    username: 'ARAPP',
    location: 'India',
    email: 'contact@react-ui-kit.com',
    avatar: avatarOptions[0], // Use the first avatar as default
    budget: 1000,
    monthly_cap: 5000,
    notifications: true,
    newsletter: false,
  };
  
  // Add this function to update the mock profile
  export const updateMockProfile = (newProfile: Partial<typeof profile>) => {
    profile = { ...profile, ...newProfile };
  };
  
  export {
    categories,
    explore,
    products,
    profile,
    avatarOptions,
  }
  export type FurnitureModelKey = 
  'Modern Sofa - Variant 1' | 
'Modern Sofa - Variant 2' | 
'Classic Sofa - Variant 1' | 
'Classic Sofa - Variant 2' | 
'L-Shaped Sofa - Variant 1' | 
'L-Shaped Sofa - Variant 2' | 
'Wooden Dining Table - Variant 1' | 
'Wooden Dining Table - Variant 2' | 
'Glass Dining Table - Variant 1' | 
'Glass Dining Table - Variant 2' | 
'Queen Size Bed - Variant 1' | 
'Queen Size Bed - Variant 2' | 
'King Size Bed - Variant 1' | 
'King Size Bed - Variant 2' | 
'Sliding Door Closet - Variant 1' | 
'Sliding Door Closet - Variant 2' | 
'Classic Wooden Closet - Variant 1' | 
'Classic Wooden Closet - Variant 2' | 
'Office Chair - Variant 1' | 
'Office Chair - Variant 2' | 
'Dining Chair - Variant 1' | 
'Dining Chair - Variant 2' | 
'Wooden Office Desk - Variant 1' | 
'Wooden Office Desk - Variant 2' | 
'Modern Office Desk - Variant 1' | 
'Modern Office Desk - Variant 2' | 
'default';

export const furnitureModels: Record<FurnitureModelKey, any> = {
 'Modern Sofa - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Modern Sofa - Variant 2': require("../assets/res/modified_bramie1.glb"),
  'Classic Sofa - Variant 1': require("../assets/res/old_tv_stand.glb"),
  'Classic Sofa - Variant 2': require("../assets/res/c.glb"),
  'L-Shaped Sofa - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'L-Shaped Sofa - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Wooden Dining Table - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Wooden Dining Table - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Glass Dining Table - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Glass Dining Table - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Queen Size Bed - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Queen Size Bed - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'King Size Bed - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'King Size Bed - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Sliding Door Closet - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Sliding Door Closet - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Classic Wooden Closet - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Classic Wooden Closet - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Office Chair - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Office Chair - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Dining Chair - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Dining Chair - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Wooden Office Desk - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Wooden Office Desk - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'Modern Office Desk - Variant 1': require("../assets/res/office_sofa_-25mb.glb"),
  'Modern Office Desk - Variant 2': require("../assets/res/office_sofa_-25mb.glb"),
  'default': require("../assets/res/old_tv_stand.glb")
};