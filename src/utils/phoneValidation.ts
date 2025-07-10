

import { supabase } from '@/integrations/supabase/client';

const checkPhoneValidation = async () => {

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('phone_validated')
            .eq('id', user.id)
            .single();

        return(profile?.phone_validated || false);
    } catch (error) {
        console.error('Error checking phone validation:', error);
        return(false);
    }
}

export default checkPhoneValidation;