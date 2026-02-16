import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

const METHODS = [
    { id: '1', name: 'Visa', number: '**** **** **** 8970', expiry: '12/26', icon: 'card' },
    { id: '2', name: 'Mastercard', number: '**** **** **** 8970', expiry: '12/26', icon: 'card' },
    { id: '3', name: 'My Wallet', balance: '$349', icon: 'wallet' },
    { id: '4', name: 'Cash', icon: 'cash' },
    { id: '5', name: 'PayPal', detail: 'mailaddress@gmail.com', icon: 'logo-paypal' },
    { id: '6', name: 'Google Pay', icon: 'logo-google' },
    { id: '7', name: 'Phone Pay', icon: 'call' },
];

export default function PaymentMethodScreen() {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState('1');

    return (
        <ScreenWrapper style={styles.container} showHeader title="Select payment method">
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.subtitle}>Select payment method you want to use</Text>

                {METHODS.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[styles.methodCard, selectedMethod === method.id && styles.selectedCard]}
                        onPress={() => setSelectedMethod(method.id)}
                    >
                        <View style={styles.methodInfo}>
                            <Ionicons name={method.icon as any} size={24} color={selectedMethod === method.id ? COLORS.primaryDark : "#6B7280"} />
                            <View>
                                <Text style={styles.methodName}>{method.name}</Text>
                                {method.number && (
                                    <View>
                                        <Text style={styles.methodDetail}>{method.number}</Text>
                                        <Text style={styles.expiryText}>Expires: {method.expiry}</Text>
                                    </View>
                                )}
                                {method.balance && <Text style={styles.methodDetail}>{method.balance}</Text>}
                                {method.detail && <Text style={styles.methodDetail}>{method.detail}</Text>}
                            </View>
                        </View>
                        <Ionicons
                            name={selectedMethod === method.id ? "radio-button-on" : "radio-button-off"}
                            size={22}
                            color={selectedMethod === method.id ? COLORS.primaryDark : "#E5E7EB"}
                        />
                    </TouchableOpacity>
                ))}

                <CustomButton
                    title="Confirm Ride"
                    onPress={() => router.back()}
                    style={styles.confirmButton}
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
        padding: 20,
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 25,
    },
    methodCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 12,
    },
    selectedCard: {
        borderColor: COLORS.primaryDark,
        backgroundColor: COLORS.primary + '05',
    },
    methodInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        flex: 1,
    },
    methodName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    methodDetail: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    expiryText: {
        fontSize: 11,
        color: '#D1D5DB',
    },
    confirmButton: {
        marginTop: 30,
        width: '100%',
    },
});
