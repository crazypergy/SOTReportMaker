// Automatically set the current date for Completed Tasks Date
document.addEventListener("DOMContentLoaded", function() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("completedTasksDate").value = today;
});

function submitForm() {
    // Gather the form data
    const formData = {
        sales: document.getElementById("sales").value,
        shiftSchedule: document.getElementById("shiftSchedule").value,
        completedTasksDate: document.getElementById("completedTasksDate").value,
        completedTasks: document.getElementById("completedTasks").value,
        tasksForTomorrowDate: document.getElementById("tasksForTomorrowDate").value,
        tasksForTomorrow: document.getElementById("tasksForTomorrow").value,
        lossReport: document.getElementById("lossReport").value,
        announcements: document.getElementById("announcements").value,
        customerFeedback: document.getElementById("customerFeedback").value,
        ordersDate: document.getElementById("ordersDate").value,
        orders: document.getElementById("orders").value
    };
    
    // Format data into a list structure
    const formattedData = `
        <ol>
            <li><strong>Sales</strong><br>${formData.sales}</li>
            <li><strong>Shift Schedule for Tomorrow</strong><br>${formData.shiftSchedule}</li>
            <li><strong>Completed Tasks (${formData.completedTasksDate})</strong><br>${formData.completedTasks}</li>
            <li><strong>Tasks for ${formData.tasksForTomorrowDate}</strong><br>${formData.tasksForTomorrow}</li>
            <li><strong>Loss Report</strong><br>${formData.lossReport}</li>
            <li><strong>Announcements</strong><br>${formData.announcements}</li>
            <li><strong>Customer Feedback & Observations</strong><br>${formData.customerFeedback}</li>
            <li><strong>Orders for ${formData.ordersDate}</strong><br>${formData.orders}</li>
        </ol>
    `;

    // Open a new window and display the formatted data
    const newWindow = window.open("", "_blank", "width=600,height=800");
    newWindow.document.write(`
        <html>
            <head>
                <title>Daily Report</title>
                <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light p-4">
                <div class="container">
                    <h2>Daily Report</h2>
                    <div id="reportContent" class="border rounded p-3 bg-white">${formattedData}</div>
                    <button id="copyButton" class="btn btn-primary mt-3">Copy to Clipboard</button>
                </div>
                <script>
                    // Copy to Clipboard function
                    document.getElementById("copyButton").onclick = function() {
                        const reportContent = document.getElementById("reportContent").innerText;
                        navigator.clipboard.writeText(reportContent).then(function() {
                            alert("Copied to clipboard!");
                        }).catch(function(err) {
                            console.error("Failed to copy: ", err);
                        });
                    };
                </script>
            </body>
        </html>
    `);

    newWindow.document.close();
}
