"use client";
import { Download, CalendarClock, Headphones, XCircle } from "lucide-react";
import { GetOneBooking } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { PDFDownloadLink } from "@react-pdf/renderer";

// Make sure to import the React component we created in the previous step
import { BookingPDFDocument, BookingPdfDataInterface } from "../../utils/BookingPdf";

interface BookingActionsProps {
    bookingId: string;
    bookingData: GetOneBooking;
}

export const BookingActions = ({ bookingId, bookingData }: BookingActionsProps) => {
    const trpc = useTRPC();

    const { data: userdata, isLoading: isUserLoading } = useQuery(trpc.userProfile.getUser.queryOptions());

    const { data: carData, isLoading: isCarLoading } = useQuery(
        trpc.userBrowse.getOne.queryOptions({
            id: bookingData.carId
        })
    );

    // Prepare the data payload for the PDF. 
    // We do this inline now so React-PDF can react to the query data arriving.
    const pdfData: BookingPdfDataInterface = {
        bookingId: bookingData.id,
        status: bookingData.status,
        createdAt: bookingData.createdAt,

        fullName: userdata?.name || "",
        email: userdata?.email || "",
        phoneNumber: userdata?.phone || "",
        licenseNumber: bookingData.licenseNumber || "",

        carMake: carData?.make || "",
        carModel: carData?.model || "",
        carYear: carData?.year || 0,
        carCategory: carData?.category || "",
        carTier: carData?.tier || "",
        carTransmission: carData?.transmission || "",
        carFuelType: carData?.fuelType || "",
        carSeats: carData?.seats || 0,

        startDate: bookingData.startDate,
        endDate: bookingData.endDate,

        dailyRate: bookingData.dailyRate,
        days: bookingData.days,
        protectionFee: bookingData.protectionFee,
        surchargeFee: bookingData.surchargeFee,
        totalPrice: bookingData.totalPrice,
        paymentMethod: bookingData.paymentMethod,
    };

    // Prevent rendering the download link with empty data while queries are fetching
    const isDataReady = !isUserLoading && !isCarLoading && userdata && carData;
    const fileName = `Brothers-Booking-BR-${bookingData.id.slice(0, 8).toUpperCase()}.pdf`;

    return (
        <div data-html2canvas-ignore="true" className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 w-full pb-8">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">

                {/* Replace standard button with PDFDownloadLink. 
                  It provides a render prop to access the internal 'loading' state.
                */}
                {isDataReady ? (
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
                                {loading ? "Generating..." : "Download Invoice"}
                            </button>
                        )}
                    </PDFDownloadLink>
                ) : (
                    // Fallback button while TRPC queries are resolving
                    <button
                        disabled
                        className="flex items-center justify-center gap-2 bg-[#1C2333] opacity-50 text-white font-bold text-[14px] px-6 py-3.5 rounded-[12px] w-full sm:w-auto shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Loading Data...
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