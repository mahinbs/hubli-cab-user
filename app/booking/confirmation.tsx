import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';
import { createRide } from '../../supabase/rides';
import { supabase } from '../../supabase/client';
import { Alert } from 'react-native';

export default function BookingConfirmationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { name, type, plate_number, color, driver_id, driver_name, driver_phone, pickup, destination } = params;

    const carName = name as string || 'Standard Ride';
    const [loading, setLoading] = React.useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert("Error", "You must be logged in to book a ride");
                router.push('/auth/login');
                return;
            }

            // Insert dynamic ride linked to real registered driver details
            const ride = await createRide({
                rider_id: user.id,
                driver_id: driver_id && !driver_id.includes('dummy') ? driver_id : null,
                vehicle_type_id: type || 'sedan',
                pickup_address: pickup || 'Current location',
                destination_address: destination || 'Office',
                pickup_latitude: 18.5204, 
                pickup_longitude: 73.8567,
                destination_latitude: 18.5204,
                destination_longitude: 73.8567,
                status: 'pending',
                estimated_fare: 150,
                final_fare: 150,
                payment_method: 'Connected Wallet',
                payment_status: 'unpaid',
                otp: Math.floor(1000 + Math.random() * 9000).toString(), // Live verification OTP like Uber/Ola
            });

            router.push({
                pathname: '/booking/connecting',
                params: { 
                    rideId: ride.id,
                    car_name: carName,
                    plate_number: plate_number || 'KA 01 AB 1234',
                    color: color || 'White',
                    driver_name: driver_name || 'Amit Kumar',
                    driver_phone: driver_phone || ''
                }
            });
        } catch (error: any) {
            console.error('Ride creation failed:', error);
            Alert.alert("Booking Failed", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Request for rent">
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.locationCard}>
                    <View style={styles.locationItem}>
                        <Ionicons name="location" size={20} color={COLORS.primaryDark} />
                        <View>
                            <Text style={styles.label}>Pickup location</Text>
                            <Text style={styles.value} numberOfLines={2}>{pickup || "Current Location"}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.locationItem}>
                        <Ionicons name="pin" size={20} color="#EF4444" />
                        <View>
                            <Text style={styles.label}>Destination</Text>
                            <Text style={styles.value} numberOfLines={2}>{destination || "Office"}</Text>
                        </View>
                        <Text style={styles.distance}>1.5km</Text>
                    </View>
                </View>

                <View style={styles.carCard}>
                    <View style={styles.cardInfo}>
                        <Text style={styles.carName}>{carName}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color={COLORS.primaryDark} />
                            <Text style={styles.ratingText}>4.9 (531 reviews)</Text>
                        </View>
                    </View>
                    <Image
                        source={{ uri: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg' }}
                        style={styles.carImage}
                    />
                </View>

                <View style={styles.chargeSection}>
                    <Text style={styles.sectionTitle}>Charge</Text>
                    <View style={styles.chargeRow}>
                        <Text style={styles.chargeLabel}>Mustang/per hours</Text>
                        <Text style={styles.chargeValue}>$200</Text>
                    </View>
                    <View style={styles.chargeRow}>
                        <Text style={styles.chargeLabel}>Vat (5%)</Text>
                        <Text style={styles.chargeValue}>$20</Text>
                    </View>
                    <View style={styles.chargeRow}>
                        <Text style={styles.chargeLabel}>Promo Code</Text>
                        <Text style={styles.promoValue}>-$5</Text>
                    </View>
                </View>

                <View style={styles.paymentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Select payment method</Text>
                        <TouchableOpacity onPress={() => router.push('/booking/payment-method')}>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.paymentCard}>
                        <View style={styles.cardInfo}>
                            <Ionicons name="card" size={24} color="#1F2937" />
                            <View>
                                <Text style={styles.cardNumber}>**** **** **** 8970</Text>
                                <Text style={styles.cardExpiry}>Expires: 12/26</Text>
                            </View>
                        </View>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primaryDark} />
                    </View>
                </View>

                <CustomButton
                    title="Confirm Ride"
                    onPress={handleConfirm}
                    style={styles.confirmButton}
                    isLoading={loading}
                />
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: SIZES.padding,
        paddingBottom: 40,
    },
    locationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 20,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    verticalLine: {
        width: 1,
        height: 20,
        backgroundColor: '#E5E7EB',
        marginLeft: 10,
        marginVertical: 4,
    },
    label: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        width: 220,
    },
    distance: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 'auto',
    },
    carCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 16,
        marginBottom: 25,
    },
    carName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#6B7280',
    },
    carImage: {
        width: 100,
        height: 60,
        borderRadius: 8,
    },
    chargeSection: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 15,
    },
    chargeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    chargeLabel: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    chargeValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    promoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#EF4444',
    },
    paymentSection: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    viewAll: {
        fontSize: 14,
        color: COLORS.primaryDark,
        fontWeight: '600',
    },
    paymentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    cardNumber: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    cardExpiry: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    confirmButton: {
        width: '100%',
    },
});
