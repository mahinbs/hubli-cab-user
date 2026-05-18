import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';
import { getVehicleTypes } from '../../supabase/rides';

// Data now fetched from Supabase

import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../supabase/client';

export default function AvailableRidesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [rides, setRides] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            // Fetch real profiles with role = 'driver' and join their vehicles!
            const { data: driverData, error: driverErr } = await supabase
                .from('profiles')
                .select('*, vehicles(*)')
                .eq('role', 'driver');
            
            let fetchedRides = [];
            if (driverData && driverData.length > 0) {
                fetchedRides = driverData.map(driver => {
                    const vehicle = driver.vehicles && driver.vehicles[0];
                    return {
                        id: driver.id,
                        name: vehicle?.model || 'Premium Sedan',
                        type: vehicle?.type || 'sedan',
                        plate_number: vehicle?.plate_number || 'MH-12-AB-3456',
                        color: vehicle?.color || 'White',
                        driver_id: driver.id,
                        driver_name: driver.full_name || 'Driver',
                        driver_phone: driver.phone_number || '',
                        estimated_arrival: '4 min',
                        image_url: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg'
                    };
                });
            }

            // Fallback: If no drivers are registered in the DB yet, populate beautiful mock vehicles
            if (fetchedRides.length === 0) {
                fetchedRides = [
                    {
                        id: 'dummy-driver-1',
                        name: 'Toyota Prius',
                        type: 'hybrid',
                        plate_number: 'KA-03-MX-7777',
                        color: 'Silver',
                        driver_id: 'dummy-driver-1',
                        driver_name: 'Amit Kumar',
                        driver_phone: '+91 9900881122',
                        estimated_arrival: '3 min',
                        image_url: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg'
                    },
                    {
                        id: 'dummy-driver-2',
                        name: 'Honda Civic',
                        type: 'sedan',
                        plate_number: 'KA-05-ZZ-9999',
                        color: 'Black',
                        driver_id: 'dummy-driver-2',
                        driver_name: 'Rajesh Patel',
                        driver_phone: '+91 9888223344',
                        estimated_arrival: '6 min',
                        image_url: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg'
                    }
                ];
            }

            setRides(fetchedRides);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = (ride: any) => {
        router.push({
            pathname: '/booking/vehicle-details',
            params: { 
                name: ride.name,
                type: ride.type,
                plate_number: ride.plate_number,
                color: ride.color,
                driver_id: ride.driver_id,
                driver_name: ride.driver_name,
                driver_phone: ride.driver_phone,
                pickup: params.pickup,
                destination: params.destination
            }
        });
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Available cars for ride">
            <View style={styles.content}>
                <Text style={styles.countText}>{rides.length} cars found</Text>
                <FlatList
                    data={rides}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.info}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.type}>{item.type || 'Standard'}</Text>
                                    <View style={styles.distanceRow}>
                                        <Ionicons name="location" size={14} color={COLORS.primaryDark} />
                                        <Text style={styles.distance}>{item.estimated_arrival || '4 min'} away</Text>
                                    </View>
                                </View>
                                <Image source={{ uri: item.image_url || 'https://via.placeholder.com/150' }} style={styles.carImage} resizeMode="cover" />
                            </View>

                            <View style={styles.actions}>
                                <CustomButton
                                    title="Book later"
                                    onPress={() => { }}
                                    variant="outline"
                                    style={styles.halfButton}
                                />
                                <CustomButton
                                    title="Ride Now"
                                    onPress={() => handleBookNow(item)}
                                    style={styles.halfButton}
                                />
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={() => !loading && (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: '#6B7280' }}>No vehicles available right now</Text>
                        </View>
                    )}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingVertical: 20,
    },
    countText: {
        fontSize: 14,
        color: '#9CA3AF',
        paddingHorizontal: SIZES.padding,
        marginBottom: 15,
    },
    list: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    type: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    distance: {
        fontSize: 12,
        color: '#6B7280',
    },
    carImage: {
        width: 100,
        height: 60,
        borderRadius: 8,
    },
    viewList: {
        alignItems: 'center',
        marginBottom: 15,
    },
    viewListText: {
        color: COLORS.primaryDark,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    halfButton: {
        flex: 1,
        height: 48,
    },
});
