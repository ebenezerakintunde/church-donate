import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBankDetails {
  bankName: string;
  accountName: string;
  iban?: string;
  accountNumber?: string;
  sortCode?: string;
  swiftCode?: string;
  routingNumber?: string;
  revolutLink?: string;
  additionalInfo?: string;
}

export interface IChurch extends Document {
  _id: string;
  name: string;
  nickname?: string;
  slug: string;
  publicId: string;
  country: string;
  address: string;
  description: string;
  logo?: string;
  managerEmails?: string[]; // Array of emails for profile managers (max 3, not shown on public pages)
  bankDetails: IBankDetails;
  qrCodePath: string;
  pageViews: number;
  qrScans: number;
  createdAt: Date;
  updatedAt: Date;
}

const BankDetailsSchema = new Schema<IBankDetails>(
  {
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
    },
    accountName: {
      type: String,
      required: [true, "Account name is required"],
      trim: true,
    },
    iban: {
      type: String,
      trim: true,
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    sortCode: {
      type: String,
      trim: true,
    },
    swiftCode: {
      type: String,
      trim: true,
    },
    routingNumber: {
      type: String,
      trim: true,
    },
    revolutLink: {
      type: String,
      trim: true,
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ChurchSchema: Schema<IChurch> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Church name is required"],
      trim: true,
    },
    nickname: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: [true, "Public ID is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}$/,
        "Public ID must be in format: xxxxx-xxxxx-xxxxx-xxxxx",
      ],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    managerEmails: {
      type: [String],
      default: [],
      validate: {
        validator: function (emails: string[]) {
          if (!emails || emails.length === 0) return true;
          if (emails.length > 3) return false;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emails.every((email) => emailRegex.test(email));
        },
        message: "Maximum 3 valid email addresses allowed",
      },
    },
    bankDetails: {
      type: BankDetailsSchema,
      required: [true, "Bank details are required"],
    },
    qrCodePath: {
      type: String,
      required: true,
    },
    pageViews: {
      type: Number,
      default: 0,
    },
    qrScans: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Note: publicId and slug indexes are automatically created by 'unique: true' in field definitions

// Prevent model recompilation in development
const Church: Model<IChurch> =
  mongoose.models.Church || mongoose.model<IChurch>("Church", ChurchSchema);

export default Church;
