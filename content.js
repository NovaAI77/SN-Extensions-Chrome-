(() => {
    const SYS_ID_REGEX = /^[a-f0-9]{32}$/i;
    const USER_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9._-]{2,}$/;

    const LEAF_TAGS = new Set(['SPAN', 'A', 'TD', 'LI', 'DIV', 'P', 'LABEL']);

    let hoverTimer = null;
    let tooltip = null;
    let lastValue = null;
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;

        clearTimeout(hoverTimer);

        const target = event.target;
        if (!target || !LEAF_TAGS.has(target.tagName)) {
            removeTooltip();
            return;
        }

        const directText = Array.from(target.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent.trim())
            .join(' ')
            .trim();

        if (!directText || directText.length > 64) {
            removeTooltip();
            return;
        }

        const value = directText.split(/\s+/)[0];

        if (value === lastValue) return;

        hoverTimer = setTimeout(() => {
            if (SYS_ID_REGEX.test(value)) {
                lookupUser(`sys_id=${value}`, value);
            } else if (USER_NAME_REGEX.test(value)) {
                lookupUser(`user_name=${value}`, value);
            } else {
                removeTooltip();
            }
        }, 600);
    });

    document.addEventListener('mouseleave', removeTooltip);

    async function lookupUser(query, value) {
        lastValue = value;

        try {
            const response = await fetch(
                `/api/now/table/sys_user?sysparm_query=${query}&sysparm_fields=name,email,location.name&sysparm_limit=1`,
                {
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                }
            );

            if (!response.ok) return;

            const data = await response.json();
            const user = data.result && data.result[0];

            if (!user) return;

            showTooltip(user);
        } catch (e) {
            // Silent failure
        }
    }

    function showTooltip(user) {
        removeTooltip();

        tooltip = document.createElement('div');
        tooltip.className = 'sn-user-tooltip';

        const name = document.createElement('div');
        name.className = 'sn-name';
        name.textContent = user.name || '';

        const email = document.createElement('div');
        email.className = 'sn-email';
        email.textContent = user.email || '';

        const location = document.createElement('div');
        location.className = 'sn-location';
        location.textContent = user['location.name'] || 'No Location';

        tooltip.appendChild(name);
        tooltip.appendChild(email);
        tooltip.appendChild(location);

        const PAD = 12;
        tooltip.style.position = 'fixed';
        tooltip.style.top = '-9999px';
        tooltip.style.left = '-9999px';
        document.body.appendChild(tooltip);

        const tw = tooltip.offsetWidth;
        const th = tooltip.offsetHeight;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const left = Math.min(mouseX + PAD, vw - tw - PAD);
        const top = Math.min(mouseY + PAD, vh - th - PAD);

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    function removeTooltip() {
        clearTimeout(hoverTimer);
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
        lastValue = null;
    }
})();
