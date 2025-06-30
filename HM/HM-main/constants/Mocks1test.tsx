import axios from "axios";

interface Items {
    id: string;
    name: string;
    count: number;
    image: any;
}

interface FurnitureVariant {
    name: string;
    image: any; // Use a specific type like ImageSourcePropType for React Native images
    color: string;
    price: number;
    dimensions: string; // Furniture dimensions
    roomType: string;   // Suggested room type (e.g., "Living Room")
    furnitureType: string; // Category of furniture (e.g., "Sofa")
}

let items: any[] = [];
let furnitures: { [key: string]: Items[] } = {};
let sofaDetails: { [key: string]: FurnitureVariant[] } = {};

axios.get('http://192.168.1.2:5000/items') // Replace with your backend's IP/URL
    .then((response) => {
        const datas = response.data;
        datas.forEach((element: { name: any; }) => {
            items.push(element.name);
        });

        items.forEach((category) => {
            furnitures[category] = [];
        });
        // console.log(items);
        // console.log(furnitures);
    })
    .catch((error) => {
        console.error('Error fetching data (items):', error);
    });

axios.get('http://192.168.1.2:5000/furnitures') // Replace with your backend's IP/URL
    .then((response) => {
        const datas = response.data;
        datas.forEach((element: { type: string | number; id: any; name: any; count: any; image: any; }) => {
            furnitures[element.type].push({ id: element.id, image: { uri: `https://github.com/TUHINMODAK/ARapp/blob/main/ARapp-main/assets/icons/${element.image}?raw=true` }, name: element.name, count: element.count }); //https://github.com/TUHINMODAK/ARapp/blob/main/ARapp-main/assets/icons/${element.image}?raw=true
        });
        Object.keys(furnitures).forEach((category) => {
            furnitures[category].forEach((element) => {
                sofaDetails[element.id] = [];
            })
        });
        // console.log(furnitures);
        // console.log(sofaDetails);
    })
    .catch((error) => {
        console.error('Error fetching data (furnitures):', error);
    });

axios.get('http://192.168.1.2:5000/variants') // Replace with your backend's IP/URL
    .then((response) => {
        const datas = response.data;
        datas.forEach((element: { name: string; image: any; color: string; price: number; dimensions: string; roomType: string; furnitureType: string; type: any; }) => {
            sofaDetails[element.type].push({ name: element.name, image: { uri: `https://github.com/TUHINMODAK/ARapp/blob/main/ARapp-main/assets/images/${element.image}?raw=true` }, color: element.color, price: element.price, dimensions: element.dimensions, roomType: element.roomType, furnitureType: element.furnitureType });
        });
        // console.log(sofaDetails);
    })
    .catch((error) => {
        console.error('Error fetching data (varients):', error);
    });

export { furnitures, sofaDetails };//, sofaDetails };
