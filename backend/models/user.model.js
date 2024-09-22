import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        cartItems: [
            {
                quantity: {
                    type: Number,
                    default: 1,
                },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
            },
        ],
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        lastLogin: Date,
        accessTokenCode: String,
        accessTokenExpiresAt: Date,
        refreshTokenCode: String,
        refreshTokenExpiresAt: Date,
    },
    {
        timestamps: true,
    }
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt)
        next();
    } catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compareSync(password, this.password);
}
const User = mongoose.model("User", userSchema);
export default User;