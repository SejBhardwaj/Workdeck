# Test Script for Priority Sorting Fix
# Run this AFTER restarting the backend server

Write-Output "=== PRIORITY SORTING VERIFICATION ===" ""

Write-Output "1. Testing Global Tasks - Priority ASC (should be low → medium → high):"
$responseAsc = Invoke-WebRequest -Uri "http://localhost:5000/tasks?sortBy=priority&sortOrder=asc" -UseBasicParsing
$tasksAsc = ($responseAsc.Content | ConvertFrom-Json).data
Write-Output "   Status: $($responseAsc.StatusCode)"

# Get our test tasks
$testTasksAsc = $tasksAsc | Where-Object { $_.title -like "TEST PRIORITY*" }
Write-Output "   Test tasks order:"
$testTasksAsc | ForEach-Object { Write-Output "     - $($_.title): $($_.priority)" }

# Check if order is correct
$priorities = $testTasksAsc | Select-Object -ExpandProperty priority
$expectedAsc = @("low", "medium", "high")
$isCorrectAsc = ($priorities[0] -eq "low" -and $priorities[1] -eq "medium" -and $priorities[2] -eq "high")
if ($isCorrectAsc) {
    Write-Output "   ✅ ASC order is CORRECT (low → medium → high)" ""
} else {
    Write-Output "   ❌ ASC order is INCORRECT" ""
}

Write-Output "2. Testing Global Tasks - Priority DESC (should be high → medium → low):"
$responseDesc = Invoke-WebRequest -Uri "http://localhost:5000/tasks?sortBy=priority&sortOrder=desc" -UseBasicParsing
$tasksDesc = ($responseDesc.Content | ConvertFrom-Json).data
Write-Output "   Status: $($responseDesc.StatusCode)"

$testTasksDesc = $tasksDesc | Where-Object { $_.title -like "TEST PRIORITY*" }
Write-Output "   Test tasks order:"
$testTasksDesc | ForEach-Object { Write-Output "     - $($_.title): $($_.priority)" }

$prioritiesDesc = $testTasksDesc | Select-Object -ExpandProperty priority
$isCorrectDesc = ($prioritiesDesc[0] -eq "high" -and $prioritiesDesc[1] -eq "medium" -and $prioritiesDesc[2] -eq "low")
if ($isCorrectDesc) {
    Write-Output "   ✅ DESC order is CORRECT (high → medium → low)" ""
} else {
    Write-Output "   ❌ DESC order is INCORRECT" ""
}

Write-Output "3. Testing Project-Specific Sorting:"
$projectId = "ddc24414-3b29-4b8e-9749-3d286d0bef87"
$projAsc = Invoke-WebRequest -Uri "http://localhost:5000/projects/$projectId/tasks?sortBy=priority&sortOrder=asc" -UseBasicParsing
$projTasksAsc = ($projAsc.Content | ConvertFrom-Json).data
Write-Output "   Project tasks (ASC):"
$projTasksAsc | Select-Object -First 5 | ForEach-Object { 
    Write-Output "     - $($_.title.Substring(0, [Math]::Min(35, $_.title.Length))): $($_.priority)" 
}

Write-Output ""
Write-Output "4. Testing Other Sort Fields (should be unchanged):"

# Test title sorting
$titleSort = Invoke-WebRequest -Uri "http://localhost:5000/tasks?sortBy=title&sortOrder=asc&limit=5" -UseBasicParsing
$titleTasks = ($titleSort.Content | ConvertFrom-Json).data
Write-Output "   Title ASC (first 3):"
$titleTasks | Select-Object -First 3 | ForEach-Object { Write-Output "     - $($_.title)" }

# Test created_at sorting
$dateSort = Invoke-WebRequest -Uri "http://localhost:5000/tasks?sortBy=created_at&sortOrder=desc&limit=3" -UseBasicParsing
$dateTasks = ($dateSort.Content | ConvertFrom-Json).data
Write-Output "   Created DESC (first 3):"
$dateTasks | Select-Object -First 3 | ForEach-Object { Write-Output "     - $($_.title)" }

Write-Output ""
if ($isCorrectAsc -and $isCorrectDesc) {
    Write-Output "=== ✅ ALL PRIORITY SORTING TESTS PASSED ==="
} else {
    Write-Output "=== ❌ PRIORITY SORTING NEEDS BACKEND RESTART ==="
    Write-Output "Stop the backend and restart with: cd backend && npm start"
}
