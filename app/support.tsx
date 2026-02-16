import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import CustomButton from '../src/components/ui/CustomButton';
import CustomInput from '../src/components/ui/CustomInput';
import ScreenWrapper from '../src/components/ui/ScreenWrapper';
import { COLORS, SIZES } from '../src/constants/colors';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.faqItem}>
            <TouchableOpacity onPress={toggleExpand} style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{question}</Text>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={COLORS.textMuted}
                />
            </TouchableOpacity>
            {expanded && (
                <View style={styles.faqBody}>
                    <Text style={styles.faqAnswer}>{answer}</Text>
                </View>
            )}
        </View>
    );
};

export default function SupportScreen() {
    const [issue, setIssue] = useState('');

    const faqs = [
        {
            question: "How do I book a ride?",
            answer: "Simply enter your pickup and drop-off locations on the home screen, choose your ride type, and confirm booking."
        },
        {
            question: "Can I schedule a ride for later?",
            answer: "Yes, you can schedule a ride up to 7 days in advance. Just select 'Schedule' instead of 'Ride Now'."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept credit/debit cards, digital wallets, and cash payments."
        },
        {
            question: "How do I contact my driver?",
            answer: "Once a driver accepts your ride, you can call or message them directly through the app."
        }
    ];

    return (
        <ScreenWrapper showHeader title="Help & Support" showMenu={false}>
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                <View style={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Contact Support</Text>
                <View style={styles.contactRow}>
                    <TouchableOpacity style={styles.contactCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                            <Ionicons name="call" size={24} color="#0284C7" />
                        </View>
                        <Text style={styles.contactLabel}>Call Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#DCFCE7' }]}>
                            <Ionicons name="mail" size={24} color="#16A34A" />
                        </View>
                        <Text style={styles.contactLabel}>Email Us</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                            <Ionicons name="chatbubbles" size={24} color="#9333EA" />
                        </View>
                        <Text style={styles.contactLabel}>Live Chat</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Report an Issue</Text>
                <View style={styles.form}>
                    <CustomInput
                        label="Describe your issue"
                        placeholder="Tell us what went wrong..."
                        value={issue}
                        onChangeText={setIssue}
                        multiline
                        numberOfLines={4}
                        style={{ height: 100, textAlignVertical: 'top' }}
                    />
                    <CustomButton
                        title="Submit Ticket"
                        onPress={() => { }}
                        style={styles.button}
                    />
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: SIZES.padding,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 15,
        marginTop: 10,
    },
    faqList: {
        marginBottom: 25,
    },
    faqItem: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        marginBottom: 10,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            }
        }),
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
        paddingRight: 10,
    },
    faqBody: {
        padding: 15,
        paddingTop: 0,
        backgroundColor: COLORS.surface, // Ensure consistent bg
    },
    faqAnswer: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    contactCard: {
        width: '31%', // Three items
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radius,
        padding: 15,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            }
        }),
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    contactLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
    },
    form: {
        backgroundColor: COLORS.surface,
        padding: 20,
        borderRadius: SIZES.radius,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 1,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            }
        }),
    },
    button: {
        marginTop: 15,
    },
});
