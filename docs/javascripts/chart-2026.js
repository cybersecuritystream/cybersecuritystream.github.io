document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("bar-chart-horizontal-2026")) {
        new Chart(document.getElementById("bar-chart-horizontal-2026"), {
            type: 'bar',
            data: {
                labels: ["2026"],
                datasets: [
                    {
                        label: "Signed-up",
                        backgroundColor: ["#3e95cd"],
                        data: [238]
                    },
                    {
                        label: "Passed entrance exam",
                        backgroundColor: ["#8e5ea2"],
                        data: [178]
                    },
                    {
                        label: "Attend classes",
                        backgroundColor: ["#F8CF60"],
                        data: []
                    },
                    {
                        label: "Passed final exam",
                        backgroundColor: ["#EC5F3B"],
                        data: []
                    },
                    {
                        label: "Certified",
                        backgroundColor: ["#84C678"],
                        data: []
                    }
                ]
            },
            options: {
                legend: { display: true },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cybersecurity lectures summary: 2026'
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