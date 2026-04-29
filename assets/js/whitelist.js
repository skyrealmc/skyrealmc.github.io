/**
 * Sky Realms SMP - Whitelist Application
 * Client-side validation + backend API integration + Discord Auth + Membership Gate + Turnstile.
 */

const WHITELIST_STORAGE_KEY = 'skyrealms-whitelist-applications-v1';
const API_ENDPOINT = 'https://skybot.skyrealm.fun/api/whitelist/apply';
const AUTH_SESSION_ENDPOINT = 'https://skybot.skyrealm.fun/auth/session';
const AUTH_LOGIN_ENDPOINT = 'https://skybot.skyrealm.fun/auth/login';

let currentUserSession = null;
let turnstileVerified = false;

function isValidMinecraftUsername(username) {
    return /^[A-Za-z0-9_]{3,16}$/.test(username);
}

function isValidDiscordId(discordId) {
    return /^\d{17,19}$/.test(discordId);
}

function showWhitelistMessage(element, text, type) {
    element.innerHTML = text; // Allow HTML for links
    element.classList.remove('success', 'error', 'info');
    element.classList.add(type);
}

// ========================================
// Turnstile Callbacks
// ========================================
window.onTurnstileSuccess = function(token) {
    console.log('Turnstile verified');
    turnstileVerified = true;
    updateApplyButtonState();
};

window.onTurnstileExpired = function() {
    console.log('Turnstile expired');
    turnstileVerified = false;
    updateApplyButtonState();
};

function updateApplyButtonState() {
    const form = document.getElementById('whitelistForm');
    const applyButton = document.getElementById('whitelistApplyBtn');
    const applicationsOpen = form?.dataset.applicationsOpen === 'true';

    if (!applyButton) return;

    // Button should only be enabled if applications are open AND turnstile is verified
    applyButton.disabled = !(applicationsOpen && turnstileVerified);
}

async function checkDiscordSession() {
    try {
        const response = await fetch(AUTH_SESSION_ENDPOINT, { credentials: 'include' });
        if (!response.ok) return null;
        
        const data = await response.json();
        if (data.authenticated) {
            currentUserSession = data.user;
            updateDiscordUI(data.user);
            return data.user;
        }
    } catch (error) {
        console.error('Failed to check Discord session:', error);
    }
    return null;
}

function updateDiscordUI(user) {
    const statusText = document.getElementById('discordAuthStatus');
    const detailText = document.getElementById('discordAuthDetail');
    const loginBtn = document.getElementById('discordLoginBtn');
    const avatarImg = document.getElementById('discordUserAvatar');
    const discordInput = document.getElementById('discordUsername');
    const discordField = document.getElementById('discordUsernameField');

    if (user) {
        statusText.textContent = user.username;
        statusText.classList.add('connected');
        
        if (user.isGuildMember) {
            detailText.textContent = `Discord ID: ${user.id} (Member Verified)`;
            detailText.style.color = '#22C55E';
        } else {
            detailText.textContent = `Discord Linked, but not a member of the server.`;
            detailText.style.color = '#EF4444';
        }
        
        if (loginBtn) {
            loginBtn.innerHTML = '<span>Disconnect</span>';
            loginBtn.classList.remove('btn-discord');
            loginBtn.classList.add('btn-secondary');
            loginBtn.onclick = handleDiscordLogout;
        }

        if (avatarImg) {
            avatarImg.src = user.avatarUrl || '';
            avatarImg.classList.remove('hidden');
        }

        if (discordInput) {
            discordInput.value = user.id;
            discordInput.required = false;
        }

        if (discordField) {
            discordField.setAttribute('style', 'display: none !important');
        }
    } else {
        statusText.textContent = 'Discord Not Connected';
        statusText.classList.remove('connected');
        detailText.textContent = 'Link your Discord for automatic ID verification.';
        detailText.style.color = '';
        
        if (loginBtn) {
            loginBtn.innerHTML = `
                <svg class="discord-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Link Discord</span>
            `;
            loginBtn.classList.add('btn-discord');
            loginBtn.classList.remove('btn-secondary');
            loginBtn.onclick = handleDiscordLogin;
        }

        if (avatarImg) {
            avatarImg.classList.add('hidden');
        }

        if (discordInput) {
            discordInput.value = '';
            discordInput.required = true;
        }

        if (discordField) {
            discordField.style.display = 'block';
        }
    }
}

function handleDiscordLogin() {
    const returnUrl = window.location.origin + window.location.pathname;
    window.location.href = `${AUTH_LOGIN_ENDPOINT}?returnUrl=${encodeURIComponent(returnUrl)}`;
}

async function handleDiscordLogout() {
    try {
        await fetch('https://skybot.skyrealm.fun/auth/logout', { method: 'POST', credentials: 'include' });
        currentUserSession = null;
        updateDiscordUI(null);
        
        const discordInput = document.getElementById('discordUsername');
        if (discordInput) discordInput.value = '';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

function handleGuildRequiredError(messageElement, joinUrl) {
    const html = `
        <div style="margin-bottom: 10px;">You must be a member of our Discord server to apply.</div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="${joinUrl}" target="_blank" class="btn btn-discord btn-small" style="text-transform: none;">Join Discord</a>
            <button type="button" class="btn btn-secondary btn-small" onclick="location.reload()" style="text-transform: none;">I've Joined (Retry)</button>
        </div>
    `;
    showWhitelistMessage(messageElement, html, 'error');
}

async function submitToBackend(minecraftUsername, discordUsername, email, age, turnstileToken) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            minecraftUsername,
            discordId: discordUsername,
            email,
            age,
            turnstileToken // Send token to backend
        })
    });

    const rawBody = await response.text();
    let data = {};

    if (rawBody) {
        try {
            data = JSON.parse(rawBody);
        } catch (parseError) {
            data = { message: rawBody };
        }
    }

    if (!response.ok) {
        const error = new Error(data.message || data.error || `Server error: ${response.status}`);
        error.data = data;
        throw error;
    }

    return { success: true, data };
}

function initWhitelistForm() {
    const form = document.getElementById('whitelistForm');
    const message = document.getElementById('whitelistMessage');
    const applyButton = document.getElementById('whitelistApplyBtn');
    const loginBtn = document.getElementById('discordLoginBtn');
    const applicationsOpen = form?.dataset.applicationsOpen === 'true';

    if (!form || !message) return;

    if (loginBtn) {
        loginBtn.onclick = handleDiscordLogin;
    }

    checkDiscordSession();

    // Initial button state check
    updateApplyButtonState();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!applicationsOpen) {
            showWhitelistMessage(message, 'Whitelist applications are currently closed.', 'error');
            return;
        }

        const minecraftUsername = form.minecraftUsername.value.trim();
        const discordUsername = form.discordUsername.value.trim();
        const email = form.email.value.trim();
        const age = Number(form.age.value);
        const agreeRules = form.agreeRules.checked;
        
        // Get Turnstile token
        const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value;

        if (!isValidMinecraftUsername(minecraftUsername)) {
            showWhitelistMessage(message, 'Use a valid Minecraft username.', 'error');
            return;
        }

        if (!isValidDiscordId(discordUsername)) {
            showWhitelistMessage(message, 'Enter a valid Discord User ID (17-19 digits) or Link Discord above.', 'error');
            return;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showWhitelistMessage(message, 'Enter a valid email address.', 'error');
            return;
        }

        if (!Number.isInteger(age) || age < 13 || age > 99) {
            showWhitelistMessage(message, 'Age must be between 13 and 99.', 'error');
            return;
        }

        if (!agreeRules) {
            showWhitelistMessage(message, 'You must agree to the rules.', 'error');
            return;
        }

        if (!turnstileToken) {
            showWhitelistMessage(message, 'Please complete the security check.', 'error');
            return;
        }

        applyButton.disabled = true;
        showWhitelistMessage(message, 'Submitting...', 'info');

        try {
            await submitToBackend(minecraftUsername, discordUsername, email, age, turnstileToken);

            const applications = loadApplications();
            applications.push({
                id: `WL-${Date.now()}`,
                minecraftUsername,
                discordUsername,
                email,
                age,
                status: 'pending',
                submittedAt: new Date().toISOString()
            });
            saveApplications(applications);

            showWhitelistMessage(
                message,
                `✓ Application submitted for ${minecraftUsername}! Check Discord for updates.`,
                'success'
            );

            form.reset();
            // Reset Turnstile
            turnstileVerified = false;
            if (window.turnstile) {
                window.turnstile.reset();
            }
            
            if (currentUserSession) {
                updateDiscordUI(currentUserSession);
            }
            updateApplyButtonState();
        } catch (error) {
            // Reset Turnstile on error
            turnstileVerified = false;
            if (window.turnstile) {
                window.turnstile.reset();
            }
            updateApplyButtonState();

            if (error.data?.error === 'GUILD_REQUIRED') {
                handleGuildRequiredError(message, error.data.joinUrl);
            } else if (error.data?.error === 'AUTH_REQUIRED' || error.data?.error === 'TOKEN_EXPIRED') {
                showWhitelistMessage(message, 'Your session has expired. Please Link Discord again.', 'error');
                updateDiscordUI(null);
            } else {
                let errorMessage = error.message || 'Failed to submit application.';
                if (error.message.includes('duplicate')) {
                    errorMessage = 'You have already submitted an application in the last 24 hours.';
                }
                showWhitelistMessage(message, errorMessage, 'error');
            }
        } finally {
            // updateApplyButtonState will keep it disabled until re-verified if reset
            // but we want to ensure it stays disabled if we just submitted
        }
    });
}

document.addEventListener('DOMContentLoaded', initWhitelistForm);
