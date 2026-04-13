import { Resend } from "resend";
import { config } from "dotenv";
config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'janduaditay@gmail.com';
        console.log("Sending to:", adminEmail);
        const { data, error } = await resend.emails.send({
            from: "Brothers Car Rental <onboarding@resend.dev>",
            to: adminEmail,
            subject: "Test Admin Email",
            html: "<p>Test</p>"
        });
        
        if (error) {
            console.error("Resend Error:", error);
        } else {
            console.log("Success:", data);
        }
    } catch (e) {
        console.error("Fatal exception:", e);
    }
}
test();
