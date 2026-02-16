import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

export default function PaymentSummaryScreen() {
    const router = useRouter();
    const { name } = useLocalSearchParams();

    const carName = name as string || 'Mustang Shelby GT';

    return (
        <ScreenWrapper style={styles.container} showHeader title="Payment">
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.carRow}>
                    <View style={styles.carInfo}>
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
                        <Text style={styles.chargeLabel}>{carName.split(' ')[0]}/per hours</Text>
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
                    <View style={styles.divider} />
                    <View style={styles.chargeRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>$215</Text>
                    </View>
                </View>

                <View style={styles.paymentSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Select payment method</Text>
                        <CustomButton
                            title="View All"
                            variant="text"
                            onPress={() => router.push('/booking/payment-method')}
                            textStyle={styles.viewAllText}
                            style={styles.viewAllBtn}
                        />
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
                    onPress={() => router.push('/booking/feedback')}
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
    carRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        marginBottom: 25,
    },
    carInfo: {
        // Just for reference
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
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
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
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 15,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
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
    viewAllBtn: {
        padding: 0,
        height: 'auto',
    },
    viewAllText: {
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
