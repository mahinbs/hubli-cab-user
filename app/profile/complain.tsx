import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';

export default function ComplainScreen() {
    const router = useRouter();
    const [complain, setComplain] = useState('');
    const [reason, setReason] = useState('Vehicle not clean');
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = () => {
        setShowSuccess(true);
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Complain">
            <View style={styles.content}>
                <TouchableOpacity style={styles.dropdown}>
                    <Text style={styles.dropdownText}>{reason}</Text>
                    <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <TextInput
                    style={styles.textArea}
                    placeholder="Write your complain here (minimum 10 characters)"
                    value={complain}
                    onChangeText={setComplain}
                    multiline
                    numberOfLines={6}
                />

                <CustomButton
                    title="Submit"
                    onPress={handleSubmit}
                    style={styles.submitBtn}
                    disabled={complain.length < 10}
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

                        <Text style={styles.modalTitle}>Send successful</Text>
                        <Text style={styles.modalDesc}>Your complain has been send successful</Text>

                        <CustomButton
                            title="Back Home"
                            onPress={() => router.replace('/(tabs)/account')}
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
        padding: SIZES.padding,
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
        marginBottom: 20,
    },
    dropdownText: {
        fontSize: 15,
        color: '#1F2937',
    },
    textArea: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        height: 150,
        textAlignVertical: 'top',
        fontSize: 15,
        color: '#1F2937',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 30,
    },
    submitBtn: {
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
        marginBottom: 30,
    },
    modalButton: {
        width: '100%',
    },
});
