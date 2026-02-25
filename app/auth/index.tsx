import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { SIZES } from '../../src/constants/colors';

export default function WelcomeScreen() {
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/auth/signup');
    };

    const handleLogin = () => {
        router.push('/auth/login');
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.content}>
                <View style={styles.illustrationContainer}>
                    <View style={styles.illustrationPlaceholder}>
                        <Image
                            source={require('../../assets/app-logo/hubliCab-logo.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>Welcome to HubliCab</Text>
                    <Text style={styles.subtitle}>A seamless and affordable ride experience.</Text>
                </View>

                <View style={styles.footer}>
                    <CustomButton
                        title="Create an account"
                        onPress={handleSignUp}
                        style={styles.button}
                    />
                    <CustomButton
                        title="Log In"
                        onPress={handleLogin}
                        variant="outline"
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
        justifyContent: 'space-between',
    },
    illustrationContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
    },
    textContainer: {
        alignItems: 'center',
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
        textAlign: 'center',
    },
    footer: {
        width: '100%',
    },
    button: {
        marginBottom: 16,
    },
});
