import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../../src/components/ui/CustomButton';
import ScreenWrapper from '../../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../../src/constants/colors';

export default function ForgotPasswordMethodScreen() {
    const router = useRouter();
    const [method, setMethod] = useState<'sms' | 'email'>('sms');

    const handleContinue = () => {
        router.push({
            pathname: '/auth/forgot-password/input',
            params: { method }
        });
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Forgot Password">
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Select which contact details should we use to reset your password</Text>
                </View>

                <View style={styles.methods}>
                    <TouchableOpacity
                        style={[styles.methodCard, method === 'sms' && styles.selectedCard]}
                        onPress={() => setMethod('sms')}
                    >
                        <View style={styles.iconBox}>
                            <Ionicons name="chatbox-outline" size={30} color={COLORS.primaryDark} />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodLabel}>Via SMS</Text>
                            <Text style={styles.methodValue}>***** ***70</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.methodCard, method === 'email' && styles.selectedCard]}
                        onPress={() => setMethod('email')}
                    >
                        <View style={styles.iconBox}>
                            <Ionicons name="mail-outline" size={30} color={COLORS.primaryDark} />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodLabel}>Via Email</Text>
                            <Text style={styles.methodValue}>**** **** **** xyz@xyz.com</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <CustomButton
                    title="Continue"
                    onPress={handleContinue}
                    style={styles.button}
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
        padding: 30,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    methods: {
        gap: 20,
        marginBottom: 60,
    },
    methodCard: {
        flexDirection: 'row',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    selectedCard: {
        borderColor: COLORS.primaryDark,
        backgroundColor: '#FFFBEB',
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FEF9C3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    methodInfo: {
        flex: 1,
    },
    methodLabel: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 4,
    },
    methodValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    button: {
        marginTop: 10,
    },
});
