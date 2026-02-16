import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

const RECENT_PLACES = [
    { id: '1', name: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486', distance: '2.7km', icon: 'briefcase-outline' },
    { id: '2', name: 'Coffee shop', address: '1901 Thornridge Cir. Shiloh, Hawaii 81063', distance: '1.1km', icon: 'cafe-outline' },
    { id: '3', name: 'Shopping center', address: '4140 Parker Rd. Allentown, New Mexico 31134', distance: '4.9km', icon: 'cart-outline' },
    { id: '4', name: 'Shopping mall', address: '4140 Parker Rd. Allentown, New Mexico 31134', distance: '4.9km', icon: 'cart-outline' },
    { id: '5', name: 'Shopping mall', address: '4140 Parker Rd. Allentown, New Mexico 31134', distance: '4.9km', icon: 'cart-outline' },
];

export default function BookingSearchScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const handleSelect = (place) => {
        router.push({
            pathname: '/booking/select-address',
            params: { name: place.name, address: place.address }
        });
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search destination"
                        placeholderTextColor="#9CA3AF"
                        autoFocus
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent places</Text>
                <TouchableOpacity>
                    <Text style={styles.clearAll}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={RECENT_PLACES}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.placeItem} onPress={() => handleSelect(item)}>
                        <View style={styles.iconCircle}>
                            <Ionicons name={item.icon as any} size={20} color="#6B7280" />
                        </View>
                        <View style={styles.placeDetails}>
                            <Text style={styles.placeName}>{item.name}</Text>
                            <Text style={styles.placeAddress} numberOfLines={1}>{item.address}</Text>
                        </View>
                        <Text style={styles.distance}>{item.distance}</Text>
                    </TouchableOpacity>
                )}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 15,
    },
    backButton: {
        padding: 4,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        padding: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    clearAll: {
        fontSize: 14,
        color: COLORS.primaryDark,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    placeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    placeDetails: {
        flex: 1,
    },
    placeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 2,
    },
    placeAddress: {
        fontSize: 13,
        color: '#6B7280',
    },
    distance: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
        marginLeft: 10,
    },
});
