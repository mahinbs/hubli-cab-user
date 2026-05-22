import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import HomeMap from '../../src/components/map/HomeMap';
import CustomButton from '../../src/components/ui/CustomButton';
import { COLORS, SIZES } from '../../src/constants/colors';
import { VEHICLE_TYPES } from '../../src/constants/mockData';
import { createRide } from '../../supabase/rides';
import { useAuthStore } from '../../store/authStore';

const { height } = Dimensions.get('window');

export default function RoutePreviewScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { destination } = params;
    const { session } = useAuthStore();

    const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_TYPES[0].id);
    const [loading, setLoading] = useState(false);

    const handleBookRide = async () => {
        if (!session?.user) {
            router.push('/auth/login');
            return;
        }

        setLoading(true);
        try {
            const vehicle = VEHICLE_TYPES.find(v => v.id === selectedVehicle);
            const rideData = {
                rider_id: session.user.id,
                vehicle_type_id: selectedVehicle,
                pickup_address: 'Current Location', // This should be dynamic based on user selection
                destination_address: destination || 'Unknown Destination',
                status: 'pending',
                estimated_fare: vehicle?.baseFare || 0
            };
            const newRide = await createRide(rideData);
            router.push({ pathname: '/booking/connecting', params: { rideId: newRide.id } });
        } catch (error) {
            console.error('Failed to create ride:', error);
            // Optionally show error to user
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Map Background (Simulate Route View) */}
            <View style={styles.mapContainer}>
                <HomeMap />

                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Vehicle Selection Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <Text style={styles.sheetTitle}>Choose a ride to {destination}</Text>

                <FlatList
                    data={VEHICLE_TYPES}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.vehicleList}
                    renderItem={({ item }) => {
                        const isSelected = selectedVehicle === item.id;
                        return (
                            <TouchableOpacity
                                style={[styles.vehicleItem, isSelected && styles.selectedVehicle]}
                                onPress={() => setSelectedVehicle(item.id)}
                                activeOpacity={0.7}
                            >
                                {/* Placeholder Image */}
                                <View style={styles.vehicleImagePlaceholder}>
                                    <Ionicons name="car-sport" size={32} color={isSelected ? COLORS.primary : COLORS.textMuted} />
                                </View>

                                <Text style={[styles.vehicleName, isSelected && styles.selectedText]}>{item.name}</Text>
                                <Text style={styles.vehiclePrice}>₹{item.baseFare}</Text>
                                <Text style={styles.vehicleEta}>{item.eta}</Text>
                            </TouchableOpacity>
                        );
                    }}
                />

                {/* Payment Method & Promo (Simplified) */}
                <View style={styles.paymentRow}>
                    <View style={styles.paymentMethod}>
                        <Ionicons name="cash-outline" size={20} color={COLORS.success} />
                        <Text style={styles.paymentText}>Cash</Text>
                    </View>
                    <Text style={styles.promoText}>Promo Code</Text>
                </View>

                <CustomButton
                    title={`Confirm ${VEHICLE_TYPES.find(v => v.id === selectedVehicle)?.name}`}
                    onPress={handleBookRide}
                    style={styles.bookButton}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mapContainer: {
        height: height * 0.55,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: '#000',
        elevation: 5
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: SIZES.padding,
        marginTop: -20, // Overlap map slightly
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 20,
    },
    sheetTitle: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
        textAlign: 'center'
    },
    vehicleList: {
        paddingBottom: 20,
    },
    vehicleItem: {
        width: 100,
        height: 130,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: SIZES.radius,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
        padding: 10
    },
    selectedVehicle: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(212, 175, 55, 0.1)' // faint gold bg
    },
    vehicleImagePlaceholder: {
        marginBottom: 10
    },
    vehicleName: {
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        fontSize: SIZES.body
    },
    selectedText: {
        color: COLORS.primary
    },
    vehiclePrice: {
        color: COLORS.text,
        fontWeight: 'bold',
        marginTop: 4
    },
    vehicleEta: {
        color: COLORS.textMuted,
        fontSize: SIZES.caption,
        marginTop: 2
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.surfaceLight,
        paddingTop: 15
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    paymentText: {
        color: COLORS.text,
        marginLeft: 5,
        fontWeight: '600'
    },
    promoText: {
        color: COLORS.primary,
        fontWeight: '600'
    },
    bookButton: {
        marginBottom: 20
    }
});
