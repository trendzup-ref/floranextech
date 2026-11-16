import jwt from "jsonwebtoken";


export const isAdmin = async (req, res, next) => {
    try {
        // If already decoded by authMiddleware
        if (req.user && req.user.role) {
            if (req.user.role.toLowerCase() === "admin") {
                return next();
            }
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
            });
        }

        // Otherwise extract token from cookie or Authorization header
        const token =
            req.cookies?.token ||
            (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated. Token missing.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.role) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Role not found in token.",
            });
        }

        // Attach user info to req if not already present
        req.user = {
            id: decoded.userId,
            role: decoded.role,
        };

        if (decoded.role.toLowerCase() !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
            });
        }

        next();
    } catch (error) {
        console.error("Admin verification error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

export default isAdmin;
