import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';

const OFFERS = [
    { id: '1', title: 'Discount 15% off', desc: 'Special Promo valid for Black Friday', code: 'DISC15', color: '#EF4444' },
    { id: '2', title: 'Special 5% off', desc: 'Special Weekend deal promo', code: 'WEEK5', color: '#16A34A' },
    { id: '3', title: 'Cashback 15%', desc: 'Special Promo valid for today', code: 'CASH15', color: '#3B82F6' },
    { id: '4', title: 'Special 15% off', desc: 'Special Promo valid for Black Friday', code: 'DISC15B', color: '#EF4444' },
    { id: '5', title: 'Discount 15% off', desc: 'Special Promo valid for Black Friday', code: 'DISC15C', color: '#8B5CF6' },
    { id: '6', title: 'Discount 15% off', desc: 'Special Promo valid for Black Friday', code: 'DISC15D', color: '#16A34A' },
];

export default function OfferScreen() {
    const [selectedOffer, setSelectedOffer] = useState<any>(null);

    return (
        <ScreenWrapper style={styles.container} showHeader title="Special Offer">
            <FlatList
                data={OFFERS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.offerCard} onPress={() => setSelectedOffer(item)}>
                        <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                            <Ionicons name="pricetag" size={24} color={item.color} />
                        </View>
                        <View style={styles.offerInfo}>
                            <Text style={styles.offerTitle}>{item.title}</Text>
                            <Text style={styles.offerDesc}>{item.desc}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <Modal visible={!!selectedOffer} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedOffer(null)}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>

                        <Text style={styles.modalHeader}>Special Offer</Text>

                        <View style={styles.bigIconBox}>
                            <Ionicons name="pricetag-outline" size={60} color={COLORS.primaryDark} />
                        </View>

                        <Text style={styles.modalOfferTitle}>{selectedOffer?.title}</Text>
                        <Text style={styles.modalOfferDesc}>{selectedOffer?.desc}</Text>

                        <View style={styles.promoCodeBox}>
                            <Text style={styles.promoCode}>{selectedOffer?.code}</Text>
                            <Ionicons name="copy-outline" size={20} color={COLORS.primaryDark} />
                        </View>

                        <View style={styles.termsBox}>
                            <Text style={styles.termsHeader}>Terms and Conditions</Text>
                            <Text style={styles.termsText}>
                                • Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.{"\n"}
                                • Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </Text>
                        </View>

                        <CustomButton
                            title="Use Promo"
                            onPress={() => setSelectedOffer(null)}
                            style={styles.useBtn}
                        />
                    </View>
                </View>
            </Modal>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    listContent: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 20,
    },
    offerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    offerInfo: {
        flex: 1,
    },
    offerTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    offerDesc: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        alignItems: 'center',
    },
    closeBtn: {
        alignSelf: 'flex-end',
        marginBottom: 5,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 20,
    },
    bigIconBox: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalOfferTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 8,
    },
    modalOfferDesc: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 25,
    },
    promoCodeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: COLORS.primaryDark,
        marginBottom: 25,
    },
    promoCode: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
        letterSpacing: 2,
    },
    termsBox: {
        width: '100%',
        marginBottom: 30,
    },
    termsHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 10,
    },
    termsText: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 18,
    },
    useBtn: {
        width: '100%',
        marginBottom: 20,
    },
});
