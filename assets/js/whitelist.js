/**
 * Sky Realms SMP - Whitelist Application
 * Client-side validation + local queue storage.
 */

const WHITELIST_STORAGE_KEY = 'skyrealms-whitelist-applications-v1';
const WHITELIST_APPLICATIONS_OPEN = false;

function isValidMinecraftUsername(username) {
    return /^[A-Za-z0-9_]{3,16}$/.test(username);
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

function initWhitelistForm() {
    const form = document.getElementById('whitelistForm');
    const message = document.getElementById('whitelistMessage');
    const applyButton = document.getElementById('whitelistApplyBtn');

    if (!form || !message) return;

    if (applyButton) {
        applyButton.disabled = !WHITELIST_APPLICATIONS_OPEN;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!WHITELIST_APPLICATIONS_OPEN) {
            showWhitelistMessage(
                message,
                'Whitelist applications are currently closed. Please check back later.',
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

        if (discordUsername.length < 2) {
            showWhitelistMessage(message, 'Enter a valid Discord username.', 'error');
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
            `Application submitted for ${minecraftUsername}. If accepted, we will announce it through email at ${email}.`,
            'success'
        );

        form.reset();

        /**
         * Backend integration needed for production:
         * 1) POST to /api/whitelist/apply with application payload.
         * 2) Staff panel updates status to accepted/rejected.
         * 3) On accepted, backend sends transactional email notification.
         */
    });
}

document.addEventListener('DOMContentLoaded', initWhitelistForm);

window.WhitelistFunctions = {
    initWhitelistForm,
    isValidMinecraftUsername
};
