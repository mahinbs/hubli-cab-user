import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '../../constants/colors';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    isLoading = false,
    disabled = false,
    style,
    textStyle,
    variant = 'primary',
}) => {
    const isText = variant === 'text';
    // Outline if explicitly outline OR primary + disabled
    const isOutline = variant === 'outline' || (variant === 'primary' && disabled);

    if (isText) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || isLoading}
                style={[styles.textButton, style]}
            >
                <Text style={[styles.textButtonText, textStyle]}>{title}</Text>
            </TouchableOpacity>
        );
    }

    if (isOutline) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || isLoading}
                style={[
                    styles.outlineButton,
                    disabled && styles.disabledButton,
                    style,
                ]}
            >
                {isLoading ? (
                    <ActivityIndicator color={disabled ? COLORS.textMuted : COLORS.primary} />
                ) : (
                    <Text
                        style={[
                            styles.outlineText,
                            disabled && { color: COLORS.textMuted },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                )}
            </TouchableOpacity>
        );
    }

    // Primary button with gradient
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
            style={[styles.container, style]} // Removed backgroundColor
        >
            <LinearGradient
                colors={COLORS.buttonGradient} // Use your constant
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {isLoading ? (
                    <ActivityIndicator color={COLORS.background} />
                ) : (
                    <Text style={[styles.text, textStyle]}>{title}</Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 56,
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        padding: 0,
        zIndex: 10,
        backgroundColor: COLORS.primary, // Fallback color
        borderWidth: 0, // Ensure no border
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }
        }),
    },
    gradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
    },
    text: {
        color: '#202935', // Dark gray
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    outlineButton: {
        width: '100%',
        height: 56,
        borderRadius: SIZES.radius,
        borderWidth: 1.5, // Slightly thicker for visibility
        borderColor: COLORS.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        padding: 0,
        ...Platform.select({
            ios: { shadowOpacity: 0 },
            android: { elevation: 0 },
        }),
    },
    outlineText: {
        color: COLORS.primaryDark,
        fontSize: 18,
        fontWeight: '700',
    },
    disabledButton: {
        borderColor: COLORS.textMuted,
        opacity: 1,
        padding: 0, // Explicit zero padding
        ...Platform.select({
            ios: { shadowOpacity: 0 },
            android: { elevation: 0 },
        }),
    },
    textButton: {
        height: 'auto',
        padding: 5, // Small padding for text button (intentional)
    },
    textButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primaryDark,
    },
});

export default CustomButton;