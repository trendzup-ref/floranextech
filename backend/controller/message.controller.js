import { ContactMessage } from "../models/contactMessage.model.js";

export const sendEnquiry = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation for required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields (name, email, subject, message)"
            });
        }

        // Email format validation check
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Create contact enquiry using the imported model
        const contactMessage = await ContactMessage.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully. Our team will contact you shortly.",
            contactMessage
        });
    } catch (error) {
        console.error("Error in sendEnquiry:", error);

        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const firstError = Object.values(error.errors)[0]?.message;
            return res.status(400).json({
                success: false,
                message: firstError || "Validation error"
            });
        }

        return res.status(500).json({
            success: false,
            message: "An error occurred while sending your enquiry. Please try again later."
        });
    }
};
