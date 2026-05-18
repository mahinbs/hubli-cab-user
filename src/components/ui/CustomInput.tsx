import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';

interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    rightIconName?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    leftComponent?: React.ReactNode;
    containerStyle?: ViewStyle;
    onPress?: () => void; // For dropdown/picker style
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    error,
    iconName,
    rightIconName,
    onRightIconPress,
    leftComponent,
    containerStyle,
    style,
    secureTextEntry,
    onPress,
    pointerEvents: _pointerEvents,
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = secureTextEntry;

    const handleRightIconPress = () => {
        if (isPassword) {
            setIsPasswordVisible(!isPasswordVisible);
        } else if (onRightIconPress) {
            onRightIconPress();
        }
    };

    const InputWrapper = onPress ? TouchableOpacity : View;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <InputWrapper
                activeOpacity={onPress ? 0.7 : 1}
                onPress={onPress}
                style={[styles.inputContainer, error ? styles.errorBorder : null]}
            >
                {leftComponent}
                {iconName && (
                    <Ionicons
                        name={iconName}
                        size={20}
                        color={COLORS.textMuted}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[
                        styles.input, 
                        style, 
                        onPress ? { pointerEvents: 'none' } : null
                    ]}
                    placeholderTextColor={COLORS.textMuted}
                    selectionColor={COLORS.primary}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    editable={!onPress}
                    {...props}
                />
                {(rightIconName || isPassword) && (
                    <TouchableOpacity onPress={handleRightIconPress}>
                        <Ionicons
                            name={isPassword ? (isPasswordVisible ? 'eye-off-outline' : 'eye-outline') : rightIconName!}
                            size={20}
                            color={COLORS.textMuted}
                        />
                    </TouchableOpacity>
                )}
                {onPress && !rightIconName && !isPassword && (
                    <Ionicons name="chevron-down" size={20} color={COLORS.textMuted} />
                )}
            </InputWrapper>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        color: COLORS.text,
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 4,
        fontWeight: '700',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        height: 56,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '500',
        height: '100%',
    },
    icon: {
        marginRight: 12,
    },
    errorBorder: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
        fontWeight: '500',
    },
});

export default CustomInput;
