class BandwidthUtilizer {
    constructor() {
        this.state = {
            active: false,
            startTime: null,
            dataUsed: 0,
            threads: 1,
            limit: 0,
            intervals: [],
            speedSamples: []
        };

        this.elements = {
            controlBtn: document.getElementById('controlBtn'),
            dataMetric: document.getElementById('dataMetric'),
            speedMetric: document.getElementById('speedMetric'),
            timeMetric: document.getElementById('timeMetric'),
            threadControl: document.getElementById('threadControl'),
            dataLimit: document.getElementById('dataLimit'),
            threadCount: document.getElementById('threadCount')
        };

        this.initialize();
    }

    initialize() {
        this.elements.threadControl.addEventListener('input', (e) => {
            this.state.threads = parseInt(e.target.value);
            this.elements.threadCount.textContent = e.target.value;
        });

        this.elements.dataLimit.addEventListener('change', (e) => {
            this.state.limit = parseInt(e.target.value) * 1024; // Convert MB to KB
        });

        this.elements.controlBtn.addEventListener('click', () => this.toggle());
    }

    toggle() {
        if (!this.state.active) {
            if (!confirm('This will consume significant data. Proceed?')) return;
            this.start();
        } else {
            this.stop();
        }
    }

    async fetchChunk() {
        try {
            const start = performance.now();
            const response = await fetch(`https://picsum.photos/300/?${Math.random()}`);
            
            if (!response.ok) return false;
            
            const kb = 300; // Approx image size in KB
            const duration = (performance.now() - start) / 1000;
            
            this.state.dataUsed += kb;
            this.state.speedSamples.push((kb / duration) * 8); // Kbps
            
            if (this.state.speedSamples.length > 10) {
                this.state.speedSamples.shift();
            }
            
            return true;
        } catch (error) {
            console.error('Network error:', error);
            return false;
        }
    }

    updateUI() {
        // Data display
        this.elements.dataMetric.textContent = 
            `${(this.state.dataUsed / 1024).toFixed(1)} MB`;

        // Speed calculation
        const avgSpeed = this.state.speedSamples.length > 0 ?
            this.state.speedSamples.reduce((a, b) => a + b) / this.state.speedSamples.length :
            0;
        
        this.elements.speedMetric.textContent = 
            `${avgSpeed.toFixed(1)} Kbps`;

        // Time calculation
        const seconds = Math.floor((Date.now() - this.state.startTime) / 1000);
        const timeString = new Date(seconds * 1000)
            .toISOString().substr(11, 8);
        this.elements.timeMetric.textContent = timeString;
    }

    start() {
        this.state.active = true;
        this.state.startTime = Date.now();
        
        this.elements.controlBtn.classList.add('active');
        this.elements.controlBtn.textContent = 'Stop Utilization';

        // Create workers
        for (let i = 0; i < this.state.threads; i++) {
            const interval = setInterval(async () => {
                if (!this.state.active) return;
                
                if (this.state.limit > 0 && this.state.dataUsed >= this.state.limit) {
                    this.stop();
                    return;
                }

                await this.fetchChunk();
                this.updateUI();
            }, 1000);

            this.state.intervals.push(interval);
        }
    }

    stop() {
        this.state.active = false;
        this.state.intervals.forEach(clearInterval);
        this.state.intervals = [];
        
        this.elements.controlBtn.classList.remove('active');
        this.elements.controlBtn.textContent = 'Start Utilization';
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new BandwidthUtilizer();
});
