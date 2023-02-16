param(
  [CmdletBinding()]
  [Parameter(Mandatory)]
  [string]$viserver,

  [Parameter(Mandatory)]
  [string]$servername,
  
  [Parameter(Mandatory)]
  [string]$username,

  [Parameter(Mandatory)]
  [string]$password
)

class Datacenter {
    [string]$name
    [System.Collections.ArrayList]$clusters = @()
    [System.Collections.ArrayList]$hosts = @()

    [void]DefineDC($dc) {
        $this.name = $dc
    }

    [void]AddCluster($cluster) {
        $this.clusters += $cluster
    }

    [void]AddHost($esx) {
        $this.hosts += $esx
    }

}


$vcenter = @()
Set-PowerCLIConfiguration -InvalidCertificateAction Ignore -Confirm:$false

Connect-VIserver $viserver -User $username -Password $password 
foreach($dc in Get-Datacenter){
    $vc = New-Object Datacenter 
    $vc.DefineDC($dc.Name)
    foreach($cluster in Get-Cluster -Location $dc){
        $vc.AddCluster($cluster.Name)

    }
    foreach($esx in Get-VMHost -Location $dc) {
            $vc.AddHost($esx.Name)
    }
    $vcenter += $vc 
  }
  $vcenter | ConvertTo-Json | Out-File "/artifacts/$servername.json"
