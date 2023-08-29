export interface loginResponse { 
    user: {
        user_id: string;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        phone: string;
        dob: string;
        photo: string;
        gender: string;
        created_at: string;
        updated_at: string;
        is_active: boolean
    },
    token: string
}