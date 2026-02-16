import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import Sidebar from '../../src/components/ui/Sidebar';
import { COLORS, SIZES } from '../../src/constants/colors';

const TRANSACTIONS = [
    { id: '1', name: 'Welton', date: 'Today at 09:20 am', amount: '-$570.00', icon: 'wallet-outline' },
    { id: '2', name: 'Natham', date: 'Today at 09:20 am', amount: '$570.00', icon: 'checkmark-circle-outline' },
    { id: '3', name: 'Welton', date: 'Today at 09:20 am', amount: '-$570.00', icon: 'wallet-outline' },
    { id: '4', name: 'Natham', date: 'Today at 09:20 am', amount: '$570.00', icon: 'checkmark-circle-outline' },
    { id: '5', name: 'Natham', date: 'Today at 09:20 am', amount: '$570.00', icon: 'checkmark-circle-outline' },
];

export default function WalletScreen() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <ScreenWrapper
            style={styles.container}
            showHeader
            title="Wallet"
            showMenu
            onMenuPress={() => setIsSidebarOpen(true)}
        >
            <View style={styles.headerRow}>
                <TouchableOpacity
                    style={styles.addMoneyBtn}
                    onPress={() => router.push('/wallet/add-money')}
                >
                    <Text style={styles.addMoneyText}>Add Money</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.cardsRow}>
                <View style={[styles.balanceCard, { backgroundColor: COLORS.primary + '20' }]}>
                    <Text style={styles.amountText}>$500</Text>
                    <Text style={styles.label}>Available Balance</Text>
                </View>
                <View style={[styles.balanceCard, { backgroundColor: '#F3F4F6' }]}>
                    <Text style={styles.amountText}>$200</Text>
                    <Text style={styles.label}>Total Expend</Text>
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Transactions</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={TRANSACTIONS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <View style={styles.iconCircle}>
                            <Ionicons name={item.icon as any} size={22} color={item.amount.startsWith('-') ? "#EF4444" : COLORS.success} />
                        </View>
                        <View style={styles.txDetails}>
                            <Text style={styles.txName}>{item.name}</Text>
                            <Text style={styles.txDate}>{item.date}</Text>
                        </View>
                        <Text style={[styles.txAmount, item.amount.startsWith('-') ? styles.negative : styles.positive]}>
                            {item.amount}
                        </Text>
                    </View>
                )}
            />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: SIZES.padding,
        marginBottom: 15,
    },
    addMoneyBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primaryDark,
    },
    addMoneyText: {
        color: COLORS.primaryDark,
        fontWeight: '700',
        fontSize: 14,
    },
    cardsRow: {
        flexDirection: 'row',
        paddingHorizontal: SIZES.padding,
        gap: 15,
        marginBottom: 30,
    },
    balanceCard: {
        flex: 1,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    amountText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: '#6B7280',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    seeAll: {
        fontSize: 12,
        color: COLORS.primaryDark,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: SIZES.padding,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    txDetails: {
        flex: 1,
    },
    txName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    txDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    txAmount: {
        fontSize: 15,
        fontWeight: '700',
    },
    negative: {
        color: '#1F2937',
    },
    positive: {
        color: COLORS.success,
    },
});
