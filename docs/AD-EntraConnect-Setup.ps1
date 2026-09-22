<#
.SYNOPSIS
    สรุปคำสั่ง PowerShell สำหรับติดตั้ง/ตรวจสอบ Entra Connect Sync (PHS)
    อ้างอิงจาก docs/AD-EntraID-SSO-Requirements.md ข้อ 2.4

.NOTES
    - รัน Step 1-2 บน Domain Controller / AD envigithubronment
    - รัน Step 3 บน Entra Connect Server (หลังติดตั้ง Entra Connect Sync ผ่าน wizard แล้ว)
    - รัน Step 4 บนเครื่องที่มี Microsoft Graph PowerShell module (Install-Module Microsoft.Graph)
    - แก้ไขค่าตัวแปรด้านล่างให้ตรงกับ environment จริงก่อนรัน
#>

param(
    [string]$DomainDN = "DC=contoso,DC=com",
    [string]$ServiceAccountOU = "ServiceAccounts",
    [string]$ServiceAccountName = "svc-entraconnect",
    [string]$Upn = "svc-entraconnect@contoso.com",
    [string]$TestUserUpn = "user1@contoso.com"
)

# ---------------------------------------------------------------------------
# Step 1: ตรวจสอบความพร้อมของ Server ก่อนติดตั้ง Entra Connect (ทีม Infra)
# ---------------------------------------------------------------------------
function Test-EntraConnectPrerequisites {
    Write-Host "== ตรวจสอบ TLS 1.2 ==" -ForegroundColor Cyan
    Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\TLS 1.2\Client' `
        -Name 'DisabledByDefault' -ErrorAction SilentlyContinue

    Write-Host "== ตรวจสอบการเชื่อมต่อไปยัง Microsoft 365 endpoint ==" -ForegroundColor Cyan
    Test-NetConnection login.microsoftonline.com -Port 443
}

# ---------------------------------------------------------------------------
# Step 2: สร้าง Service Account สำหรับ Entra Connect Connector (รันบน Domain Controller)
# ---------------------------------------------------------------------------
function New-EntraConnectServiceAccount {
    param(
        [Parameter(Mandatory)] [securestring]$Password
    )

    New-ADOrganizationalUnit -Name $ServiceAccountOU -Path $DomainDN -ErrorAction SilentlyContinue

    New-ADUser -Name $ServiceAccountName `
        -SamAccountName $ServiceAccountName `
        -UserPrincipalName $Upn `
        -Path "OU=$ServiceAccountOU,$DomainDN" `
        -AccountPassword $Password `
        -Enabled $true `
        -PasswordNeverExpires $true
}

# ---------------------------------------------------------------------------
# Step 3: ตรวจสอบสถานะ Sync บน Entra Connect Server (Import-Module ADSync)
# ---------------------------------------------------------------------------
function Get-EntraConnectSyncStatus {
    Import-Module ADSync
    Get-ADSyncScheduler
}

function Start-EntraConnectDeltaSync {
    Import-Module ADSync
    Start-ADSyncSyncCycle -PolicyType Delta
}

# ---------------------------------------------------------------------------
# Step 4: ตรวจสอบผู้ใช้ที่ถูก sync เข้า Entra ID แล้ว (Microsoft Graph PowerShell)
# ---------------------------------------------------------------------------
function Get-SyncedEntraUser {
    param(
        [string]$UserPrincipalName = $TestUserUpn
    )

    Connect-MgGraph -Scopes "User.Read.All"
    Get-MgUser -Filter "userPrincipalName eq '$UserPrincipalName'" `
        -Property "displayName,userPrincipalName,mail,employeeId,onPremisesSamAccountName,onPremisesSyncEnabled,onPremisesImmutableId" |
        Select-Object DisplayName, UserPrincipalName, Mail, EmployeeId, OnPremisesSamAccountName, OnPremisesSyncEnabled, OnPremisesImmutableId
}

# ---------------------------------------------------------------------------
# ตัวอย่างการเรียกใช้งาน (uncomment ตามต้องการ)
# ---------------------------------------------------------------------------
# Test-EntraConnectPrerequisites
# New-EntraConnectServiceAccount -Password (ConvertTo-SecureString "P@ssw0rd-Change-Me!" -AsPlainText -Force)
# Get-EntraConnectSyncStatus
# Start-EntraConnectDeltaSync
# Get-SyncedEntraUser -UserPrincipalName $TestUserUpn
