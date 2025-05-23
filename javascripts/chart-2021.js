document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("bar-chart-horizontal-2021")) {
        new Chart(document.getElementById("bar-chart-horizontal-2021"), {
            type: 'bar',
            data: {
                labels: ["2021"],
                datasets: [
                    {
                        label: "Signed-up",
                        backgroundColor: ["#3e95cd"],
                        data: [53]
                    },
                    {
                        label: "Passed entrance exam",
                        backgroundColor: ["#8e5ea2"],
                        data: [39]
                    },
                    {
                        label: "Attend classes",
                        backgroundColor: ["#F8CF60"],
                        data: [39]
                    },
                    {
                        label: "Passed final exam",
                        backgroundColor: ["#EC5F3B"],
                        data: [31]
                    },
                    {
                        label: "Certified",
                        backgroundColor: ["#84C678"],
                        data: [31]
                    }
                ]
            },
            options: {
                legend: { display: true },
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cybersecurity lectures summary: 2021'
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