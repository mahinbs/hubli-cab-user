import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import CustomInput from '../../src/components/ui/CustomInput';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [accepted, setAccepted] = useState(false);

    const handleSignUp = () => {
        router.push('/auth/otp');
    };

    const CountryPrefix = () => (
        <View style={styles.prefixContainer}>
            <Text style={styles.flag}>🇧🇩</Text>
            <Text style={styles.prefix}>+880</Text>
            <View style={styles.divider} />
        </View>
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
                        placeholder="Your mobile number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        leftComponent={<CountryPrefix />}
                    />
                    <CustomInput
                        placeholder="Gender"
                        value={gender}
                        onPress={() => { }} // Dropdown behavior
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

                    <CustomButton
                        title="Sign Up"
                        onPress={handleSignUp}
                        style={styles.button}
                    />

                    <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>or</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-apple" size={24} color="#000000" />
                        </TouchableOpacity>
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
    flag: {
        fontSize: 20,
        marginRight: 5,
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
});
