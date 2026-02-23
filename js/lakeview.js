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

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuButton ? mobileMenuButton.querySelector('span.material-symbols-outlined') : null;

    if (mobileMenuButton && mobileMenu && menuIcon) {
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            menuIcon.textContent = isHidden ? 'menu' : 'close';
            mobileMenuButton.setAttribute('aria-expanded', !isHidden);
        });
    }

    // Admin Login Logic
    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-login-id').value;
            const password = document.getElementById('admin-login-password').value;
            const button = adminLoginForm.querySelector('button[type="submit"]');
            
            button.disabled = true;
            button.innerHTML = `<span class="material-symbols-outlined animate-spin">progress_activity</span> Logging In...`;

            try {
                const { data, error } = await sb.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                document.getElementById('admin-login-view').classList.add('hidden');
                document.getElementById('admin-dashboard-view').classList.remove('hidden');
                await loadAdminDashboard();

            } catch (error) {
                alert('Login Failed: ' + error.message);
            } finally {
                button.disabled = false;
                button.innerHTML = `<span class="material-symbols-outlined">login</span> Access Dashboard`;
            }
        });
    }

    // Admin Logout Logic
    const adminLogoutButton = document.getElementById('admin-logout-button');
    if (adminLogoutButton) {
        adminLogoutButton.addEventListener('click', async () => {
            await sb.auth.signOut();
            document.getElementById('admin-dashboard-view').classList.add('hidden');
            document.getElementById('admin-login-view').classList.remove('hidden');
            alert('You have been logged out.');
        });
    }

    // Portal Login Logic
    const portalLoginForm = document.getElementById('portal-login-form');
    if (portalLoginForm) {
        portalLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, you'd validate credentials here.
            document.getElementById('portal-login-view').classList.add('hidden');
            document.getElementById('portal-dashboard-view').classList.remove('hidden');
            // Potentially load student data here in a real app
        });
    }

    // Function to load and render admin dashboard data
    async function loadAdminDashboard() {
        // Fetch and display user info
        if (!sb) return;
        
        const { data: { user } } = await sb.auth.getUser();
        if (user) {
            const userNameEl = document.getElementById('admin-user-name');
            if (userNameEl) {
                userNameEl.textContent = user.user_metadata?.full_name || user.email;
            }
        }

        // Load data from localStorage (as before)
        const notifications = JSON.parse(localStorage.getItem('lakeview_notifications') || '[]');
        renderNotifications(notifications);
        renderActivities();

        const inquiryStat = document.getElementById('stat-inquiries');
        if(inquiryStat) {
            inquiryStat.textContent = notifications.length;
        }
    }

    function renderNotifications(notifications) {
        const container = document.getElementById('admin-notifications-container');
        if (!container) return;

        if (notifications.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 px-6">
                    <span class="material-symbols-outlined text-4xl text-slate-400">inbox</span>
                    <p class="mt-2 text-sm font-medium text-slate-500">No new notifications.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = notifications.map(n => `
            <div class="flex items-start gap-4 p-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary">
                    <span class="material-symbols-outlined">${n.type === 'admission' ? 'assignment_ind' : 'contact_support'}</span>
                </div>
                <div class="flex-grow">
                    <p class="font-bold text-sm">${n.title} <span class="ml-2 text-xs font-medium text-slate-500">from ${n.user}</span></p>
                    <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">${n.details}</p>
                    <div class="text-xs text-slate-400 mt-2"><span>${n.email}</span> &bull; <span>${n.date}</span></div>
                </div>
                <button class="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><span class="material-symbols-outlined text-lg">more_vert</span></button>
            </div>
        `).join('');
    }

    function renderActivities() {
        const activities = JSON.parse(localStorage.getItem('lakeview_activities') || '[]');
        const container = document.getElementById('admin-activity-log');
        if (!container) return;

        container.innerHTML = activities.slice(0, 5).map(a => `
            <div class="flex items-center gap-4 py-3 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                <span class="material-symbols-outlined text-slate-400 text-xl">history</span>
                <div class="flex-grow"><p class="text-sm font-medium">${a.action}</p><p class="text-xs text-slate-500">${a.date}</p></div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">${a.status}</span>
            </div>
        `).join('');
    }
});