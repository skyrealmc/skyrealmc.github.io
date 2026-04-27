/**
 * Sky Realms SMP - Whitelist Application
 * Client-side validation + backend API integration.
 */

const WHITELIST_STORAGE_KEY = 'skyrealms-whitelist-applications-v1';
const API_ENDPOINT = 'https://skybot.skyrealm.fun/api/whitelist/apply';

function isValidMinecraftUsername(username) {
    return /^[A-Za-z0-9_]{3,16}$/.test(username);
}

function isValidDiscordId(discordId) {
    return /^\d{17,19}$/.test(discordId);
}

function showWhitelistMessage(element, text, type) {
    element.textContent = text;
    element.classList.remove('success', 'error');
    element.classList.add(type);
}

function loadApplications() {
    try {
        const raw = localStorage.getItem(WHITELIST_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}

function saveApplications(applications) {
    localStorage.setItem(WHITELIST_STORAGE_KEY, JSON.stringify(applications));
}

async function submitToBackend(minecraftUsername, discordUsername, email, age) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            minecraftUsername,
            discordId: discordUsername,
            email,
            age
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
        throw new Error(data.message || data.error || `Server error: ${response.status}`);
    }

    return { success: true, data };
}

function initWhitelistForm() {
    const form = document.getElementById('whitelistForm');
    const message = document.getElementById('whitelistMessage');
    const applyButton = document.getElementById('whitelistApplyBtn');
    const applyOverlay = document.getElementById('whitelistApplyOverlay');
    const applicationsOpen = form?.dataset.applicationsOpen === 'true';

    if (!form || !message) return;

    if (applyButton) {
        applyButton.disabled = !applicationsOpen;
    }

    if (applyOverlay) {
        applyOverlay.hidden = applicationsOpen;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!applicationsOpen) {
            showWhitelistMessage(
                message,
                'Whitelist applications are currently closed. Join Discord chat for launch updates and the next application window.',
                'error'
            );
            return;
        }

        const minecraftUsername = form.minecraftUsername.value.trim();
        const discordUsername = form.discordUsername.value.trim();
        const email = form.email.value.trim();
        const age = Number(form.age.value);
        const agreeRules = form.agreeRules.checked;

        if (!isValidMinecraftUsername(minecraftUsername)) {
            showWhitelistMessage(
                message,
                'Use a valid Minecraft username (3-16 chars, letters/numbers/underscore only).',
                'error'
            );
            return;
        }

        if (!isValidDiscordId(discordUsername)) {
            showWhitelistMessage(message, 'Enter a valid Discord User ID (17-19 digits).', 'error');
            return;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showWhitelistMessage(message, 'Enter a valid email address.', 'error');
            return;
        }

        if (!Number.isInteger(age) || age < 13 || age > 99) {
            showWhitelistMessage(message, 'Age must be a number between 13 and 99.', 'error');
            return;
        }

        if (!agreeRules) {
            showWhitelistMessage(message, 'You must agree to the rules before applying.', 'error');
            return;
        }

        applyButton.disabled = true;
        showWhitelistMessage(message, 'Submitting your application...', 'info');

        try {
            const result = await submitToBackend(minecraftUsername, discordUsername, email, age);

            const applications = loadApplications();
            const application = {
                id: `WL-${Date.now()}`,
                minecraftUsername,
                discordUsername,
                email,
                age,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };
            applications.push(application);
            saveApplications(applications);

            showWhitelistMessage(
                message,
                `✓ Application submitted for ${minecraftUsername}! Check your email (${email}) for updates. Staff will review your application and announce results in Discord.`,
                'success'
            );

            form.reset();
        } catch (error) {
            let errorMessage = error.message || 'Failed to submit application. Please try again.';

            if (error instanceof TypeError || /Failed to fetch/i.test(errorMessage)) {
                errorMessage = 'Unable to reach the whitelist server. Open this site using https://skyrealm.fun and try again without VPN/ad-block network filters.';
            }
            
            if (error.message.includes('duplicate')) {
                errorMessage = 'You have already submitted an application. Please wait for staff review.';
            } else if (error.message.includes('closed')) {
                errorMessage = 'Whitelist applications are currently closed.';
            }

            showWhitelistMessage(message, errorMessage, 'error');
        } finally {
            applyButton.disabled = !applicationsOpen;
        }
    });
}

document.addEventListener('DOMContentLoaded', initWhitelistForm);

window.WhitelistFunctions = {
    initWhitelistForm,
    isValidMinecraftUsername
};
