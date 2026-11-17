import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        ebook: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ebook",
            required: [true, "eBook reference is required"],
        },
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"],
        },
        coverImageUrl: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User reference is required"],
            index: true,
        },
        items: {
            type: [orderItemSchema],
            validate: {
                validator: (val) => Array.isArray(val) && val.length > 0,
                message: "Order must contain at least one item",
            },
        },
        totalAmount: {
            type: Number,
            required: [true, "Total amount is required"],
            min: [0, "Total amount cannot be negative"],
        },
        currency: {
            type: String,
            default: "EUR",
            uppercase: true,
        },

        // Payment gateway configuration (tailored for PayPal integration)
        paymentMethod: {
            type: String,
            enum: ["paypal", "card", "free", "pending"],
            default: "paypal",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "cancelled", "refunded"],
            default: "pending",
            index: true,
        },

        // PayPal specific transaction data
        paypalDetails: {
            orderId: {
                type: String, // PayPal order ID (e.g. 5O190127TN364715T)
                default: null,
                index: true,
            },
            captureId: {
                type: String, // PayPal capture transaction ID
                default: null,
            },
            payerId: {
                type: String, // PayPal payer ID
                default: null,
            },
            payerEmail: {
                type: String,
                default: null,
            },
            paymentTime: {
                type: Date,
                default: null,
            },
            rawResponse: {
                type: mongoose.Schema.Types.Mixed,
                default: null,
            },
        },

        // Order fulfillment & access grants
        orderStatus: {
            type: String,
            enum: ["created", "processing", "completed", "cancelled"],
            default: "created",
            index: true,
        },
        isFulfilled: {
            type: Boolean,
            default: false,
        },
        fulfilledAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Fast lookups for user order histories and PayPal ID webhooks
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "paypalDetails.orderId": 1 });

export const Order = mongoose.model("Order", orderSchema);
export default Order;
