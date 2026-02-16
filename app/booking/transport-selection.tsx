import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';

const CATEGORIES = [
    { id: 'car', name: 'Car', icon: 'car', type: 'material' },
    { id: 'bike', name: 'Bike', icon: 'motorbike', type: 'material' },
    { id: 'taxi', name: 'Taxi', icon: 'taxi', type: 'material' },
];

interface TransportCategory {
    id: string;
    name: string;
    icon: string;
    type: string;
}

export default function TransportSelectionScreen() {
    const router = useRouter();

    const handleSelect = (category: TransportCategory) => {
        router.push('/booking/available-rides');
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Select transport">
            <View style={styles.content}>
                <Text style={styles.title}>Select your transport</Text>

                <View style={styles.grid}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.card}
                            onPress={() => handleSelect(cat)}
                        >
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name={cat.icon as any} size={50} color="#EF4444" />
                            </View>
                            <Text style={styles.name}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
        padding: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 40,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
    },
    card: {
        width: 140,
        height: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconContainer: {
        marginBottom: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});
