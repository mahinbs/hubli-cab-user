export const MOCK_LOCATIONS = [
    { id: '1', name: 'Home', address: '123 Main St, Cityville' },
    { id: '2', name: 'Work', address: 'Tech Park, Sector 5' },
    { id: '3', name: 'Airport', address: 'International Airport T3' },
    { id: '4', name: 'Central Mall', address: 'Downtown Shopping Center' },
    { id: '5', name: 'City Hospital', address: '456 Health Ave' },
];

export const VEHICLE_TYPES = [
    {
        id: 'auto',
        name: 'Auto',
        image: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png', // Placeholder
        baseFare: 30,
        perKm: 10, // Rider rate (commission is 10 paise/km)
        eta: '4 min',
    },
    {
        id: 'mini',
        name: 'Mini',
        image: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
        baseFare: 50,
        perKm: 12, // Rider rate
        eta: '6 min',
    },
    {
        id: 'sedan',
        name: 'Sedan',
        image: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
        baseFare: 70,
        perKm: 15, // Rider rate
        eta: '8 min',
    },
    {
        id: 'suv',
        name: 'SUV',
        image: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
        baseFare: 100,
        perKm: 20, // Rider rate
        eta: '10 min',
    },
];
