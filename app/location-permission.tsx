import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HomeMap from '../src/components/map/HomeMap';
import CustomButton from '../src/components/ui/CustomButton';
import { SIZES } from '../src/constants/colors';

export default function LocationPermissionScreen() {
    const router = useRouter();

    const handleAllow = () => {
        // In real app, trigger permission request
        // router.replace('/auth/login');
        router.push('/auth/login');
    };

    const handleSkip = () => {
        router.push('/auth/login');
    };

    return (
        <View style={styles.container}>
            {/* Map Background (Blurry/Dimmed) */}
            <View style={styles.mapBackground}>
                <HomeMap />
                <View style={styles.overlay} />
            </View>

            {/* Permission Card */}
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <View style={styles.iconCircle}>
                        <View style={styles.dot} />
                    </View>

                    <Text style={styles.title}>Enable your location</Text>
                    <Text style={styles.description}>
                        Choose your location to start find the request around you
                    </Text>

                    <CustomButton
                        title="Use my location"
                        onPress={handleAllow}
                        style={styles.button}
                    />

                    <Text style={styles.skipLink} onPress={handleSkip}>
                        Skip for now
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    mapBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    card: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 30,
        padding: SIZES.padding,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEF9C3', // light yellow
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FACC15',
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    button: {
        marginBottom: 20,
    },
    skipLink: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '600',
    }
});
