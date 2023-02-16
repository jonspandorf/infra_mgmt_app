param(
    [cmdletBinding()]
    
    [Parameter(Mandatory)]
    [string]$viserver,

    [Parameter(Mandatory)]
    [string]$username,

    [Parameter(Mandatory)]
    [string]$password,

    [Parameter(Mandatory)]
    [string]$dc_name,

    [string]$cluster_name,

    [string]$esxi_name,

    [string]$rp_name
    )

Set-PowerCLIConfiguration -InvalidCertificateAction Ignore -Confirm:$false

Connect-VIserver $viserver -User $username -Password $password 


$dc = Get-Datacenter -Name $dc_name

$location = ""

$dss = if ($cluster_name) { 
      Get-Cluster -Name $cluster_name -Location $dc | Get-Datastore | Select-Object Name, FreeSpaceGB
      $location = $cluster_name 
  } elseif ($esxi_name) {
    Get-VMHost -Name $esxi_name -Location $dc | Get-Datastore | Select-Object Name, FreeSpaceGB
    $location = $esxi_name
    }



if ($rp_name) {
    $rp_exists = Get-ResourcePool -Location $location -Name $rp_name
    if (-Not $rp_exists) {
        New-ResourcePool -Location $location -Name $rp_name
    }   
} 

$max = ($dss | Measure-Object -Property FreeSpaceGB -Maximum).Maximum

$dss | ? { $_.FreeSpaceGB -eq $max} | ConvertTo-Json  | Out-File "/artifacts/ds.json"


return $dss
