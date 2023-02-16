data "vsphere_virtual_machine" "linux_vm_template" {
  for_each      = { for vm in var.vm_specs : vm.vm_name => vm }
  name          = each.value.name
  datacenter_id = data.vsphere_datacenter.datacenter.id
  depends_on    = [vsphere_virtual_machine.linux_vm_template]
}


output "ip_addresses" {
  value = {
    for vm in data.vsphere_virtual_machine.linux_vm_template : vm.name => vm.default_ip_address 
  }
}