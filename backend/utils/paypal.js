/**
 * Helper utility to interact securely with PayPal REST API.
 * Uses PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET from server environment variables.
 * Secret keys are never exposed to the frontend/browser.
 */

const getPayPalBaseUrl = () => {
    let url = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";
    // Ensure API endpoint domain is used rather than user login domain
    if (url.includes("sandbox.paypal.com") && !url.includes("api-m.")) {
        url = "https://api-m.sandbox.paypal.com";
    } else if (url.includes("paypal.com") && !url.includes("api-m.")) {
        url = "https://api-m.paypal.com";
    }
    return url.replace(/\/+$/, "");
};

/**
 * Generate a short-lived OAuth 2.0 access token using PayPal Client ID and Secret.
 * @returns {Promise<string>} Access Token
 */
export const generatePayPalAccessToken = async () => {
    try {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error("Missing PayPal credentials in environment variables (PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET)");
        }

        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
        const baseUrl = getPayPalBaseUrl();

        const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`PayPal auth request failed: ${response.status} - ${errData}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error generating PayPal access token:", error.message);
        throw error;
    }
};

/**
 * Create an order on PayPal's servers.
 *
 * @param {Object} orderDetails - { amount, currency, customId, description }
 * @returns {Promise<Object>} PayPal Order response object
 */
export const createPayPalServerOrder = async ({ amount, currency = "EUR", customId, description }) => {
    const accessToken = await generatePayPalAccessToken();
    const baseUrl = getPayPalBaseUrl();

    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                custom_id: customId ? String(customId) : undefined,
                description: description || "Digital product purchase",
                amount: {
                    currency_code: currency.toUpperCase(),
                    value: Number(amount).toFixed(2),
                },
            },
        ],
    };

    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to create PayPal order");
    }

    return data;
};

/**
 * Capture an approved PayPal order on PayPal's servers.
 *
 * @param {string} paypalOrderId - The ID of the PayPal order (e.g. from onApprove)
 * @returns {Promise<Object>} PayPal capture response
 */
export const capturePayPalServerOrder = async (paypalOrderId) => {
    const accessToken = await generatePayPalAccessToken();
    const baseUrl = getPayPalBaseUrl();

    const response = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to capture PayPal order");
    }

    return data;
};

export default {
    generatePayPalAccessToken,
    createPayPalServerOrder,
    capturePayPalServerOrder,
};
