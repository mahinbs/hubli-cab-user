import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../../src/constants/colors';
import { supabase } from '../../supabase/client';

export default function EditProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('Male');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (data) {
                    setName(data.full_name || '');
                    setEmail(data.email || '');
                    setPhone(data.phone_number || '');
                    setGender(data.nationality || 'Male');
                    setAddress(data.complete_address || '');
                }
            }
        } catch (err) {
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        full_name: name,
                        email: email,
                        phone_number: phone,
                        nationality: gender,
                        complete_address: address
                    })
                    .eq('id', user.id);
                if (error) throw error;
                router.back();
            }
        } catch (err: any) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile: ' + err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <ScreenWrapper style={styles.container} showHeader title="Edit Profile">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primaryDark} />
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper style={styles.container} showHeader title="Edit Profile">
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: 'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editIconBtn}>
                            <Ionicons name="pencil" size={12} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileName}>{name || 'My Profile'}</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Full Name"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.phoneGroup}>
                        <View style={styles.countryPicker}>
                            <Image
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/1024px-Flag_of_Bangladesh.svg.png' }}
                                style={styles.flag}
                            />
                            <Ionicons name="chevron-down" size={16} color="#4B5563" />
                        </View>
                        <TextInput
                            style={styles.phoneInput}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <TouchableOpacity 
                            style={styles.dropdown}
                            onPress={() => setGender(gender === 'Male' ? 'Female' : 'Male')}
                        >
                            <Text style={styles.dropdownText}>{gender}</Text>
                            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Address"
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <CustomButton
                        title="Update"
                        onPress={handleUpdate}
                        style={styles.updateBtn}
                        isLoading={updating}
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
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#F9FAFB',
        marginBottom: 20,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    editIconBtn: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: COLORS.primaryDark,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    profileName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
    },
    form: {
        paddingHorizontal: SIZES.padding,
    },
    inputGroup: {
        marginBottom: 15,
    },
    input: {
        height: 56,
        backgroundColor: '#FFFFFF',
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
    phoneGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
        height: 56,
        width: 80,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    flag: {
        width: 24,
        height: 16,
        borderRadius: 2,
    },
    phoneInput: {
        flex: 1,
        height: 56,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1F2937',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
    },
    dropdownText: {
        fontSize: 15,
        color: '#1F2937',
    },
    updateBtn: {
        marginTop: 20,
    },
});
