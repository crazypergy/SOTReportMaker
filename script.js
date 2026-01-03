// script.js - Updated to show ¥ symbol in Sales output

document.addEventListener("DOMContentLoaded", function() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("completedTasksDate").value = today;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    document.getElementById("tasksForTomorrowDate").value = tomorrowStr;
    document.getElementById("ordersDate").value = tomorrowStr;

    // Show/hide custom shift input based on dropdown
    document.getElementById("shiftType").addEventListener("change", function() {
        document.getElementById("shiftCustom").style.display = this.value === "Custom" ? "block" : "none";
    });
});

function addShift() {
    const name = document.getElementById("shiftName").value.trim();
    let shift = document.getElementById("shiftType").value;
    if (shift === "Custom") {
        shift = document.getElementById("shiftCustom").value.trim();
    }
    const training = document.getElementById("shiftTraining").checked ? "トレ/Training " : "";

    if (name && shift) {
        const line = `[${name}] ${training}[${shift}]`;
        const textarea = document.getElementById("shiftSchedule");
        textarea.value += (textarea.value ? "\n" : "") + line;

        // Clear inputs for next entry
        document.getElementById("shiftName").value = "";
        document.getElementById("shiftType").value = "早/Early";
        document.getElementById("shiftCustom").value = "";
        document.getElementById("shiftCustom").style.display = "none";
        document.getElementById("shiftTraining").checked = false;
    } else {
        alert("名前とシフトを入力してください / Please enter name and shift.");
    }
}

function submitForm() {
    const getTextareaValue = (id) => {
        const rawValue = document.getElementById(id).value;
        const trimmed = rawValue.trim();
        if (trimmed === "") return "(none)";
        return trimmed.replace(/\n/g, '<br>');
    };

    // Format Sales with Yen symbol
    const salesValue = document.getElementById("sales").value.trim();
    const sales = salesValue === "" ? "(none)" : `¥${salesValue}`;

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
    
    const formattedData = `
        <ol style="padding-left: 20px; margin: 0;">
            <li><strong>売上 / Sales</strong><br>${formData.sales}</li>
            <li><strong>明日のシフト予定 / Shift Schedule for Tomorrow</strong><br>${formData.shiftSchedule}</li>
            <li><strong>完了したタスク (${formData.completedTasksDate}) / Completed Tasks (${formData.completedTasksDate})</strong><br>${formData.completedTasks}</li>
            <li><strong>${formData.tasksForTomorrowDate}のタスク / Tasks for ${formData.tasksForTomorrowDate}</strong><br>${formData.tasksForTomorrow}</li>
            <li><strong>ロス報告 / Loss Report</strong><br>${formData.lossReport}</li>
            <li><strong>お知らせ / Announcements</strong><br>${formData.announcements}</li>
            <li><strong>お客様の声・観察事項 / Customer Feedback & Observations</strong><br>${formData.customerFeedback}</li>
            <li><strong>${formData.ordersDate}の発注 / Orders for ${formData.ordersDate}</strong><br>${formData.orders}</li>
        </ol>
    `;

    const reportWindow = window.open("", "_blank", "width=600,height=800");
    if (!reportWindow) {
        alert("ポップアップを許可してください / Please allow pop-ups to view the report.");
        return;
    }

    reportWindow.document.write(`
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <title>SOT Coffee Shop 日報 / Daily Report</title>
            <style>
               <style>
    body { 
        padding: 24px; 
        font-family: system-ui, -apple-system, "Hiragino Kaku Gothic ProN", sans-serif; 
        background: #f9f5f0; 
    }
    .container { 
        max-width: 600px; 
        margin: 0 auto; 
        background: white; 
        padding: 32px; 
        border-radius: 16px; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
    }
    h2 { 
        text-align: center; 
        color: #8b4513; 
        margin-bottom: 32px; 
        font-size: 1.8rem; 
    }
    #reportContent { 
        line-height: 1.8; 
        padding: 20px; 
        background: #fff; 
        border: 1px solid #e6d8c8; 
        border-radius: 12px; 
    }
    #copyButton {
        background: #8b4513;
        margin-top: 32px;
        padding: 18px;
        font-size: 1.2rem;
    }
</style>
            </style>
        </head>
        <body class="bg-light">
            <div class="container">
                <h2 class="text-center mb-4">SOT Coffee Shop 日報 / Daily Report</h2>
                <div id="reportContent" class="border rounded p-4 bg-white mb-4">${formattedData}</div>
                <button id="copyButton" class="btn btn-success btn-lg btn-block shadow">
                    LINE用レポートコピー / Copy Formatted Report (for LINE)
                </button>
            </div>

            <script>
                document.getElementById("copyButton").onclick = async () => {
                    const content = document.getElementById("reportContent");
                    try {
                        if (navigator.clipboard && navigator.clipboard.write) {
                            const htmlBlob = new Blob([content.innerHTML], { type: "text/html" });
                            const textBlob = new Blob([content.innerText], { type: "text/plain" });
                            const clipboardItem = new ClipboardItem({
                                "text/html": htmlBlob,
                                "text/plain": textBlob
                            });
                            await navigator.clipboard.write([clipboardItem]);
                            alert("レポートがコピーされました！ LINEに貼り付け可能です / Formatted report copied successfully! Ready to paste into LINE.");
                        } else {
                            const range = document.createRange();
                            range.selectNode(content);
                            const selection = window.getSelection();
                            selection.removeAllRanges();
                            selection.addRange(range);
                            document.execCommand("copy");
                            selection.removeAllRanges();
                            alert("レポートがコピーされました（プレーンテキスト） / Report copied (plain text fallback).");
                        }
                    } catch (err) {
                        console.error("Copy failed:", err);
                        alert("コピーに失敗しました。手動で選択してコピーしてください / Copy failed. Please select the text and copy manually.");
                    }
                };
            </script>
        </body>
        </html>
    `);

    reportWindow.document.close();
}

function clearForm() {
    document.getElementById("reportForm").reset();

    const today = new Date().toISOString().split("T")[0];
    document.getElementById("completedTasksDate").value = today;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    document.getElementById("tasksForTomorrowDate").value = tomorrowStr;
    document.getElementById("ordersDate").value = tomorrowStr;

    document.getElementById("sales").focus();
}