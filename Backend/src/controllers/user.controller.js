import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

// for cookies, specifies only server can modify these cookie, (secure cookies)
const options = {
    httpOnly: true,
    secure: true,
};

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
    // console.log("fullname: ", fullName);
    // console.log("email: ", email);
    // console.log("username: ", username);
    // console.log("password: ", password);

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    });

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    console.log(req.files)

    // multer adds req.files in the request field
    const avatarLocalPath = req?.files?.avatar[0]?.path || null;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

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

const generateAccessAndRefreshToken = async (user_id) => {
    try {
        const userInstance = await User.findById(user_id);
        const accessToken = await userInstance.generateAccessToken();
        const refreshToken = await userInstance.generateRefreshToken();

        userInstance.refreshToken = refreshToken;
        await userInstance.save({ validateBeforeSave: false }); // because if its true it will demand password

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
}

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username, email, password
    // validate info
    // check by username or value
    // bcrypt decrypt password, match if valid, continue
    // return res, generate refreshToken and send accessToken

    const { username, email, password } = req.body;

    // check
    if(!username && !email) {
        throw new ApiError(400, "email or username is required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}],
    });

    if(!user) {
        throw new ApiError(404, "user does not exist");
    }

    // user will have the custom methods access not User 

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid) {
        throw new ApiError(401, "invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const updatedUser = await User.findById(user._id).select("-password -refreshToken");

    if(!updatedUser) {
        throw new ApiError(500);
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: updatedUser,
                accessToken,
                refreshToken,
            },
            "user logged in successfully"
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        const loggedOutUser = await User.findByIdAndUpdate(
            req?.user?._id,
            {
                $set: {
                    refreshToken: undefined,
                }
            },
            {
                new: true,
            }
        );
        console.log("Logged out user:: ", loggedOutUser);

        return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
            new ApiResponse(200, {}, "user logged out")
        );
    } catch (error) {
        throw new ApiError(500, error?.message);
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req?.cookies?.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedRefreshToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedRefreshToken?._id);
    
        if(!user) {
            throw new ApiError(401, "token verification failed");
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token expired");
        }
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user?._id);
    
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access Token refreshed"
            )
        );
    } catch (error) {
        throw new ApiError(401, error?.message || "panga hai bhai");
    }
});


export { registerUser, loginUser, logoutUser, refreshAccessToken };