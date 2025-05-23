document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("bar-chart-horizontal-2025")) {
        new Chart(document.getElementById("bar-chart-horizontal-2025"), {
            type: 'bar',
            data: {
                labels: ["2025"],
                datasets: [
                    {
                        label: "Signed-up",
                        backgroundColor: ["#3e95cd"],
                        data: [167]
                    },
                    {
                        label: "Passed entrance exam",
                        backgroundColor: ["#8e5ea2"],
                        data: [130]
                    },
                    {
                        label: "Attend classes",
                        backgroundColor: ["#F8CF60"],
                        data: [98]
                    },
                    {
                        label: "Passed final exam",
                        backgroundColor: ["#EC5F3B"],
                        data: [78]
                    },
                    {
                        label: "Certified",
                        backgroundColor: ["#84C678"],
                        data: [78]
                    }
                ]
            },
            options: {
                legend: { display: true },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cybersecurity lectures summary: 2025'
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
});