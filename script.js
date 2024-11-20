// Default Configurations
let chunks = 1024;
let threads = 1;
let dataWasted = 0;
let stopAfter = 0;
let running = false;
let time = 0;
let instantTime = 0;
let loader = 0;
let threadsArr = [];

const element = document.getElementById("startBtn");
const timeObject = document.getElementById("timeRunningText");
const speedObject = document.getElementById("averageSpeedText");

// Start Function
function start() {
    for (let i = 0; i < threads; i++) {
        const temp = setInterval(() => {
            if (running) {
                if (stopAfter != 0 && dataWasted / 1024 >= stopAfter) {
                    stop();
                }

                instantTime = Date.now();
                const t = fetch("https://picsum.photos/200?" + Math.random())

                    .then(response => {
                        if (response.status == 200) {
                            dataWasted += chunks;
                            document.getElementById("dataWastedText").innerHTML = parseInt(dataWasted / 1024) + " MB";
                            if (loader % threads == 0) {
                                instantTime = Date.now() - instantTime;
                                speedObject.innerHTML = parseInt((chunks) / (instantTime / 1000)) * 8 + " Kbps";
                            }
                        }
                    });

                loader += 1;
            }
        }, 3000);
        threadsArr.push(temp);
    }
}

// Stop Function
function stop() {
    running = false;
    element.classList.remove("btn-danger");
    element.classList.add("btn-success");
    element.innerHTML = "Start Wasting";
    threadsArr.forEach(clearInterval);
}

// Update Timer
function timeRunningUpdate() {
    setInterval(() => {
        time += 1;
        if (time < 60) {
            timeObject.innerHTML = time + " sec";
        } else if (time < 3600) {
            timeObject.innerHTML = parseInt(time / 60) + " min " + time % 60 + " sec";
        } else {
            timeObject.innerHTML = parseInt(time / 3600) + " hrs " + parseInt((time - parseInt(time / 3600) * 3600) / 60) + " min " + time % 60 + " sec";
        }
    }, 1000);
}

// Start/Stop Button Click Event
document.getElementById("startBtn").addEventListener("click", () => {
    const rangeBar = document.getElementById("threadsRange");
    const stopafter = document.getElementById("stopafter");

    threads = parseInt(rangeBar.value) + 1;
    stopAfter = stopafter.value ? dataWasted + parseInt(stopafter.value) : 0;

    if (running) {
        stop();
    } else {
        running = true;
        element.classList.remove("btn-success");
        element.classList.add("btn-danger");
        element.innerHTML = "Stop Wasting";
        start();
        timeRunningUpdate();
    }
});
