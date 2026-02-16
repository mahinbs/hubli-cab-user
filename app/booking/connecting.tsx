import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';

const { width } = Dimensions.get('window');

const PulseParams = {
    start: 0,
    end: 1,
    duration: 2000
};

export default function ConnectingScreen() {
    const router = useRouter();
    const pulse = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
            -1,
            false
        );

        // Simulate 2s delay to find driver
        const timer = setTimeout(() => {
            router.replace('/booking/ride_confirmed');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(pulse.value, [0, 1], [0.8, 1.5]);
        const opacity = interpolate(pulse.value, [0, 1], [0.8, 0]);
        return {
            transform: [{ scale }],
            opacity
        };
    });

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.content}>
                <View style={styles.pulseContainer}>
                    <Animated.View style={[styles.pulseCircle, animatedStyle]} />
                    <View style={styles.centerCircle}>
                        <Ionicons name="car-sport" size={50} color={COLORS.primary} />
                    </View>
                </View>

                <Text style={styles.title}>Connecting...</Text>
                <Text style={styles.subtitle}>Finding the best driver for you</Text>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        alignItems: 'center'
    },
    pulseContainer: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },
    pulseCircle: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: COLORS.primaryDark,
        opacity: 0.5
    },
    centerCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.primary
    },
    title: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10
    },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.body
    }
});
