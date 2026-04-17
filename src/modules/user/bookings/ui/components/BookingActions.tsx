"use client";
import { useState, useEffect } from "react";
import { Download, CalendarClock, Headphones, XCircle } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { BookingPDFDocument, BookingPdfDataInterface } from "../../utils/BookingPdf";

interface BookingActionsProps {
    bookingData: {
        booking: any;
        car: any;
        location?: any;
    };
}

export const BookingActions = ({ bookingData }: BookingActionsProps) => {
    // 1. Add a mount state
    const [isMounted, setIsMounted] = useState(false);

    // 2. Set to true only after the component mounts in the browser
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { booking, car } = bookingData;

    const pdfData: BookingPdfDataInterface = {
        bookingId: booking.id,
        status: booking.status,
        createdAt: booking.createdAt,

        fullName: booking.fullName || "",
        email: booking.email || "",
        phoneNumber: booking.phoneNumber || "",
        licenseNumber: booking.licenseNumber || "",

        carMake: car?.make || "",
        carModel: car?.model || "",
        carYear: car?.year || 0,
        carCategory: car?.category || "",
        carTier: car?.tier || "",
        carTransmission: car?.transmission || "",
        carFuelType: car?.fuelType || "",
        carSeats: car?.seats || 0,

        startDate: booking.startDate,
        endDate: booking.endDate,

        dailyRate: booking.dailyRate,
        days: booking.days,
        protectionFee: booking.protectionFee,
        surchargeFee: booking.surchargeFee,
        totalPrice: booking.totalPrice,
        paymentMethod: booking.paymentMethod,
    };

    const fileName = `Brothers-Booking-BR-${booking.id.slice(0, 8).toUpperCase()}.pdf`;

    return (
        <div data-html2canvas-ignore="true" className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 w-full pb-8">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">

                {/* 3. Only render the PDF library if we are in the browser */}
                {isMounted ? (
                    <PDFDownloadLink
                        document={<BookingPDFDocument data={pdfData} />}
                        fileName={fileName}
                        className="w-full sm:w-auto"
                    >
                        {({ loading }) => (
                            <button
                                disabled={loading}
                                className="flex items-center justify-center gap-2 bg-[#1C2333] hover:bg-[#151b27] text-white font-bold text-[14px] px-6 py-3.5 rounded-[12px] transition-colors w-full sm:w-auto shadow-sm disabled:opacity-50"
                            >
                                <Download className="w-4 h-4" />
                                {loading ? "Generating PDF..." : "Download Invoice"}
                            </button>
                        )}
                    </PDFDownloadLink>
                ) : (
                    // Fallback button while SSR is happening
                    <button
                        disabled
                        className="flex items-center justify-center gap-2 bg-[#1C2333] opacity-50 text-white font-bold text-[14px] px-6 py-3.5 rounded-[12px] w-full sm:w-auto shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Preparing Invoice...
                    </button>
                )}

                <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0B0F3B] font-bold text-[14px] px-6 py-3.5 rounded-[12px] border border-slate-200 transition-colors w-full sm:w-auto shadow-sm">
                    <CalendarClock className="w-4 h-4" />
                    Modify Booking
                </button>
                <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0B0F3B] font-bold text-[14px] px-6 py-3.5 rounded-[12px] border border-slate-200 transition-colors w-full sm:w-auto shadow-sm">
                    <Headphones className="w-4 h-4" />
                    Contact Support
                </button>
            </div>

            <button className="flex items-center justify-center gap-2 text-rose-600 hover:text-rose-700 font-bold text-[14px] px-4 py-3.5 transition-colors w-full md:w-auto mt-2 md:mt-0">
                <XCircle className="w-5 h-5" />
                Cancel Reservation
            </button>
        </div>
    );
};