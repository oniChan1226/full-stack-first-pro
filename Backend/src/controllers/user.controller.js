import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // get username, email, password
    // validate info
    // --check if user already exists
    // --check if info not null
    // --check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // save to database
    // remove password and refresh token field from response
    // send response

    const { fullName, email, username, password } = req.body;
    console.log("full name: ", fullName);
    console.log("email: ", email);
    console.log("username: ", username);
    console.log("password: ", password);

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    });

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // multer adds req.files in the request field
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImage ? await uploadOnCloudinary(coverImageLocalPath) : "";

    if(!avatar) {
        throw new ApiError(400, "Error uploading Avatar");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password
    })

    // fullproof approach, check if the user is actually created or not
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(500, "something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    );

});

export { registerUser };