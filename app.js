if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("/serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    });
}

async function subscribeToPush() {
    if (navigator.serviceWorker) {

        const reg = await navigator.serviceWorker.getRegistration();

        if (reg && reg.pushManager) {

            const subscription = await reg.pushManager.getSubscription();

            if (!subscription) {

                console.info("existe subscription");
                // const key = await fetch("https://example.com/vapid_key");
                // const keyData = await key.text();

                const sub = await reg.pushManager.subscribe({
                    applicationServerKey: "msc-push-notification",
                    userVisibleOnly: true
                });

                console.info("sub: ", sub);

                await fetch("https://example.com/push_subscribe", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        endpoint: sub.endpoint,
                        expirationTime: sub.expirationTime,
                        keys: sub.toJSON().keys
                    })
                });

            }

        }

    }
}