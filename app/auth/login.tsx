import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import CustomInput from '../../src/components/ui/CustomInput';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { SIZES } from '../../src/constants/colors';

export default function LoginScreen() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = () => {
        if (phoneNumber.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }
        setError('');
        setLoading(true);

        // Simulate API Call
        setTimeout(() => {
            setLoading(false);
            router.push({ pathname: '/auth/otp', params: { phone: phoneNumber } });
        }, 1500);
    };

    return (
        <ScreenWrapper style={styles.container}>
            <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Enter your mobile number to login</Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            label="Mobile Number"
                            placeholder="9876543210"
                            keyboardType="number-pad"
                            maxLength={10}
                            value={phoneNumber}
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                                if (error) setError('');
                            }}
                            error={error}
                            iconName="call-outline"
                        />

                        <CustomButton
                            title="Get OTP"
                            onPress={handleSendOTP}
                            isLoading={loading}
                            style={styles.button}
                            disabled={phoneNumber.length !== 10}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Pressable>
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
        lineHeight: 26,
    },
    form: {
        width: '100%',
    },
    button: {
        marginTop: 20,
    },
});
