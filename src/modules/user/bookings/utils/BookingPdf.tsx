import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

export interface BookingPdfDataInterface {
    bookingId: string;
    status: string;
    createdAt: string | Date;
    fullName: string;
    email: string;
    phoneNumber: string;
    licenseNumber: string;
    carMake: string;
    carModel: string;
    carYear: number;
    carCategory: string;
    carTier: string;
    carTransmission: string;
    carFuelType: string;
    carSeats: number;
    startDate: string | Date;
    endDate: string | Date;
    dailyRate: number;
    days: number;
    protectionFee: number;
    surchargeFee: number;
    totalPrice: number;
    paymentMethod: string;
}

// ─── HELPERS ────────────────────────────────────────────────────

const formatCurrency = (amount: number): string => `Rs. ${amount.toLocaleString("en-IN")}`;

const capitalize = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
        case "completed":
        case "confirmed":
            return { label: status.toUpperCase(), color: '#059669' }; // Emerald
        case "cancelled":
            return { label: "CANCELLED", color: '#E11D48' }; // Rose
        default:
            return { label: "PENDING", color: '#D97706' }; // Amber
    }
};

// ─── STYLES ─────────────────────────────────────────────────────

const COLORS = {
    navy: '#0B0F3B',
    darkBlue: '#1C2333',
    gold: '#B87A3D',
    slate50: '#F8FAFC',
    slate200: '#E2E8F0',
    slate400: '#94A3B8',
    slate500: '#64748B',
    white: '#FFFFFF',
    lightAmberBg: '#FEFCF1',
    lightAmberBorder: '#FDE6B4'
};

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        backgroundColor: COLORS.white,
        paddingBottom: 60,
    },
    // Header
    headerBand: {
        backgroundColor: COLORS.darkBlue,
        paddingHorizontal: 30,
        paddingTop: 24,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1.5,
        borderBottomColor: COLORS.gold,
    },
    companyName: { fontFamily: 'Helvetica-Bold', fontSize: 24, color: COLORS.white },
    companySubtitle: { fontSize: 9, color: '#B4BED2', letterSpacing: 1.5, marginTop: 4 },
    docTitle: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: COLORS.white, textAlign: 'right' },
    refText: { fontSize: 9, color: '#B4BED2', textAlign: 'right', marginTop: 6 },
    dateText: { fontSize: 8, color: COLORS.white, textAlign: 'right', marginTop: 4 },
    statusBadge: {
        alignSelf: 'flex-end',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 8,
    },
    statusText: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: COLORS.white },

    // Body Layout
    body: { paddingHorizontal: 30, paddingTop: 20 },
    sectionMargin: { marginBottom: 24 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    colRight: { width: '48%' },
    colLeft: { width: '48%' },

    // Section Titles
    sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    sectionTitleAccent: { width: 2.5, height: 10, backgroundColor: COLORS.gold, marginRight: 6 },
    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: COLORS.navy },

    // Cards
    card: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        borderRadius: 4,
        padding: 14,
    },

    // Vehicle
    carTitle: { fontFamily: 'Helvetica-Bold', fontSize: 18, color: COLORS.navy },
    carSubtitle: { fontSize: 10, color: COLORS.slate500, marginTop: 4, marginBottom: 12 },
    specRow: { flexDirection: 'row', gap: 10 },
    specBadge: {
        flexDirection: 'row',
        backgroundColor: COLORS.slate50,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    specLabel: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: COLORS.slate500, marginRight: 4 },
    specValue: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: COLORS.navy },

    // Customer
    fieldBlock: { marginBottom: 10 },
    fieldLabel: { fontSize: 7, color: COLORS.slate400, textTransform: 'uppercase', marginBottom: 2 },
    fieldValue: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: COLORS.navy },

    // Schedule Timeline
    timelineItem: { flexDirection: 'row', marginBottom: 4 },
    timelineGraphic: { width: 16, alignItems: 'center', marginRight: 8 },
    dotFilled: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#059669', zIndex: 2 },
    dotHollow: { width: 6, height: 6, borderRadius: 3, borderWidth: 1.5, borderColor: COLORS.navy, zIndex: 2, backgroundColor: '#fff' },
    timelineLine: { width: 1, backgroundColor: COLORS.slate200, flex: 1, marginVertical: -2, zIndex: 1 },
    timeTextContainer: { flex: 1, paddingBottom: 16 },
    timeLabel: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: COLORS.slate400, marginBottom: 2 },
    timeDate: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: COLORS.navy, marginBottom: 2 },
    timeClock: { fontSize: 8.5, color: COLORS.slate500 },
    durationBadge: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.slate50,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginTop: 4,
    },
    durationText: { fontFamily: 'Helvetica-Bold', fontSize: 7, color: COLORS.slate500 },

    // Payment
    lineItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    lineItemLabel: { fontSize: 9.5, color: COLORS.slate500 },
    lineItemValue: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: COLORS.navy },
    totalBox: {
        backgroundColor: COLORS.slate50,
        borderTopWidth: 1,
        borderTopColor: COLORS.slate200,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginHorizontal: -14, // Negate card padding to make it flush
        marginTop: 6,
        marginBottom: -14, // Push to bottom of card
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    totalLabel: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: COLORS.navy },
    totalValue: { fontFamily: 'Helvetica-Bold', fontSize: 16, color: COLORS.navy },
    paymentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 },
    paymentMethodText: { fontSize: 8.5, color: COLORS.slate500 },

    // Notes
    notesBox: {
        backgroundColor: COLORS.lightAmberBg,
        borderRadius: 4,
        padding: 12,
        flexDirection: 'row',
    },
    notesBorder: { width: 3, backgroundColor: COLORS.gold, borderRadius: 2, marginRight: 10 },
    noteItem: { fontSize: 8, color: '#8C6E3C', marginBottom: 6, lineHeight: 1.4 },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    footerLine: { marginHorizontal: 30, borderTopWidth: 1, borderTopColor: COLORS.slate200, marginBottom: 8 },
    footerText: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: COLORS.slate400, textAlign: 'center', marginBottom: 2 },
    footerSub: { fontSize: 8, color: COLORS.slate400, textAlign: 'center', marginBottom: 12 },
    footerGoldBar: { height: 4, backgroundColor: COLORS.gold, width: '100%' }
});

// ─── REUSABLE COMPONENTS ────────────────────────────────────────

const SectionTitle = ({ title }: { title: string }) => (
    <View style={styles.sectionTitleContainer} >
        <View style={styles.sectionTitleAccent} />
        < Text style={styles.sectionTitle} > {title} </Text>
    </View>
);

// ─── MAIN DOCUMENT COMPONENT ────────────────────────────────────

export const BookingPDFDocument = ({ data }: { data: BookingPdfDataInterface }) => {
    const sDate = new Date(data.startDate);
    const eDate = new Date(data.endDate);
    const displayId = `BR-${data.bookingId.slice(0, 8).toUpperCase()}`;
    const statusConfig = getStatusConfig(data.status);
    const isPaid = data.status.toLowerCase() === "completed" || data.status.toLowerCase() === "confirmed";

    return (
        <Document>
            <Page size="A4" style={styles.page} >

                {/* HEADER */}
                < View style={styles.headerBand} >
                    <View>
                        <Text style={styles.companyName}> BROTHERS </Text>
                        < Text style={styles.companySubtitle} > CAR RENTAL </Text>
                    </View>
                    < View >
                        <Text style={styles.docTitle}> BOOKING CONFIRMATION </Text>
                        < Text style={styles.refText} > Ref: {displayId} </Text>
                        < Text style={styles.dateText} > Issued: {format(new Date(data.createdAt), "dd MMM yyyy, hh:mm a")} </Text>
                        < View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]} >
                            <Text style={styles.statusText}> {statusConfig.label} </Text>
                        </View>
                    </View>
                </View>

                {/* BODY */}
                <View style={styles.body}>

                    {/* VEHICLE DETAILS */}
                    < View style={styles.sectionMargin} >
                        <SectionTitle title="Vehicle Details" />
                        <View style={styles.card}>
                            <Text style={styles.carTitle}> {data.carMake} {data.carModel} </Text>
                            < Text style={styles.carSubtitle} > {data.carYear}  •  {data.carTier} {data.carCategory} </Text>
                            < View style={styles.specRow} >
                                {
                                    [
                                        { label: "TRANSMISSION", value: capitalize(data.carTransmission) },
                                        { label: "FUEL", value: capitalize(data.carFuelType) },
                                        { label: "SEATS", value: `${data.carSeats}` }
                                    ].map((spec, i) => (
                                        <View key={i} style={styles.specBadge} >
                                            <Text style={styles.specLabel} > {spec.label}: </Text>
                                            < Text style={styles.specValue} > {spec.value} </Text>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </View>

                    {/* TWO COLUMNS: CUSTOMER & SCHEDULE */}
                    <View style={styles.row}>
                        {/* CUSTOMER */}
                        < View style={styles.colLeft} >
                            <SectionTitle title="Customer Details" />
                            <View style={[styles.card, { height: 140 }]}>
                                {
                                    [
                                        { label: "Full Name", value: data.fullName },
                                        { label: "Email", value: data.email },
                                        { label: "Phone", value: data.phoneNumber },
                                        { label: "License No.", value: data.licenseNumber },
                                    ].map((field, i) => (
                                        <View key={i} style={styles.fieldBlock} >
                                            <Text style={styles.fieldLabel} > {field.label} </Text>
                                            < Text style={styles.fieldValue} > {field.value} </Text>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>

                        {/* SCHEDULE */}
                        <View style={styles.colRight}>
                            <SectionTitle title="Rental Schedule" />
                            <View style={[styles.card, { height: 140 }]}>
                                {/* Pick-up */}
                                < View style={styles.timelineItem} >
                                    <View style={styles.timelineGraphic}>
                                        <View style={styles.dotFilled} />
                                        < View style={styles.timelineLine} />
                                    </View>
                                    < View style={styles.timeTextContainer} >
                                        <Text style={styles.timeLabel}> PICK - UP </Text>
                                        < Text style={styles.timeDate} > {format(sDate, "EEE, dd MMM yyyy")} </Text>
                                        < Text style={styles.timeClock} > {format(sDate, "hh:mm a")} </Text>
                                    </View>
                                </View>
                                {/* Drop-off */}
                                <View style={styles.timelineItem}>
                                    <View style={styles.timelineGraphic}>
                                        <View style={styles.dotHollow} />
                                    </View>
                                    < View style={[styles.timeTextContainer, { paddingBottom: 0 }]} >
                                        <Text style={styles.timeLabel}> DROP - OFF </Text>
                                        < Text style={styles.timeDate} > {format(eDate, "EEE, dd MMM yyyy")} </Text>
                                        < Text style={styles.timeClock} > {format(eDate, "hh:mm a")} </Text>
                                    </View>
                                </View>

                                < View style={styles.durationBadge} >
                                    <Text style={styles.durationText}> {data.days} DAY{data.days > 1 ? 'S' : ''} </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* PAYMENT BREAKDOWN */}
                    <View style={styles.sectionMargin}>
                        <SectionTitle title="Payment Breakdown" />
                        <View style={styles.card}>
                            <View style={styles.lineItem}>
                                <Text style={styles.lineItemLabel}> Daily Rate({data.days} day{data.days > 1 ? 's' : ''}) </Text>
                                < Text style={styles.lineItemValue} > {formatCurrency(data.dailyRate * data.days)} </Text>
                            </View>
                            < View style={styles.lineItem} >
                                <Text style={styles.lineItemLabel}> Executive Insurance </Text>
                                < Text style={styles.lineItemValue} > {formatCurrency(data.protectionFee)} </Text>
                            </View>
                            < View style={styles.lineItem} >
                                <Text style={styles.lineItemLabel}> Surcharges & Fees </Text>
                                < Text style={styles.lineItemValue} > {formatCurrency(data.surchargeFee)} </Text>
                            </View>
                            < View style={styles.lineItem} >
                                <Text style={styles.lineItemLabel}> Tax(0 %) </Text>
                                < Text style={styles.lineItemValue} > {formatCurrency(0)} </Text>
                            </View>

                            < View style={styles.totalBox} >
                                <Text style={styles.totalLabel}> TOTAL </Text>
                                < Text style={styles.totalValue} > {formatCurrency(data.totalPrice)} </Text>
                            </View>
                        </View>

                        < View style={styles.paymentFooter} >
                            <Text style={styles.paymentMethodText}> Method: {capitalize(data.paymentMethod)} </Text>
                            < View style={[styles.statusBadge, { backgroundColor: isPaid ? '#059669' : COLORS.slate400, marginTop: 0 }]} >
                                <Text style={styles.statusText}> {isPaid ? 'PAID' : 'UNPAID'} </Text>
                            </View>
                        </View>
                    </View>

                    {/* IMPORTANT NOTES */}
                    <View style={styles.sectionMargin}>
                        <SectionTitle title="Important Information" />
                        <View style={styles.notesBox}>
                            <View style={styles.notesBorder} />
                            < View style={{ flex: 1 }
                            }>
                                {
                                    [
                                        "Please carry a valid driver's license and a government-issued photo ID at pick-up.",
                                        "A security deposit may be held on your payment method and released after drop-off.",
                                        "Please return the vehicle with the same fuel level as at pick-up to avoid refueling charges.",
                                        "For any modifications or cancellations, please contact support at least 24 hours in advance."
                                    ].map((note, i) => (
                                        <Text key={i} style={styles.noteItem} >•  {note} </Text>
                                    ))
                                }
                            </View>
                        </View>
                    </View>

                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <View style={styles.footerLine} />
                    < Text style={styles.footerText} > Brothers Car Rental </Text>
                    < Text style={styles.footerSub} > Premium Vehicle Hire </Text>
                    < View style={styles.footerGoldBar} />
                </View>

            </Page>
        </Document>
    );
};