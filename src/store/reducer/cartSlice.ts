import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Item {
    id: number;
    title: string;
    newPrice: number;
    weight: string;
    image: string;
    imageTwo: string;
    date: string;
    status: string;
    rating: number;
    oldPrice: any;
    location: string;
    brand: string;
    sku: number;
    category: string;
    quantity: number;
}
export interface CounterState {
    items: Item[];
    orders: object[];
}

const defaultItems: Item[] = [
    {
        title: "Pirandai Thokku",
        image: "/assets/img/product/pirandai-thokku.jpg",
        imageTwo: "/assets/img/product/pirandai-thokku.jpg",
        category: "Thokku",
        oldPrice: "₹22.00",
        newPrice: 32,
        location: "In Store",
        brand: "Peoples Store",
        sku: 24433,
        id: 5,
        quantity: 1,
        rating: 4,
        status: "Out Of Stock",
        weight: "1pack",
        date: ""
    },
    {
        title: "Tomato Thokku",
        image: "/assets/img/product/tomato-thokku.jpg",
        imageTwo: "/assets/img/product/tomato-thokku.jpg",
        category: "Thokku",
        oldPrice: '₹45.00',
        newPrice: 41,
        location: "In Store,online",
        brand: "Darsh Mart",
        sku: 24433,
        date: "",
        id: 6,
        quantity: 1,
        rating: 5,
        status: "Out Of Stock",
        weight: "200g",
    },
    {
        title: "Onion Thokku",
        image: "/assets/img/product/onion-thokku.jpg",
        imageTwo: "/assets/img/product/onion-thokku.jpg",
        category: "Thokku",
        oldPrice: '₹31.00',
        newPrice: 29,
        location: "online",
        brand: "Bhisma Organics",
        sku: 24433,
        date: "",
        id: 7,
        quantity: 1,
        rating: 2,
        status: "In Stock",
        weight: "250g",
    },
    {
        title: "ABC Malt",
        image: "/assets/img/product/abc-malt.jpg",
        imageTwo: "/assets/img/product/abc-malt.jpg",
        category: "Malt",
        oldPrice: '₹10.00',
        newPrice: 9,
        location: "In Store,online",
        brand: "Peoples Store",
        sku: 24433,
        date: "",
        id: 8,
        quantity: 1,
        rating: 4,
        status: "Out Of Stock",
        weight: "500g",
    },

];

const defaultOrders: object[] = [
    {
        orderId: "65820",
        date: "2024-08-23T06:45:41.989Z",
        shippingMethod: "free",
        totalItems: 3,
        totalPrice: 194.4,
        status: "Completed",
        products: [
            {
                title: "Crunchy Banana Chips",
                sale: "",
                image: "/assets/img/new-product/3.jpg",
                imageTwo: "/assets/img/new-product/back-3.jpg",
                category: "Chips",
                oldPrice: '₹2.00',
                newPrice: 1,
                location: "In Store,online",
                brand: "Darsh Mart",
                sku: 24433,
                itemLeft: "",
                id: 3,
                quantity: 1,
                rating: 1,
                status: "In Stock",
                weight: "100 g",
            },
            {
                title: "Crunchy Potato Chips",
                sale: "",
                image: "/assets/img/new-product/4.jpg",
                imageTwo: "/assets/img/new-product/back-4.jpg",
                category: "Chips",
                // oldPrice: 22,
                newPrice: 15,
                location: "online",
                brand: "Bhisma Organics",
                sku: 24433,
                itemLeft: "3 left",
                id: 4,
                quantity: 1,
                rating: 2,
                status: "In Stock",
                weight: "",
            },
            {
                title: "Black Pepper Spice pack",
                sale: "",
                image: "/assets/img/new-product/5.jpg",
                imageTwo: "/assets/img/new-product/back-5.jpg",
                category: "Spices",
                // oldPrice: 22,
                newPrice: 32,
                location: "In Store",
                brand: "Peoples Store",
                sku: 24433,
                itemLeft: "1 left",
                id: 5,
                quantity: 1,
                rating: 4,
                status: "Out Of Stock",
                weight: "1 pack",
            },
        ],
        address: {
            id: "1724395538835",
            firstName: "John",
            lastName: "Smith",
            address: "    My Street, Big town BG23 4YZ",
            city: "Shaghat",
            postalCode: "395004",
            country: "AM",
            state: "SU",
            countryName: "Armenia",
            stateName: "Syunik Province",
        },
    },
    {
        orderId: "31264",
        date: "2024-08-23T07:00:36.339Z",
        shippingMethod: "free",
        totalItems: 3,
        totalPrice: 181.2,
        status: "Completed",
        products: [
            {
                title: "Chilli Flakes Pack",
                sale: "New",
                image: "/assets/img/new-product/7.jpg",
                imageTwo: "/assets/img/new-product/back-7.jpg",
                category: "Spices",
                oldPrice: '₹31.00',
                newPrice: 29,
                location: "online",
                brand: "Bhisma Organics",
                sku: 24433,
                itemLeft: "",
                id: 7,
                quantity: 1,
                rating: 2,
                status: "In Stock",
                weight: "250 g",
            },
            {
                title: "Tomato Ketchup Pack",
                sale: "New",
                image: "/assets/img/new-product/8.jpg",
                imageTwo: "/assets/img/new-product/back-8.jpg",
                category: "Sauces",
                oldPrice: '₹10.00',
                newPrice: 9,
                location: "In Store,online",
                brand: "Peoples Store",
                sku: 24433,
                itemLeft: "",
                id: 8,
                quantity: 1,
                rating: 4,
                status: "Out Of Stock",
                weight: "500 g",
            },
            {
                title: "Organic dragon fruit",
                sale: "New",
                image: "/assets/img/new-product/9.jpg",
                imageTwo: "/assets/img/new-product/9.jpg",
                category: "Fruit",
                oldPrice: '₹7.00',
                newPrice: 5,
                location: "In Store",
                brand: "Darsh Mart",
                sku: 24433,
                itemLeft: "",
                id: 9,
                quantity: 1,
                rating: 3,
                status: "In Stock",
                weight: "2 Pcs",
            },
        ],
        address: {
            id: "1724395538835",
            firstName: "John",
            lastName: "Smith",
            address: "    My Street, Big town BG23 4YZ",
            city: "Shaghat",
            postalCode: "395004",
            country: "AM",
            state: "SU",
            countryName: "Armenia",
            stateName: "Syunik Province",
        },
    },
    {
        orderId: "47394",
        date: "2024-08-23T07:01:13.747Z",
        shippingMethod: "free",
        totalItems: 3,
        totalPrice: 106.8,
        status: "Pending",
        products: [
            {
                title: "Black Pepper Spice pack",
                sale: "",
                image: "/assets/img/new-product/5.jpg",
                imageTwo: "/assets/img/new-product/back-5.jpg",
                category: "Spices",
                // oldPrice: 22,
                newPrice: 32,
                location: "In Store",
                brand: "Peoples Store",
                sku: 24433,
                itemLeft: "1 left",
                id: 5,
                quantity: 1,
                rating: 4,
                status: "Out Of Stock",
                weight: "1 pack",
            },
            {
                title: "Small Cardamom Spice Pack",
                sale: "Sale",
                image: "/assets/img/new-product/6.jpg",
                imageTwo: "/assets/img/new-product/back-6.jpg",
                category: "Spices",
                oldPrice: '₹45.00',
                newPrice: 41,
                location: "In Store,online",
                brand: "Darsh Mart",
                sku: 24433,
                itemLeft: "",
                id: 6,
                quantity: 1,
                rating: 5,
                status: "Out Of Stock",
                weight: "200 g",
            },
            {
                title: "Chilli Flakes Pack",
                sale: "New",
                image: "/assets/img/new-product/7.jpg",
                imageTwo: "/assets/img/new-product/back-7.jpg",
                category: "Spices",
                oldPrice: '₹31.00',
                newPrice: 29,
                location: "online",
                brand: "Bhisma Organics",
                sku: 24433,
                itemLeft: "",
                id: 7,
                quantity: 1,
                rating: 2,
                status: "In Stock",
                weight: "250 g",
            },
            {
                title: "Tomato Ketchup Pack",
                sale: "New",
                image: "/assets/img/new-product/8.jpg",
                imageTwo: "/assets/img/new-product/back-8.jpg",
                category: "Sauces",
                oldPrice: '$10.00',
                newPrice: 9,
                location: "In Store,online",
                brand: "Peoples Store",
                sku: 24433,
                itemLeft: "",
                id: 8,
                quantity: 1,
                rating: 4,
                status: "Out Of Stock",
                weight: "500 g",
            },
        ],
        address: {
            id: "1724395538835",
            firstName: "John",
            lastName: "Smith",
            address: "    My Street, Big town BG23 4YZ",
            city: "Shaghat",
            postalCode: "395004",
            country: "AM",
            state: "SU",
            countryName: "Armenia",
            stateName: "Syunik Province",
        },
    },
];

const initialState: CounterState = {
    items: defaultItems,
    orders: defaultOrders,

};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setItems(state, action: PayloadAction<Item[]>) {
            state.items = action.payload;
        },
        addItem(state, action: PayloadAction<Item>) {
            state.items.push(action.payload);
            if (typeof window !== "undefined") {
                localStorage.setItem("products", JSON.stringify(state.items));
            }
        },
        removeItem(state, action: PayloadAction<number>) {
            state.items = state.items.filter((item) => item.id !== action.payload);
            if (typeof window !== "undefined") {
                localStorage.setItem("products", JSON.stringify(state.items));
            }
        },
        clearCart: (state) => {
            state.items = [];
            if (typeof window !== "undefined") {
                localStorage.setItem("products", JSON.stringify(state.items));
            }
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ id: number; quantity: number }>
        ) => {
            const { id, quantity } = action.payload;
            const itemToUpdate = state.items.find((item) => item.id === id);
            if (itemToUpdate) {
                itemToUpdate.quantity = quantity;
                if (typeof window !== "undefined") {
                    localStorage.setItem("products", JSON.stringify(state.items));
                }
            }
        },
        updateItemQuantity: (state, action) => {
            state.items = action.payload;
        },
        addOrder(state, action: PayloadAction<any>) {
            const newOrder = action.payload;
            const loginUser =
                typeof window !== "undefined"
                    ? JSON.parse(localStorage.getItem("login_user") || "{}")
                    : {};

            if (loginUser?.uid) {
                const storedOrders = JSON.parse(localStorage.getItem("orders") || "{}");
                let userOrders = storedOrders[loginUser.uid] || defaultOrders;

                if (newOrder) {
                    userOrders = [...userOrders, newOrder];
                    storedOrders[loginUser.uid] = userOrders;
                    localStorage.setItem("orders", JSON.stringify(storedOrders));
                }
            }
        },
        setOrders(state, action: PayloadAction<any[]>) {
            state.orders = action.payload;
        },
    },
});

export const {
    setItems,
    addItem,
    removeItem,
    clearCart,
    updateQuantity,
    updateItemQuantity,
    addOrder,
    setOrders
} = cartSlice.actions;

export default cartSlice.reducer;