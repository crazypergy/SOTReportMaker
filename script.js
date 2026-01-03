// script.js - SOT Coffee Shop Daily Report Generator
// Optimized for LINE pasting with bold formatting, whitespace trimming, and usability

// ============================================================================
// Page Load: Auto-fill dates when the page is ready
// ============================================================================
document.addEventListener("DOMContentLoaded", function() {
    // Set today's date (readonly) for "Completed Tasks Date"
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("completedTasksDate").value = today;

    // Pre-fill tomorrow's date for "Tasks for Date" and "Orders for Date"
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    document.getElementById("tasksForTomorrowDate").value = tomorrowStr;
    document.getElementById("ordersDate").value = tomorrowStr;
});

// ============================================================================
// Main Function: Generate and display the formatted report
// ============================================================================
function submitForm() {
    // ------------------------------------------------------------------------
    // Helper: Process textarea values – trim whitespace, handle empty fields,
    //         and preserve intentional line breaks
    // ------------------------------------------------------------------------
    const getTextareaValue = (id) => {
        const rawValue = document.getElementById(id).value;
        const trimmed = rawValue.trim();                    // Remove leading/trailing blank lines
        if (trimmed === "") return "(none)";
        return trimmed.replace(/\n/g, '<br>');               // Convert internal newlines to <br>
    };

    // Sales is a number input – handle empty case separately
    const salesValue = document.getElementById("sales").value.trim();
    const sales = salesValue === "" ? "(none)" : salesValue;

    // ------------------------------------------------------------------------
    // Collect all form data
    // ------------------------------------------------------------------------
    const formData = {
        sales: sales,
        shiftSchedule: getTextareaValue("shiftSchedule"),
        completedTasksDate: document.getElementById("completedTasksDate").value,
        completedTasks: getTextareaValue("completedTasks"),
        tasksForTomorrowDate: document.getElementById("tasksForTomorrowDate").value,
        tasksForTomorrow: getTextareaValue("tasksForTomorrow"),
        lossReport: getTextareaValue("lossReport"),
        announcements: getTextareaValue("announcements"),
        customerFeedback: getTextareaValue("customerFeedback"),
        ordersDate: document.getElementById("ordersDate").value,
        orders: getTextareaValue("orders")
    };
    
    // ------------------------------------------------------------------------
    // Build the formatted report HTML (ordered list with bold headings)
    // ------------------------------------------------------------------------
    const formattedData = `
        <ol style="padding-left: 20px;">
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

    // ------------------------------------------------------------------------
    // Open preview window and display the report
    // ------------------------------------------------------------------------
    const reportWindow = window.open("", "_blank", "width=600,height=800");
    if (!reportWindow) {
        alert("Please allow pop-ups to view the report.");
        return;
    }

    // Write full HTML document to the new window
    reportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>SOT Coffee Shop Daily Report</title>
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 20px; font-family: system-ui, sans-serif; }
                #reportContent { line-height: 1.6; }
            </style>
        </head>
        <body class="bg-light">
            <div class="container">
                <h2 class="text-center mb-4">SOT Coffee Shop Daily Report</h2>
                <div id="reportContent" class="border rounded p-4 bg-white mb-4">${formattedData}</div>
                <button id="copyButton" class="btn btn-success btn-lg btn-block shadow">
                    Copy Formatted Report (for LINE)
                </button>
            </div>

            <!-- ============================================================ -->
            <!-- Clipboard Copy Logic (inside preview window)                -->
            <!-- Supports rich HTML for bold text in LINE + plain text fallback -->
            <!-- ============================================================ -->
            <script>
                document.getElementById("copyButton").onclick = async () => {
                    const content = document.getElementById("reportContent");
                    try {
                        // Modern browsers: Copy both HTML (bold preserved) and plain text
                        if (navigator.clipboard && navigator.clipboard.write) {
                            const htmlBlob = new Blob([content.innerHTML], { type: "text/html" });
                            const textBlob = new Blob([content.innerText], { type: "text/plain" });
                            const clipboardItem = new ClipboardItem({
                                "text/html": htmlBlob,
                                "text/plain": textBlob
                            });
                            await navigator.clipboard.write([clipboardItem]);
                            alert("Formatted report copied successfully! Ready to paste into LINE.");
                        } else {
                            // Older browsers: Fallback to plain text selection copy
                            const range = document.createRange();
                            range.selectNode(content);
                            const selection = window.getSelection();
                            selection.removeAllRanges();
                            selection.addRange(range);
                            document.execCommand("copy");
                            selection.removeAllRanges();
                            alert("Report copied (plain text fallback).");
                        }
                    } catch (err) {
                        console.error("Copy failed:", err);
                        alert("Copy failed. Please select the text and copy manually.");
                    }
                };
            </script>
        </body>
        </html>
    `);

    reportWindow.document.close();
}

// ============================================================================
// Clear Form: Reset all inputs and restore auto-filled dates
// ============================================================================
function clearForm() {
    // Reset the form to default values
    document.getElementById("reportForm").reset();

    // Re-apply today's date
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("completedTasksDate").value = today;

    // Re-apply tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    document.getElementById("tasksForTomorrowDate").value = tomorrowStr;
    document.getElementById("ordersDate").value = tomorrowStr;

    // Return focus to Sales field for quick next entry
    document.getElementById("sales").focus();
}