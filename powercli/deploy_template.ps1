
# function Deploy-Template {

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

            [Parameter(Mandatory)]
            [string]$ovf_path,

            [Parameter(Mandatory)]
            [string]$template_name,

            [string]$cluster_name,
            
            [string]$esxi_name

        )
    Set-PowerCLIConfiguration -InvalidCertificateAction Ignore -Confirm:$false

    Connect-VIserver $viserver -User $username -Password $password 

    $datastores = $null

    $location = $null 
    # get datastore 
    if ($cluster_name) { 
     $datastores = Get-Cluster -Name $cluster_name -Location $dc_name | Get-Datastore | Select-Object Name, FreeSpaceGB
    } elseif ($esxi_name) {
        $datastores = Get-VMHost -Name $esxi_name -Location $dc_name | Get-Datastore | Select-Object Name, FreeSpaceGB
    }
    
    $location =  Get-VMHost -Name $esxi_name -Location $dc_name

    $max = ($datastores | Measure-Object -Property FreeSpaceGB -Maximum).Maximum
    $ds = $datastores | ? { $_.FreeSpaceGB -eq $max} 
    $ds = Get-Datastore -Location $dc_name -Name $ds.Name

    Import-vApp -Source $ovf_path -Datastore $ds -Force -Name $template_name -VMHost $location
    
    Get-VM -Name $template_name -Location $dc_name | Set-VM –ToTemplate –Name $template_name -Confirm:$false
    
# }
