import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

export default function AddMoneyScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('450');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        setShowSuccess(true);
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Amount">
            <View style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Payment Method</Text>
                    <TouchableOpacity style={styles.dropdown}>
                        <Text style={styles.dropdownText}>Visa</Text>
                        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Account Number</Text>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter account number"
                            value="**** **** **** 8970"
                            editable={false}
                        />
                        <View style={styles.crossIcon}>
                            <Ionicons name="close-outline" size={30} color={COLORS.primaryDark} />
                        </View>
                    </View>
                </View>

                <CustomButton
                    title="Save Payment Method"
                    onPress={handleSave}
                    style={styles.saveBtn}
                />
            </View>

            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeModal} onPress={() => setShowSuccess(false)}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>

                        <View style={styles.successCircle}>
                            <Ionicons name="checkmark" size={50} color={COLORS.success} />
                        </View>

                        <Text style={styles.modalTitle}>Add Success</Text>
                        <Text style={styles.modalDesc}>Your money has been add successfully</Text>

                        <Text style={styles.amountLabel}>Amount</Text>
                        <Text style={styles.amountValue}>${amount}</Text>

                        <CustomButton
                            title="Back Home"
                            onPress={() => router.replace('/(tabs)/wallet')}
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
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 10,
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
    },
    dropdownText: {
        fontSize: 15,
        color: '#1F2937',
    },
    inputBox: {
        position: 'relative',
    },
    input: {
        height: 56,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1F2937',
    },
    crossIcon: {
        position: 'absolute',
        top: -40,
        alignSelf: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: COLORS.primary + '20',
        zIndex: 10,
    },
    saveBtn: {
        marginTop: 20,
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
        marginBottom: 10,
    },
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.success + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalDesc: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 25,
    },
    amountLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    amountValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 30,
    },
    modalButton: {
        width: '100%',
    },
});
