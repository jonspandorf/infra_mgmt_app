
data "vsphere_virtual_machine" "linux_vm_ova" {
  for_each      = { for vm in var.vm_specs : vm.vm_name => vm  }
  name          = each.value.vm_name
  datacenter_id = data.vsphere_datacenter.datacenter.id
  depends_on    = [vsphere_virtual_machine.linux_vm_ova]
}

output "ip_addresses" {

  value = {
    for vm in data.vsphere_virtual_machine.linux_vm_ova : vm.name => vm.default_ip_address 
  }
}
