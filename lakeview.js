tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#ec5b13",
                "background-light": "#f8f6f6",
                "background-dark": "#221610",
            },
            fontFamily: {
                "display": ["Public Sans", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
}

// Initialize Supabase
// Make sure to include the Supabase JS CDN in your HTML files before this script runs, or ensure it's available globally.
const supabaseUrl = 'https://sdpdmqndlabrfjrczyam.supabase.co'; // TODO: Replace with your actual Supabase Project URL (e.g., https://xyz.supabase.co)
const supabaseKey = 'sb_publishable_7Lxc83XanPdTuz0GzhPAgQ__bucoIXW'; // The API key you provided

// Create a single supabase client for interacting with your database
const sb = typeof supabase !== 'undefined' ? supabase.createClient(supabaseUrl, supabaseKey) : null;