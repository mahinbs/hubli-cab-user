import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import CustomInput from '../../src/components/ui/CustomInput';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { SIZES } from '../../src/constants/colors';

export default function SetPasswordScreen() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        router.push('/auth/profile');
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Set password">
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Set your password</Text>
                </View>

                <View style={styles.form}>
                    <CustomInput
                        placeholder="Enter Your Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <CustomInput
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <Text style={styles.hint}>
                        Atleast 1 number or a special character
                    </Text>

                    <CustomButton
                        title="Register"
                        onPress={handleRegister}
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
        padding: SIZES.padding,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        color: '#6B7280',
    },
    form: {
        width: '100%',
    },
    hint: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        marginTop: 10,
    },
});
