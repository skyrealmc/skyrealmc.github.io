/**
 * Sky Realms SMP - Whitelist Application
 * Client-side validation + local queue storage.
 */

const WHITELIST_STORAGE_KEY = 'skyrealms-whitelist-applications-v1';

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
    const applyOverlay = document.getElementById('whitelistApplyOverlay');
    const applicationsOpen = form?.dataset.applicationsOpen === 'true';

    if (!form || !message) return;

    if (applyButton) {
        applyButton.disabled = !applicationsOpen;
    }

    if (applyOverlay) {
        applyOverlay.hidden = applicationsOpen;
    }

    form.addEventListener('submit', (event) => {
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
            `Application saved for ${minecraftUsername}. Staff review will be announced during the open whitelist window, and follow-up will use ${email}.`,
            'success'
        );

        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', initWhitelistForm);

window.WhitelistFunctions = {
    initWhitelistForm,
    isValidMinecraftUsername
};
