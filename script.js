// script.js - Fixed: getTextareaValue moved to correct scope

// Helper function - defined at the top so it's available everywhere
function getTextareaValue(id) {
    const raw = document.getElementById(id).value;
    const trimmed = raw.trim();
    return trimmed === "" ? "(none)" : trimmed.replace(/\n/g, '<br>');
}

document.addEventListener("DOMContentLoaded", function() {
    // Auto-fill today's date (readonly)
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("completedTasksDate").value = today;

    // Auto-fill tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    document.getElementById("tasksForTomorrowDate").value = tomorrowStr;

    // Show/hide custom shift input
    document.getElementById("shiftType").addEventListener("change", function() {
        const customField = document.getElementById("shiftCustom");
        customField.style.display = this.value === "Custom" ? "block" : "none";
        if (this.value !== "Custom") customField.value = "";
    });
});

// Add a shift line to the textarea
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

        // Reset shift inputs
        document.getElementById("shiftName").value = "";
        document.getElementById("shiftType").value = "早/Early";
        document.getElementById("shiftCustom").value = "";
        document.getElementById("shiftCustom").style.display = "none";
        document.getElementById("shiftTraining").checked = false;

        document.getElementById("shiftName").focus();
    } else {
        alert("名前とシフトを入力してください / Please enter name and shift.");
    }
}

// Generate the formatted report
function submitForm() {
    // Sales with discrepancy
    const salesValue = document.getElementById("sales").value.trim();
    const salesNum = salesValue === "" ? 0 : parseInt(salesValue, 10);
    const formattedSales = salesValue === "" ? "(none)" : `¥${salesNum.toLocaleString()}`;

    const discrepancyValue = document.getElementById("salesDiscrepancyAmount").value.trim();
    const discrepancyNum = discrepancyValue === "" ? 0 : parseInt(discrepancyValue, 10);
    const discrepancyNote = getTextareaValue("salesDiscrepancyNote");

    let salesLine = formattedSales;
    if (discrepancyNum !== 0) {
        const sign = discrepancyNum > 0 ? "+" : "-";
        salesLine += ` (${sign}¥${Math.abs(discrepancyNum).toLocaleString()})`;
        if (discrepancyNote !== "(none)") {
            salesLine += `<br>理由 / Reason: ${discrepancyNote}`;
        }
    }

    // Product production counts
    const plain = parseInt(document.getElementById("plainCheesecake").value) || 0;
    const seasonal = parseInt(document.getElementById("seasonalCheesecake").value) || 0;
    const nougat = parseInt(document.getElementById("nougatBar").value) || 0;

    let productionLine = "";
    if (plain > 0 || seasonal > 0 || nougat > 0) {
        productionLine = `<strong>生産数 / Production:</strong><br>`;
        if (plain > 0) productionLine += `・プレーンチーズケーキ / Plain Cheesecake: ${plain}個<br>`;
        if (seasonal > 0) productionLine += `・季節のチーズケーキ / Seasonal Cheesecake: ${seasonal}個<br>`;
        if (nougat > 0) productionLine += `・ヌガーバー / Nougat Bar: ${nougat}個<br>`;
        productionLine += "<br>";
    } else {
        productionLine = "(none)<br><br>";
    }

    // Roasting dates - month/day only
    const roastLatteBrazil = document.getElementById("roastLatteBrazil").value;
    const roastESP = document.getElementById("roastESP").value;

    let roastingLine = "";
    if (roastLatteBrazil || roastESP) {
        roastingLine = `<strong>焙煎日 / Roasting Dates:</strong><br>`;
        if (roastLatteBrazil) {
            const lbDate = new Date(roastLatteBrazil);
            const lbMonth = lbDate.getMonth() + 1;
            const lbDay = lbDate.getDate();
            roastingLine += `・Latte Brazil: ${lbMonth}月${lbDay}日<br>`;
        }
        if (roastESP) {
            const espDate = new Date(roastESP);
            const espMonth = espDate.getMonth() + 1;
            const espDay = espDate.getDate();
            roastingLine += `・ESP: ${espMonth}月${espDay}日<br>`;
        }
        roastingLine += "<br>";
    }

    // Special coffees notes
    const specialLatte = getTextareaValue("specialLatte");
    const lightAmericano = getTextareaValue("lightAmericano");
    const decaf = getTextareaValue("decaf");

    let specialCoffeesLine = "";
    if (specialLatte !== "(none)" || lightAmericano !== "(none)" || decaf !== "(none)") {
        specialCoffeesLine = `<strong>特別コーヒー / Special Coffees:</strong><br>`;
        if (specialLatte !== "(none)") specialCoffeesLine += `・Special Latte: ${specialLatte}<br>`;
        if (lightAmericano !== "(none)") specialCoffeesLine += `・Light Americano: ${lightAmericano}<br>`;
        if (decaf !== "(none)") specialCoffeesLine += `・Decaf: ${decaf}<br>`;
        specialCoffeesLine += "<br>";
    }

    const formData = {
        sales: salesLine,
        production: productionLine,
        shiftSchedule: getTextareaValue("shiftSchedule"),
        roasting: roastingLine,
        specialCoffees: specialCoffeesLine,
        completedTasksDate: document.getElementById("completedTasksDate").value,
        completedTasks: getTextareaValue("completedTasks"),
        tasksForTomorrowDate: document.getElementById("tasksForTomorrowDate").value,
        tasksForTomorrow: getTextareaValue("tasksForTomorrow"),
        lossReport: getTextareaValue("lossReport"),
        announcements: getTextareaValue("announcements"),
        customerFeedback: getTextareaValue("customerFeedback")
    };

    // Japanese date header
    const dateObj = new Date(formData.completedTasksDate);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const weekdays = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
    const weekday = weekdays[dateObj.getDay()];
    const japaneseDate = `${month}月${day}日　${weekday}`;

    const formattedData = `
        <div style="text-align: center; font-size: 1.4rem; font-weight: bold; color: #8b4513; margin-bottom: 32px;">
            ${japaneseDate}
        </div>
        <ol style="padding-left: 20px; margin: 0; line-height: 2.2;">
            <li><strong>*売上 / Sales*</strong><br>${formData.sales}<br><br></li>
            <li><strong>明日のシフト予定 / Shift Schedule for Tomorrow</strong><br>${formData.shiftSchedule}<br><br></li>
            <li><strong>生産・完了タスク (${formData.completedTasksDate}) / Production & Completed Tasks</strong><br>${formData.production}${formData.completedTasks}<br><br></li>
            <li><strong>${formData.tasksForTomorrowDate}のタスク / Tasks for ${formData.tasksForTomorrowDate}</strong><br>${formData.tasksForTomorrow}<br><br></li>
            <li><strong>ロス報告 / Loss Report</strong><br>${formData.lossReport}<br><br></li>
            ${formData.roasting ? `<li>${formData.roasting}</li>` : ''}
            ${formData.specialCoffees ? `<li>${formData.specialCoffees}</li>` : ''}
            <li><strong>お知らせ / Announcements</strong><br>${formData.announcements}<br><br></li>
            <li><strong>お客様の声・観察事項 / Customer Feedback & Observations</strong><br>${formData.customerFeedback}<br><br></li>
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
                body { padding: 24px; font-family: system-ui, -apple-system, "Hiragino Kaku Gothic ProN", sans-serif; background: #f9f5f0; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                h2 { text-align: center; color: #8b4513; margin-bottom: 16px; font-size: 1.8rem; }
                #reportContent { line-height: 1.8; padding: 20px; background: #fff; border: 1px solid #e6d8c8; border-radius: 12px; }
                #copyButton { background: #8b4513; margin-top: 32px; padding: 18px; font-size: 1.2rem; border: none; color: white; border-radius: 12px; width: 100%; font-weight: 600; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>SOT Coffee Shop 日報 / Daily Report</h2>
                <div id="reportContent">${formattedData}</div>
                <button id="copyButton">LINE用レポートコピー / Copy Formatted Report (for LINE)</button>
            </div>

            <script>
                document.getElementById("copyButton").onclick = async () => {
                    const content = document.getElementById("reportContent");
                    try {
                        if (navigator.clipboard && navigator.clipboard.write) {
                            const htmlBlob = new Blob([content.innerHTML], { type: "text/html" });
                            const textBlob = new Blob([content.innerText], { type: "text/plain" });
                            const clipboardItem = new ClipboardItem({ "text/html": htmlBlob, "text/plain": textBlob });
                            await navigator.clipboard.write([clipboardItem]);
                            alert("レポートがコピーされました！ LINEに貼り付け可能です / Formatted report copied! Ready to paste into LINE.");
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
                        alert("コピーに失敗しました。手動で選択してコピーしてください / Copy failed. Please select and copy manually.");
                    }
                };
            </script>
        </body>
        </html>
    `);

    reportWindow.document.close();
}

// Clear form and restore defaults
function clearForm() {
    document.getElementById("reportForm").reset();

    const today = new Date().toISOString().split("T")[0];
    document.getElementById("completedTasksDate").value = today;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    document.getElementById("tasksForTomorrowDate").value = tomorrowStr;

    document.getElementById("salesDiscrepancyAmount").value = "0";
    document.getElementById("plainCheesecake").value = "0";
    document.getElementById("seasonalCheesecake").value = "0";
    document.getElementById("nougatBar").value = "0";

    document.getElementById("roastLatteBrazil").value = "";
    document.getElementById("roastESP").value = "";
    document.getElementById("specialLatte").value = "";
    document.getElementById("lightAmericano").value = "";
    document.getElementById("decaf").value = "";

    document.getElementById("sales").focus();
}
