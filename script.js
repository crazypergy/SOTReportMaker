// script.js - Updated with date pre-filling, empty field handling, and LINE-optimized clipboard copy
document.addEventListener("DOMContentLoaded", function() {
    // Set today's date for Completed Tasks (readonly)
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("completedTasksDate").value = today;

    // Pre-fill tomorrow's date for Tasks and Orders
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    document.getElementById("tasksForTomorrowDate").value = tomorrowStr;
    document.getElementById("ordersDate").value = tomorrowStr;
});

function submitForm() {
    // Gather and trim the form data; use "(none)" for empty fields
    const getValue = (id) => {
        const val = document.getElementById(id).value.trim();
        return val === "" ? "(none)" : val.replace(/\n/g, '<br>');
    };

    const formData = {
        sales: getValue("sales"),
        shiftSchedule: getValue("shiftSchedule"),
        completedTasksDate: document.getElementById("completedTasksDate").value,
        completedTasks: getValue("completedTasks"),
        tasksForTomorrowDate: document.getElementById("tasksForTomorrowDate").value,
        tasksForTomorrow: getValue("tasksForTomorrow"),
        lossReport: getValue("lossReport"),
        announcements: getValue("announcements"),
        customerFeedback: getValue("customerFeedback"),
        ordersDate: document.getElementById("ordersDate").value,
        orders: getValue("orders")
    };
    
    // Format data into a list structure (preserve line breaks with <br>)
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

    // Open preview window
    const reportWindow = window.open("", "_blank", "width=600,height=800");
    if (!reportWindow) {
        alert("Please allow pop-ups to view the report.");
        return;
    }

    reportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>SOT Coffee Shop Daily Report</title>
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 20px; }
                #reportContent ol { padding-left: 20px; }
            </style>
        </head>
        <body class="bg-light">
            <div class="container">
                <h2 class="text-center mb-4">SOT Coffee Shop Daily Report</h2>
                <div id="reportContent" class="border rounded p-4 bg-white mb-4">${formattedData}</div>
                <button id="copyButton" class="btn btn-success btn-lg btn-block">Copy Formatted Report (for LINE)</button>
            </div>
            <script>
                document.getElementById("copyButton").onclick = async () => {
                    const content = document.getElementById("reportContent");
                    try {
                        // Modern clipboard with HTML (preserves bold in LINE)
                        if (navigator.clipboard && navigator.clipboard.write) {
                            const htmlBlob = new Blob([content.innerHTML], { type: "text/html" });
                            const textBlob = new Blob([content.innerText], { type: "text/plain" });
                            const item = new ClipboardItem({ "text/html": htmlBlob, "text/plain": textBlob });
                            await navigator.clipboard.write([item]);
                        } else {
                            // Fallback: copy plain text
                            const range = document.createRange();
                            range.selectNode(content);
                            window.getSelection().removeAllRanges();
                            window.getSelection().addRange(range);
                            document.execCommand("copy");
                            window.getSelection().removeAllRanges();
                        }
                        alert("Formatted report copied! Ready to paste into LINE.");
                    } catch (err) {
                        console.error(err);
                        alert("Copy failed. Please select the text and copy manually.");
                    }
                };
            </script>
        </body>
        </html>
    `);

    reportWindow.document.close();
}
