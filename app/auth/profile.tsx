import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from '../../src/components/ui/CustomButton';
import CustomInput from '../../src/components/ui/CustomInput';
import ScreenWrapper from '../../src/components/ui/ScreenWrapper';
import { SIZES } from '../../src/constants/colors';

export default function ProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('Full Name');
    const [email, setEmail] = useState('Email');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [district, setDistrict] = useState('');

    const handleSave = () => {
        router.replace('/');
    };

    return (
        <ScreenWrapper style={styles.container} showHeader title="Profile">
            <View style={styles.content}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarPlaceholder} />
                </View>

                <View style={styles.form}>
                    <CustomInput
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <CustomInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <CustomInput
                        label="Street"
                        value={street}
                        onChangeText={setStreet}
                    />
                    <CustomInput
                        label="City"
                        value={city}
                        onPress={() => { }} // Dropdown
                    />
                    <CustomInput
                        label="District"
                        value={district}
                        onPress={() => { }} // Dropdown
                    />

                    <View style={styles.footer}>
                        <CustomButton
                            title="Cancel"
                            onPress={() => router.back()}
                            variant="outline"
                            style={styles.halfButton}
                        />
                        <CustomButton
                            title="Save"
                            onPress={handleSave}
                            style={styles.halfButton}
                        />
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: SIZES.padding,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E5E7EB',
    },
    form: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 20,
    },
    halfButton: {
        flex: 1,
    },
});
