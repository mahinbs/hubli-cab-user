import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert, Modal, FlatList, Pressable, Platform } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import CustomInput from '../../src/components/ui/CustomInput';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';
import { signUp } from '../../supabase/auth';

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword || !phone) {
            setError('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!accepted) {
            setError('You must accept the terms of service');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await signUp(email, password, name, phone);
            if (Platform.OS === 'web') {
                alert("Verification Required: Please enter the verification code sent to your email.");
                router.push({
                    pathname: '/auth/otp',
                    params: { email, name, phone, password }
                });
            } else {
                Alert.alert(
                    "Verification Required",
                    "Please enter the verification code sent to your email.",
                    [{ 
                        text: "OK", 
                        onPress: () => router.push({
                            pathname: '/auth/otp',
                            params: { email, name, phone, password }
                        })
                    }]
                );
            }
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const CountryPrefix = () => (
        <View style={styles.prefixContainer}><Text style={styles.prefix}>+91</Text><View style={styles.divider} /></View>
    );

    return (
        <ScreenWrapper style={styles.container} showHeader title="Sign up">
            <View style={styles.content}>
                <View style={styles.form}>
                    <CustomInput
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <CustomInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <CustomInput
                        placeholder="Password"
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
                    <CustomInput
                        placeholder="Your mobile number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        leftComponent={<CountryPrefix />}
                    />
                    <TouchableOpacity
                        style={styles.termsContainer}
                        onPress={() => setAccepted(!accepted)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, accepted && styles.checked]}>
                            {accepted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                        </View>
                        <Text style={styles.termsText}>
                            By signing up, you agree to the <Text style={styles.link}>Terms of service</Text> and <Text style={styles.link}>Privacy policy</Text>.
                        </Text>
                    </TouchableOpacity>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <CustomButton
                        title="Sign Up"
                        onPress={handleSignUp}
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
                        Already have an account? <Text style={styles.footerLink} onPress={() => router.push('/auth/login')}>Sign in</Text>
                    </Text>
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
    prefixContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    prefix: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginRight: 10,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#E5E7EB',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: COLORS.primary,
        marginRight: 12,
        marginTop: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: COLORS.primary,
    },
    termsText: {
        flex: 1,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    link: {
        color: COLORS.primaryDark,
        fontWeight: '700',
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
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: '600',
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
        width: '100%',
        maxWidth: 400,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 20,
        textAlign: 'center',
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    genderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
    },
    genderSelected: {
        color: COLORS.primaryDark,
    }
});
