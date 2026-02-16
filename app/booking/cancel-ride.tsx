import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

const REASONS = [
    'Waiting for long time',
    'Unable to contact driver',
    'Driver denied to go to destination',
    'Driver denied to come to pickup',
    'Wrong address shown',
    'The price is not reasonable',
];

export default function CancelRideScreen() {
    const router = useRouter();
    const [selectedReason, setSelectedReason] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = () => {
        setShowSuccess(true);
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Cancel Taxi">
            <View style={styles.content}>
                <Text style={styles.subtitle}>Please select the reason of cancellation.</Text>

                {REASONS.map((reason, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.reasonRow}
                        onPress={() => setSelectedReason(index)}
                    >
                        <Ionicons
                            name={selectedReason === index ? "checkbox" : "square-outline"}
                            size={24}
                            color={selectedReason === index ? COLORS.success : "#D1D5DB"}
                        />
                        <Text style={[styles.reasonText, selectedReason === index && styles.selectedReasonText]}>
                            {reason}
                        </Text>
                    </TouchableOpacity>
                ))}

                <View style={styles.otherContainer}>
                    <Text style={styles.otherLabel}>Other</Text>
                    <View style={styles.otherInput} />
                </View>

                <CustomButton
                    title="Submit"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                />
            </View>

            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeModal} onPress={() => setShowSuccess(false)}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>

                        <View style={styles.sadEmoji}>
                            <Text style={{ fontSize: 60 }}>😔</Text>
                        </View>

                        <Text style={styles.modalTitle}>We're so sad about your cancellation</Text>
                        <Text style={styles.modalDesc}>
                            We will continue to improve our service & satisfy you on the next trip.
                        </Text>

                        <CustomButton
                            title="Back Home"
                            onPress={() => router.replace('/(tabs)')}
                            style={styles.modalButton}
                        />
                    </View>
                </View>
            </Modal>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    content: {
        padding: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 25,
    },
    reasonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    reasonText: {
        fontSize: 15,
        color: '#6B7280',
    },
    selectedReasonText: {
        color: '#1F2937',
        fontWeight: '600',
    },
    otherContainer: {
        marginTop: 20,
        marginBottom: 40,
    },
    otherLabel: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 10,
    },
    otherInput: {
        height: 50,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    submitButton: {
        width: '100%',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        width: '100%',
    },
    closeModal: {
        alignSelf: 'flex-end',
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    sadEmoji: {
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    modalDesc: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    modalButton: {
        width: '100%',
    },
});
