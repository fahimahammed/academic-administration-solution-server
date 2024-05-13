export interface IUser {
    userId: string;
    role: string;
    password: string;
    needsPasswordChange?: boolean;
    passwordResetToken?: string;
    passwordResetTokenExpires?: Date;
}

// export interface IUserMethods {
//   isPasswordCorrect(givenPassword: string, userPassword: string): Promise<boolean>;
// }

// export type UserModel = Model<IUser, object, IUserMethods>;

export interface IUserFilterRequest {
    searchTerm?: string;
    role?: string;
}

// export interface IAssignPermissionRequest {
//   permissionIds: string[];
// }

// export interface IRemovePermissionRequest {
//   permissionIds: string[];
// }
