import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS } from '../../src/constants/colors';

const TIPS = ['$1', '$2', '$5', '$10', '$20'];

export default function FeedbackScreen() {
    const router = useRouter();
    const [rating, setRating] = useState(5);
    const [selectedTip, setSelectedTip] = useState('$2');
    const [showFinal, setShowFinal] = useState(false);

    const handleSubmit = () => {
        setShowFinal(true);
    };

    if (showFinal) {
        return (
            <ScreenWrapper style={styles.container} showHeader title="Payment">
                <View style={styles.finalContent}>
                    <View style={styles.successCircle}>
                        <Ionicons name="checkmark" size={60} color={COLORS.success} />
                    </View>
                    <Text style={styles.finalTitle}>Thank you</Text>
                    <Text style={styles.finalDesc}>Thank you for your valuable feedback and tip</Text>
                    <CustomButton
                        title="Back Home"
                        onPress={() => router.replace('/(tabs)/')}
                        style={styles.backHomeBtn}
                    />
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper style={styles.container} showHeader title="Payment">
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.successCard}>
                    <View style={styles.successCircleSmall}>
                        <Ionicons name="checkmark" size={30} color={COLORS.success} />
                    </View>
                    <Text style={styles.successTitle}>Payment Success</Text>
                    <Text style={styles.successDesc}>Your money has been successfully sent to Sergio Ramasis</Text>
                    <Text style={styles.amount}>$215</Text>

                    <Text style={styles.feedbackPrompt}>How is your trip?</Text>
                    <Text style={styles.feedbackSub}>Your feedback will help us to improve your driving experience better</Text>

                    <TouchableOpacity style={styles.feedbackBtn} onPress={() => { }}>
                        <Text style={styles.feedbackBtnText}>Please Feedback</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.ratingSection}>
                    <View style={styles.driverSection}>
                        <Image
                            source={{ uri: 'https://img.freepik.com/free-photo/handsome-young-man-with-new-haircut_273609-12182.jpg' }}
                            style={styles.driverAvatarMini}
                        />
                        <Text style={styles.excellent}>Excellent</Text>
                        <Text style={styles.ratingLabel}>You rated Sergio Ramasis 4 star</Text>

                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                    <Ionicons
                                        name={s <= rating ? "star" : "star-outline"}
                                        size={32}
                                        color={COLORS.primaryDark}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Write your text..."
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.tipTitle}>Give some tips to Sergio Ramasis</Text>
                    <View style={styles.tipsRow}>
                        {TIPS.map((tip) => (
                            <TouchableOpacity
                                key={tip}
                                style={[styles.tipItem, selectedTip === tip && styles.selectedTip]}
                                onPress={() => setSelectedTip(tip)}
                            >
                                <Text style={[styles.tipText, selectedTip === tip && styles.selectedTipText]}>{tip}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.otherAmount}>Enter other amount</Text>
                    </TouchableOpacity>

                    <CustomButton
                        title="Submit"
                        onPress={handleSubmit}
                        style={styles.submitBtn}
                    />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    successCard: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 30,
    },
    successCircleSmall: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.success + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 10,
    },
    successDesc: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    amount: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 25,
    },
    feedbackPrompt: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    feedbackSub: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 20,
    },
    feedbackBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 12,
    },
    feedbackBtnText: {
        fontWeight: '700',
        color: '#1F2937',
    },
    ratingSection: {
        alignItems: 'center',
    },
    driverSection: {
        alignItems: 'center',
        marginBottom: 25,
    },
    driverAvatarMini: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 15,
    },
    excellent: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 5,
    },
    ratingLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 20,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    textInput: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        height: 120,
        textAlignVertical: 'top',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 15,
    },
    tipsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    tipItem: {
        width: 60,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedTip: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    tipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    selectedTipText: {
        color: '#1F2937',
    },
    otherAmount: {
        fontSize: 12,
        color: COLORS.primaryDark,
        fontWeight: '600',
        textDecorationLine: 'underline',
        marginBottom: 30,
    },
    submitBtn: {
        width: '100%',
    },
    finalContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    successCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.success + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    finalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 15,
    },
    finalDesc: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 40,
    },
    backHomeBtn: {
        width: '100%',
    },
});
