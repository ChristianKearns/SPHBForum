import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react';

const supabase = createClient(
    "https://uvzlykichvbwpbqcmqid.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2emx5a2ljaHZid3BicWNtcWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MzM4MjAsImV4cCI6MTk5MTIwOTgyMH0.9UEbNncg2fk8ZuN8dbfoO2mJrthprzE6deEUsT_CQzo"
);

export function useUser() {
    const [user, setUser] = useState({})

    useEffect(() => {
        async function getUserData() {
            await supabase.auth.getUser().then((value) => {
                if (value.data?.user) {
                    setUser(value.data.user)
                }
            })
        }

        getUserData()
    }, [])

    if (user?.id) {
        return user
    }

    return {}
}