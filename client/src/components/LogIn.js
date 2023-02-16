import { createClient } from '@supabase/supabase-js'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'

const supabase = createClient(
    "https://uvzlykichvbwpbqcmqid.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2emx5a2ljaHZid3BicWNtcWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzU2MzM4MjAsImV4cCI6MTk5MTIwOTgyMH0.9UEbNncg2fk8ZuN8dbfoO2mJrthprzE6deEUsT_CQzo"
);

function LogIn() {


    return (
        <div>
            <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                theme="dark"
                providers={["discord"]}
                onlyThirdPartyProviders={true}
            />
        </div>
    );
}

export default LogIn