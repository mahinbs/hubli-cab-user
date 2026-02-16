import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenWrapper from '../src/components/ui/ScreenWrapper';
import { SIZES } from '../src/constants/colors';

const NOTIFICATIONS = [
    { id: '1', title: 'Payment Successfully!', desc: 'Lorem ipsum dolor sit amet consectetur. Ut nisl et tincidunt eleifend vitae.', type: 'payment', date: 'Today' },
    { id: '2', title: '30% Special Discount!', desc: 'Lorem ipsum dolor sit amet consectetur. Ut nisl et tincidunt eleifend vitae.', type: 'discount', date: 'Today' },
    { id: '3', title: 'Payment Successfully!', desc: 'Lorem ipsum dolor sit amet consectetur. Ut nisl et tincidunt eleifend vitae.', type: 'payment', date: 'Yesterday' },
    { id: '4', title: 'Credit Card added!', desc: 'Lorem ipsum dolor sit amet consectetur. Ut nisl et tincidunt eleifend vitae.', type: 'card', date: 'Yesterday' },
    { id: '5', title: 'Added Money wallet Successfully!', desc: 'Lorem ipsum dolor sit amet consectetur. Ut nisl et tincidunt eleifend vitae.', type: 'wallet', date: 'Yesterday' },
    { id: '6', title: '5% Special Discount!', desc: 'Lorem ipsum dolor sit amet consectetur. Ut nisl et tincidunt eleifend vitae.', type: 'discount', date: 'Yesterday' },
];

const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

export default function NotificationsScreen() {
    return (
        <ScreenWrapper style={styles.container} showHeader title="Notification">
            <FlatList
                data={NOTIFICATIONS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item, index }) => {
                    const showHeader = index === 0 || NOTIFICATIONS[index - 1].date !== item.date;
                    return (
                        <View>
                            {showHeader && <SectionHeader title={item.date} />}
                            <View style={styles.item}>
                                <View style={styles.iconCircle}>
                                    <Ionicons
                                        name={item.type === 'payment' ? 'card' : item.type === 'discount' ? 'pricetag' : 'wallet' as any}
                                        size={24}
                                        color="#FFFFFF"
                                    />
                                </View>
                                <View style={styles.content}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemDesc}>{item.desc}</Text>
                                </View>
                            </View>
                        </View>
                    );
                }}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    list: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 40,
    },
    sectionHeader: {
        paddingVertical: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    item: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 15,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    itemDesc: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
});
