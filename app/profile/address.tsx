import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';

const INITIAL_ADDRESSES = [
    { id: '1', type: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '2', type: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '3', type: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '4', type: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '5', type: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
    { id: '6', type: 'Office', address: '2972 Westheimer Rd. Santa Ana, Illinois 85486' },
];

export default function AddressScreen() {
    const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
    const [showAddModal, setShowAddModal] = useState(false);
    const [name, setName] = useState('');
    const [detail, setDetail] = useState('');

    const handleAdd = () => {
        if (name && detail) {
            setAddresses([...addresses, { id: Date.now().toString(), type: name, address: detail }]);
            setShowAddModal(false);
            setName('');
            setDetail('');
        }
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Address">
            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.addressItem}>
                        <View style={styles.leftBox}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="location" size={20} color={COLORS.primaryDark} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.typeName}>{item.type}</Text>
                                <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Ionicons name="create-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.bottomBar}>
                <CustomButton
                    title="Add New Address"
                    onPress={() => setShowAddModal(true)}
                />
            </View>

            <Modal visible={showAddModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowAddModal(false)}>
                            <Ionicons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Address Details</Text>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Name of Address"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Address Details"
                                value={detail}
                                onChangeText={setDetail}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <CustomButton
                            title="Add Address"
                            onPress={handleAdd}
                            style={styles.addBtn}
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
        paddingBottom: 100,
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    leftBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        flex: 1,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    typeName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    addressText: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SIZES.padding,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
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
        padding: SIZES.padding,
        alignItems: 'center',
    },
    closeBtn: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 25,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15,
    },
    input: {
        height: 56,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1F2937',
    },
    textArea: {
        height: 100,
        paddingTop: 15,
        textAlignVertical: 'top',
    },
    addBtn: {
        width: '100%',
        marginTop: 10,
        marginBottom: 20,
    },
});
