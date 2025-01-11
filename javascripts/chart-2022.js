document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("bar-chart-horizontal-2022")) {
        new Chart(document.getElementById("bar-chart-horizontal-2022"), {
            type: 'bar',
            data: {
                labels: ["2022"],
                datasets: [
                    {
                        label: "Signed-up",
                        backgroundColor: ["#3e95cd"],
                        data: [124]
                    },
                    {
                        label: "Passed entrance exam",
                        backgroundColor: ["#8e5ea2"],
                        data: [98]
                    },
                    {
                        label: "Attend classes",
                        backgroundColor: ["#F8CF60"],
                        data: [73]
                    },
                    {
                        label: "Passed final exam",
                        backgroundColor: ["#EC5F3B"],
                        data: [64]
                    },
                    {
                        label: "Certified",
                        backgroundColor: ["#84C678"],
                        data: [64]
                    }
                ]
            },
            options: {
                legend: { display: true },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cybersecurity lectures summary: 2022'
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