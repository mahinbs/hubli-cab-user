import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeMap from '../../src/components/map/HomeMap';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

export default function SelectAddressScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [pickup, setPickup] = useState('Current location');
    const [destination, setDestination] = useState(params.name as string || 'Select destination');
    const insets = useSafeAreaInsets();

    const handleConfirm = () => {
        router.push('/booking/transport-selection');
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.mapContainer}>
                <HomeMap />
                <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.title}>Select address</Text>
                </View>

                <View style={styles.addressInputs}>
                    <View style={styles.inputRow}>
                        <Ionicons name="location" size={20} color={COLORS.primaryDark} />
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Pickup</Text>
                            <Text style={styles.value}>{pickup}</Text>
                        </View>
                    </View>
                    <View style={styles.verticalLine} />
                    <View style={styles.inputRow}>
                        <Ionicons name="pin" size={20} color="#EF4444" />
                        <View style={styles.inputBox}>
                            <Text style={styles.label}>Destination</Text>
                            <Text style={styles.value}>{destination}</Text>
                        </View>
                    </View>
                </View>

                <CustomButton
                    title="Confirm Location"
                    onPress={handleConfirm}
                    style={styles.button}
                />
            </View>
        </ScreenWrapper>
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
    backButton: {
        position: 'absolute',
        left: 20,
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
    card: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    addressInputs: {
        marginBottom: 30,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    inputBox: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    label: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    verticalLine: {
        width: 1.5,
        height: 20,
        backgroundColor: '#E5E7EB',
        marginLeft: 25,
        marginVertical: 4,
    },
    button: {
        width: '100%',
    },
});
