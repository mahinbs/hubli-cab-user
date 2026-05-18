import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

const SPECS = [
    { id: '1', label: 'Max power', value: '250hp', icon: 'flash' },
    { id: '2', label: 'Fuel', value: '10km per litre', icon: 'water' },
    { id: '3', label: 'Max speed', value: '230kph', icon: 'speedometer' },
    { id: '4', label: '0-60mph', value: '4.5sec', icon: 'timer' },
];

const FEATURES = [
    { label: 'Model', value: 'GT5000' },
    { label: 'Capacity', value: '760hp' },
    { label: 'Color', value: 'Red' },
    { label: 'Fuel type', value: 'Octane' },
    { label: 'Gear type', value: 'Automatic' },
];

export default function VehicleDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { name, type, plate_number, color, driver_id, driver_name, driver_phone, pickup, destination } = params;

    const carName = name as string || 'Premium Sedan';

    // Build specs and features dynamically if they were passed
    const dynamicFeatures = [
        { label: 'Model', value: (name as string) || 'Premium Ride' },
        { label: 'License Plate', value: (plate_number as string) || 'KA-01-AB-1234' },
        { label: 'Color', value: (color as string) || 'White' },
        { label: 'Gear type', value: 'Automatic' },
        { label: 'Capacity', value: '4 Passengers' }
    ];

    const handleRideNow = () => {
        router.push({
            pathname: '/booking/confirmation',
            params: { 
                name: carName,
                type: (type as string) || 'sedan',
                plate_number: (plate_number as string) || 'KA-01-AB-1234',
                color: (color as string) || 'White',
                driver_id: (driver_id as string) || '',
                driver_name: (driver_name as string) || 'Amit Kumar',
                driver_phone: (driver_phone as string) || '',
                pickup: (pickup as string) || 'Current Location',
                destination: (destination as string) || 'Office'
            }
        });
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title={carName}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color={COLORS.primaryDark} />
                    <Text style={styles.ratingText}>4.9 (531 reviews)</Text>
                </View>

                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.arrowButton}>
                        <Ionicons name="chevron-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg' }}
                        style={styles.carImage}
                        resizeMode="contain"
                    />
                    <TouchableOpacity style={styles.arrowButton}>
                        <Ionicons name="chevron-forward" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Specifications</Text>
                <View style={styles.specsGrid}>
                    {SPECS.map(spec => (
                        <View key={spec.id} style={styles.specItem}>
                            <Ionicons name={spec.icon as any} size={20} color={COLORS.primaryDark} />
                            <Text style={styles.specValue}>{spec.value}</Text>
                            <Text style={styles.specLabel}>{spec.label}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Car features</Text>
                <View style={styles.featuresCard}>
                    {dynamicFeatures.map((feature, index) => (
                        <View key={feature.label} style={[styles.featureRow, index === dynamicFeatures.length - 1 && styles.noBorder]}>
                            <Text style={styles.featureLabel}>{feature.label}</Text>
                            <Text style={styles.featureValue}>{feature.value}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.bottomActions}>
                    <CustomButton
                        title="Book later"
                        variant="outline"
                        onPress={() => { }}
                        style={styles.halfButton}
                    />
                    <CustomButton
                        title="Ride Now"
                        onPress={handleRideNow}
                        style={styles.halfButton}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
    },
    ratingText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    carImage: {
        width: 250,
        height: 150,
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 15,
    },
    specsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    specItem: {
        width: 75,
        height: 85,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    specValue: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 6,
    },
    specLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: 2,
    },
    featuresCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 30,
    },
    featureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    featureLabel: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    featureValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
    bottomActions: {
        flexDirection: 'row',
        gap: 15,
    },
    halfButton: {
        flex: 1,
    },
});
