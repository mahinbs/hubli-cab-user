import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeMap from '../../src/components/map/HomeMap';
import Sidebar from '../../src/components/ui/Sidebar';
import { COLORS, SIZES } from '../../src/constants/colors';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [region, setRegion] = useState<any>(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        })();
    }, []);

    return (
        <View style={styles.container}>
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            {/* Full Screen Map */}
            <View style={styles.mapContainer}>
                <HomeMap region={region} />
                <View style={styles.overlay} />
            </View>
...

            {/* Top Bar */}
            <View style={[styles.topBar, { top: insets.top + 10 }]}>
                <TouchableOpacity style={styles.topButton} onPress={() => setIsSidebarOpen(true)}>
                    <Ionicons name="menu" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View style={styles.topRightActions}>
                    <TouchableOpacity style={styles.topButton}>
                        <Ionicons name="notifications-outline" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topButton}>
                        <Ionicons name="search-outline" size={24} color="#1F2937" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Action Area */}
            <View style={styles.bottomCardContainer}>
                <TouchableOpacity style={styles.rentalButton} activeOpacity={0.9}>
                    <Text style={styles.rentalText}>Rental</Text>
                    <Ionicons name="add-circle" size={20} color={COLORS.primaryDark} />
                </TouchableOpacity>

                <View style={styles.mainCard}>
                    <TouchableOpacity
                        style={styles.searchBox}
                        onPress={() => router.push('/booking')}
                    >
                        <Ionicons name="search" size={22} color={COLORS.primaryDark} style={styles.searchIcon} />
                        <Text style={styles.placeholderText}>Where would you go?</Text>
                        <Ionicons name="heart-outline" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    mapContainer: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    topBar: {
        position: 'absolute',
        left: SIZES.padding,
        right: SIZES.padding,
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    topRightActions: {
        flexDirection: 'row',
        gap: 12,
    },
    topButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    bottomCardContainer: {
        position: 'absolute',
        bottom: 30,
        left: SIZES.padding,
        right: SIZES.padding,
        zIndex: 10,
    },
    rentalButton: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    rentalText: {
        fontWeight: '700',
        color: '#1F2937',
        fontSize: 16,
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: SIZES.padding,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        height: 56,
        paddingHorizontal: 16,
    },
    searchIcon: {
        marginRight: 12,
    },
    placeholderText: {
        flex: 1,
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '500',
    },
});
