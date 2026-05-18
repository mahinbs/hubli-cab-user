import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Keyboard, Pressable } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import CustomInput from '../../src/components/ui/CustomInput';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';
import { signIn } from '../../supabase/auth';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            router.replace('/(tabs)/');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Sign in">
            <View style={{ flex: 1 }}>
                <View style={styles.content}>
                    <View style={styles.form}>
                        <CustomInput
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (error) setError('');
                            }}
                            keyboardType="email-address"
                            iconName="mail-outline"
                        />
                        <CustomInput
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (error) setError('');
                            }}
                            secureTextEntry
                            iconName="lock-closed-outline"
                        />
                        <TouchableOpacity style={styles.forgotPassword}><Text style={styles.forgotPasswordText}>Forgot password?</Text></TouchableOpacity>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        <CustomButton
                            title="Sign In"
                            onPress={handleLogin}
                            style={styles.button}
                            isLoading={loading}
                        />
                        <View style={styles.separatorContainer}>
                            <View style={styles.separatorLine} />
                            <Text style={styles.separatorText}>or</Text>
                            <View style={styles.separatorLine} />
                        </View>
                        <View style={styles.socialContainer}>
                            <TouchableOpacity style={styles.socialButton}><Ionicons name="logo-google" size={24} color="#DB4437" /></TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}><Ionicons name="logo-facebook" size={24} color="#4267B2" /></TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}><Ionicons name="logo-apple" size={24} color="#000000" /></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don't have an account? <Text style={styles.footerLink} onPress={() => router.push('/auth/signup')}>Sign up</Text>
                        </Text>
                    </View>
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
    },
    form: {
        marginTop: 20,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: COLORS.primaryDark,
        fontWeight: '700',
        fontSize: 14,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: '600',
    },
    button: {
        marginBottom: 40,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    separatorText: {
        paddingHorizontal: 15,
        color: '#9CA3AF',
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#6B7280',
    },
    footerLink: {
        color: COLORS.primaryDark,
        fontWeight: '800',
    },
});
