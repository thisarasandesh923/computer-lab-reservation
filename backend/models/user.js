
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userScheme = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        trim: true
    },

    email:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password:
    {
        type: String,
        required: true,
        select: false
    },

    role:
    {
        type: String,
        enum: [
            "representative",
            "module_coordinator",
            "lab_coordinator",
            "instructor"
            ],
        default: "representative"
    }
});


userScheme.pre("save", async function ()
{
    if (!this.isModified("password"))
    {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userScheme.methods.comparePassword = async function (enteredPassword)
{
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userScheme);

export default User;
