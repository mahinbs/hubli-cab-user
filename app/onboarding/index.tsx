import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ViewToken, useWindowDimensions } from 'react-native';
import Animated, { Extrapolate, SharedValue, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const SLIDES: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Welcome to HubliCab',
        description: 'Your localized ride-hailing app. Fast, secure, and intuitive cab booking across the city.',
        icon: 'location-outline',
    },
    {
        id: '2',
        title: 'Fair Fares Everyday',
        description: 'Our revolutionary 10 paise per km commission ensures maximum earnings for drivers and lower fares for you.',
        icon: 'wallet-outline',
    },
    {
        id: '3',
        title: 'Safe & Reliable',
        description: 'Real-time tracking, SOS safety suite, and secure payment options for a worry-free journey.',
        icon: 'shield-checkmark-outline',
    },
];

interface SlideProps {
    item: OnboardingSlide;
    index: number;
    scrollX: SharedValue<number>;
    width: number;
}

const Slide = ({ item, index, scrollX, width }: SlideProps) => {
    const { height } = useWindowDimensions();
    const isSmallHeight = height < 700;

    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0, 1, 0],
            Extrapolate.CLAMP
        );
        const translateY = interpolate(
            scrollX.value,
            inputRange,
            [50, 0, 50],
            Extrapolate.CLAMP
        );
        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    return (
        <View style={[styles.slide, { width }]}>
            <View style={[styles.illustrationContainer, isSmallHeight && { flex: 0.4 }]}>
                <View style={[styles.iconCircle, isSmallHeight && { width: 140, height: 140, borderRadius: 70 }]}>
                    <Ionicons name={item.icon as any} size={isSmallHeight ? 70 : 100} color={COLORS.primaryDark} />
                </View>
            </View>
            <Animated.View style={[styles.textContainer, animatedStyle, isSmallHeight && { flex: 0.4 }]}>
                <Text style={[styles.title, isSmallHeight && { fontSize: 24 }]}>{item.title}</Text>
                <Text style={[styles.description, isSmallHeight && { fontSize: 16, lineHeight: 22 }]}>{item.description}</Text>
            </Animated.View>
        </View>
    );
};

export default function OnboardingScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<FlatList<OnboardingSlide>>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems && viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const handleNext = () => {
        if (currentIndex === SLIDES.length - 1) {
            router.push('/location-permission');
        } else {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }
    };

    const handleSkip = () => {
        router.push('/location-permission');
    };

    const isLastSlide = currentIndex === SLIDES.length - 1;

    return (
        <ScreenWrapper style={styles.wrapper}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <Animated.FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={({ item, index }) => <Slide item={item} index={index} scrollX={scrollX} width={width} />}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                }}
            />

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => {
                        const animatedDotStyle = useAnimatedStyle(() => {
                            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                            const dotWidth = interpolate(
                                scrollX.value,
                                inputRange,
                                [8, 24, 8],
                                Extrapolate.CLAMP
                            );
                            const opacity = interpolate(
                                scrollX.value,
                                inputRange,
                                [0.3, 1, 0.3],
                                Extrapolate.CLAMP
                            );
                            return {
                                width: dotWidth,
                                opacity,
                            };
                        });
                        return (
                            <Animated.View key={index} style={[styles.dot, animatedDotStyle] as any} />
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[styles.nextButtonCircle, isLastSlide && styles.goButton]}
                    onPress={handleNext}
                >
                    {isLastSlide ? (
                        <Text style={styles.goText}>Go</Text>
                    ) : (
                        <Ionicons name="arrow-forward" size={30} color="#1F2937" />
                    )}
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        paddingTop: 20,
        paddingRight: 20,
        alignItems: 'flex-end',
    },
    skipText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    illustrationContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#FEF9C3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 0.3,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 18,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 28,
        paddingHorizontal: 20,
    },
    footer: {
        flex: 0.2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 10,
    },
    pagination: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primaryDark,
        marginHorizontal: 3,
    },
    nextButtonCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 3,
        borderColor: '#FEF08A',
    },
    goButton: {
        width: 120,
        borderRadius: 32,
    },
    goText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
    },
});
