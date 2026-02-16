import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';

const RIDES = [
    { id: '1', name: 'BMW Cabrio', type: 'Automatic | 3 seats | Octane', distance: '800m (5mins away)', image: 'https://img.freepik.com/free-photo/view-luxurious-white-car_23-2149021430.jpg' },
    { id: '2', name: 'Mustang Shelby GT', type: 'Automatic | 2 seats | Octane', distance: '800m (5mins away)', image: 'https://img.freepik.com/free-photo/modern-luxury-car-white_23-2148906323.jpg' },
    { id: '3', name: 'BMW i8', type: 'Automatic | 2 seats | Octane', distance: '800m (5mins away)', image: 'https://img.freepik.com/free-photo/fancy-car-outdoor_23-2149303534.jpg' },
    { id: '4', name: 'Jaguar Silber', type: 'Automatic | 4 seats | Octane', distance: '800m (5mins away)', image: 'https://img.freepik.com/free-photo/silver-luxury-sedan-road_114579-5036.jpg' },
];

export default function AvailableRidesScreen() {
    const router = useRouter();

    const handleBookNow = (ride: any) => {
        router.push({
            pathname: '/booking/vehicle-details',
            params: { name: ride.name }
        });
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Available cars for ride">
            <View style={styles.content}>
                <Text style={styles.countText}>{RIDES.length} cars found</Text>
                <FlatList
                    data={RIDES}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.info}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.type}>{item.type}</Text>
                                    <View style={styles.distanceRow}>
                                        <Ionicons name="location" size={14} color={COLORS.primaryDark} />
                                        <Text style={styles.distance}>{item.distance}</Text>
                                    </View>
                                </View>
                                <Image source={{ uri: item.image }} style={styles.carImage} resizeMode="cover" />
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
