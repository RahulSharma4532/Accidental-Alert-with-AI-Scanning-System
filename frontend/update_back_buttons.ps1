$c = Get-Content .\src\pages\accidents\AccidentDetail.jsx -Raw
$c = $c -replace "navigate\('/accidents'\)", "navigate(-1)" -replace "Back to Accident Logs", "Go Back"
Set-Content .\src\pages\accidents\AccidentDetail.jsx $c

$c = Get-Content .\src\pages\admin\AdminRevenueDashboard.jsx -Raw
$c = $c -replace "navigate\('/admin'\)", "navigate(-1)" -replace "Back to Admin", "Go Back"
Set-Content .\src\pages\admin\AdminRevenueDashboard.jsx $c

$c = Get-Content .\src\pages\claims\ClaimDetail.jsx -Raw
$c = $c -replace "navigate\('/claims'\)", "navigate(-1)" -replace "Back to Claims List", "Go Back"
Set-Content .\src\pages\claims\ClaimDetail.jsx $c

$c = Get-Content .\src\pages\dashboard\Dashboard.jsx -Raw
$c = $c -replace "navigate\('/'\)", "navigate(-1)" -replace "Back to Portal", "Go Back"
Set-Content .\src\pages\dashboard\Dashboard.jsx $c

$c = Get-Content .\src\pages\insurer\ClaimQueue.jsx -Raw
$c = $c -replace "navigate\('/insurer'\)", "navigate(-1)" -replace "Back to Dashboard", "Go Back"
Set-Content .\src\pages\insurer\ClaimQueue.jsx $c

$c = Get-Content .\src\pages\mediator\MediatorDisputeDetail.jsx -Raw
$c = $c -replace "navigate\('/mediator'\)", "navigate(-1)" -replace "Back to Dashboard", "Go Back"
Set-Content .\src\pages\mediator\MediatorDisputeDetail.jsx $c

$c = Get-Content .\src\pages\profile\Profile.jsx -Raw
$c = $c -replace "navigate\('/'\)", "navigate(-1)" -replace "Back to Portal", "Go Back"
$c = $c -replace '(?s)<button\s+onClick=\{\(\) => navigate\(''/dashboard''\)\}.*?Back to Overview</span>\s+</button>', ''
Set-Content .\src\pages\profile\Profile.jsx $c

$authPages = @(".\src\pages\public\LoginPage.jsx", ".\src\pages\public\RegisterPage.jsx", ".\src\pages\public\ForgotPasswordPage.jsx")
foreach($f in $authPages) {
    if (Test-Path $f) {
        $c = Get-Content $f -Raw
        $c = $c -replace '(?s)<Link to="/" className="(.*?)">\s*<ArrowLeft className="(.*?)" /> Back to portal\s*</Link>', '<button onClick={() => navigate(-1)} className="$1 cursor-pointer"><ArrowLeft className="$2" /> Go Back</button>'
        Set-Content $f $c
    }
}
