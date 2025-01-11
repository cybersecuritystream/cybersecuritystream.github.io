document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("bar-chart-horizontal-2023")) {
        new Chart(document.getElementById("bar-chart-horizontal-2023"), {
            type: 'bar',
            data: {
                labels: ["2023"],
                datasets: [
                    {
                        label: "Signed-up",
                        backgroundColor: ["#3e95cd"],
                        data: [109]
                    },
                    {
                        label: "Passed entrance exam",
                        backgroundColor: ["#8e5ea2"],
                        data: [100]
                    },
                    {
                        label: "Attend classes",
                        backgroundColor: ["#F8CF60"],
                        data: [83]
                    },
                    {
                        label: "Passed final exam",
                        backgroundColor: ["#EC5F3B"],
                        data: [65]
                    },
                    {
                        label: "Certified",
                        backgroundColor: ["#84C678"],
                        data: [65]
                    }
                ]
            },
            options: {
                legend: { display: true },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cybersecurity lectures summary: 2023'
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