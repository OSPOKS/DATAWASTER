// Optimized DATAWASTER script

class DataWaster {
    constructor() {
        this.threads = 0;
        this.dataUsed = 0;
        this.startTime = null;
        this.fetchControllers = [];
        this.isRunning = false;
        this.maxDataLimit = null;
    }

    startWasting(threads, dataLimitMB = null) {
        if (this.isRunning) return;
        this.threads = threads;
        this.dataUsed = 0;
        this.startTime = performance.now();
        this.isRunning = true;
        this.maxDataLimit = dataLimitMB ? dataLimitMB * 1024 * 1024 : null;

        for (let i = 0; i < threads; i++) {
            this.fetchData(i);
        }
    }

    async fetchData(threadId) {
        while (this.isRunning) {
            try {
                const controller = new AbortController();
                this.fetchControllers.push(controller);
                const response = await fetch('https://picsum.photos/200', { signal: controller.signal });
                const blob = await response.blob();
                this.dataUsed += blob.size;

                if (this.maxDataLimit && this.dataUsed >= this.maxDataLimit) {
                    this.stopWasting();
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error(`Thread ${threadId} fetch error:`, error);
                }
            }
        }
    }

    stopWasting() {
        this.isRunning = false;
        this.fetchControllers.forEach(controller => controller.abort());
        this.fetchControllers = [];
        console.log(`Stopped. Total data used: ${(this.dataUsed / (1024 * 1024)).toFixed(2)} MB`);
    }

    getStats() {
        const elapsedTime = (performance.now() - this.startTime) / 1000;
        return {
            dataUsedMB: (this.dataUsed / (1024 * 1024)).toFixed(2),
            speedMbps: ((this.dataUsed * 8) / (elapsedTime * 1000000)).toFixed(2),
            runtimeSeconds: elapsedTime.toFixed(2)
        };
    }
}

// Usage
const dataWaster = new DataWaster();

// Start with 5 threads, optional 10MB limit
dataWaster.startWasting(5, 10);

// Stop manually after some time
setTimeout(() => dataWaster.stopWasting(), 30000);

// Log stats every 5 seconds
setInterval(() => console.log(dataWaster.getStats()), 5000);
