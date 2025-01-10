# CRC 2021 edition

## Summary

{{ read_csv('summary.csv') }}

<div>
<canvas id="bar-chart-horizontal" width="800" height="420"></canvas>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById("bar-chart-horizontal")) {
        new Chart(document.getElementById("bar-chart-horizontal"), {
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
</script>

## Topics

{{ read_csv('topics.csv', colalign=("left","left",)) }}

## Assessment

Here are some opinions from our training participants in **CRC'21**:

![CRC Cybersecurity survey 2021](crc-cybersecurity-survey-2021.png){ loading=lazy }

## Testimonials

!!! quote "2021 training participant 1"

    Great course, thanks!

!!! quote "2021 training participant 2"
    
    It is a pity that the course only lasted two days. There was no time to bite into the topic :)

!!! quote "2021 training participant 3"

    Even more labs would be welcome ;)

!!! quote "2021 training participant 4"

    In my opinion more practical exercises would be better, also homework tasks would be welcome too.
