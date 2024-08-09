export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};

export interface Item {
    itemId: string;
    parentId: string;
    name: string;
    type: string;
    visibility: string;
    driveLink: string;
    downloadLink: string | null;
    parent: Item | null;
}


interface StorageDetails {
    total_storage: number;          // in GB
    used_storage: number;           // in GB
    trash_storage: number;          // in GB
    usage_in_drive: number;         // in GB
    usage_in_drive_trash: number;   // in GB
    remaining_storage: number;      // in GB
}