import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';

const HISTORY_DATA = [
    { id: '1', name: 'Nate', car: 'Mustang Shelby GT', date: 'Today at 09:20 am', status: 'Done', type: 'completed' },
    { id: '2', name: 'Henry', car: 'Mustang Shelby GT', date: 'Today at 10:20 am', status: 'Done', type: 'completed' },
    { id: '3', name: 'William', car: 'Mustang Shelby GT', date: 'Tomorrow at 09:20 am', status: 'Done', type: 'completed' },
    { id: '4', name: 'Nate', car: 'Mustang Shelby GT', date: 'Today at 09:20 am', status: 'Done', type: 'completed' },
    { id: '5', name: 'Henry', car: 'Mustang Shelby GT', date: 'Today at 10:20 am', status: 'Done', type: 'completed' },
    { id: '6', name: 'William', car: 'Mustang Shelby GT', date: 'Tomorrow at 09:20 am', status: 'Done', type: 'completed' },
    { id: '7', name: 'Nate', car: 'Mustang Shelby GT', date: 'Today at 09:20 am', status: 'Cancel', type: 'cancelled' },
    { id: '8', name: 'Henry', car: 'Mustang Shelby GT', date: 'Today at 10:20 am', status: 'Cancel', type: 'cancelled' },
    { id: '9', name: 'William', car: 'Mustang Shelby GT', date: 'Tomorrow at 09:20 am', status: 'Cancel', type: 'cancelled' },
];

const TABS = ['Upcoming', 'Completed', 'Cancelled'];

export default function HistoryScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Completed');

    const filteredData = HISTORY_DATA.filter(item => {
        if (activeTab === 'Upcoming') return item.type === 'upcoming';
        if (activeTab === 'Completed') return item.type === 'completed';
        if (activeTab === 'Cancelled') return item.type === 'cancelled';
        return true;
    });

    return (
        <ScreenWrapper style={styles.container} showHeader title="History">
            <View style={styles.tabBar}>
                {TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.driverName}>{item.name}</Text>
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                        <View style={styles.itemFooter}>
                            <Text style={styles.carName}>{item.car}</Text>
                            <Text style={[styles.statusText, item.type === 'cancelled' ? styles.cancelledStatus : styles.completedStatus]}>
                                {item.status}
                            </Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No rides found in this category.</Text>
                    </View>
                }
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: SIZES.padding,
        paddingVertical: 15,
        gap: 10,
    },
    tab: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#1F2937',
    },
    listContent: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 20,
    },
    historyItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    driverName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    },
    dateText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    carName: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    completedStatus: {
        color: COLORS.success,
    },
    cancelledStatus: {
        color: '#EF4444',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
});
