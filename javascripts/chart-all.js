document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("bar-chart-horizontal-all")) {
        new Chart(document.getElementById("bar-chart-horizontal-all"), {
            type: 'bar',
            data: {
                labels: ["2019", "2021", "2022", "2023", "2024", "2025"],
                datasets: [
                    {
                        label: "Signed-up",
                        backgroundColor: ["#3e95cd"],
                        data: [36, 53, 124, 109, 190, 167]
                    },
                    {
                        label: "Passed entrance exam",
                        backgroundColor: ["#8e5ea2"],
                        data: [25, 39, 98, 100, 139, 130]
                    },
                    {
                        label: "Attend classes",
                        backgroundColor: ["#F8CF60"],
                        data: [23, 39, 73, 83, 95, 98]
                    },
                    {
                        label: "Passed final exam",
                        backgroundColor: ["#EC5F3B"],
                        data: [11, 31, 64, 65, 86, 78]
                    },
                    {
                        label: "Certified",
                        backgroundColor: ["#84C678"],
                        data: [11, 31, 64, 65, 86, 78]
                    }
                ]
            },
            options: {
                legend: { display: true },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cybersecurity lectures summary: 2019-2025'
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