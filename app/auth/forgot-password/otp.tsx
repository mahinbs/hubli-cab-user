import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import CustomButton from '../../../src/components/ui/CustomButton';
import ScreenWrapper from '../../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../../src/constants/colors';

export default function ForgotPasswordOTPScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '']);

    const handleVerify = () => {
        router.replace('/auth/login');
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Forgot Password">
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Code has been send to ***** ***70</Text>
                </View>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={styles.otpInput}
                            value={digit}
                            onChangeText={(v) => {
                                const newOtp = [...otp];
                                newOtp[index] = v;
                                setOtp(newOtp);
                            }}
                            keyboardType="number-pad"
                            maxLength={1}
                        />
                    ))}
                </View>

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive code? </Text>
                    <Text style={styles.resendLink}>Resend again</Text>
                </View>

                <CustomButton
                    title="Verify"
                    onPress={handleVerify}
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
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    otpInput: {
        width: 56,
        height: 56,
        borderWidth: 1.5,
        borderColor: '#EAB308',
        borderRadius: 12,
        backgroundColor: '#FFFBEB',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    resendText: {
        color: '#6B7280',
        fontSize: 16,
    },
    resendLink: {
        color: COLORS.primaryDark,
        fontWeight: '800',
        fontSize: 16,
    },
    button: {
        marginTop: 10,
    },
});
