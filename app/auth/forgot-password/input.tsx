import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from '../../../src/components/ui/CustomButton';
import CustomInput from '../../../src/components/ui/CustomInput';
import ScreenWrapper from '../../../src/components/ui/ScreenWrapper';

export default function ForgotPasswordInputScreen() {
    const router = useRouter();
    const { method } = useLocalSearchParams();
    const [value, setValue] = useState('');

    const handleSendOTP = () => {
        router.push('/auth/forgot-password/otp');
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Verification email or phone number">
            <View style={styles.content}>
                <View style={styles.form}>
                    <CustomInput
                        placeholder={method === 'email' ? "Email" : "Phone number"}
                        value={value}
                        onChangeText={setValue}
                        keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
                    />

                    <CustomButton
                        title="Send OTP"
                        onPress={handleSendOTP}
                        style={styles.button}
                    />
                </View>
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
    form: {
        width: '100%',
    },
    button: {
        marginTop: 40,
    },
});
