//Language Selection
document.addEventListener("DOMContentLoaded", function(){
    //Hide main form until language is selected
    document.getElementById("reportForm").style.display = "none";
});

function setLanguage(lang){
    localStorage.setItem("selectedLang", lang); //store choice
    document.getElementById("languageSelection").style.display = "none";
    document.getElementById("reportForm").style.display = "block";

    if (lang === "ja") {
        //Translate UI to Japanese
        document.getElementById("salesLabel").innerText = "売上"; // Sales  
        document.getElementById("sales").innerText = "ここに売上データを入力してください"; //text box
        document.getElementById("shiftScheduleLabel").innerText = "明日のシフト"; // Shift Schedule for Tomorrow  
        document.getElementById("completedTasksDateLabel").innerText = "完了した作業の日付"; // Completed Tasks Date  
        document.getElementById("completedTasksLabel").innerText = "完了した作業"; // Completed Tasks
        document.getElementById("tasksForDateLabel").innerText = "明日の作業"; // Tasks for Tomorrow Date  
        document.getElementById("tasksForTomorrowLabel").innerText = "明日の作業"; // Tasks for Tomorrow  
        document.getElementById("lossReportLabel").innerText = "損失報告"; // Loss Report  
        document.getElementById("announcementsLabel").innerText = "お知らせ"; // Announcements  
        document.getElementById("customerFeedbackLabel").innerText = "顧客のフィードバックと観察"; // Customer Feedback & Observations  
        document.getElementById("ordersLabel").innerText = "注文"; // Orders  
        document.getElementById("ordersDateLabel").innerText = "注文の日付"; // Orders for Date

        // Update Input Placeholders or InnerText
        document.getElementById("sales").placeholder = "ここに売上データを入力してください";  
        document.getElementById("shiftSchedule").placeholder = "ここに明日のシフトを入力してください";  
        document.getElementById("completedTasksDate").innerText = "完了した作業の日付";  
        document.getElementById("completedTasks").placeholder = "ここに完了した作業を入力してください";  
        document.getElementById("tasksForTomorrowDate").innerText = "明日の作業の日付";  
        document.getElementById("tasksForTomorrow").placeholder = "ここに明日の作業を入力してください";  
        document.getElementById("lossReport").placeholder = "ここに損失報告を入力してください";  
        document.getElementById("announcements").placeholder = "ここにお知らせを入力してください";  
        document.getElementById("customerFeedback").placeholder = "ここに顧客のフィードバックを入力してください";  
        document.getElementById("ordersDate").innerText = "注文の日付";  
        document.getElementById("orders").placeholder = "ここに注文を入力してください";  
    }
}

// Automatically set the current date for Completed Tasks Date
document.addEventListener("DOMContentLoaded", function() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("completedTasksDate").value = today;
});

//Automatically set tomorrow's date for Tasks for Tomorrow
document.addEventListener("DOMContentLoaded", function(){
    const today = new Date();
    today.setDate(today.getDate() + 1); //Move to the next day
    const tomorrow = today.toISOString().split("T")[0]; //Format as YYY-MM-DD
    document.getElementById("tasksForTomorrowDate").value = tomorrow;
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
