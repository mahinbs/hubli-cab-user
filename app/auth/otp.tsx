import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import CustomInput from '../../src/components/ui/CustomInput';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';

const CountdownTimer = () => {
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
                {timer > 0 ? `Resend code in ${timer}s` : "Didn't receive code?"}
            </Text>
            {timer === 0 && (
                <Text style={styles.resendLink} onPress={() => setTimer(30)}>Resend</Text>
            )}
        </View>
    );
};

const OTPHeader = ({ phone }: { phone: string | string[] | undefined }) => (
    <View style={styles.header}>
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.subtitle}>Enter the code sent to {phone || 'your number'}</Text>
    </View>
);

export default function OTPScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { phone } = params;

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerifyOTP = () => {
        if (otp.length !== 4) {
            setError('Please enter a valid 4-digit OTP');
            return;
        }
        setError('');
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)');
        }, 1500);
    };

    return (
        <ScreenWrapper style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                    style={styles.content}
                >
                    <OTPHeader phone={phone} />

                    <View style={styles.form}>
                        <CustomInput
                            label="OTP"
                            placeholder="1234"
                            keyboardType="number-pad"
                            maxLength={4}
                            value={otp}
                            onChangeText={(text) => {
                                setOtp(text);
                                if (error) setError('');
                            }}
                            error={error}
                            iconName="key-outline"
                            style={styles.otpInput}
                        />

                        <CountdownTimer />

                        <CustomButton
                            title="Verify"
                            onPress={handleVerifyOTP}
                            isLoading={loading}
                            style={styles.button}
                            disabled={otp.length !== 4}
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
    },
    content: {
        flex: 1,
        padding: SIZES.padding,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#6B7280',
    },
    form: {
        width: '100%',
    },
    otpInput: {
        letterSpacing: 10,
        textAlign: 'center',
        fontSize: 24,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    resendText: {
        color: '#6B7280',
    },
    resendLink: {
        color: COLORS.primaryDark,
        fontWeight: 'bold',
        marginLeft: 5
    },
    button: {
        marginTop: 10,
    },
});
