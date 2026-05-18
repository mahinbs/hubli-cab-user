import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import Sidebar from '../../src/components/ui/Sidebar';
import { COLORS, SIZES } from '../../src/constants/colors';
import { supabase } from '../../supabase/client';

// Data now fetched from Supabase transactions table

export default function WalletScreen() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [balance, setBalance] = useState(0);
    const [expend, setExpend] = useState(0);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setTransactions(data);
                const totalBalance = data.reduce((acc, curr) => 
                    curr.type === 'deposit' ? acc + parseFloat(curr.amount) : acc - parseFloat(curr.amount), 0);
                const totalSpent = data.reduce((acc, curr) => 
                    curr.type === 'spend' ? acc + parseFloat(curr.amount) : acc, 0);
                
                setBalance(totalBalance);
                setExpend(totalSpent);
            }
        } catch (error) {
            console.error('Wallet fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    <Text style={styles.amountText}>₹{balance.toLocaleString()}</Text>
                    <Text style={styles.label}>Available Balance</Text>
                </View>
                <View style={[styles.balanceCard, { backgroundColor: '#F3F4F6' }]}>
                    <Text style={styles.amountText}>₹{expend.toLocaleString()}</Text>
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
                data={transactions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                        <div style={styles.iconCircle}>
                            <Ionicons 
                                name={item.type === 'spend' ? 'wallet-outline' : 'checkmark-circle-outline'} 
                                size={22} 
                                color={item.type === 'spend' ? "#EF4444" : COLORS.success} 
                            />
                        </div>
                        <View style={styles.txDetails}>
                            <Text style={styles.txName}>{item.description || 'Global Transaction'}</Text>
                            <Text style={styles.txDate}>{new Date(item.created_at).toLocaleString()}</Text>
                        </View>
                        <Text style={[styles.txAmount, item.type === 'spend' ? styles.negative : styles.positive]}>
                            {item.type === 'spend' ? '-' : '+'}₹{item.amount}
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
