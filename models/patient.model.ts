import mongoose, { type Document, Schema } from "mongoose";

const GendersEnum = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;

export const AvailableGenders = Object.values(GendersEnum);
export type Gender = (typeof AvailableGenders)[number];

export interface IPatient extends Document {
  medicalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: Gender;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalHistory: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    surgeries: string[];
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  lastVisit?: Date;
  notes: string;
  availableTimes: string[];
}

const PatientSchema = new Schema<IPatient>(
  {
    medicalId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: AvailableGenders,
      required: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    medicalHistory: {
      allergies: [String],
      medications: [String],
      conditions: [String],
      surgeries: [String],
    },
    insurance: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
    },
    lastVisit: Date,
    notes: {
      type: String,
      default: "",
    },
    availableTimes: [String],
  },
  {
    timestamps: true,
  }
);

export const Patient =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
