export const MOCK_LOCATIONS = [
    { id: '1', name: 'Home', address: '123 Main St, Cityville' },
    { id: '2', name: 'Work', address: 'Tech Park, Sector 5' },
    { id: '3', name: 'Airport', address: 'International Airport T3' },
    { id: '4', name: 'Central Mall', address: 'Downtown Shopping Center' },
    { id: '5', name: 'City Hospital', address: '456 Health Ave' },
];

export const VEHICLE_TYPES = [
    {
        id: 'bike',
        name: 'Bike',
        image: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png', // Placeholder
        baseFare: 20,
        perKm: 5,
        eta: '2 min',
    },
    {
        id: 'auto',
        name: 'Auto',
        image: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png', // Placeholder
        baseFare: 30,
        perKm: 10, // 10 paise mentioned but that's commission? or rate? Assuming regular rate here + comm logic
        // User said "fixed commission of 10 paise per km". Note: 10 paise is tiny (0.1 INR). 
        // Maybe they meant the *App Fee* is 10p/km?
        // I will stick to realistic fares for the USER display, and maybe show 'Commission: ₹0.10/km' in driver app.
        eta: '4 min',
    },
    {
        id: 'mini',
        name: 'Mini',
        image: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
        baseFare: 50,
        perKm: 12,
        eta: '6 min',
    },
    {
        id: 'sedan',
        name: 'Sedan',
        image: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
        baseFare: 70,
        perKm: 15,
        eta: '8 min',
    },
];
